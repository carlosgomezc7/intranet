# auth/rbac Specification

## Purpose
Defines the multi-role access control system that governs user permissions across all intranet modules, ensuring organizational data isolation and role-appropriate feature access.

## Requirements

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

### Requirement: Route protection by role
The system SHALL restrict access to intranet routes based on the authenticated user's role, redirecting unauthorized users to the dashboard with a notification. The system SHALL redirect unauthenticated users to `/login` preserving the original URL as a `redirectTo` parameter. When demo mode is inactive and Supabase is unreachable, the middleware SHALL NOT grant access to any protected route — it SHALL redirect to `/login` with an error parameter `?error=connection_failed`.

#### Scenario: Unauthorized route access
- **GIVEN** a user with the role `employee`
- **WHEN** the user attempts to navigate to an admin-only route (e.g., `/settings/admin`)
- **THEN** the system SHALL redirect to `/dashboard` and display a Spanish-language notification: "No tienes permisos para acceder a esta sección"

#### Scenario: Unauthenticated access to protected route
- **GIVEN** a visitor without an active session and demo mode disabled
- **WHEN** the visitor attempts to access any route under `(intranet)/`
- **THEN** the system SHALL redirect to `/login` preserving the original URL as a `redirectTo` parameter

#### Scenario: Unauthenticated access with demo mode enabled
- **GIVEN** a visitor without an active session and `NEXT_PUBLIC_DEMO_MODE` set to `"true"`
- **WHEN** the visitor navigates to `/login` and submits the demo credentials
- **THEN** the system SHALL set the `elevate_demo_session` cookie and redirect to `/dashboard`

#### Scenario: Supabase unreachable without demo mode
- **GIVEN** Supabase is unreachable and `NEXT_PUBLIC_DEMO_MODE` is not `"true"`
- **WHEN** the user submits the login form
- **THEN** the system SHALL redirect to `/login?error=No%20se%20pudo%20conectar%20con%20el%20servidor` and SHALL NOT set any demo session cookie

### Requirement: Permission check hook
The system SHALL provide a client-side hook `usePermissions` and server-side helper `hasPermission(resource, action)` that evaluates effective granular permissions from the user's role and assigned groups.

#### Scenario: Permission evaluation
- **GIVEN** a component evaluating `can('users', 'create')`
- **WHEN** the user belongs to a role with permission `users:create` or is `SuperAdministrador`
- **THEN** the permission check SHALL return `true`

### Requirement: RLS multi-tenant isolation
The system SHALL enforce organization-level data isolation through PostgreSQL Row Level Security policies on all tables containing an `org_id` column.

#### Scenario: Cross-organization data access attempt
- **GIVEN** a user belonging to organization A
- **WHEN** the user queries any table with `org_id`
- **THEN** the database SHALL return only rows where `org_id` matches the user's organization, regardless of the query parameters

### Requirement: Explicit signup flow with organization creation
The `signupAction` server action SHALL be the sole authority for creating organizations and linking profiles. It SHALL NOT rely on a database trigger. The flow SHALL collect a unique `username`, email (or derive an organizational email), password, full name, and organization name, creating the auth user and profile with `username` and `role = 'admin'` linked to the new organization.

#### Scenario: New user signup creates organization and profile
- **WHEN** a new user submits the signup form with username, email, password, full name, and organization name
- **THEN** the system SHALL create an `auth.users` entry, insert a new row in `organizations`, and upsert a row in `profiles` with `username`, `role = 'admin'` and the correct `org_id`

#### Scenario: Signup with missing required fields
- **WHEN** a user submits the signup form without username or password
- **THEN** the system SHALL redirect to `/login?error=Por favor completa todos los campos requeridos` and SHALL NOT create any database records

### Requirement: No implicit demo profile in authenticated state
The `useUser` hook and intranet layout SHALL NOT initialize state with a hardcoded demo profile. When no authenticated user is found and demo mode is inactive, the profile state SHALL be `null` and the UI SHALL display a loading skeleton or redirect to login.

#### Scenario: useUser hook without authentication
- **GIVEN** no user session exists and demo mode is disabled
- **WHEN** a component calls `useUser()`
- **THEN** `profile` SHALL be `null` and `loading` SHALL transition from `true` to `false`

#### Scenario: Intranet layout without authentication
- **GIVEN** no user session exists and demo mode is disabled
- **WHEN** the `(intranet)/layout.tsx` server component executes
- **THEN** it SHALL redirect to `/login` instead of rendering with a demo profile

### Requirement: Username-based authentication resolution
The system SHALL allow users to log in using their organizational username and password. The server action SHALL resolve the username to the registered profile email before authenticating with Supabase Auth.

#### Scenario: Successful login with username
- **WHEN** a user enters their valid username (e.g. `carlos.gomez`) and password in `/login`
- **THEN** the system SHALL query the profile matching the username, authenticate the associated session with Supabase, and redirect to `/dashboard`

#### Scenario: Login attempt with non-existent username
- **WHEN** a user enters an unrecognized username in `/login`
- **THEN** the system SHALL redirect to `/login?error=Usuario o contraseña incorrectos` without exposing whether the username exists

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

### Requirement: Granular Feature Permissions for Collaboration Suite
The system SHALL extend permissions in `public.permissions` to cover social feeds, manuals, ideas, and town halls, allowing administrators to grant or restrict access per role or user override (`user_permission_overrides`).

#### Scenario: Admin restricts feed post creation for a specific user
- **GIVEN** an administrator who sets `feed:create` override `is_granted = false` for user "Empleado A"
- **WHEN** "Empleado A" accesses `/feed`
- **THEN** the system SHALL hide the post creation text box and reject any direct POST attempt with 403 Forbidden
