-- ==============================================================================
-- ELEVATE INTRANET B2B — 010_enterprise_scale.sql
-- Enterprise 200-Employee Scaling Extensions: Knowledge Governance, Read Receipts,
-- Project Hubs, Peer Kudos & Onboarding Journey with Full RLS and Search Indexes
-- ==============================================================================

-- 1. KNOWLEDGE ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category TEXT NOT NULL CHECK (category IN ('sop', 'compliance', 'hr_policy', 'technical', 'guide')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    version TEXT DEFAULT '1.0' NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'stale', 'archived', 'draft')),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    next_review_due TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + INTERVAL '90 days') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (org_id, slug)
);

-- 2. DOCUMENT REVISIONS AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.document_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE NOT NULL,
    revised_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    version TEXT NOT NULL,
    change_summary TEXT NOT NULL,
    content_snapshot TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ANNOUNCEMENT READ RECEIPTS (ACUSE DE RECIBO)
CREATE TABLE IF NOT EXISTS public.announcement_read_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    UNIQUE (announcement_id, profile_id)
);

-- 4. PEER-TO-PEER KUDOS & CULTURE RECOGNITION
CREATE TABLE IF NOT EXISTS public.peer_kudos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    core_value TEXT NOT NULL CHECK (core_value IN ('Innovación', 'Colaboración', 'Excelencia', 'Compromiso', 'Liderazgo', 'Integridad')),
    message TEXT NOT NULL,
    reactions_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ONBOARDING JOURNEYS TABLE
CREATE TABLE IF NOT EXISTS public.onboarding_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    day1_completed BOOLEAN DEFAULT false,
    day7_completed BOOLEAN DEFAULT false,
    day30_completed BOOLEAN DEFAULT false,
    checklist_json JSONB DEFAULT '[]'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    activated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (profile_id)
);

-- 6. CROSS-FUNCTIONAL PROJECT HUBS & MEMBERS
CREATE TABLE IF NOT EXISTS public.project_hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
    lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_departments UUID[] DEFAULT ARRAY[]::UUID[],
    roadmap_json JSONB DEFAULT '[]'::jsonb,
    agreements_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_hub_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hub_id UUID REFERENCES public.project_hubs(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'contributor' CHECK (role IN ('lead', 'contributor', 'reviewer', 'stakeholder')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (hub_id, profile_id)
);

-- 7. SEARCH INDEXES & SKILLS EXTENSION
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_knowledge_tags ON public.knowledge_articles USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN (skills);

-- Full-text Search indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_fts ON public.knowledge_articles 
    USING GIN (to_tsvector('spanish', title || ' ' || content));

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_kudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_hub_members ENABLE ROW LEVEL SECURITY;

-- Knowledge Articles
CREATE POLICY "Users can view knowledge articles in their organization" ON public.knowledge_articles
    FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Authors and Admins can manage knowledge articles" ON public.knowledge_articles
    FOR ALL USING (
        org_id = public.get_user_org_id()
        AND (owner_id = auth.uid() OR public.get_user_role() IN ('super_admin', 'admin', 'manager', 'hr_manager'))
    );

-- Read Receipts
CREATE POLICY "Users can view and submit their own read receipts or Admins view all" ON public.announcement_read_receipts
    FOR ALL USING (
        org_id = public.get_user_org_id()
        AND (profile_id = auth.uid() OR public.get_user_role() IN ('super_admin', 'admin', 'hr_manager'))
    );

-- Peer Kudos
CREATE POLICY "Users can view all kudos in organization" ON public.peer_kudos
    FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Users can insert kudos in organization" ON public.peer_kudos
    FOR INSERT WITH CHECK (org_id = public.get_user_org_id() AND sender_id = auth.uid());

-- Onboarding
CREATE POLICY "Users can view own onboarding or HR/Admin view all" ON public.onboarding_journeys
    FOR ALL USING (
        org_id = public.get_user_org_id()
        AND (profile_id = auth.uid() OR mentor_id = auth.uid() OR public.get_user_role() IN ('super_admin', 'admin', 'hr_manager'))
    );

-- Project Hubs
CREATE POLICY "Users can view project hubs in their organization" ON public.project_hubs
    FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Project Leads and Admins can manage project hubs" ON public.project_hubs
    FOR ALL USING (
        org_id = public.get_user_org_id()
        AND (lead_id = auth.uid() OR public.get_user_role() IN ('super_admin', 'admin', 'manager'))
    );
