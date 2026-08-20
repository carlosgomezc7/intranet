# auth/access-control Specification

## Purpose
Provides an administrative user interface and server actions for managing custom roles, granular CRUD policies per system module, and organizational user groups.

## Requirements

### Requirement: Role and Policy Management Interface
The system SHALL provide an administrative view under `/settings/access` accessible exclusively by `SuperAdministrador` and `Administrador` to view, create, edit, and assign policies to roles.

#### Scenario: Listing system and custom roles
- **WHEN** an authorized administrator visits `/settings/access/roles`
- **THEN** the system SHALL display all active roles with their hierarchy level, user count, and permissions matrix

#### Scenario: Creating a custom role with policy matrix
- **WHEN** an administrator creates a new custom role with selected permissions (e.g. `reports:read`, `reports:create`, `attendance:read`)
- **THEN** the system SHALL persist the role with `hierarchy_level > 1` and map the corresponding `role_permissions` rows

### Requirement: User Groups Management Interface
The system SHALL provide group management views under `/settings/access/groups` allowing administrators to create logical groupings (e.g. "Comité de Auditoría", "Líderes de Proyecto") and assign users in bulk.

#### Scenario: Group creation and member assignment
- **WHEN** an administrator creates a group and assigns selected user profiles
- **THEN** the system SHALL store the relationships in `user_groups` and enable group-targeted communications and permissions
