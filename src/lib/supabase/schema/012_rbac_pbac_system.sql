-- ==============================================================================
-- ELEVATE INTRANET B2B — 012_rbac_pbac_system.sql
-- Relational Role-Based & Policy-Based Access Control (RBAC/PBAC) Engine
-- ==============================================================================

-- 1. ROLES TABLE (Hierarchical definition)
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    hierarchy_level INTEGER NOT NULL DEFAULT 3, -- 0: SuperAdmin, 1: Admin, 2: Manager, 3: User, >3: Custom
    is_system BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_roles_org_slug UNIQUE(org_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_roles_org_id ON public.roles(org_id);
CREATE INDEX IF NOT EXISTS idx_roles_hierarchy ON public.roles(hierarchy_level);

-- 2. PERMISSIONS TABLE (Granular resources and actions)
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource TEXT NOT NULL, -- e.g. 'users', 'roles', 'groups', 'announcements', 'reports', 'payroll'
    action TEXT NOT NULL,   -- e.g. 'create', 'read', 'update', 'delete', 'manage', 'export'
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_permissions_resource_action UNIQUE(resource, action)
);

CREATE INDEX IF NOT EXISTS idx_permissions_resource ON public.permissions(resource);

-- 3. ROLE_PERMISSIONS (Many-to-many junction)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (role_id, permission_id)
);

-- 4. GROUPS TABLE (Logical user grouping for permissions & broadcasting)
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_groups_org_slug UNIQUE(org_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_groups_org_id ON public.groups(org_id);

-- 5. USER_GROUPS (Junction table)
CREATE TABLE IF NOT EXISTS public.user_groups (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, group_id)
);

-- 6. EXTEND PROFILES WITH ROLE_ID & MUST_CHANGE_PASSWORD
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles(id) ON DELETE RESTRICT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON public.profiles(role_id);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;

-- Permissions are globally readable by authenticated users
CREATE POLICY "Authenticated users can read permissions" ON public.permissions
    FOR SELECT TO authenticated USING (true);

-- Roles policies
CREATE POLICY "Users can read roles within their organization" ON public.roles
    FOR SELECT TO authenticated USING (org_id = public.get_user_org_id() OR is_system = true);

CREATE POLICY "Admins can manage roles within their organization" ON public.roles
    FOR ALL TO authenticated USING (
        org_id = public.get_user_org_id() 
        AND public.get_user_role() IN ('super_admin', 'admin')
    );

-- Role Permissions policies
CREATE POLICY "Users can read role permissions" ON public.role_permissions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage role permissions" ON public.role_permissions
    FOR ALL TO authenticated USING (
        public.get_user_role() IN ('super_admin', 'admin')
    );

-- Groups policies
CREATE POLICY "Users can read groups in their organization" ON public.groups
    FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());

CREATE POLICY "Admins can manage groups in their organization" ON public.groups
    FOR ALL TO authenticated USING (
        org_id = public.get_user_org_id() 
        AND public.get_user_role() IN ('super_admin', 'admin')
    );

-- User Groups policies
CREATE POLICY "Users can read user groups in their organization" ON public.user_groups
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.groups g 
            WHERE g.id = user_groups.group_id 
            AND g.org_id = public.get_user_org_id()
        )
    );

CREATE POLICY "Admins can manage user groups in their organization" ON public.user_groups
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.groups g 
            WHERE g.id = user_groups.group_id 
            AND g.org_id = public.get_user_org_id()
        )
        AND public.get_user_role() IN ('super_admin', 'admin')
    );

-- 8. PREVENT SYSTEM ROLE DELETION TRIGGER
CREATE OR REPLACE FUNCTION public.prevent_system_role_deletion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_system = true THEN
        RAISE EXCEPTION 'Cannot delete system roles (SuperAdministrador, Administrador, Gerente, Usuario).';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_system_role_deletion ON public.roles;
CREATE TRIGGER trg_prevent_system_role_deletion
    BEFORE DELETE ON public.roles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_system_role_deletion();

-- 9. DEFAULT ROLES & PERMISSIONS SEED DATA
DO $$
DECLARE
    v_org_id UUID;
    v_role_super UUID := 'b1000000-0000-4000-b000-000000000001';
    v_role_admin UUID := 'b1000000-0000-4000-b000-000000000002';
    v_role_manager UUID := 'b1000000-0000-4000-b000-000000000003';
    v_role_user UUID := 'b1000000-0000-4000-b000-000000000004';
