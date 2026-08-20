## Why

The existing intranet project at `/home/carlos/Documents/intranet` is a minimal prototype with only a public landing page, basic Supabase login/signup, and a placeholder dashboard. The client **Elevate** requires a production-grade corporate intranet for **200+ employees** with user management, real-time communication, multi-level approval workflows, attendance tracking, payroll consultation, and file management. This Phase 1 establishes the foundational architecture — auth, RBAC, the macOS Dock-style layout, dashboard, employee directory, settings, and bug reporting — upon which all future phases (Chat, Workflows, Files) will build.

## What Changes

- **BREAKING**: Replace monolithic `src/app/page.tsx` (556 lines) with modular components in `src/components/landing/`
- **BREAKING**: Restructure app router into route groups: `(auth)` for login flows, `(intranet)` for protected routes
- **BREAKING**: Replace existing Supabase schema (`multi_tenant_schema.sql`, `onboarding_rls.sql`) with expanded numbered migrations (`001_core.sql` through `009_rls_policies.sql`)
- **NEW**: macOS Dock-style sidebar navigation (`DockSidebar.tsx`) with icons, tooltips, and active indicators
- **NEW**: Top bar with global search and user profile menu (`TopBar.tsx`, `UserMenu.tsx`)
- **NEW**: Dashboard with metrics, quick access widgets, and recent activity feed
- **NEW**: Employee directory with search, filters, and profile views
- **NEW**: Expanded RBAC system with 6 roles: `super_admin`, `admin`, `hr_manager`, `manager`, `team_lead`, `employee`
- **NEW**: Database tables for `departments`, `teams`, `team_members` supporting hierarchical + cross-functional structure
- **NEW**: Bug report / improvement suggestion form with file upload
- **NEW**: Profile settings page
- **NEW**: Custom React hooks: `useUser`, `usePermissions`
- **NEW**: Shared components: `Avatar`, `Badge`, `SkipLink`, `EmptyState`, `SearchBar`
- **NEW**: TypeScript type system (`types.ts`) and constants/enums (`constants.ts`)
- **NEW**: WCAG 2.2 AA accessibility: semantic HTML5, ARIA attributes, keyboard navigation, skip links
- **MODIFY**: `globals.css` — complete design system with dark theme, dock styles, glassmorphism
- **MODIFY**: `layout.tsx` — Inter font, skip link, SEO metadata
- **MODIFY**: `middleware.ts` — expanded route protection for `(auth)` and `(intranet)` groups
- **MODIFY**: `config.ts` — Elevate branding and metadata
- **MODIFY**: `AGENTS.md` — VISION MCP rules integrated

## Capabilities

### New Capabilities
- `auth/rbac`: Multi-role access control system with 6 hierarchical roles and permission checks
- `core/departments`: Department hierarchy with parent-child relationships and department heads
- `core/teams`: Cross-functional project teams with membership and role-in-team
- `layout/dock-sidebar`: macOS Dock-style navigation sidebar with icons, tooltips, separators, and active state
- `layout/topbar`: Global search bar and user profile menu header
- `dashboard/overview`: Dashboard with metrics cards, quick access grid, and recent activity feed
- `directory/employees`: Searchable employee directory with department filters and profile detail views
- `settings/profile`: User profile editor (name, avatar, phone, notification preferences)
- `reports/bug-reports`: Bug report and improvement suggestion form with file attachment support
- `core/database-schema`: Numbered SQL migration system (001-009) with RLS policies for multi-tenant isolation

### Modified Capabilities
_(No existing specs to modify — this is the initial specification of the system)_

## Impact

### Affected Modules and Dependencies
| Module | Impact | Dependencies |
|:---|:---|:---|
| Auth & User Management | Expanded with RBAC, department assignment | Supabase Auth, `001_core.sql` |
| Dashboard | New module | Auth, `001_core.sql`, `useUser` hook |
| Employee Directory | New module | Auth, `001_core.sql`, departments, teams |
| Settings | New module | Auth, `useUser` hook |
| Bug Reports | New module | Auth (optional — can be anonymous) |
| Landing Page | Refactored into modular components | `config.ts` |
| Layout System | New Dock sidebar + TopBar architecture | Auth, `usePermissions` hook |

### RBAC Roles Impacted
All 6 roles are defined in this phase: `super_admin`, `admin`, `hr_manager`, `manager`, `team_lead`, `employee`. The `usePermissions` hook enforces visibility and access per role.

### Database Schema Changes
- **New tables**: `departments`, `teams`, `team_members`, `bug_reports`
- **Modified tables**: `organizations` (added `industry`, `max_users`, `settings_json`), `profiles` (added `department_id`, `job_title`, `phone`, `hire_date`, `is_active`, `settings_json`)
- **New RLS policies**: Department-scoped reads, team membership checks, profile visibility within organization
- **New functions**: `get_user_org_id()` (preserved), `get_user_role()`, `get_user_department_id()`

### Rollback Strategy
1. Revert to the current `main` branch commit (preserves existing monolithic structure)
2. SQL: Drop new tables (`departments`, `teams`, `team_members`, `bug_reports`) and revert column additions to `organizations` and `profiles`
3. No data loss risk — Phase 1 does not delete existing data, only adds structure
