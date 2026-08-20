-- ==============================================================================
-- ELEVATE INTRANET B2B — 003_workflows.sql
-- Multi-Level Approval Chains, Requests & Row Level Security (RLS)
-- ==============================================================================

-- 1. REQUEST TYPES (Personalizables)
CREATE TABLE IF NOT EXISTS public.request_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'FileCheck2',
    fields_schema_json JSONB DEFAULT '[]'::jsonb,
    requires_attachment BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. APPROVAL CHAINS (Multi-Nivel)
CREATE TABLE IF NOT EXISTS public.approval_chains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    request_type_id UUID REFERENCES public.request_types(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. APPROVAL CHAIN STEPS
CREATE TABLE IF NOT EXISTS public.approval_chain_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_id UUID REFERENCES public.approval_chains(id) ON DELETE CASCADE NOT NULL,
    step_order INTEGER NOT NULL,
    approver_role TEXT NOT NULL CHECK (approver_role IN ('manager', 'department_head', 'hr_manager', 'admin', 'specific_user')),
    specific_approver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    auto_approve_after_hours INTEGER DEFAULT 72,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    request_type_id UUID REFERENCES public.request_types(id) ON DELETE RESTRICT NOT NULL,
    requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    data_json JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'in_review', 'approved', 'rejected', 'cancelled')),
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 2,
    attachment_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. REQUEST APPROVALS (Decisiones por paso)
CREATE TABLE IF NOT EXISTS public.request_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
    step_order INTEGER NOT NULL,
    approver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    decision TEXT NOT NULL DEFAULT 'pending' CHECK (decision IN ('pending', 'approved', 'rejected', 'delegated')),
    comments TEXT,
    decided_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- RLS POLICIES FOR WORKFLOWS
-- ==============================================================================

ALTER TABLE public.request_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_chain_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view request types in their organization" ON public.request_types
    FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Users can view their own requests or requests assigned to them for approval" ON public.requests
    FOR SELECT USING (
        org_id = public.get_user_org_id()
        AND (
            requester_id = auth.uid()
            OR public.get_user_role() IN ('super_admin', 'admin', 'hr_manager', 'manager')
        )
    );

CREATE POLICY "Employees can submit requests in their organization" ON public.requests
    FOR INSERT WITH CHECK (
        org_id = public.get_user_org_id()
        AND requester_id = auth.uid()
    );

CREATE POLICY "Approvers can view and record decisions" ON public.request_approvals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.requests r
            WHERE r.id = request_approvals.request_id
            AND r.org_id = public.get_user_org_id()
        )
    );
