-- ==============================================================================
-- ELEVATE INTRANET B2B — 011_username_auth.sql
-- Username-Based Authentication Support
-- ==============================================================================

-- 1. ADD USERNAME COLUMN TO PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- 2. CASE-INSENSITIVE INDEX FOR FAST USERNAME LOOKUP
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON public.profiles ((LOWER(username)));

-- 3. POPULATE DEFAULT USERNAMES FOR SEED PROFILES
UPDATE public.profiles SET username = 'admin' WHERE email = 'admin@elevate.com.mx' AND (username IS NULL OR username = '');
UPDATE public.profiles SET username = 'superadmin' WHERE email = 'superadmin@elevate.com.mx' AND (username IS NULL OR username = '');
UPDATE public.profiles SET username = 'mariana.silva' WHERE email = 'mariana.silva@elevate.com.mx' AND (username IS NULL OR username = '');
UPDATE public.profiles SET username = 'alejandro.morales' WHERE email = 'alejandro.morales@elevate.com.mx' AND (username IS NULL OR username = '');
UPDATE public.profiles SET username = 'sofia.valenzuela' WHERE email = 'sofia.valenzuela@elevate.com.mx' AND (username IS NULL OR username = '');
UPDATE public.profiles SET username = 'diego.hernandez' WHERE email = 'diego.hernandez@elevate.com.mx' AND (username IS NULL OR username = '');
UPDATE public.profiles SET username = 'valeria.castillo' WHERE email = 'valeria.castillo@elevate.com.mx' AND (username IS NULL OR username = '');
UPDATE public.profiles SET username = 'roberto.mendoza' WHERE email = 'roberto.mendoza@elevate.com.mx' AND (username IS NULL OR username = '');
UPDATE public.profiles SET username = 'lucia.navarro' WHERE email = 'lucia.navarro@elevate.com.mx' AND (username IS NULL OR username = '');
UPDATE public.profiles SET username = 'gabriel.torres' WHERE email = 'gabriel.torres@elevate.com.mx' AND (username IS NULL OR username = '');