BEGIN
    SELECT id INTO v_org_id FROM public.organizations LIMIT 1;
    IF v_org_id IS NULL THEN
        v_org_id := '00000000-0000-0000-0000-000000000001';
    END IF;

    -- Insert Base System Roles
    INSERT INTO public.roles (id, org_id, name, slug, description, hierarchy_level, is_system)
    VALUES
        (v_role_super, v_org_id, 'SuperAdministrador', 'super_admin', 'Acceso irrestricto total al sistema y gestión de configuración raíz.', 0, true),
        (v_role_admin, v_org_id, 'Administrador', 'admin', 'Administración de usuarios, roles, políticas y grupos.', 1, true),
        (v_role_manager, v_org_id, 'Gerente', 'manager', 'Gestión operativa departamental, comunicados y aprobaciones.', 2, true),
        (v_role_user, v_org_id, 'Usuario', 'employee', 'Acceso estándar a autoservicio, chat, directorio y documentos.', 3, true)
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        description = EXCLUDED.description,
        hierarchy_level = EXCLUDED.hierarchy_level,
        is_system = EXCLUDED.is_system;

    -- Insert Granular Permissions
    INSERT INTO public.permissions (resource, action, description)
    VALUES
        ('users', 'create', 'Crear nuevos colaboradores'),
        ('users', 'read', 'Consultar perfiles de colaboradores'),
        ('users', 'update', 'Editar datos de colaboradores'),
        ('users', 'delete', 'Dar de baja colaboradores'),
        ('roles', 'create', 'Crear roles personalizados'),
        ('roles', 'read', 'Visualizar catálogo de roles y permisos'),
        ('roles', 'update', 'Modificar matrices de permisos'),
        ('roles', 'delete', 'Eliminar roles personalizados'),
        ('roles', 'assign', 'Asignar roles a usuarios'),
        ('groups', 'create', 'Crear grupos de usuarios'),
        ('groups', 'read', 'Consultar grupos de la organización'),
        ('groups', 'update', 'Editar grupos'),
        ('groups', 'delete', 'Eliminar grupos'),
        ('groups', 'assign', 'Asignar colaboradores a grupos'),
        ('announcements', 'create', 'Redactar comunicados'),
        ('announcements', 'read', 'Leer comunicados'),
        ('announcements', 'update', 'Editar comunicados'),
        ('announcements', 'delete', 'Eliminar comunicados'),
        ('announcements', 'publish', 'Publicar comunicados urgentes'),
        ('knowledge', 'create', 'Subir artículos y SOPs'),
        ('knowledge', 'read', 'Consultar base de conocimiento'),
        ('knowledge', 'update', 'Actualizar versiones de documentos'),
        ('knowledge', 'delete', 'Archivar documentos'),
        ('payroll', 'read:self', 'Consultar recibos propios'),
        ('payroll', 'read:all', 'Consultar recibos de toda la plantilla'),
        ('payroll', 'import', 'Importar timbrados CONTPAQi/NOI'),
        ('attendance', 'checkin:self', 'Registrar asistencia propia'),
        ('attendance', 'read:department', 'Ver asistencias de departamento'),
        ('attendance', 'read:all', 'Ver asistencias globales'),
        ('attendance', 'import', 'Importar registros biométricos'),
        ('projects', 'create', 'Crear espacios de proyecto'),
        ('projects', 'read', 'Ver espacios de proyecto'),
        ('projects', 'update', 'Modificar hitos y acuerdos')
    ON CONFLICT (resource, action) DO NOTHING;

    -- Assign All Permissions to Admin & SuperAdmin
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_admin, p.id FROM public.permissions p
    ON CONFLICT DO NOTHING;

    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_super, p.id FROM public.permissions p
    ON CONFLICT DO NOTHING;

    -- Assign Departmental Permissions to Manager
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_manager, p.id FROM public.permissions p
    WHERE p.resource IN ('users', 'announcements', 'knowledge', 'attendance', 'projects')
      AND p.action IN ('read', 'create', 'update', 'checkin:self', 'read:department')
    ON CONFLICT DO NOTHING;

    -- Assign Base Permissions to User
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_user, p.id FROM public.permissions p
    WHERE (p.resource = 'announcements' AND p.action = 'read')
       OR (p.resource = 'knowledge' AND p.action = 'read')
       OR (p.resource = 'payroll' AND p.action = 'read:self')
       OR (p.resource = 'attendance' AND p.action = 'checkin:self')
       OR (p.resource = 'projects' AND p.action = 'read')
       OR (p.resource = 'users' AND p.action = 'read')
    ON CONFLICT DO NOTHING;

    -- Update existing profiles to link role_ids
    UPDATE public.profiles SET role_id = v_role_super WHERE role = 'super_admin' AND role_id IS NULL;
    UPDATE public.profiles SET role_id = v_role_admin WHERE role = 'admin' AND role_id IS NULL;
    UPDATE public.profiles SET role_id = v_role_manager WHERE role IN ('manager', 'hr_manager') AND role_id IS NULL;
    UPDATE public.profiles SET role_id = v_role_user WHERE role IN ('employee', 'team_lead') AND role_id IS NULL;

    -- Insert Default Initial Administrador Account (must_change_password = true)
    INSERT INTO public.profiles (
        id, org_id, username, email, full_name, role, role_id, job_title, must_change_password
    ) VALUES (
        'a1000000-0000-4000-a000-000000000099',
        v_org_id,
        'Administrador',
        'administrador@elevate.com.mx',
        'Administrador Inicial',
        'admin',
        v_role_admin,
        'Administrador del Sistema',
        true
    ) ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        role_id = EXCLUDED.role_id,
        must_change_password = EXCLUDED.must_change_password;

END $$;

