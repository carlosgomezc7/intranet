## Context

See [proposal.md](proposal.md) for background and motivation. The system currently supports role-based permissions (`012_rbac_pbac_system.sql`) and initial username lookups (`011_username_auth.sql`). However, permissions are strictly attached to roles (`roles` and `role_permissions`). When an administrator wants to customize access for a specific user (such as granting an operator access to view team payroll or restricting chat access for an individual employee), they are forced to create redundant custom roles. Furthermore, username resolution during login requires hardened security against user enumeration and clean integration with SSR cookies and demo fallback accounts.

**Gap analysis** (see analysis_results.md) revealed additional debts:
- `usePermissions` is 100% hardcoded — it evaluates permissions by hierarchy level in TypeScript without ever querying `role_permissions` or the DB. This is a complete rewrite, not an update.
- `useUser` falls back to `DEMO_PROFILE` in 3 catch branches even when demo mode is disabled, violating the "No implicit demo profile" spec.
- Login has hardcoded `@elevate.com.mx` domain fallback and demo credentials in source code.
- Dual role sources: `profiles.role` (TEXT CHECK) vs `profiles.role_id` (UUID FK to `roles`).

## Goals / Non-Goals

**Goals:**
- Provide a relational user-level override mechanism (`user_permission_overrides`) supporting both explicit granting (`is_granted = true`) and explicit blocking/denial (`is_granted = false`).
- Implement an unambiguous, deterministic permission evaluation algorithm: `Explicit User Deny` > `Explicit User Grant` > `Role Assigned Permissions` > `Hierarchy Baseline`.
- Implement hierarchical guardrails preventing administrators from altering permissions of users with equal or higher hierarchy levels, or granting permissions they do not possess.
- Provide a secure identifier lookup routine in PostgreSQL (`resolve_login_identifier`) to authenticate with either username or email without leaking user existence.
- **Rewrite** `src/hooks/usePermissions.ts` to be data-driven (fetch effective permissions from profile context, not hardcoded switches).
- **Harden** `src/hooks/useUser.ts` to never fall back to `DEMO_PROFILE` unless `isDemoMode()` is true.
- **Remove** hardcoded domain `@elevate.com.mx` from login resolution and hardcoded demo password from source.
- Provide an administrative UI in `/settings/access/users` and `/directory` with WCAG 2.2 AA compliant toggles and ARIA status announcements.

**Non-Goals:**
- Attribute-Based Access Control (ABAC) based on dynamic external variables like GPS location or time of day.
- Replacing PostgreSQL Row Level Security (RLS remains the authoritative Zero-Trust enforcement layer).
- Removing `profiles.role` TEXT column entirely — it will be retained as a denormalized convenience field kept in sync with `role_id`, but `role_id` becomes the authoritative source. Full migration to role_id-only is deferred.

## Decisions

### Decision 1: Relational User Permission Overrides (`user_permission_overrides`) vs JSONB Column
- **Choice**: Dedicated junction table `public.user_permission_overrides` with `(user_id, permission_id, is_granted, granted_by, updated_at)` foreign keys.
- **Rationale**: Direct relational integrity with `public.permissions`, cascade deletion on user removal, clean indexing, and native SQL joins inside PostgreSQL RLS policies without JSON parsing overhead.
- **Alternatives Considered**: Storing a JSONB `permission_overrides` column on `public.profiles`. Rejected because JSONB makes relational joins, referential integrity, and database-level audit triggers more error-prone.

```sql
CREATE TABLE IF NOT EXISTS public.user_permission_overrides (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    is_granted BOOLEAN NOT NULL, -- TRUE = explicit grant, FALSE = explicit block/deny
    granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, permission_id)
);
```

### Decision 2: Permission Resolution Engine & Precedence Flow
- **Choice**: Precedence order evaluated on both database and client:
```
┌────────────────────────────────────────────────────────┐
│               Check Resource & Action                  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
           ┌─────────────────────────────────┐
           │ SuperAdmin (Hierarchy Level 0)? │───▶ YES ───▶ [ALLOW]
           └────────────────┬────────────────┘
                            │ NO
                            ▼
           ┌─────────────────────────────────┐
           │ Explicit User Override Exists?  │
           └────────────────┬────────────────┘
                   YES ┌────┴────┐ NO
                       ▼         ▼
          ┌──────────────────┐  ┌────────────────────────┐
          │ is_granted == ?  │  │ In Role Permissions?   │
          └─────┬──────┬─────┘  └───────────┬────────────┘
         FALSE  │      │ TRUE       YES ┌───┴───┐ NO
                ▼      ▼                ▼       ▼
             [DENY] [ALLOW]          [ALLOW] [DENY]
```
- **Change from prior version**: Removed the "Hierarchy Baseline OK?" fallback step. Without an explicit `role_permissions` record or user override, the answer is always DENY (least privilege). `super_admin` bypass at the top is sufficient.

