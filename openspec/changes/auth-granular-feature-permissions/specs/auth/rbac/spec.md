## ADDED Requirements

### Requirement: Granular user-level permission overrides
The system SHALL support explicit permission overrides for individual user profiles in `user_permission_overrides`, permitting administrators to explicitly grant (`is_granted = true`) or explicitly block/deny (`is_granted = false`) specific feature permissions independently of the user's base role.

#### Scenario: Admin explicitly blocks a feature for a specific user
- **GIVEN** a user "Mario" assigned to the role `employee` (which normally has access to `chat:access`)
- **WHEN** an administrator sets a user permission override for "Mario" on `chat:access` with `is_granted = false`
- **THEN** the system SHALL deny Mario access to chat features and hide chat navigation elements, while other users with role `employee` retain chat access

#### Scenario: Admin explicitly grants an elevated capability to a specific user
- **GIVEN** a user "Mario" assigned to the role `employee` (which normally cannot view departmental payroll)
- **WHEN** an administrator sets a user permission override for "Mario" on `payroll:read:department` with `is_granted = true`
- **THEN** the system SHALL permit Mario to view departmental payroll records in accordance with RLS policies

### Requirement: Effective permission precedence calculation
The system SHALL evaluate effective permissions following strict hierarchical precedence:
1. Explicit User Deny (`user_permission_overrides.is_granted = false`) -> `false` (Deny takes top precedence).
2. Explicit User Grant (`user_permission_overrides.is_granted = true`) -> `true`.
3. Role Direct Permissions (`role_permissions`) -> `true` if mapped.
4. Role Hierarchy Level Baseline (`hierarchy_level === 0` for `super_admin`) -> `true`.
5. Default Fallback -> `false`.

#### Scenario: Precedence evaluation with conflicting role and user override
- **GIVEN** a user whose role grants `announcements:publish`
- **WHEN** the user has a record in `user_permission_overrides` with `resource = 'announcements'`, `action = 'publish'`, and `is_granted = false`
- **THEN** calling `can('announcements', 'publish')` on client or server SHALL return `false`

#### Scenario: Precedence evaluation with super_admin role
- **GIVEN** an authenticated user with role `super_admin` (hierarchy level 0)
- **WHEN** the user accesses any system resource or action
- **THEN** the system SHALL grant access unconditionally regardless of specific permission records

## MODIFIED Requirements

### Requirement: Username-based authentication resolution
The system SHALL allow users to log in using either their organizational username or email and password. The authentication action SHALL resolve the identifier to the registered profile email using a case-insensitive lookup via a secure server routine, authenticate the associated session with Supabase Auth, synchronize SSR HttpOnly cookies, and prevent user enumeration through timing-safe and generic error messaging.

#### Scenario: Successful login with username
- **WHEN** a user enters their valid username (e.g. `carlos.gomez` or `carlos.gomez@elevate.com.mx`) and password in `/login`
- **THEN** the system SHALL query the profile matching the username case-insensitively, authenticate the session with Supabase, set session cookies, and redirect to `/dashboard`

#### Scenario: Login attempt with non-existent username or bad credentials
- **WHEN** a user enters an unrecognized username or invalid password in `/login`
- **THEN** the system SHALL redirect to `/login?error=Usuario o contraseña incorrectos` with constant-time response characteristics without exposing whether the identifier exists in the database

#### Scenario: Demo mode fallback when enabled
- **GIVEN** `NEXT_PUBLIC_DEMO_MODE` is `"true"`
- **WHEN** a user submits valid demo credentials (e.g. `admin`, `superadmin`, `operador`)
- **THEN** the system SHALL establish the demo session cookie and load the corresponding mock profile without failing on unconfigured Supabase instances
