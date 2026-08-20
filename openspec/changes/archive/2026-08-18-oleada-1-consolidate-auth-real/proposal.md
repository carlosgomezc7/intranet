## Why

The project has two conflicting database schemas (`001_core.sql` with 6 RBAC roles and `org_id` vs legacy `multi_tenant_schema.sql` with 2 roles and `organization_id`) that cannot coexist. Additionally, all intranet modules rely on hardcoded demo profiles and mock data — the auth flow falls back to `DEMO_PROFILE` on any network error, giving unrestricted admin access. This blocks any real user testing and must be resolved before connecting any module to live data.

## What Changes

- **BREAKING**: Remove legacy `multi_tenant_schema.sql` and `onboarding_rls.sql` — canonize `001_core.sql` as the single source of truth for the database schema
- Convert the `elevate_demo_session` cookie fallback from an implicit catch-all to an explicit, opt-in demo mode controlled by a `NEXT_PUBLIC_DEMO_MODE` environment variable
- Refactor `signupAction` to be the explicit owner of organization + profile creation (no DB trigger), ensuring `org_id` is correctly linked
- Remove all hardcoded `DEMO_PROFILE` / `DEMO_USER_PROFILE` constants from `useUser.ts` and `(intranet)/layout.tsx` — replace with proper loading/unauthenticated states
- Remove hardcoded `defaultValue` credentials from `LoginForm.tsx` (only shown in demo mode)
- Create `009_seed.sql` with a realistic seed dataset: 1 organization, 4 departments, ~20 employee profiles across roles, and sample announcements
- Validate that Settings (`/settings`) and Report (`/report`) — which already have real Supabase queries — work correctly with real auth

## Capabilities

### New Capabilities
- `core/demo-mode`: Controlled demo mode feature flag that allows offline presentation without Supabase, activated only via environment variable
- `core/seed-data`: Realistic seed data script for development and demo environments

### Modified Capabilities
- `auth/rbac`: Auth flow removes implicit demo fallback; `signupAction` becomes the authoritative profile+org creation path; login enforces real Supabase credentials unless demo mode is explicitly enabled
- `core/database-schema`: Legacy `multi_tenant_schema.sql` and `onboarding_rls.sql` are removed; `001_core.sql` is the canonical schema

## Impact

**Affected modules and dependencies:**
- Auth module: `actions.ts`, `LoginForm.tsx`, `middleware.ts` (Supabase middleware)
- Layout: `(intranet)/layout.tsx`, `useUser.ts` hook
- Settings page: validation only (already has real Supabase queries)
- Report page: validation only (already has real Supabase queries)
- Database: removal of 2 SQL files, creation of 1 seed file

**RBAC roles impacted:** All 6 roles — the demo fallback currently grants `admin` access unconditionally; after this change, role comes from the real profile or demo mode explicitly assigns a configurable role.

**Database schema changes:**
- No new tables or columns — existing `001_core.sql` through `007_notifications.sql` remain unchanged
- Removal of conflicting `multi_tenant_schema.sql` (duplicate `organizations`, `profiles`, `announcements` definitions with different column names)
- Removal of `onboarding_rls.sql` (duplicate RLS policies already covered by `001_core.sql`)
- New `009_seed.sql` with INSERT statements for development data

**Rollback strategy:** Revert the PR. The legacy SQL files can be restored from git history. The seed data is additive and can be rolled back with `DELETE FROM` statements. No destructive schema migrations are involved.
