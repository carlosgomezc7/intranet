-- ==========================================
-- SAAS ONBOARDING RLS UPDATE
-- ==========================================

-- 1. Allow authenticated users to create a new organization
CREATE POLICY "Users can insert an organization" ON public.organizations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Allow authenticated users to update their profile to link to the new organization
CREATE POLICY "Users can update their own organization link" ON public.profiles
    FOR UPDATE USING (id = auth.uid());
