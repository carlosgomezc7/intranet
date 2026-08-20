## MODIFIED Requirements

### Requirement: Demo mode credential pre-fill
When demo mode is active, the login form SHALL pre-fill username and password fields with demo credentials. When demo mode is inactive, the form SHALL display empty fields with placeholder text only.

#### Scenario: Login form in demo mode
- **WHEN** `NEXT_PUBLIC_DEMO_MODE` is `"true"` and the user navigates to `/login`
- **THEN** the username field SHALL contain `admin` and the password field SHALL contain `elevate2026`

#### Scenario: Login form in production mode
- **WHEN** `NEXT_PUBLIC_DEMO_MODE` is not `"true"` and the user navigates to `/login`
- **THEN** both username and password fields SHALL be empty with placeholder text `usuario` and `••••••••` respectively
