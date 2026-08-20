## Purpose

Defines the multi-role access control system that governs user permissions across all intranet modules, ensuring organizational data isolation and role-appropriate feature access.

## ADDED Requirements

### Requirement: Role hierarchy definition
The system SHALL support exactly six roles with descending privilege levels: `super_admin` > `admin` > `hr_manager` > `manager` > `team_lead` > `employee`.

#### Scenario: Role privilege inheritance
- **GIVEN** a user with the role `manager`
- **WHEN** the system evaluates their access permissions
- **THEN** the user SHALL have access to all features available to `team_lead` and `employee` roles, plus manager-specific features (approve department requests, publish department announcements)

### Requirement: Route protection by role
The system SHALL restrict access to intranet routes based on the authenticated user's role, redirecting unauthorized users to the dashboard with a notification.

#### Scenario: Unauthorized route access
- **GIVEN** a user with the role `employee`
- **WHEN** the user attempts to navigate to an admin-only route (e.g., `/settings/admin`)
- **THEN** the system SHALL redirect to `/dashboard` and display a Spanish-language notification: "No tienes permisos para acceder a esta sección"

#### Scenario: Unauthenticated access to protected route
- **GIVEN** a visitor without an active session
- **WHEN** the visitor attempts to access any route under `(intranet)/`
- **THEN** the system SHALL redirect to `/login` preserving the original URL as a `redirectTo` parameter

### Requirement: Permission check hook
The system SHALL provide a client-side hook `usePermissions` that returns boolean permission flags based on the current user's role.

#### Scenario: Permission evaluation
- **GIVEN** a React component using the `usePermissions` hook
- **WHEN** the component calls `can('manage_users')`
- **THEN** the hook SHALL return `true` only for users with roles `super_admin` or `admin`

### Requirement: RLS multi-tenant isolation
The system SHALL enforce organization-level data isolation through PostgreSQL Row Level Security policies on all tables containing an `org_id` column.

#### Scenario: Cross-organization data access attempt
- **GIVEN** a user belonging to organization A
- **WHEN** the user queries any table with `org_id`
- **THEN** the database SHALL return only rows where `org_id` matches the user's organization, regardless of the query parameters
