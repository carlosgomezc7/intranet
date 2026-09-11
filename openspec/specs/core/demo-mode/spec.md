# core/default-auth Specification

## Purpose
Provides unified local default credential authentication (`admin`/`admin`) that operates transparently with offline fallback when a live Supabase connection is unavailable, without separate demo flags, toggles, or warning banners.

## Requirements

### Requirement: Unified authentication with default credentials fallback
The system SHALL accept the default credentials `admin` / `admin` for local authentication when Supabase is offline or when local credentials match. Upon successful default credential validation, the system SHALL authenticate the user with a Super Administrator profile (`role: "super_admin"`) and establish an `elevate_session` session cookie.

#### Scenario: Default credentials login offline
- **GIVEN** Supabase is unreachable or unconfigured
- **WHEN** the user enters username `admin` and password `admin`
- **THEN** the system SHALL authenticate the user as Super Administrator and redirect to `/dashboard`

#### Scenario: Invalid credentials offline
- **GIVEN** Supabase is unreachable or unconfigured
- **WHEN** the user enters credentials other than `admin` / `admin`
- **THEN** the system SHALL display an error message and SHALL NOT grant access to protected routes

### Requirement: Default credential pre-fill
The login form SHALL pre-fill the username and password fields with the default credentials (`admin` / `admin`) to streamline local development, evaluation, and offline operation.

#### Scenario: Login form fields pre-fill
- **WHEN** the user navigates to `/login`
- **THEN** the username field SHALL contain `admin` and the password field SHALL contain `admin`

### Requirement: Absence of demo mode indicators
The application SHALL NOT render demo banners, demo badges, or synthetic warning indicators in the user interface. Protected intranet routes SHALL render identically regardless of whether the session is local or Supabase-backed.

#### Scenario: Intranet layout rendered cleanly
- **WHEN** an authenticated user navigates through `(intranet)` routes
- **THEN** no demo mode banner or watermark SHALL be present in the DOM
