# Feature Registry — Implementation Tasks

## Database

### Task 1: Create feature_flags migration
- **Create** `src/lib/supabase/schema/015_feature_flags.sql`
- Table `public.feature_flags` with columns: `org_id`, `feature_id`, `node_id`, `is_enabled`, `updated_by`, `updated_at`
- Composite PK `(org_id, feature_id, node_id)`
- Indexes on `org_id` and `feature_id`
- RLS: SELECT for all authenticated (own org), ALL for `super_admin` (own org)
- Seed default flags for demo org from registry defaults
- **Verify**: Run migration in Supabase SQL Editor, confirm table and policies exist

## Backend — Feature Definitions

### Task 2: Create feature types and interfaces
- **Create** `src/lib/features/types.ts`
- Define interfaces: `FeatureNode`, `FeatureModule`, `ResolvedFeatureState`, `ResolvedFeatureMap`, `FeaturesContextValue`
- **Verify**: `npm run build` passes with no type errors

### Task 3: Create feature module files (one per feature)
- **Create** `src/lib/features/chat.feature.ts` — nodes: `chat:access` (core), `chat:create-channel`, `chat:dm`, `chat:attachments`
- **Create** `src/lib/features/payroll.feature.ts` — nodes: `payroll:view-own` (core), `payroll:view-all`, `payroll:export`
- **Create** `src/lib/features/attendance.feature.ts` — nodes: `attendance:checkin` (core), `attendance:history`, `attendance:import`
- **Create** `src/lib/features/files.feature.ts` — nodes: `files:browse` (core), `files:upload`, `files:share`, `files:governance`
- **Create** `src/lib/features/announcements.feature.ts` — nodes: `announcements:read` (core), `announcements:create`, `announcements:read-receipt`
- **Create** `src/lib/features/requests.feature.ts` — nodes: `requests:submit` (core), `requests:approve`, `requests:configure`
- **Create** `src/lib/features/projects.feature.ts` — nodes: `projects:view` (core), `projects:create`, `projects:milestones`
- **Create** `src/lib/features/feed.feature.ts` — nodes: `feed:view` (core), `feed:create`, `feed:kudos`, `feed:polls`
- **Create** `src/lib/features/ideas.feature.ts` — nodes: `ideas:view` (core), `ideas:submit`, `ideas:vote`, `ideas:manage`
- **Create** `src/lib/features/manuals.feature.ts` — nodes: `manuals:read` (core), `manuals:create`, `manuals:publish`
- **Create** `src/lib/features/townhalls.feature.ts` — nodes: `townhalls:attend` (core), `townhalls:schedule`, `townhalls:qa`
- **Create** `src/lib/features/report.feature.ts` — nodes: `report:submit` (core), `report:manage`
- **Create** `src/lib/features/notifications.feature.ts` — nodes: `notifications:view` (core), `notifications:manage`
- **Verify**: All files export valid `FeatureModule` objects matching the interface

### Task 4: Create feature registry aggregator
- **Create** `src/lib/features/registry.ts`
- Import all `*.feature.ts` modules and export `FEATURE_REGISTRY` array
- Export helper functions: `getFeatureById(id)`, `getTogglableFeatures()`
- **Verify**: Import `FEATURE_REGISTRY` in a test file, confirm all 13 togglable features + core features are present

### Task 5: Create server-side feature resolution
- **Create** `src/lib/features/server.ts`
- Implement `getOrgFeatureFlags(orgId: string): Promise<ResolvedFeatureMap>`
- Merge DB flags with registry defaults, handle core node cascade logic
- Add demo mode fallback (all features enabled with registry defaults)
- **Verify**: `npm run build` passes

## Frontend — Hook & Context

### Task 6: Create useFeatures hook and FeaturesProvider
- **Create** `src/hooks/useFeatures.ts`
- Create `FeaturesContext` with `FeaturesProvider` export
- Implement `useFeatures()` hook returning `isFeatureEnabled`, `isNodeEnabled`, `loading`
- **Verify**: Hook compiles and exports correctly

### Task 7: Integrate FeaturesProvider into intranet layout
- **Modify** `src/app/(intranet)/layout.tsx`
- Call `getOrgFeatureFlags(profile.org_id)` in the server component
- Wrap children with `<FeaturesProvider value={...}>`
- Pass resolved features to `DockSidebar` component
- **Verify**: Layout renders with feature context available to all child components

## Frontend — Navigation Integration

### Task 8: Add featureId to navigation constants
- **Modify** `src/lib/constants.ts`
- Add `featureId?: string` field to `NavItem` interface in `src/lib/types.ts`
- Map each `DOCK_NAV_ITEMS` entry to its corresponding feature registry ID
- Core items (dashboard, settings, directory) get no `featureId` (always shown)
- **Verify**: TypeScript compiles, all nav items have appropriate featureId

### Task 9: Make DockSidebar dynamic
- **Modify** `src/components/layout/DockSidebar.tsx`
- Accept `features: ResolvedFeatureMap` prop or consume `useFeatures()`
- Filter `DOCK_NAV_ITEMS` to only render items where the linked feature is enabled
- Core items (no `featureId`) always render
- **Verify**: Disabling a feature in the DB removes its icon from the Dock

## Frontend — Super Admin Panel

### Task 10: Create features management page
- **Create** `src/app/(intranet)/settings/features/page.tsx` (< 50 lines)
- Guard: redirect if user is not `super_admin`
- Compose `FeaturesHeader` + `FeatureCardList`
- **Verify**: Route accessible at `/settings/features`, redirects non-super-admins

### Task 11: Create feature panel components
- **Create** `src/components/intranet/features/FeaturesHeader.tsx` — page title with Shield icon and description
- **Create** `src/components/intranet/features/FeatureCard.tsx` — card with icon, name, description, master toggle, expandable nodes
- **Create** `src/components/intranet/features/FeatureNodeList.tsx` — list of nodes with individual toggles
- **Create** `src/components/intranet/features/FeatureToggle.tsx` — accessible toggle switch (`role="switch"`, `aria-checked`, keyboard support, focus ring)
- Apply glassmorphism card styling consistent with existing settings panels
- **Verify**: Components render correctly with WCAG 2.2 AA compliance (contrast, keyboard nav, ARIA)

### Task 12: Create Server Action for feature flag updates
- **Create** `src/app/(intranet)/settings/features/actions.ts`
- Implement `updateFeatureFlag(featureId, nodeId, isEnabled)` Server Action
- Validate: caller is super_admin, feature is not core, inputs are valid
- Upsert into `feature_flags` table
- Call `revalidatePath('/settings/features')` and `revalidatePath('/', 'layout')`
- **Verify**: Toggle a feature in the panel, confirm DB row is upserted and Dock updates

## Integration — Route Protection

### Task 13: Add feature flag check to middleware/proxy
- **Modify** `src/middleware.ts` (or proxy equivalent)
- After session validation, check if the target route's feature is enabled
- If disabled, redirect to `/dashboard`
- Map routes to feature IDs using `FEATURE_REGISTRY` route field
- **Verify**: Navigate directly to a disabled feature's URL, confirm redirect to dashboard

## Documentation

### Task 14: Update README with Feature Registry section
- **Modify** `README.md`
- Add Feature Registry to the stack table
- Add new section documenting the feature flag architecture
- Update the project structure tree to include `src/lib/features/`
- Add `/settings/features` to the route listing
- **Verify**: README accurately reflects the new architecture
