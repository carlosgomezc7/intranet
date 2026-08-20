# core/seed-data Specification

## Purpose
Provides a realistic seed data script for development and demo environments, populating the database with a representative organization, departments, employee profiles, and sample content to enable meaningful UI testing and demonstrations.

## Requirements

### Requirement: Seed script creates a complete organizational structure
The seed script `009_seed.sql` SHALL insert a fully functional organization with at least 4 departments, ~20 employee profiles distributed across all 6 RBAC roles, and sample data for announcements.

#### Scenario: Seed data populates organization and departments
- **WHEN** `009_seed.sql` is executed against a database where `001_core.sql` through `007_notifications.sql` have been applied
- **THEN** the database SHALL contain exactly 1 organization named "Elevate Enterprise Solutions", at least 4 departments (Tecnología, Recursos Humanos, Finanzas, Dirección), and at least 20 profiles linked to those departments

### Requirement: Seed profiles cover all RBAC roles
The seed data SHALL include at least one profile for each of the base system roles (`SuperAdministrador`, `Administrador`, `Gerente`, `Usuario`) to enable testing of role-based access control and permission boundaries.

#### Scenario: Role distribution in seed data
- **WHEN** `009_seed.sql` has been executed
- **THEN** querying `SELECT DISTINCT role FROM profiles` SHALL return all base role values and associate each profile with a valid `role_id`

### Requirement: Seed script is idempotent
The seed script SHALL use `INSERT ... ON CONFLICT DO NOTHING` or equivalent patterns to allow re-execution without duplicate key errors.

#### Scenario: Re-running seed script
- **WHEN** `009_seed.sql` is executed a second time on the same database
- **THEN** no errors SHALL occur and the data count SHALL remain unchanged

### Requirement: Default Initial Administrador account
The seed migration SHALL insert an initial `Administrador` account with username `Administrador`, secure password hash for default password `Administrador`, assigned to the `Administrador` system role, with a flag `must_change_password = true` forcing a password update on first login.

#### Scenario: Initial Administrador login forces password change
- **GIVEN** the newly seeded database
- **WHEN** user logs in with credentials `Administrador` / `Administrador`
- **THEN** the system SHALL redirect to `/settings/change-password` or display a mandatory modal before allowing access to administrative sections
