## Context

See proposal.md for motivation. The current codebase has two auth paths running in parallel: a real Supabase SSR flow and an implicit demo fallback that activates on any error. Both `useUser.ts` and `(intranet)/layout.tsx` initialize with `DEMO_PROFILE` constants. The middleware accepts an `elevate_demo_session` cookie that bypasses all auth. The legacy `multi_tenant_schema.sql` uses `organization_id` while all application code uses `org_id`. Settings (`/settings`) and Report (`/report`) already have working Supabase queries but they operate against the demo profile rather than real data.

## Goals / Non-Goals

**Goals:**
- Single canonical database schema with no duplicate definitions
- Auth flow that enforces real Supabase credentials by default
- Opt-in demo mode controlled by `NEXT_PUBLIC_DEMO_MODE` env var
- `signupAction` as sole owner of org + profile creation
- Realistic seed data for development and demo purposes
- Settings and Report validated with real auth

**Non-Goals:**
- SaaS features (billing, trials, subdomain routing) — deferred to Fase 4+
- Connecting Directory, Dashboard, or other modules to live data — that is Oleada 2
- handle_new_user trigger — user chose explicit signupAction control
- Mobile responsive sidebar — separate change

## Decisions

### Decision 1: Demo mode via environment variable (not feature flag table)

**Choice**: `NEXT_PUBLIC_DEMO_MODE` environment variable checked at build time.

**Alternatives considered**:
- **Feature flag in Supabase DB**: Rejected because demo mode is specifically for when Supabase is unavailable — a DB-stored flag would be unreachable.
- **Runtime toggle in UI**: Rejected because it would be a security vector in production; env vars are deployment-level controls.

**Implementation**: Create a helper `src/lib/demo.ts` exporting `isDemoMode()` that returns `process.env.NEXT_PUBLIC_DEMO_MODE === "true"`. All demo-conditional code checks this single function.

### Decision 2: Retain `elevate_demo_session` cookie but gate it behind demo mode

**Choice**: Keep the cookie mechanism but only set it when `isDemoMode()` returns true.

**Alternatives considered**:
- **Remove cookie entirely**: Rejected because server-side middleware needs a way to recognize demo sessions on subsequent requests without re-checking Supabase.
- **JWT-based demo token**: Over-engineered for a development-only feature.

**Implementation in middleware.ts**:
```typescript
// Only check demo cookie if demo mode is enabled
const isDemoAuthenticated = isDemoMode() && Boolean(demoCookie?.value);
```

### Decision 3: signupAction owns the full creation flow (no DB trigger)

**Choice**: The `signupAction` server action explicitly: (1) creates auth user, (2) inserts organization, (3) upserts profile with `org_id`.

**Alternatives considered**:
- **handle_new_user trigger**: Auto-creates profile on auth.users INSERT. Rejected because the user needs explicit control over org creation timing and the profile-to-org linkage.

**Implementation in actions.ts**:
```typescript
// 1. Create auth user
const { data: authData } = await supabase.auth.signUp({ email, password, options: { data: { full_name } } });
// 2. Create organization
const { data: orgData } = await supabase.from("organizations").insert({ name: orgName }).select("id").single();
// 3. Link profile to organization
await supabase.from("profiles").upsert({ id: authData.user.id, org_id: orgData.id, email, full_name, role: "admin" });
```

### Decision 4: Remove DEMO_PROFILE constants, add proper null/loading states

**Choice**: Replace `DEMO_PROFILE` with `null` initial state. Components handle null profile with loading skeletons.

**Files affected**:
- `src/hooks/useUser.ts`: `useState<Profile | null>(null)`, `loading` starts as `true`
- `src/app/(intranet)/layout.tsx`: If `user` is null and demo mode is off → redirect to `/login`
- `src/components/intranet/dashboard/WelcomeBanner.tsx`: Already handles `profile?.full_name || "Colaborador"` — no change needed

### Decision 5: Seed data as SQL migration file (not a script)

**Choice**: `009_seed.sql` in `src/lib/supabase/schema/` using deterministic UUIDs and `ON CONFLICT DO NOTHING`.

**Alternatives considered**:
- **TypeScript seed script**: Rejected because it would require a running app server; SQL can be pasted directly into Supabase SQL editor.
- **Supabase seed.sql convention**: The project already uses numbered migrations; keeping consistency.

**Seed data structure**:
```sql
-- 1 organization with deterministic UUID
INSERT INTO organizations (id, name, ...) VALUES ('550e8400-...', 'Elevate Enterprise Solutions', ...)
  ON CONFLICT (id) DO NOTHING;

-- 4 departments
INSERT INTO departments (id, org_id, name, ...) VALUES
  ('dept-tech-uuid', '550e8400-...', 'Tecnología', ...),
  ('dept-rh-uuid', '550e8400-...', 'Recursos Humanos', ...),
  ('dept-fin-uuid', '550e8400-...', 'Finanzas', ...),
  ('dept-dir-uuid', '550e8400-...', 'Dirección', ...)
  ON CONFLICT (id) DO NOTHING;

-- ~20 profiles across all 6 roles
-- Note: profiles reference auth.users, so seed profiles require
-- corresponding auth.users entries or service_role bypass
```

**Important note on profiles**: Since `profiles.id` is a FK to `auth.users(id)`, seed profiles need corresponding auth users. Two approaches:
1. Create auth users via Supabase Dashboard/CLI first, then run seed SQL
2. Use `service_role` key to insert into `auth.users` directly (dev only)

The seed script will include commented instructions for both approaches.

## Risks / Trade-offs

- **[Risk] Demo mode left enabled in production** → Mitigation: The `NEXT_PUBLIC_DEMO_MODE` variable is prefixed with `NEXT_PUBLIC_`, making it visible in client bundles. Add a `console.warn` when demo mode is active. The demo banner provides visual indication.
- **[Risk] Seed data UUIDs conflict with real data** → Mitigation: Use a reserved UUID namespace (e.g., `00000000-0000-4000-a000-*`) unlikely to collide with `uuid_generate_v4()`.
- **[Risk] Existing demo users lose access after removing fallback** → Mitigation: This is development-only. No real users exist yet. Document the migration in the PR description.
- **[Trade-off] `NEXT_PUBLIC_` prefix exposes demo mode flag to client** → Acceptable because demo mode is a non-secret development convenience, not a security boundary.

## Migration Plan

1. Delete `src/lib/supabase/multi_tenant_schema.sql` and `src/lib/supabase/onboarding_rls.sql`
2. Create `src/lib/demo.ts` with `isDemoMode()` helper
3. Refactor `middleware.ts`, `actions.ts`, `useUser.ts`, `layout.tsx` to use `isDemoMode()`
4. Remove `DEMO_PROFILE` constants and hardcoded credentials
5. Add `.env.local.example` entry for `NEXT_PUBLIC_DEMO_MODE`
6. Create `009_seed.sql`
7. Run `npm run build` to verify TypeScript compilation
8. Test login flow with real Supabase credentials
9. Test login flow with `NEXT_PUBLIC_DEMO_MODE=true`

Rollback: Revert the PR branch. No database migrations are involved — only file removals and code refactors.
