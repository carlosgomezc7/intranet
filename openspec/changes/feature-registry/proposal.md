## Why

Organizations deploying ELEVATE often require different feature sets — a law firm may not need the attendance tracker, while a manufacturing company has no use for the ideas board. Currently, every module is hardcoded into the Dock Sidebar and always available for all organizations. Administrators cannot turn modules on or off, nor fine-tune which sub-capabilities (nodes) within a module are available. This forces every deployment to expose the full suite, which adds cognitive load, training burden, and security surface area.

A **Feature Registry** introduces a declarative, file-per-feature architecture where each major capability is self-described with granular toggleable nodes. A Super Admin panel (`/settings/features`) lets the organization's root administrator enable or disable entire modules and individual sub-features at the organization level — before RBAC/PBAC even evaluates user-level permissions.

## What Changes

- **Feature Module Definitions (`src/lib/features/*.feature.ts`)**:
  - One TypeScript file per major feature (chat, payroll, attendance, files, announcements, requests, projects, directory, feed, ideas, manuals, townhalls, report, notifications).
  - Each file exports a `FeatureModule` object declaring: `id`, `name`, `description`, `icon`, `route`, `defaultEnabled`, and an array of `FeatureNode` sub-capabilities with their own `id`, `name`, `defaultEnabled`, and optional `isCoreNode` flag.
  - A `registry.ts` aggregates and exports all feature modules for the system to consume.

- **Database Persistence (`015_feature_flags.sql`)**:
  - New table `public.feature_flags` with composite key `(org_id, feature_id, node_id)`, a boolean `is_enabled`, and audit metadata (`updated_by`, `updated_at`).
  - RLS policies: all authenticated users can read their organization's flags; only `super_admin` can modify flags.
  - Seed data applying `defaultEnabled` from each feature definition for the demo organization.

- **Server & Client Evaluation**:
  - Server-side helper `getOrgFeatureFlags(orgId)` returning resolved feature state.
  - Client hook `useFeatures()` exposing `isFeatureEnabled(featureId)` and `isNodeEnabled(featureId, nodeId)`.
  - Integration into `DockSidebar` to dynamically render only enabled features.
  - Middleware-level route guard: disabled features return a redirect to `/dashboard`.

- **Super Admin Panel (`/settings/features`)**:
  - New route exclusive to `super_admin` (hierarchy_level === 0).
  - Card-per-feature layout with master toggle and expandable node list with individual toggles.
  - Real-time persistence via Server Action `updateFeatureFlag`.

- **Three-Layer Access Resolution**:
  - Layer 1 (Feature Registry — org-level): "Does this feature exist for this organization?"
  - Layer 2 (Feature Nodes — org-level): "Is this specific sub-capability enabled?"
  - Layer 3 (RBAC/PBAC — user-level, existing): "Does this user have permission for this action?"
  - If Layer 1 or 2 returns disabled, Layer 3 is never evaluated.

- **Core Features (always enabled, non-togglable)**:
  - Dashboard, Settings, Directory, and Auth are protected from being disabled — they are structural to the platform.

## Capabilities

### New Capabilities
- `core/feature-registry`: Declarative feature flag system with file-per-feature architecture, database-backed organization-level toggles, and Super Admin management panel.

### Modified Capabilities
- `layout/dock-sidebar`: DockSidebar now dynamically filters navigation items based on enabled features from the Feature Registry instead of rendering a static list.
- `auth/rbac`: Feature Registry is injected as a superior layer in the permission resolution chain — disabled features short-circuit all RBAC evaluation for that resource.

## Impact

- **Affected Modules**: Layout (`DockSidebar`, `TopBar`), Settings (`/settings/features` new route), Middleware (`src/middleware.ts`), Hooks (`useFeatures` new hook), Lib (`src/lib/features/` new directory).
- **RBAC Roles Impacted**:
  - `super_admin`: Gains exclusive access to `/settings/features` panel for toggling features and nodes.
  - All other roles: Experience is filtered by feature flags — disabled features do not appear in navigation, routes, or UI elements.
- **Database Schema Changes**:
  - New table `public.feature_flags` with RLS policies.
  - Migration script `015_feature_flags.sql`.
- **Rollback Strategy**:
  - Revert migration `015_feature_flags.sql` dropping `feature_flags` table.
  - Remove `src/lib/features/` directory and `useFeatures` hook.
  - Restore static `DOCK_NAV_ITEMS` array in `DockSidebar`.
  - Feature evaluation in middleware and RBAC resolves to "always enabled" by default.
