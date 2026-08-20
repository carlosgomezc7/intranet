-- ==============================================================================
-- ELEVATE INTRANET B2B — 001_core.sql
-- Core Organizational Schema, Multi-Tenant Isolation & Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    industry TEXT,
    max_users INTEGER DEFAULT 200,
    is_active BOOLEAN DEFAULT true,
    settings_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. DEPARTMENTS TABLE (Hierarchical)
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    parent_department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    head_user_id UUID, -- Will reference auth.users / profiles(id)
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('super_admin', 'admin', 'hr_manager', 'manager', 'team_lead', 'employee')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    job_title TEXT,
    phone TEXT,
    hire_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    settings_json JSONB DEFAULT '{"theme": "dark", "notifications_enabled": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key from departments.head_user_id to profiles(id)
ALTER TABLE public.departments 
    DROP CONSTRAINT IF EXISTS fk_departments_head_user,
    ADD CONSTRAINT fk_departments_head_user 
    FOREIGN KEY (head_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 4. TEAMS TABLE (Cross-functional Project Groups)
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    lead_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role_in_team TEXT DEFAULT 'member' CHECK (role_in_team IN ('lead', 'member', 'guest')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (team_id, profile_id)
);

-- 6. BUG REPORTS & IMPROVEMENT SUGGESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.bug_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    type TEXT NOT NULL DEFAULT 'improvement' CHECK (type IN ('bug', 'improvement', 'suggestion')),
    description TEXT NOT NULL,
    attachment_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- HELPER FUNCTIONS FOR ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Helper: Get current user's organization ID
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS UUID AS $$
    SELECT org_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: Get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: Get current user's department ID
CREATE OR REPLACE FUNCTION public.get_user_department_id()
RETURNS UUID AS $$
    SELECT department_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- 1. ORGANIZATIONS POLICIES
CREATE POLICY "Users can read own organization" ON public.organizations
    FOR SELECT USING (id = public.get_user_org_id());

CREATE POLICY "Authenticated users can insert an organization during onboarding" ON public.organizations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update own organization" ON public.organizations
    FOR UPDATE USING (
        id = public.get_user_org_id() 
        AND public.get_user_role() IN ('super_admin', 'admin')
    );

-- 2. DEPARTMENTS POLICIES
CREATE POLICY "Users can view departments in their organization" ON public.departments
    FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Admins and HR can manage departments" ON public.departments
    FOR ALL USING (
        org_id = public.get_user_org_id()
        AND public.get_user_role() IN ('super_admin', 'admin', 'hr_manager')
    );

-- 3. PROFILES POLICIES
CREATE POLICY "Users can view profiles in their organization" ON public.profiles
    FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Users can insert their own initial profile" ON public.profiles
    FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage any profile in their organization" ON public.profiles
    FOR ALL USING (
        org_id = public.get_user_org_id()
        AND public.get_user_role() IN ('super_admin', 'admin')
    );

-- 4. TEAMS POLICIES
CREATE POLICY "Users can view teams in their organization" ON public.teams
    FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Team leads and Admins can manage teams" ON public.teams
    FOR ALL USING (
        org_id = public.get_user_org_id()
        AND (
            public.get_user_role() IN ('super_admin', 'admin')
            OR lead_user_id = auth.uid()
        )
    );

-- 5. TEAM MEMBERS POLICIES
CREATE POLICY "Users can view team members in their organization" ON public.team_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.teams t 
            WHERE t.id = team_members.team_id 
            AND t.org_id = public.get_user_org_id()
        )
    );

CREATE POLICY "Team leads and Admins can manage team members" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.teams t 
            WHERE t.id = team_members.team_id 
            AND t.org_id = public.get_user_org_id()
            AND (
                public.get_user_role() IN ('super_admin', 'admin')
                OR t.lead_user_id = auth.uid()
            )
        )
    );

-- 6. BUG REPORTS POLICIES
CREATE POLICY "Anyone authenticated or anonymous can submit bug reports" ON public.bug_reports
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own submitted bug reports" ON public.bug_reports
    FOR SELECT USING (
        reporter_id = auth.uid()
        OR org_id = public.get_user_org_id()
    );

CREATE POLICY "Admins can manage bug reports" ON public.bug_reports
    FOR ALL USING (
        org_id = public.get_user_org_id()
        AND public.get_user_role() IN ('super_admin', 'admin')
    );
