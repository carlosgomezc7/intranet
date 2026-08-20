## MODIFIED Requirements

### Requirement: Seed profiles cover all RBAC roles
The seed data SHALL include at least one profile for each of the base system roles (`SuperAdministrador`, `Administrador`, `Gerente`, `Usuario`) to enable testing of role-based access control and permission boundaries.

#### Scenario: Role distribution in seed data
- **WHEN** `009_seed.sql` has been executed
- **THEN** querying `SELECT DISTINCT role FROM profiles` SHALL return all base role values and associate each profile with a valid `role_id`

## ADDED Requirements

### Requirement: Default Initial Administrador account
The seed migration SHALL insert an initial `Administrador` account with username `Administrador`, secure password hash for default password `Administrador`, assigned to the `Administrador` system role, with a flag `must_change_password = true` forcing a password update on first login.

#### Scenario: Initial Administrador login forces password change
- **GIVEN** the newly seeded database
- **WHEN** user logs in with credentials `Administrador` / `Administrador`
- **THEN** the system SHALL redirect to `/settings/change-password` or display a mandatory modal before allowing access to administrative sections
