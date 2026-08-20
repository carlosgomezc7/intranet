## MODIFIED Requirements

### Requirement: Explicit signup flow with organization creation
The `signupAction` server action SHALL be the sole authority for creating organizations and linking profiles. It SHALL NOT rely on a database trigger. The flow SHALL collect a unique `username`, email (or derive an organizational email), password, full name, and organization name, creating the auth user and profile with `username` and `role = 'admin'` linked to the new organization.

#### Scenario: New user signup creates organization and profile
- **WHEN** a new user submits the signup form with username, email, password, full name, and organization name
- **THEN** the system SHALL create an `auth.users` entry, insert a new row in `organizations`, and upsert a row in `profiles` with `username`, `role = 'admin'` and the correct `org_id`

#### Scenario: Signup with missing required fields
- **WHEN** a user submits the signup form without username or password
- **THEN** the system SHALL redirect to `/login?error=Por favor completa todos los campos requeridos` and SHALL NOT create any database records

## ADDED Requirements

### Requirement: Username-based authentication resolution
The system SHALL allow users to log in using their organizational username and password. The server action SHALL resolve the username to the registered profile email before authenticating with Supabase Auth.

#### Scenario: Successful login with username
- **WHEN** a user enters their valid username (e.g. `carlos.gomez`) and password in `/login`
- **THEN** the system SHALL query the profile matching the username, authenticate the associated session with Supabase, and redirect to `/dashboard`

#### Scenario: Login attempt with non-existent username
- **WHEN** a user enters an unrecognized username in `/login`
- **THEN** the system SHALL redirect to `/login?error=Usuario o contraseña incorrectos` without exposing whether the username exists
