## Why

Modern enterprise B2B intranets require a flexible, mathematically sound, and scalable Role-Based and Policy-Based Access Control (RBAC/PBAC) architecture. Moving from a hardcoded role enum to a dynamic relational permissions engine allows organizations to manage hierarchical roles, define granular CRUD policies per module (users, reports, configuration, etc.), organize users into logical groups, and enforce strict hierarchical delegation boundaries (e.g. preventing lower-level admins from modifying or assigning roles equal to or higher than their own).

## What Changes

- **Relational RBAC / PBAC Data Model**:
  - `roles` table: `id`, `name`, `description`, `hierarchy_level` (0 = SuperAdmin, 1 = Admin, 2 = Manager, 3 = User, >3 = Custom), `is_system` (boolean).
  - `permissions` table: `id`, `resource` (e.g. `users`, `reports`, `settings`, `announcements`), `action` (`create`, `read`, `update`, `delete`, `manage`, `approve`), `description`.
  - `role_permissions` table: Many-to-many relationship mapping roles to specific granular permissions.
  - `groups` and `user_groups` tables: Logical grouping of profiles for bulk policy assignment and modular intranet visualization.
  - Mandatory role constraint on `profiles` (`role_id NOT NULL REFERENCES roles(id)` with backward-compatible role slug support).
- **Hierarchical Role Structure**:
  - Level 0 (`SuperAdministrador`): Total system access, bypasses CRUD restrictions, manages root config and tenants.
  - Level 1 (`Administrador`): User, role, profile, group, and policy management. Cannot modify or assign Level 0 roles.
  - Level 2 (`Gerente`): Broad departmental operational access (read/write), no access to security or role configuration.
  - Level 3 (`Usuario`): Standard employee access to assigned self-service and collaboration modules.
  - Level >3 (`Roles Personalizados`): Dynamically created custom roles with bespoke policy sets.
- **Enterprise Seed Data**:
  - 4 base system roles: `SuperAdministrador`, `Administrador`, `Gerente`, `Usuario`.
  - Default `SuperAdministrador` account.
  - Default initial `Administrador` account (`username: Administrador`, `password: Administrador`, `must_change_password: true`).
- **Security & Authorization Engine**:
  - Mandatory role enforcement at DB constraint and DTO schema layers.
  - Principle of Least Privilege enforcement in Server Actions and API middleware.
  - Hierarchical protection rules (cannot edit, delete, or assign roles with `hierarchy_level <= current_user.hierarchy_level`).
  - Authorization middleware / guards verifying effective permissions before mutation or route resolution.

## Capabilities

### Modified Capabilities
- `auth/rbac`: Updates role hierarchy, introduces dynamic CRUD policy matrices, mandatory role constraints, and hierarchical role protection rules.
- `core/database-schema`: Defines relational tables (`roles`, `permissions`, `role_permissions`, `groups`, `user_groups`) and foreign key constraints.
- `core/seed-data`: Adds default system roles, SuperAdministrador, and initial Administrador with mandatory password reset flag.

### New Capabilities
- `auth/access-control`: Administrative management UI and server actions for configuring roles, assigning granular module permissions, and managing user groups.

## Impact

- **Affected Code & Modules**:
  - Database: New migration `012_rbac_pbac_system.sql`.
  - Types: `src/lib/types.ts` (`Role`, `Permission`, `RolePermission`, `Group`, `UserGroup`).
  - Auth Server Actions & Hooks: `usePermissions.ts`, `actions.ts`, `middleware.ts`.
  - UI: Administrative access control interfaces under `src/app/(intranet)/settings/access/` and `src/components/intranet/access/`.
- **RBAC Roles Impacted**: All roles, with structured escalation boundaries.
- **Rollback Strategy**: The migration is structured additively, preserving existing `role` string columns alongside the new `role_id` relational foreign key.
