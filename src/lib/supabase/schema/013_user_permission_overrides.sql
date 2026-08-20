-- ==============================================================================
-- ELEVATE INTRANET B2B — 013_user_permission_overrides.sql
-- User-Level Granular Permission Overrides & Secure Login Resolution
-- ==============================================================================

-- 1. USER PERMISSION OVERRIDES TABLE
-- Allows administrators to explicitly grant or deny specific permissions
-- for individual users, independent of their base role.
CREATE TABLE IF NOT EXISTS public.user_permission_overrides (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    is_granted BOOLEAN NOT NULL, -- TRUE = explicit grant, FALSE = explicit block/deny
    granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_upo_user_id ON public.user_permission_overrides(user_id);
CREATE INDEX IF NOT EXISTS idx_upo_permission_id ON public.user_permission_overrides(permission_id);
CREATE INDEX IF NOT EXISTS idx_upo_granted_by ON public.user_permission_overrides(granted_by);

-- 2. ROW LEVEL SECURITY (RLS) FOR USER PERMISSION OVERRIDES
ALTER TABLE public.user_permission_overrides ENABLE ROW LEVEL SECURITY;

-- Users can read overrides for profiles within their organization
CREATE POLICY "Users can read overrides in their organization"
    ON public.user_permission_overrides
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = user_permission_overrides.user_id
            AND p.org_id = public.get_user_org_id()
        )
    );

-- Admins can manage overrides for profiles within their organization
CREATE POLICY "Admins can manage overrides in their organization"
    ON public.user_permission_overrides
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = user_permission_overrides.user_id
            AND p.org_id = public.get_user_org_id()
        )
        AND public.get_user_role() IN ('super_admin', 'admin')
    );

-- 3. RESOLVE LOGIN IDENTIFIER (Anti-Enumeration)
-- Case-insensitive lookup by username or email. Returns email or NULL.
-- Runs as SECURITY DEFINER to bypass RLS during login.
CREATE OR REPLACE FUNCTION public.resolve_login_identifier(p_identifier TEXT)
RETURNS TEXT AS $$
DECLARE
    v_email TEXT;
BEGIN
    SELECT email INTO v_email
    FROM public.profiles
    WHERE LOWER(username) = LOWER(p_identifier)
       OR LOWER(email) = LOWER(p_identifier)
    LIMIT 1;

    -- Return email if found, NULL otherwise.
    -- The calling server action always proceeds to Supabase Auth
    -- regardless, returning a generic error to prevent enumeration.
    RETURN v_email;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 4. GET EFFECTIVE USER PERMISSIONS
-- Combines role_permissions + user_permission_overrides with precedence:
--   1. SuperAdmin bypass (all permissions granted)
--   2. Explicit user override deny (is_granted = false) → DENY
--   3. Explicit user override grant (is_granted = true) → ALLOW
--   4. Role permission exists → ALLOW
--   5. Default → DENY
CREATE OR REPLACE FUNCTION public.get_effective_user_permissions(p_user_id UUID)
RETURNS TABLE (
    resource TEXT,
    action TEXT,
    is_granted BOOLEAN,
    source TEXT -- 'super_admin_bypass', 'user_override', 'role_permission', 'denied'
) AS $$
DECLARE
    v_role_id UUID;
    v_hierarchy_level INTEGER;
