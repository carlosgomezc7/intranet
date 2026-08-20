## 1. Database Migrations & Schema

- [x] 1.1 Create migration `src/lib/supabase/schema/012_rbac_pbac_system.sql` defining `roles`, `permissions`, `role_permissions`, `groups`, `user_groups`, RLS policies, and mandatory `role_id` on `profiles` [NEW]
- [x] 1.2 Update `src/lib/types.ts` with `Role`, `Permission`, `RolePermission`, `Group`, `UserGroup` interfaces and update `Profile` [MODIFY]
- [x] 1.3 Update seed data to insert base system roles, permissions matrix, `SuperAdministrador`, and initial `Administrador` with `must_change_password = true` [MODIFY]

## 2. Server-Side Authorization & Engine

- [x] 2.1 Implement `hasPermission(resource, action)` and `getEffectivePermissions(userId)` in `src/lib/auth/rbac.ts` [NEW]
- [x] 2.2 Create Server Actions for Role & Policy CRUD (`src/app/(intranet)/settings/access/actions.ts`) enforcing hierarchy protection [NEW]
- [x] 2.3 Create Server Actions for Group management and member assignment [NEW]
- [x] 2.4 Update auth flow to handle mandatory password change flag (`must_change_password`) on first login [MODIFY]

## 3. Client Hooks & Management UI

- [x] 3.1 Refactor `src/hooks/usePermissions.ts` to support granular `can(resource, action)` checks [MODIFY]
- [x] 3.2 Create Role & Permissions Matrix view in `/settings/access/page.tsx` and components [NEW]
- [x] 3.3 Create User Groups management view in `/settings/access/groups/page.tsx` [NEW]
- [x] 3.4 Create Password Change modal/screen for forced initial credential updates [NEW]

## 4. Verification & Audit

- [x] 4.1 Run Next.js production build (`npm run build`) and strict type checking to ensure 0 errors
- [x] 4.2 Verify hierarchical protection boundaries (preventing Level 1 admin from modifying Level 0 super_admin)
