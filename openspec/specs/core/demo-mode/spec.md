# core/demo-mode Specification

## Purpose
Provides a controlled offline demonstration mode that allows the application to function without a live Supabase connection, activated exclusively through an explicit environment variable flag.

## Requirements

### Requirement: Demo mode activation via environment variable
The system SHALL activate demo mode only when the environment variable `NEXT_PUBLIC_DEMO_MODE` is set to `"true"`. When not set or set to any other value, demo mode SHALL be disabled and all auth flows SHALL require a live Supabase connection.

#### Scenario: Demo mode enabled
- **WHEN** `NEXT_PUBLIC_DEMO_MODE` is `"true"` and the user submits the login form
- **THEN** the system SHALL authenticate the user with a synthetic demo profile (role: `admin`, org_id: `demo`) without contacting Supabase auth, and redirect to `/dashboard`

#### Scenario: Demo mode disabled with Supabase offline
- **WHEN** `NEXT_PUBLIC_DEMO_MODE` is not `"true"` and Supabase is unreachable
- **THEN** the system SHALL display a Spanish-language error "No se pudo conectar con el servidor de autenticación" on the login page and SHALL NOT grant access to protected routes

### Requirement: Demo mode credential pre-fill
When demo mode is active, the login form SHALL pre-fill username and password fields with demo credentials. When demo mode is inactive, the form SHALL display empty fields with placeholder text only.

#### Scenario: Login form in demo mode
- **WHEN** `NEXT_PUBLIC_DEMO_MODE` is `"true"` and the user navigates to `/login`
- **THEN** the username field SHALL contain `admin` and the password field SHALL contain `elevate2026`

#### Scenario: Login form in production mode
- **WHEN** `NEXT_PUBLIC_DEMO_MODE` is not `"true"` and the user navigates to `/login`
- **THEN** both username and password fields SHALL be empty with placeholder text `usuario` and `••••••••` respectively

### Requirement: Demo mode visual indicator
When demo mode is active, the system SHALL display a persistent, non-intrusive banner indicating "Modo Demo — Los datos no se persisten" to prevent confusion between demo and production usage.

#### Scenario: Demo banner visibility
- **WHEN** demo mode is active and the user is on any `(intranet)` route
- **THEN** a banner SHALL be visible at the top of the page with text "Modo Demo — Los datos no se persisten" styled with a warning color scheme
- **THEN** the banner SHALL be accessible with `role="status"` and `aria-live="polite"`