BEGIN
    -- Get user's role details
    SELECT p.role_id, COALESCE(r.hierarchy_level, 99)
    INTO v_role_id, v_hierarchy_level
    FROM public.profiles p
    LEFT JOIN public.roles r ON r.id = p.role_id
    WHERE p.id = p_user_id;

    -- SuperAdmin bypass: grant ALL permissions
    IF v_hierarchy_level = 0 THEN
        RETURN QUERY
        SELECT perm.resource, perm.action, true::BOOLEAN, 'super_admin_bypass'::TEXT
        FROM public.permissions perm;
        RETURN;
    END IF;

    -- For all other users, evaluate each permission with precedence
    RETURN QUERY
    SELECT
        perm.resource,
        perm.action,
        CASE
            -- 1. Explicit user deny overrides everything
            WHEN upo.is_granted = false THEN false
            -- 2. Explicit user grant
            WHEN upo.is_granted = true THEN true
            -- 3. Role permission exists
            WHEN rp.role_id IS NOT NULL THEN true
            -- 4. Default deny
            ELSE false
        END AS is_granted,
        CASE
            WHEN upo.is_granted = false THEN 'user_override'
            WHEN upo.is_granted = true THEN 'user_override'
            WHEN rp.role_id IS NOT NULL THEN 'role_permission'
            ELSE 'denied'
        END AS source
    FROM public.permissions perm
    LEFT JOIN public.user_permission_overrides upo
        ON upo.permission_id = perm.id AND upo.user_id = p_user_id
    LEFT JOIN public.role_permissions rp
        ON rp.permission_id = perm.id AND rp.role_id = v_role_id;

    RETURN;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 5. SYNC TRIGGER: role_id → profiles.role (slug)
-- When role_id changes on a profile, update the denormalized 'role' TEXT column.
CREATE OR REPLACE FUNCTION public.sync_role_slug_from_role_id()
RETURNS TRIGGER AS $$
DECLARE
    v_slug TEXT;
BEGIN
    IF NEW.role_id IS NOT NULL AND (OLD.role_id IS DISTINCT FROM NEW.role_id) THEN
        SELECT slug INTO v_slug FROM public.roles WHERE id = NEW.role_id;
        IF v_slug IS NOT NULL THEN
            NEW.role := v_slug;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_role_slug ON public.profiles;
CREATE TRIGGER trg_sync_role_slug
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_role_slug_from_role_id();

-- 6. ESCALATION PREVENTION TRIGGER FOR OVERRIDES
-- Prevents granting/revoking overrides for users at equal or higher hierarchy.
-- Also prevents granting permissions the actor doesn't possess.
CREATE OR REPLACE FUNCTION public.prevent_override_escalation()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_hierarchy INTEGER;
    v_target_hierarchy INTEGER;
    v_actor_has_perm BOOLEAN;
BEGIN
    -- Get actor (current user) hierarchy level
    SELECT COALESCE(r.hierarchy_level, 99) INTO v_actor_hierarchy
    FROM public.profiles p
    LEFT JOIN public.roles r ON r.id = p.role_id
    WHERE p.id = auth.uid();

    -- Get target user hierarchy level
    SELECT COALESCE(r.hierarchy_level, 99) INTO v_target_hierarchy
    FROM public.profiles p
    LEFT JOIN public.roles r ON r.id = p.role_id
    WHERE p.id = NEW.user_id;

    -- Actor must have strictly lower hierarchy_level (higher privilege) than target
    IF v_actor_hierarchy >= v_target_hierarchy THEN
        RAISE EXCEPTION 'No tienes autorización para modificar usuarios con jerarquía igual o superior a la tuya';
    END IF;

    -- If granting (is_granted = true), actor must possess the permission
    IF NEW.is_granted = true THEN
        SELECT EXISTS (
            SELECT 1 FROM public.get_effective_user_permissions(auth.uid()) ep
            WHERE ep.resource = (SELECT resource FROM public.permissions WHERE id = NEW.permission_id)
              AND ep.action = (SELECT action FROM public.permissions WHERE id = NEW.permission_id)
              AND ep.is_granted = true
        ) INTO v_actor_has_perm;

        IF NOT v_actor_has_perm THEN
            RAISE EXCEPTION 'No puedes conceder permisos que no posees';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_override_escalation ON public.user_permission_overrides;
CREATE TRIGGER trg_prevent_override_escalation
    BEFORE INSERT OR UPDATE ON public.user_permission_overrides
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_override_escalation();

