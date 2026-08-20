## ADDED Requirements

### Requirement: User-level Granular Feature Override Management Interface
The system SHALL provide an administrative interface in `/settings/access/users` and within the User Detail drawer in `/directory` allowing authorized administrators to inspect and toggle granular feature permissions per user, displaying active inheritance status (Inherited from Role, Explicitly Allowed, Explicitly Blocked).

#### Scenario: Inspecting user permission matrix
- **WHEN** an administrator opens the permission settings for user "Mario"
- **THEN** the system SHALL display the complete list of system features categorized by module, with visual indicators distinguishing default role permissions from individual overrides

#### Scenario: Toggling a feature override for a user
- **WHEN** an administrator toggles a feature (e.g. Chat or Departmental Payroll) for user "Mario" and saves the changes
- **THEN** the system SHALL invoke the server action to upsert or delete the corresponding row in `user_permission_overrides` and provide an immediate ARIA live notification "Permisos de usuario actualizados con éxito"

#### Scenario: Resetting user overrides to role defaults
- **WHEN** an administrator clicks "Restablecer a valores del rol" for a user
- **THEN** the system SHALL remove all custom `user_permission_overrides` for that user, reverting their capabilities to their base role default

### Requirement: Hierarchical Permission Modification Guardrails
The system SHALL strictly prevent administrators from modifying roles, user permissions, or feature overrides for accounts with equal or higher hierarchy levels (e.g., an `admin` at level 1 cannot modify another `admin` at level 1 or a `super_admin` at level 0), and cannot grant any permission that the administrator does not possess themselves.

#### Scenario: Admin attempts to override permissions of equal hierarchy user
- **GIVEN** an administrator with hierarchy level 1
- **WHEN** the administrator attempts to modify permissions or role assignments for another administrator
- **THEN** the system SHALL reject the operation with error "No tienes autorización para modificar usuarios con jerarquía igual o superior a la tuya"

#### Scenario: Admin attempts to grant unassigned privilege to a subordinate
- **GIVEN** an administrator who does not have `system:manage_keys` permission
- **WHEN** the administrator attempts to grant `system:manage_keys` override to an employee
- **THEN** the system SHALL block the request with validation error "No puedes conceder permisos que no posees"
