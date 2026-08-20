## MODIFIED Requirements

### Requirement: Role hierarchy definition
The system SHALL support hierarchical roles with explicit numeric hierarchy levels where lower numbers represent higher privileges: Level 0 (`SuperAdministrador` / `super_admin`), Level 1 (`Administrador` / `admin`), Level 2 (`Gerente` / `manager` / `hr_manager`), Level 3 (`Usuario` / `employee` / `team_lead`), and Level >3 for dynamic custom roles.

#### Scenario: Role privilege inheritance
- **GIVEN** a user with the role `Gerente` (hierarchy level 2)
- **WHEN** the system evaluates their access permissions
- **THEN** the user SHALL have access to all operational features permitted by their policy set, but SHALL NOT have access to security configuration, role creation, or tenant settings

#### Scenario: Hierarchical escalation prevention
- **GIVEN** an authenticated user with role `Administrador` (hierarchy level 1)
- **WHEN** the user attempts to edit, delete, or assign a role with `hierarchy_level <= 1` (such as `SuperAdministrador` or another `Administrador`)
- **THEN** the system SHALL reject the operation with an authorization error "No puedes modificar ni asignar roles con jerarquía igual o superior a la tuya"

### Requirement: Permission check hook
The system SHALL provide a client-side hook `usePermissions` and server-side helper `hasPermission(resource, action)` that evaluates effective granular permissions from the user's role and assigned groups.

#### Scenario: Permission evaluation
- **GIVEN** a component evaluating `can('users', 'create')`
- **WHEN** the user belongs to a role with permission `users:create` or is `SuperAdministrador`
- **THEN** the permission check SHALL return `true`

## ADDED Requirements

### Requirement: Mandatory role constraint
Every user in the system MUST have a valid role assigned (`role_id NOT NULL`). No user SHALL exist in an unassigned or detached state.

#### Scenario: Attempt to create user without role
- **WHEN** an administrator submits a user creation form without selecting a role
- **THEN** the system SHALL reject the creation both at schema validation and database constraint levels with error "El rol es obligatorio"

### Requirement: Least privilege policy enforcement
The system SHALL deny any action on a protected resource unless the user has an explicit granting policy assigned to their role or group, or holds the `SuperAdministrador` role.

#### Scenario: Deny by default
- **GIVEN** a user with role `Usuario`
- **WHEN** the user attempts an unassigned action such as `DELETE /api/announcements/1`
- **THEN** the authorization guard SHALL return HTTP 403 Forbidden with message "Acceso denegado: no cuentas con la política requerida"