-- 7. SEED: Demo "Operator" user (Mario) with sample overrides
DO $$
DECLARE
    v_org_id UUID;
    v_mario_id UUID := 'a1000000-0000-4000-a000-000000000011';
    v_role_user UUID := 'b1000000-0000-4000-b000-000000000004';
    v_admin_id UUID := 'a1000000-0000-4000-a000-000000000001';
    v_dept_tech UUID := 'd1000000-0000-4000-a000-000000000002';
    v_perm_chat_access UUID;
    v_perm_payroll_dept UUID;
BEGIN
    SELECT id INTO v_org_id FROM public.organizations LIMIT 1;
    IF v_org_id IS NULL THEN
        v_org_id := 'e1e0a7e0-0000-4000-a000-000000000001';
    END IF;

    -- Create auth.users entry for Mario (if possible)
    BEGIN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
        VALUES (
            v_mario_id,
            '00000000-0000-0000-0000-000000000000',
            'mario.operador@elevate.com.mx',
            '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000',
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Mario Operador","role":"employee"}',
            now(), now(), 'authenticated', 'authenticated'
        ) ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Skipping auth.users insert for Mario: %', SQLERRM;
    END;

    -- Create profile for Mario
    INSERT INTO public.profiles (id, org_id, username, email, full_name, role, role_id, department_id, job_title, phone)
    VALUES (
        v_mario_id,
        v_org_id,
        'mario.operador',
        'mario.operador@elevate.com.mx',
        'Mario Operador',
        'employee',
        v_role_user,
        v_dept_tech,
        'Operador de Sistemas',
        '+52 55 0000 1111'
    ) ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        role_id = EXCLUDED.role_id,
        job_title = EXCLUDED.job_title;

    -- Add a chat:access permission if not present (some systems may use 'chat' resource)
    INSERT INTO public.permissions (resource, action, description)
    VALUES ('chat', 'access', 'Acceder al chat corporativo')
    ON CONFLICT (resource, action) DO NOTHING;

    -- Get permission IDs
    SELECT id INTO v_perm_chat_access FROM public.permissions WHERE resource = 'chat' AND action = 'access';
    SELECT id INTO v_perm_payroll_dept FROM public.permissions WHERE resource = 'payroll' AND action = 'read:department';

    -- If payroll:read:department doesn't exist, create it
    IF v_perm_payroll_dept IS NULL THEN
        INSERT INTO public.permissions (resource, action, description)
        VALUES ('payroll', 'read:department', 'Consultar recibos de departamento')
        ON CONFLICT (resource, action) DO NOTHING;
        SELECT id INTO v_perm_payroll_dept FROM public.permissions WHERE resource = 'payroll' AND action = 'read:department';
    END IF;

    -- Assign chat:access to the base employee role (so blocking Mario is meaningful)
    IF v_perm_chat_access IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_role_user, v_perm_chat_access)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Sample overrides for Mario:
    -- BLOCK chat:access (even though his role has it)
    IF v_perm_chat_access IS NOT NULL THEN
        INSERT INTO public.user_permission_overrides (user_id, permission_id, is_granted, granted_by)
        VALUES (v_mario_id, v_perm_chat_access, false, v_admin_id)
        ON CONFLICT (user_id, permission_id) DO UPDATE SET
            is_granted = EXCLUDED.is_granted,
            granted_by = EXCLUDED.granted_by,
            updated_at = now();
    END IF;

    -- GRANT payroll:read:department (even though his role doesn't have it)
    IF v_perm_payroll_dept IS NOT NULL THEN
        INSERT INTO public.user_permission_overrides (user_id, permission_id, is_granted, granted_by)
        VALUES (v_mario_id, v_perm_payroll_dept, true, v_admin_id)
        ON CONFLICT (user_id, permission_id) DO UPDATE SET
            is_granted = EXCLUDED.is_granted,
            granted_by = EXCLUDED.granted_by,
            updated_at = now();
    END IF;

END $$;
