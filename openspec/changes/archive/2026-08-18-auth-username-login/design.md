## Context

Supabase Auth natively authenticates against `auth.users` using `email` or `phone`. However, the user experience for enterprise intranet portals requires users to input a concise `username` (e.g. `carlos.gomez`, `admin`, `mariana.silva`) rather than their full corporate email address.

## Goals / Non-Goals

**Goals:**
- Replace email input with username input across login and signup interfaces.
- Resolve `username` -> `email` inside `loginAction` using a secure server-side query against `public.profiles`.
- Support synthetic fallback mapping `${username}@elevate.internal` when direct email is not specified.
- Update demo mode constants and pre-fills to use username `admin`.
- Add `username TEXT UNIQUE` column to `public.profiles` and index `LOWER(username)`.

**Non-Goals:**
- Phone number SMS OTP login.
- OAuth SSO social logins (Google/Microsoft SSO can be added separately in Phase 4).

## Decisions

### Decision 1: Username Resolution Strategy in `loginAction`

**Choice**:
1. User submits `username` + `password`.
2. Normalize username (`username.toLowerCase().trim()`).
3. Server Action queries `profiles.email` where `LOWER(username) = ?` or `email = ?` using the Supabase server client.
4. If profile is found with an email, call `supabase.auth.signInWithPassword({ email: profile.email, password })`.
5. If no profile is found or query fails, try logging in with the synthetic email `${username}@elevate.internal` or return a generic "Usuario o contraseña incorrectos" error.

**Rationale**: This retains standard Supabase JWT SSR cookies and RLS policies without requiring custom GoTrue extensions.

### Decision 2: Schema Migration `011_username_auth.sql`

**Choice**:
```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON public.profiles ((LOWER(username)));

-- Populate existing seed profiles
UPDATE public.profiles SET username = 'admin' WHERE email = 'admin@elevate.com.mx';
UPDATE public.profiles SET username = 'superadmin' WHERE email = 'superadmin@elevate.com.mx';
UPDATE public.profiles SET username = 'mariana.silva' WHERE email = 'mariana.silva@elevate.com.mx';
UPDATE public.profiles SET username = 'alejandro.morales' WHERE email = 'alejandro.morales@elevate.com.mx';
UPDATE public.profiles SET username = 'sofia.valenzuela' WHERE email = 'sofia.valenzuela@elevate.com.mx';
UPDATE public.profiles SET username = 'diego.hernandez' WHERE email = 'diego.hernandez@elevate.com.mx';
```

## Risks / Trade-offs

- **[Risk] Case sensitivity in username** → *Mitigation*: Store usernames trimmed and search with `LOWER(username)` in SQL and server actions.
- **[Risk] Username enumeration via login errors** → *Mitigation*: Return the exact same generic error message ("Usuario o contraseña incorrectos") regardless of whether the username exists or the password was incorrect.
