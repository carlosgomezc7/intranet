## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Explicit signup flow with organization creation
The `signupAction` server action SHALL be the sole authority for creating organizations and linking profiles. It SHALL NOT rely on a database trigger. The flow SHALL: (1) create the auth user, (2) insert an organization, (3) upsert the profile with the `org_id` from the newly created organization.

#### Scenario: New user signup creates organization and profile
- **WHEN** a new user submits the signup form with email, password, full name, and organization name
- **THEN** the system SHALL create an `auth.users` entry, insert a new row in `organizations`, and upsert a row in `profiles` with `role = 'admin'` and the correct `org_id`

#### Scenario: Signup with missing required fields
- **WHEN** a user submits the signup form without email or password
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
