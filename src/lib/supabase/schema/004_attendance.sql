-- ==============================================================================
-- ELEVATE INTRANET B2B — 004_attendance.sql
-- Attendance, Check-Ins, Biometric Logs & Row Level Security (RLS)
-- ==============================================================================

-- 1. ATTENDANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'on_time' CHECK (status IN ('on_time', 'late', 'absent', 'justified', 'vacation', 'holiday')),
    source TEXT NOT NULL DEFAULT 'web' CHECK (source IN ('web', 'biometric', 'manual', 'import')),
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (profile_id, date)
);

-- 2. ATTENDANCE IMPORTS TABLE (Biométrico CSV / Excel)
CREATE TABLE IF NOT EXISTS public.attendance_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    imported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    records_count INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- RLS POLICIES FOR ATTENDANCE
-- ==============================================================================

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attendance or HR can view all" ON public.attendance_records
    FOR SELECT USING (
        org_id = public.get_user_org_id()
        AND (
            profile_id = auth.uid()
            OR public.get_user_role() IN ('super_admin', 'admin', 'hr_manager')
        )
    );

CREATE POLICY "Users can record their own daily attendance" ON public.attendance_records
    FOR INSERT WITH CHECK (
        org_id = public.get_user_org_id()
        AND profile_id = auth.uid()
    );

CREATE POLICY "Users can update their own check-out on the same day" ON public.attendance_records
    FOR UPDATE USING (
        org_id = public.get_user_org_id()
        AND profile_id = auth.uid()
    );
