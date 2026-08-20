-- ==============================================================================
-- ELEVATE INTRANET B2B — 007_notifications.sql
-- Announcements & Notifications Center Schema with Row Level Security (RLS)
-- ==============================================================================

-- 1. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'hr', 'it', 'management', 'events')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_pinned BOOLEAN DEFAULT false,
    target_departments UUID[] DEFAULT ARRAY[]::UUID[], -- Empty array = all departments
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('mention', 'chat', 'request', 'approval', 'announcement', 'system')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- RLS POLICIES FOR ANNOUNCEMENTS & NOTIFICATIONS
-- ==============================================================================

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Announcements Policies
CREATE POLICY "Users can view announcements in their organization" ON public.announcements
    FOR SELECT USING (
        org_id = public.get_user_org_id()
        AND (
            target_departments = ARRAY[]::UUID[]
            OR public.get_user_department_id() = ANY(target_departments)
            OR public.get_user_role() IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Managers, HR, and Admins can create announcements" ON public.announcements
    FOR INSERT WITH CHECK (
        org_id = public.get_user_org_id()
        AND public.get_user_role() IN ('super_admin', 'admin', 'hr_manager', 'manager')
    );

CREATE POLICY "Authors and Admins can update announcements" ON public.announcements
    FOR UPDATE USING (
        org_id = public.get_user_org_id()
        AND (author_id = auth.uid() OR public.get_user_role() IN ('super_admin', 'admin'))
    );

CREATE POLICY "Authors and Admins can delete announcements" ON public.announcements
    FOR DELETE USING (
        org_id = public.get_user_org_id()
        AND (author_id = auth.uid() OR public.get_user_role() IN ('super_admin', 'admin'))
    );

-- Notifications Policies
CREATE POLICY "Users can view and manage their own notifications" ON public.notifications
    FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "System or authenticated users can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (org_id = public.get_user_org_id());
