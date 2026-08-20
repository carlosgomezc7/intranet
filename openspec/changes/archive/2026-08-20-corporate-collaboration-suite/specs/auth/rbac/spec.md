## ADDED Requirements

### Requirement: Granular Feature Permissions for Collaboration Suite
The system SHALL extend permissions in `public.permissions` to cover social feeds, manuals, ideas, and town halls, allowing administrators to grant or restrict access per role or user override (`user_permission_overrides`).

#### Scenario: Admin restricts feed post creation for a specific user
- **GIVEN** an administrator who sets `feed:create` override `is_granted = false` for user "Empleado A"
- **WHEN** "Empleado A" accesses `/feed`
- **THEN** the system SHALL hide the post creation text box and reject any direct POST attempt with 403 Forbidden
