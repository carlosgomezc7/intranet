## Why

Organizations require flexible, hierarchical access control where system roles establish standard baseline permissions, but administrators need the authority to grant or revoke specific feature capabilities on a per-user basis (e.g., granting a specific operator access to view team payroll or blocking chat access for an individual user without creating hundreds of redundant custom roles). Additionally, username-based login resolution in Supabase Auth requires robust SSR session management, case-insensitive profile lookups, clean demo vs. production credential fallbacks, and strict protection against username enumeration attacks.

## What Changes

- **Username Resolution & Auth Security**:
  - Secure case-insensitive username-to-email resolution via a dedicated PostgreSQL stored procedure (`get_auth_email_by_identifier`) running with `SECURITY DEFINER` that returns generic responses on invalid lookups to mitigate user enumeration.
  - Hardened Server Action login flow handling SSR HttpOnly cookie sessions, clean fallback for demo accounts, and unified error messages.
- **Granular User-Level Feature Overrides (PBAC/Feature Toggles)**:
  - New relational table `public.user_permission_overrides` supporting explicit `is_granted = true` (grant/allow) or `is_granted = false` (deny/block) per user and permission.
  - Effective permission evaluation algorithm: `Explicit User Deny (false)` > `Explicit User Grant (true)` > `Role Role-Permissions` > `Role Hierarchy Baseline`.
  - Hierarchical escalation prevention: Administrators cannot grant, revoke, or override permissions for users with equal or higher hierarchy levels, nor can they grant permissions they do not possess themselves.
- **Access Control Administration UI**:
  - Enhanced `/settings/access` and employee directory user cards with a granular "Feature Matrix & Overrides" panel allowing administrators to toggle specific features per user (e.g. Chat, Announcements, Payroll, Attendance, Knowledge Base, Reports).
- **Client & Server Permission Enforcement**:
  - Updated `usePermissions` hook and server-side `hasPermission(resource, action, userId?)` helper to evaluate effective permissions combining role permissions and user overrides.
  - Updated RLS database policies to respect user-level explicit permission overrides where applicable.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `auth/rbac`: Adding user-level granular permission overrides, precedence resolution logic (User Deny/Grant > Role Permissions > Hierarchy Baseline), and secure username resolution with timing-safe anti-enumeration protection.
- `auth/access-control`: Adding UI and Server Actions for administrators to inspect, toggle, grant, and block feature capabilities for individual users, enforcing hierarchy boundaries.

## Impact

- **Affected Modules**: Auth (`src/lib/auth/actions.ts`, `src/lib/supabase/middleware.ts`), Access Control & Settings (`src/app/(intranet)/settings/access/`), Hooks (`src/hooks/usePermissions.ts`, `src/hooks/useUser.ts`), Shared Types (`src/lib/types.ts`).
- **RBAC Roles Impacted**:
  - `super_admin`: Full bypass & global override authority across all organizations.
  - `admin`: Can assign roles and toggle granular user feature overrides for hierarchy level >= 2 (`manager`, `employee`, custom roles). Cannot modify other admins or super_admins.
  - `manager` & `employee`: Subject to role baselines and explicit administrative feature overrides.
- **Database Schema Changes**:
  - New table `public.user_permission_overrides (user_id, permission_id, is_granted, created_at, updated_at, granted_by)` with foreign keys and RLS policies.
  - Function `public.get_effective_user_permissions(target_user_id UUID)` returning computed permissions.
  - Migration script `013_user_permission_overrides.sql`.
- **Rollback Strategy**:
  - Revert migration `013_user_permission_overrides.sql` dropping `user_permission_overrides` and related functions.
  - Fallback to role-only permission evaluation in `usePermissions.ts` and `src/lib/types.ts`.
