## Purpose

Establishes the core PostgreSQL schema and Row Level Security migration structure for multi-tenant isolation, organizational hierarchy, and audit tracking.

## ADDED Requirements

### Requirement: Numbered migration structure and RLS
The database schema SHALL be organized into clean numbered migrations starting with `001_core.sql` covering organizations, departments, profiles, teams, team members, and bug reports, with comprehensive RLS policies.

#### Scenario: Multi-tenant policy enforcement on core tables
- **GIVEN** queries executed against `departments` or `profiles`
- **WHEN** an authenticated user performs SELECT or INSERT operations
- **THEN** PostgreSQL RLS policies SHALL restrict operations strictly to rows where `org_id` equals the authenticated user's organization
