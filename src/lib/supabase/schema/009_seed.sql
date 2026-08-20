-- ==============================================================================
-- ELEVATE INTRANET B2B — 009_seed.sql
-- Seed Data: Organization, Departments, Profiles (All 6 RBAC Roles) & Announcements
-- Idempotent script for development and demonstration environments
-- ==============================================================================

DO $$
DECLARE
    v_org_id UUID := 'e1e0a7e0-0000-4000-a000-000000000001';
    v_dept_dir UUID := 'd1000000-0000-4000-a000-000000000001';
    v_dept_tech UUID := 'd1000000-0000-4000-a000-000000000002';
    v_dept_hr UUID := 'd1000000-0000-4000-a000-000000000003';
    v_dept_fin UUID := 'd1000000-0000-4000-a000-000000000004';
    v_admin_id UUID := 'a1000000-0000-4000-a000-000000000001';
BEGIN
    -- 1. SEED ORGANIZATION
    INSERT INTO public.organizations (id, name, industry, max_users, is_active)
    VALUES (
        v_org_id,
        'Elevate Enterprise Solutions',
        'Tecnología y Consultoría',
        200,
        true
    ) ON CONFLICT (id) DO UPDATE 
    SET name = EXCLUDED.name, max_users = EXCLUDED.max_users;

    -- 2. SEED DEPARTMENTS
    INSERT INTO public.departments (id, org_id, name, description)
    VALUES
        (v_dept_dir, v_org_id, 'Dirección General', 'Estrategia, gobierno corporativo y toma de decisiones.'),
        (v_dept_tech, v_org_id, 'Tecnología & Producto', 'Desarrollo de software, infraestructura cloud y ciberseguridad.'),
        (v_dept_hr, v_org_id, 'Recursos Humanos', 'Atracción de talento, cultura, bienestar y desarrollo organizacional.'),
        (v_dept_fin, v_org_id, 'Finanzas & Administración', 'Nómina, presupuestos, contabilidad y compras.')
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

    -- 3. SEED AUTH USERS (In case running with service_role / direct Postgres access)
    -- Note: Supabase creates auth.users automatically when signing up.
    -- If auth.users table exists in auth schema, seed placeholder accounts:
    BEGIN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
        VALUES 
            (v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@elevate.com.mx', '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Carlos Gómez","role":"admin"}', now(), now(), 'authenticated', 'authenticated'),
            ('a1000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'superadmin@elevate.com.mx', '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Super Admin","role":"super_admin"}', now(), now(), 'authenticated', 'authenticated'),
            ('a1000000-0000-4000-a000-000000000003', '00000000-0000-0000-0000-000000000000', 'mariana.silva@elevate.com.mx', '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mariana Silva","role":"manager"}', now(), now(), 'authenticated', 'authenticated'),
            ('a1000000-0000-4000-a000-000000000004', '00000000-0000-0000-0000-000000000000', 'alejandro.morales@elevate.com.mx', '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Alejandro Morales","role":"hr_manager"}', now(), now(), 'authenticated', 'authenticated'),
            ('a1000000-0000-4000-a000-000000000005', '00000000-0000-0000-0000-000000000000', 'diego.hernandez@elevate.com.mx', '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Diego Hernández","role":"team_lead"}', now(), now(), 'authenticated', 'authenticated'),
            ('a1000000-0000-4000-a000-000000000006', '00000000-0000-0000-0000-000000000000', 'sofia.valenzuela@elevate.com.mx', '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sofía Valenzuela","role":"employee"}', now(), now(), 'authenticated', 'authenticated'),
            ('a1000000-0000-4000-a000-000000000007', '00000000-0000-0000-0000-000000000000', 'valeria.castillo@elevate.com.mx', '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Valeria Castillo","role":"employee"}', now(), now(), 'authenticated', 'authenticated'),
            ('a1000000-0000-4000-a000-000000000008', '00000000-0000-0000-0000-000000000000', 'roberto.mendoza@elevate.com.mx', '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Roberto Mendoza","role":"employee"}', now(), now(), 'authenticated', 'authenticated'),
            ('a1000000-0000-4000-a000-000000000009', '00000000-0000-0000-0000-000000000000', 'lucia.navarro@elevate.com.mx', '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lucía Navarro","role":"team_lead"}', now(), now(), 'authenticated', 'authenticated'),
            ('a1000000-0000-4000-a000-000000000010', '00000000-0000-0000-0000-000000000000', 'gabriel.torres@elevate.com.mx', '$2a$10$dummyEncryptedPasswordForSeedDevelopment0000000000', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Gabriel Torres","role":"employee"}', now(), now(), 'authenticated', 'authenticated')
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        -- auth.users might be inaccessible in standard SQL editor without superuser; ignore if restricted
        RAISE NOTICE 'Skipping direct auth.users insert: %', SQLERRM;
    END;

    -- 4. SEED PROFILES (All 6 RBAC Roles covered)
    INSERT INTO public.profiles (id, org_id, username, email, full_name, role, department_id, job_title, phone)
    VALUES
        (v_admin_id, v_org_id, 'admin', 'admin@elevate.com.mx', 'Carlos Gómez', 'admin', v_dept_tech, 'Líder Técnico & Cloud Architect', '+52 55 1234 5678'),
        ('a1000000-0000-4000-a000-000000000002', v_org_id, 'superadmin', 'superadmin@elevate.com.mx', 'Dirección General', 'super_admin', v_dept_dir, 'Chief Executive Officer (CEO)', '+52 55 1111 2222'),
        ('a1000000-0000-4000-a000-000000000003', v_org_id, 'mariana.silva', 'mariana.silva@elevate.com.mx', 'Mariana Silva', 'manager', v_dept_dir, 'Directora de Operaciones (COO)', '+52 55 2345 6789'),
        ('a1000000-0000-4000-a000-000000000004', v_org_id, 'alejandro.morales', 'alejandro.morales@elevate.com.mx', 'Alejandro Morales', 'hr_manager', v_dept_hr, 'Gerente de Recursos Humanos', '+52 55 3456 7890'),
        ('a1000000-0000-4000-a000-000000000005', v_org_id, 'diego.hernandez', 'diego.hernandez@elevate.com.mx', 'Diego Hernández', 'team_lead', v_dept_tech, 'Tech Lead Fullstack', '+52 55 5678 9012'),
        ('a1000000-0000-4000-a000-000000000006', v_org_id, 'sofia.valenzuela', 'sofia.valenzuela@elevate.com.mx', 'Sofía Valenzuela', 'employee', v_dept_fin, 'Coordinadora de Nóminas', '+52 55 4567 8901'),
        ('a1000000-0000-4000-a000-000000000007', v_org_id, 'valeria.castillo', 'valeria.castillo@elevate.com.mx', 'Valeria Castillo', 'employee', v_dept_hr, 'Especialista de Cultura & Onboarding', '+52 55 6789 0123'),
        ('a1000000-0000-4000-a000-000000000008', v_org_id, 'roberto.mendoza', 'roberto.mendoza@elevate.com.mx', 'Roberto Mendoza', 'employee', v_dept_tech, 'Ingeniero de Software Frontend', '+52 55 7890 1234'),
        ('a1000000-0000-4000-a000-000000000009', v_org_id, 'lucia.navarro', 'lucia.navarro@elevate.com.mx', 'Lucía Navarro', 'team_lead', v_dept_fin, 'Líder de Contabilidad & Auditoría', '+52 55 8901 2345'),
        ('a1000000-0000-4000-a000-000000000010', v_org_id, 'gabriel.torres', 'gabriel.torres@elevate.com.mx', 'Gabriel Torres', 'employee', v_dept_tech, 'DevOps & Site Reliability Engineer', '+52 55 9012 3456')
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        department_id = EXCLUDED.department_id,
        job_title = EXCLUDED.job_title,
        phone = EXCLUDED.phone;

    -- Update department heads
    UPDATE public.departments SET head_user_id = 'a1000000-0000-4000-a000-000000000002' WHERE id = v_dept_dir;
    UPDATE public.departments SET head_user_id = v_admin_id WHERE id = v_dept_tech;
    UPDATE public.departments SET head_user_id = 'a1000000-0000-4000-a000-000000000004' WHERE id = v_dept_hr;
    UPDATE public.departments SET head_user_id = 'a1000000-0000-4000-a000-000000000009' WHERE id = v_dept_fin;

    -- 5. SEED CORPORATE ANNOUNCEMENTS
    INSERT INTO public.announcements (id, org_id, author_id, title, content, category, priority, is_pinned)
    VALUES
        (
            'c1000000-0000-4000-a000-000000000001',
            v_org_id,
            'a1000000-0000-4000-a000-000000000002',
            'Lanzamiento Oficial del Nuevo Portal Elevate Intranet B2B',
            'Estimado equipo: Nos complace presentar la nueva intranet institucional diseñada para centralizar nuestra comunicación, trámites y gestión del conocimiento en esta etapa de expansión.',
            'general',
            'urgent',
            true
        ),
        (
            'c1000000-0000-4000-a000-000000000002',
            v_org_id,
            'a1000000-0000-4000-a000-000000000004',
            'Actualización de Políticas de Trabajo Híbrido y Vacaciones 2026',
            'Se han publicado las directrices actualizadas para solicitudes de tiempo libre y días de trabajo remoto. Por favor consulten el módulo de solicitudes para registrar sus planes.',
            'hr',
            'normal',
            false
        ),
        (
            'c1000000-0000-4000-a000-000000000003',
            v_org_id,
            v_admin_id,
            'Ventana de Mantenimiento de Infraestructura Cloud y Seguridad',
            'El próximo sábado a las 22:00 hrs realizaremos una actualización programada de certificados SSL y balanceadores de carga. El servicio no presentará interrupciones mayores a 5 minutos.',
            'it',
            'normal',
            false
        )
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;

END $$;