### Decision 3: Secure Username Resolution & Anti-Enumeration
- **Choice**: Dedicated PostgreSQL function `resolve_login_identifier(p_identifier TEXT)` running with `SECURITY DEFINER`.
- **Implementation**: Look up `email` where `LOWER(username) = LOWER(p_identifier) OR LOWER(email) = LOWER(p_identifier)`.
- **Security**: The Server Action always proceeds to authenticate with Supabase Auth or returns a generic `"Usuario o contraseña incorrectos"` message in constant time, preventing timing-based user enumeration.
- **This replaces**: The hardcoded `@elevate.com.mx` domain fallback in the current `loginAction`.

### Decision 4: TypeScript Data Model & Hook Architecture
- **Choice**: Extend `Profile` and add `UserPermissionOverride` interfaces:
```typescript
export interface UserPermissionOverride {
  user_id: string;
  permission_id: string;
  is_granted: boolean;
  permission?: Permission;
}

export interface UserEffectivePermissions {
  [resourceAction: string]: boolean; // e.g. 'chat:access': false, 'payroll:read:department': true
}
```
- **`useUser` changes**: The hook will fetch `role_permissions` and `user_permission_overrides` alongside the profile, building an `effectivePermissions` map that `usePermissions` consumes synchronously. Fallbacks to `DEMO_PROFILE` will be gated strictly behind `isDemoMode()`.
- **`usePermissions` rewrite**: The `can()` function becomes a map lookup instead of hardcoded switch/if chains. Legacy action-name mapping (`manage_users`, etc.) will be preserved as aliases that map to `resource:action` pairs.

### Decision 5: `profiles.role` vs `profiles.role_id` Coexistence Strategy
- **Choice**: `role_id` becomes the authoritative source of truth. `profiles.role` TEXT is retained as a denormalized convenience field. A database trigger keeps them in sync: when `role_id` changes, the trigger updates `profiles.role` to the corresponding `roles.slug`. The `signupAction` will set both fields.
- **Rationale**: Allows gradual migration. Existing code that reads `profiles.role` continues to work. New code reads `role_id` and joins to `roles`.
- **Alternatives Considered**: Dropping `profiles.role` entirely. Rejected because it would require a large refactor of existing components and middleware that check `profile.role` directly.

### Decision 6: Demo Credential Isolation
- **Choice**: Demo credentials (`elevate2026`) are moved to `DEMO_PASSWORD` environment variable. The `loginAction` checks for demo credentials only when `isDemoMode()` returns true. In production builds with demo mode off, no demo path executes.
- **Rationale**: Prevents production exposure of demo credentials. Keeps demo flow functional for development.

## Risks / Trade-offs

- **[Risk]** Excessive database queries when evaluating permissions per user request.
  → **Mitigation**: Load role permissions + user overrides into the profile context during `useUser` initialization. `usePermissions` evaluates synchronously from the cached map — zero additional queries per `can()` call.
- **[Risk]** Privilege escalation where a lower-tier administrator grants high-level privileges to themselves or others.
  → **Mitigation**: Strict validation in PostgreSQL trigger and Server Action: `actor_hierarchy < target_user_hierarchy` AND actor must possess the target permission.
- **[Risk]** `profiles.role` and `role_id` drift out of sync.
  → **Mitigation**: Database trigger on `profiles` updates `role` column from `roles.slug` whenever `role_id` changes. Application code always sets `role_id`; never writes `role` directly.
- **[Risk]** `usePermissions` rewrite breaks existing UI components relying on `can('manage_users')` legacy syntax.
  → **Mitigation**: Maintain a legacy alias map that translates `manage_users` → `users:create,users:read,users:update,users:delete`. All existing call sites continue working.

## Migration Plan

1. **Migration SQL**: Apply `013_user_permission_overrides.sql` with tables, indexes, RLS policies, `resolve_login_identifier` function, `get_effective_user_permissions` helper, and `role`↔`role_id` sync trigger.
2. **Hardening**: Clean up `useUser` fallbacks, remove hardcoded demo password and domain from `loginAction`.
3. **Types & Hooks**: Update `src/lib/types.ts`, rewrite `src/hooks/usePermissions.ts`, update `src/hooks/useUser.ts` to load effective permissions.
4. **Auth Server Actions**: Rewrite `loginAction` to use `resolve_login_identifier`, add override management actions with hierarchy validation.
5. **UI Implementation**: Build User Permission Override panel in `/settings/access/users` and `/directory`.
6. **Rollback Strategy**: Drop table `user_permission_overrides`, remove sync trigger, and revert `usePermissions.ts` to hardcoded logic.
