## MODIFIED Requirements

### Requirement: Numbered migration structure and RLS
The database schema SHALL be organized into clean numbered migrations starting with `001_core.sql` through `012_rbac_pbac_system.sql`, defining organizations, departments, profiles, roles, permissions, role_permissions, groups, user_groups, teams, and audit tracking with comprehensive RLS policies.

#### Scenario: Multi-tenant policy enforcement on core tables
- **GIVEN** queries executed against `departments` or `profiles`
- **WHEN** an authenticated user performs SELECT or INSERT operations
- **THEN** PostgreSQL RLS policies SHALL restrict operations strictly to rows where `org_id` equals the authenticated user's organization

#### Scenario: No duplicate schema definitions
- **GIVEN** the codebase file tree
- **WHEN** searching for `CREATE TABLE public.organizations` across all SQL files
- **THEN** exactly one definition SHALL exist, located in `src/lib/supabase/schema/001_core.sql`

#### Scenario: No conflicting column names
- **GIVEN** the canonical schema
- **WHEN** examining the `profiles` table definition
- **THEN** the tenant column SHALL be named `org_id` (not `organization_id`) and SHALL reference `public.organizations(id)`

## ADDED Requirements

### Requirement: Relational RBAC and PBAC schema tables
The migration `012_rbac_pbac_system.sql` SHALL define tables: `roles` (`id`, `org_id`, `name`, `slug`, `description`, `hierarchy_level`, `is_system`), `permissions` (`id`, `resource`, `action`, `description`), `role_permissions` (`role_id`, `permission_id`), `groups` (`id`, `org_id`, `name`, `description`), and `user_groups` (`user_id`, `group_id`).

#### Scenario: Foreign key integrity and cascade
- **WHEN** a custom role is deleted
- **THEN** associated entries in `role_permissions` SHALL be deleted via CASCADE, while attempting to delete a system role (`is_system = true`) SHALL be rejected
