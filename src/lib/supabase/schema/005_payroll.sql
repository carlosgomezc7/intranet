-- ==============================================================================
-- ELEVATE INTRANET B2B — 005_payroll.sql
-- Payroll Receipts, CONTPAQi Integration & Row Level Security (RLS)
-- ==============================================================================

-- 1. PAYROLL RECEIPTS TABLE
CREATE TABLE IF NOT EXISTS public.payroll_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    period_title TEXT NOT NULL, -- e.g. "Quincena 15 - Agosto 2026"
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    gross_amount NUMERIC(12, 2) NOT NULL,
    deductions_amount NUMERIC(12, 2) NOT NULL,
    net_amount NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'MXN',
    pdf_url TEXT NOT NULL,
    xml_url TEXT,
    source TEXT DEFAULT 'contpaqi' CHECK (source IN ('manual', 'contpaqi', 'noi', 'external_api')),
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. EXTERNAL INTEGRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.external_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('contpaqi', 'noi', 'custom')),
    config_json JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (org_id, provider)
);

-- ==============================================================================
-- RLS POLICIES FOR PAYROLL
-- ==============================================================================

ALTER TABLE public.payroll_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can strictly view only their own payroll receipts or HR/Admins" ON public.payroll_receipts
    FOR SELECT USING (
        org_id = public.get_user_org_id()
        AND (
            profile_id = auth.uid()
            OR public.get_user_role() IN ('super_admin', 'admin', 'hr_manager')
        )
    );

CREATE POLICY "HR and Admins can manage payroll receipts" ON public.payroll_receipts
    FOR ALL USING (
        org_id = public.get_user_org_id()
        AND public.get_user_role() IN ('super_admin', 'admin', 'hr_manager')
    );
