## Why

For enterprise internal portals, employees frequently prefer logging in with their organizational short username (e.g. `carlos.gomez` or `admin`) rather than typing their full email address on every session. Transitioning authentication to username-based login improves user experience and aligns with corporate LDAP/Active Directory conventions while maintaining secure backend authentication.

## What Changes

- **Username Login in UI**: Replace the "Correo Electrónico" input on the login form with a "Nombre de Usuario" input (`type="text"`, `name="username"`).
- **Username Resolution in Server Actions**: In `loginAction`, resolve the user's registered `email` by querying `public.profiles` using the normalized `username` (or fallback to synthetic internal domain mapping if direct email is unused), and then authenticate with Supabase Auth.
- **Explicit Signup with Username**: In `signupAction`, collect and validate `username`, ensuring uniqueness across the organization.
- **Database Schema**: Add `username TEXT UNIQUE` column to `public.profiles` (or ensure existing `001_core.sql` / migration supports username index).
- **Demo Mode Pre-fill**: Update demo credentials pre-fill in `LoginForm.tsx` and `demo.ts` to use username `admin` instead of `admin@elevate.com.mx`.

## Capabilities

### Modified Capabilities
- `auth/rbac`: Modifies authentication and signup requirements to use organizational username instead of email for user credential entry.
- `core/demo-mode`: Modifies demo credential pre-fill to supply username instead of email address.

## Impact

**Affected modules and dependencies:**
- Auth UI: `src/components/auth/LoginForm.tsx`
- Auth Server Actions: `src/app/(auth)/login/actions.ts`
- Demo helper: `src/lib/demo.ts`
- Database & Types: `src/lib/types.ts` (`Profile.username`), migration `011_username_auth.sql`
- Seed data: update seed profiles with representative usernames (`admin`, `superadmin`, `mariana.silva`, etc.)

**RBAC roles impacted:** All 6 roles — login flow applies universally across all users.

**Database schema changes:**
- Add `username TEXT UNIQUE` column to `public.profiles`.
- Add index on `LOWER(username)` for fast case-insensitive lookup during login.

**Rollback strategy:**
Additive column change. If reverted, login form can switch back to email input without dropping the username column.
