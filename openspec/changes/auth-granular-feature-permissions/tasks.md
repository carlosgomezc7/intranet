## 1. Database Schema & Migration

- [x] 1.1 Create migration `013_user_permission_overrides.sql`: table `user_permission_overrides` with `(user_id, permission_id, is_granted, granted_by)`, foreign keys, indexes, and RLS policies scoped to org via join to profiles.
- [x] 1.2 Add PostgreSQL function `resolve_login_identifier(p_identifier TEXT)` with `SECURITY DEFINER`: case-insensitive lookup by `LOWER(username)` or `LOWER(email)`, returns email or NULL without leaking existence.
- [x] 1.3 Add PostgreSQL function `get_effective_user_permissions(p_user_id UUID)` returning a table of `(resource, action, is_granted, source)` combining role_permissions + user_permission_overrides with precedence logic.
- [x] 1.4 Add database trigger `trg_sync_role_slug` on `profiles`: when `role_id` changes, auto-update `profiles.role` to `roles.slug`. Add trigger `trg_prevent_override_escalation` on `user_permission_overrides` INSERT/UPDATE to enforce hierarchy guardrails.
- [x] 1.5 Update seed data: add a demo "operator" user (Mario) with role `employee` and sample user_permission_overrides (block `chat:access`, grant `payroll:read:department`) for testing.

## 2. Auth Hardening & Login Rewrite

- [x] 2.1 Rewrite `loginAction` in `src/app/(auth)/login/actions.ts`: replace hardcoded `@elevate.com.mx` domain fallback with RPC call to `resolve_login_identifier`. Remove hardcoded demo password — gate demo credential check behind `isDemoMode()` and read password from `DEMO_PASSWORD` env var.
- [x] 2.2 Harden `useUser` hook in `src/hooks/useUser.ts`: remove 3 unconditional `DEMO_PROFILE` fallbacks. When `!isDemoMode()` and no user/error, set `profile = null` (not demo). Only use `DEMO_PROFILE` when `isDemoMode()` returns true.
- [x] 2.3 Update `src/lib/supabase/middleware.ts`: add connection error handling — when Supabase is unreachable and `!isDemoMode()`, redirect to `/login?error=connection_failed` instead of granting access.
- [x] 2.4 Update `signupAction` to assign both `role_id` (lookup admin role UUID) and `role` ('admin') when creating profiles for new organizations.

## 3. TypeScript Data Model & Types

- [x] 3.1 Update `src/lib/types.ts`: add `UserPermissionOverride` and `UserEffectivePermissions` interfaces. Add optional `effectivePermissions?: UserEffectivePermissions` and `permissionOverrides?: UserPermissionOverride[]` to `Profile`.
- [x] 3.2 Unify hierarchy level constants: update `USER_ROLES` in `src/lib/constants.ts` to use `hierarchy_level` (0-3+) matching `012_rbac_pbac_system.sql` instead of the current 10-100 scale.

## 4. Client Hooks Rewrite

- [x] 4.1 Update `useUser` hook to fetch `role_permissions` and `user_permission_overrides` alongside the profile query, building an `effectivePermissions` map (`Record<string, boolean>`) on the profile object. Subscribe to realtime changes on `user_permission_overrides` for the current user.
- [x] 4.2 Rewrite `usePermissions` hook: replace all hardcoded hierarchy checks and switch statements with map-lookup logic against `profile.effectivePermissions`. Preserve legacy `can('manage_users')` syntax via an alias map that translates to `resource:action` pairs. The `can(resource, action)` call becomes `effectivePermissions[resource:action] ?? false`.
- [x] 4.3 Update `src/lib/auth/rbac.ts` (`getEffectivePermissions` and `hasPermission`): query `user_permission_overrides` in addition to `role_permissions`, applying precedence (user deny > user grant > role permissions > super_admin bypass).

## 5. Server Actions for Permission Management

- [x] 5.1 Create Server Actions in `src/lib/auth/actions.ts` (or new file `src/lib/auth/permission-actions.ts`): `setUserPermissionOverride(userId, permissionId, isGranted)`, `removeUserPermissionOverride(userId, permissionId)`, `resetUserOverrides(userId)`. Each validates hierarchy: actor's `hierarchy_level` must be strictly lower (higher privilege) than target user's, and actor must possess the permission being granted.
- [x] 5.2 Create Server Action `getUserPermissionMatrix(userId)` returning the full permission list with status per permission: `inherited` (from role), `explicitly_allowed`, `explicitly_blocked`, or `denied` (not in role, no override).

## 6. UI — Access Management Components

- [x] 6.1 Create `src/components/access/UserPermissionsPanel.tsx`: a panel/drawer component displaying the permission matrix for a user, grouped by module (Chat, Payroll, Attendance, Announcements, Knowledge, Projects, Users, Roles, Groups). Each permission shows its source (role badge or override badge) with a toggle switch. Include "Restablecer a valores del rol" button.
- [x] 6.2 Create or update `/settings/access` page (`src/app/(intranet)/settings/access/page.tsx`) with a "Colaboradores y Permisos" tab: searchable user list with role filter, clicking a user opens `UserPermissionsPanel`.
- [x] 6.3 Integrate permission override trigger in Employee Directory profile drawer — add a "Gestionar Permisos" button visible only to admins, opening `UserPermissionsPanel` for that user.
- [x] 6.4 Ensure full WCAG 2.2 AA compliance across all new UI: high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-cyan-400`), keyboard navigation (`Tab`, `Shift+Tab`, `Esc`, `Space` for toggles), `role="switch"` on toggles, `aria-live="polite"` region for save feedback.

## 7. Verification & End-to-End Testing

- [x] 7.1 Verify login flows: username login (case-insensitive), email login, non-existent user (generic error, no enumeration), demo mode login with env-var password.
- [x] 7.2 Verify `useUser` hardening: with demo mode OFF — error scenarios set `profile = null`, not `DEMO_PROFILE`.
- [x] 7.3 Test override scenarios: block `chat:access` for Mario → chat route forbidden and dock icon hidden. Grant `payroll:read:department` to Mario → payroll records visible. Reset overrides → revert to role defaults.
- [x] 7.4 Test hierarchy guardrails: admin cannot modify another admin's overrides. Admin cannot grant a permission they don't have.
- [x] 7.5 Verify `profiles.role` ↔ `role_id` sync trigger: changing `role_id` updates `role` column correctly.
- [x] 7.6 Run `npm run build` and lint to verify zero TypeScript regressions.
