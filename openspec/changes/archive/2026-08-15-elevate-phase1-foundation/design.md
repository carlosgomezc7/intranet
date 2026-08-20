## Context

See `proposal.md` for motivation and system overview. This design addresses Phase 1 Foundation: migrating the prototype structure into a robust Next.js 16 App Router architecture with Route Groups `(auth)` and `(intranet)`, establishing the macOS Dock sidebar layout, implementing core RBAC, creating the database migration schema, and providing essential employee and administrative views.

## Goals / Non-Goals

**Goals:**
- Implement modular landing page components (`Header`, `Hero`, `Services`, `About`, `Contact`, `Footer`) replacing monolithic `page.tsx`.
- Establish Route Groups: `(auth)` without sidebar for login/onboarding, and `(intranet)` with macOS Dock sidebar and TopBar.
- Implement high-fidelity macOS Dock sidebar with smooth hover scale effects, cyan glow indicators, and tooltips.
- Create core TypeScript types (`types.ts`) and constants/enums (`constants.ts`) for RBAC, departments, and teams.
- Create Supabase SQL migration `001_core.sql` with RLS policies covering organizations, departments, teams, profiles, and bug reports.
- Implement dashboard overview, employee directory, settings, and bug reporting views.
- Ensure strict WCAG 2.2 AA accessibility across all UI components.

**Non-Goals:**
- Real-time WebSockets chat implementation (reserved for Phase 2).
- Approval workflows execution engine and multi-step forms (reserved for Phase 3).
- Biometric attendance parsing and payroll CSV/API sync (reserved for Phase 3/4).
- Supabase storage bucket file manager UI (reserved for Phase 4).

## Decisions

### 1. Route Groups Architecture `(auth)` and `(intranet)`
- **Decision**: Split the application into `src/app/(auth)` and `src/app/(intranet)` route groups.
- **Rationale**: Isolates layout hierarchies cleanly without URL path pollution. `(auth)` renders a centered glass card without navigation, while `(intranet)` renders the persistent macOS Dock and TopBar wrapper.
- **Alternatives Considered**: Conditional rendering inside a single root layout (rejected due to layout shift and unnecessary hydration overhead).

### 2. macOS Dock Navigation Sidebar
- **Decision**: Fixed vertical Dock on the left screen margin with flex-col arrangement, glassmorphism container, and dynamic icon scale transforms (`scale-110`, `backdrop-blur-md`).
- **Rationale**: Delivers the exact premium desktop feel requested by the user, maximizes main content workspace, and provides instant visual recognition of active modules.
- **Alternatives Considered**: Top navigation bar with dropdowns (rejected based on explicit preference for macOS aesthetic).

### 3. Numbered PostgreSQL Schema Migrations in `src/lib/supabase/schema/`
- **Decision**: Structure database scripts as numbered sequential files (`001_core.sql`, `002_chat.sql`, etc.) rather than single monolith scripts.
- **Rationale**: Simplifies phased rollout, tracking, and staging across developer environments.

### 4. Client-side RBAC Hook (`usePermissions`) with Server Verification
- **Decision**: Provide `usePermissions` hook in React for UI conditional rendering, backed by database RLS and middleware-level session token verification.
- **Rationale**: Eliminates unauthorized action vulnerability while maintaining fluid, optimistic UI state updates.

## Risks / Trade-offs

- **[Risk]** Large CSS complexity in Tailwind v4 for macOS dock animations → **Mitigation**: Use clean utility classes and CSS variables in `globals.css` with `@keyframes` for subtle glows.
- **[Risk]** Deep department tree performance during directory search → **Mitigation**: Flatten search query in memory on client side or index `department_id` and `full_name` in PostgreSQL.

## Migration Plan

1. Deploy SQL migration `001_core.sql` in Supabase SQL editor.
2. Replace `globals.css` and `src/app/layout.tsx`.
3. Create `src/components/layout/DockSidebar.tsx` and `src/components/layout/TopBar.tsx`.
4. Create landing page components and update `src/app/page.tsx`.
5. Implement `(auth)` and `(intranet)` route pages.
6. Verify build with `npm run build`.
