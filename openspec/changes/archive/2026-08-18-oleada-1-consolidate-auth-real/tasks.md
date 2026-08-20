## 1. Database & Schema Consolidation

- [x] 1.1 Remove legacy database files `src/lib/supabase/multi_tenant_schema.sql` and `src/lib/supabase/onboarding_rls.sql` [DELETE]
- [x] 1.2 Create `src/lib/supabase/schema/009_seed.sql` with 1 organization, 4 departments, and ~20 profiles across 6 RBAC roles with idempotent inserts [NEW]
- [x] 1.3 Verify database migration sequence from `001_core.sql` to `009_seed.sql` for table naming and RLS helper consistency

## 2. Demo Mode Infrastructure

- [x] 2.1 Create `src/lib/demo.ts` with `isDemoMode()` utility and isolated demo constants [NEW]
- [x] 2.2 Update `.env.local.example` to document `NEXT_PUBLIC_DEMO_MODE` environment variable [MODIFY]
- [x] 2.3 Create `src/components/layout/DemoModeBanner.tsx` with WCAG 2.2 AA accessible alert styling and `aria-live="polite"` [NEW]

## 3. Server Actions & Middleware Refactoring

- [x] 3.1 Refactor `src/app/(auth)/login/actions.ts` to make `signupAction` the explicit authority for organization and profile creation, and remove unauthenticated catch-all fallback in `loginAction` [MODIFY]
- [x] 3.2 Refactor `src/lib/supabase/middleware.ts` to gate `elevate_demo_session` cookie verification strictly behind `isDemoMode()` and reject unauthenticated requests to protected routes [MODIFY]
- [x] 3.3 Ensure `signOutAction` in `src/app/(auth)/login/actions.ts` properly clears demo cookie and Supabase session [MODIFY]

## 4. Client State & UI Refactoring

- [x] 4.1 Update `src/hooks/useUser.ts` to initialize profile as `null` with proper loading state, falling back to demo profile only if `isDemoMode()` is active [MODIFY]
- [x] 4.2 Update `src/app/(intranet)/layout.tsx` to render `DemoModeBanner` when demo mode is active and enforce redirect to `/login` for unauthenticated requests [MODIFY]
- [x] 4.3 Update `src/components/auth/LoginForm.tsx` to conditionally populate default credentials only when demo mode is enabled [MODIFY]

## 5. Verification & Live Validation

- [x] 5.1 Run Next.js production build (`npm run build`) and lint checks to ensure zero TypeScript and bundling errors
- [x] 5.2 Validate Settings page (`/settings`) updates profile table correctly under an authenticated Supabase session
- [x] 5.3 Validate Report page (`/report`) inserts into `bug_reports` correctly under an authenticated Supabase session
- [x] 5.4 Test toggle of `NEXT_PUBLIC_DEMO_MODE=true` vs `NEXT_PUBLIC_DEMO_MODE=false` behaviors
