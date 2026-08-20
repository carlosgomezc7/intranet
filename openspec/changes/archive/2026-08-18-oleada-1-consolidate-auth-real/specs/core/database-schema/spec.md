## MODIFIED Requirements

### Requirement: Numbered migration structure and RLS
The database schema SHALL be organized into clean numbered migrations starting with `001_core.sql` covering organizations, departments, profiles, teams, team members, and bug reports, with comprehensive RLS policies. The legacy files `multi_tenant_schema.sql` and `onboarding_rls.sql` SHALL NOT exist in the `src/lib/supabase/` directory — `001_core.sql` is the canonical and only definition of core tables.

#### Scenario: Multi-tenant policy enforcement on core tables
- **GIVEN** queries executed against `departments` or `profiles`
- **WHEN** an authenticated user performs SELECT or INSERT operations
- **THEN** PostgreSQL RLS policies SHALL restrict operations strictly to rows where `org_id` equals the authenticated user's organization

#### Scenario: No duplicate schema definitions
- **GIVEN** the codebase file tree
- **WHEN** searching for `CREATE TABLE public.organizations` across all SQL files
- **THEN** exactly one definition SHALL exist, located in `src/lib/supabase/schema/001_core.sql`

#### Scenario: No conflicting column names
- **GIVEN** the canonical schema
- **WHEN** examining the `profiles` table definition
- **THEN** the tenant column SHALL be named `org_id` (not `organization_id`) and SHALL reference `public.organizations(id)`
