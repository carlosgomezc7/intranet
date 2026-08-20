## Context

The system requires an enterprise-grade Role-Based Access Control (RBAC) and Policy-Based Access Control (PBAC) architecture. This replaces simple static role enums with a dynamic relational model that supports granular CRUD policies per resource module, organizational groups, strict numeric role hierarchies, and delegation safety rules.

## Data Model & Relational ERD

```
+------------------+         +----------------------+         +---------------------+
|      roles       | 1 --- * |   role_permissions   | * --- 1 |     permissions     |
+------------------+         +----------------------+         +---------------------+
| id (UUID, PK)    |         | role_id (FK)         |         | id (UUID, PK)       |
| org_id (UUID, FK)|         | permission_id (FK)   |         | resource (TEXT)     |
| name (TEXT)      |         +----------------------+         | action (TEXT)       |
| slug (TEXT)      |                                          | description (TEXT)  |
| hierarchy_level  |                                          +---------------------+
| is_system (BOOL) |
+------------------+
        | 1
        |
        * (role_id NOT NULL)
+---------------------------------------+
|               profiles                |
+---------------------------------------+
| id (UUID, PK, auth.users)             |
| org_id (UUID, FK)                     |
| username (TEXT UNIQUE)                |
| email (TEXT)                          |
| full_name (TEXT)                      |
| role_id (UUID, FK NOT NULL)           |
| role (TEXT, legacy slug sync)         |
| must_change_password (BOOL)           |
+---------------------------------------+
        | 1
        |
        *
+--------------------+       +----------------------+
|    user_groups     | * - 1 |        groups        |
+--------------------+       +----------------------+
| user_id (UUID, FK) |       | id (UUID, PK)        |
| group_id (UUID, FK)|       | org_id (UUID, FK)    |
+--------------------+       | name (TEXT)          |
                             | description (TEXT)   |
                             +----------------------+
```

## Role Hierarchy & Scope

| Hierarchy Level | System Role Slug | Scope & Capabilities | Escalation Protection |
|:---|:---|:---|:---|
| **0** | `super_admin` (`SuperAdministrador`) | Root tenant configuration, bypasses CRUD checks, unconstrained administrative control. | Root-level. Cannot be modified or deleted. |
| **1** | `admin` (`Administrador`) | User provisioning, group management, role configuration, policy assignments. | Cannot assign, edit, or delete Level 0 or Level 1 roles. |
| **2** | `manager` / `hr_manager` (`Gerente`) | Broad departmental operations (announcements, project hubs, approvals, performance). | No access to role/security configuration. |
| **3** | `employee` / `team_lead` (`Usuario`) | Self-service operations, document view/upload, personal attendance, peer kudos, chat. | Baseline least privilege. |
| **>3** | Custom Roles (e.g. `auditor`, `becario`) | Custom combinations of explicit CRUD policies configured by an Administrator. | Bound by creator's level. |

## Permission & Policy Matrix

Granular resources and actions:
- **`users`**: `create`, `read`, `update`, `delete`
- **`roles`**: `create`, `read`, `update`, `delete`, `assign`
- **`groups`**: `create`, `read`, `update`, `delete`, `assign`
- **`announcements`**: `create`, `read`, `update`, `delete`, `publish`
- **`knowledge`**: `create`, `read`, `update`, `delete`, `approve`
- **`payroll`**: `read:self`, `read:all`, `import`, `export`
- **`attendance`**: `checkin:self`, `read:department`, `read:all`, `import`
- **`projects`**: `create`, `read`, `update`, `archive`

## Enforcement & Security Architecture

1. **Database Level**:
   - `role_id UUID NOT NULL REFERENCES public.roles(id)` enforced via PostgreSQL constraint.
   - RLS policies on `roles`, `permissions`, `groups` scoped to `org_id = get_user_org_id()`.
   - Prevention trigger on `roles`: prevents deletion of `is_system = true` rows.

2. **Server Layer (`hasPermission` / Server Actions)**:
   - Server Actions verify `hasPermission(user.id, resource, action)` before any database mutation.
   - Hierarchical check: `executor.hierarchy_level < target_role.hierarchy_level`.

3. **Client Layer (`usePermissions`)**:
   - React hook `usePermissions()` returns `{ can(resource, action), role, hierarchyLevel }` for conditional UI rendering.

4. **Seed Plan (`012_rbac_pbac_system.sql` & `009_seed.sql`)**:
   - Inserts base system roles and base permissions matrix.
   - Seeds initial `Administrador` account (`usuario: Administrador`, `contraseña: Administrador`, `must_change_password: true`).

## Risks / Trade-offs

- **[Risk] Backward compatibility with existing `profile.role` string checks**
  *Mitigation*: Keep `role` column in sync with `roles.slug` via trigger so existing components continue working while transitioning to `role_id` and granular permissions.
- **[Risk] Privilege escalation via API**
  *Mitigation*: Server action enforces numeric hierarchy comparison (`caller.level < target.level`).
