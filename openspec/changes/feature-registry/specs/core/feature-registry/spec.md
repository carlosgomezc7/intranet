# core/feature-registry Specification

## Purpose
Defines a declarative, file-per-feature system that allows Super Administrators to enable or disable platform capabilities at the organization level. Acts as a superior access layer above RBAC — disabled features are completely invisible and inaccessible to all users regardless of their role permissions.

## Requirements

### Requirement: Feature module definition format
Each toggleable feature SHALL be defined in a dedicated TypeScript file (`src/lib/features/<feature-id>.feature.ts`) exporting a `FeatureModule` object containing: `id` (unique kebab-case identifier), `name` (Spanish display label), `description`, `icon` (Lucide icon name), `route` (primary route path), `defaultEnabled` (boolean), and a `nodes` array of `FeatureNode` objects.

#### Scenario: Feature file exports valid module
- **GIVEN** a file `chat.feature.ts` exists in `src/lib/features/`
- **WHEN** the registry imports and validates it
- **THEN** it SHALL contain an exported `ChatFeature` object with `id: 'chat'`, at least one node, and all required fields populated

### Requirement: Feature node granularity
Each `FeatureNode` within a feature SHALL have: `id` (format `featureId:capability`, matching `permissions` resource:action convention), `name` (Spanish label), `description`, `defaultEnabled` (boolean), and optional `isCoreNode` (boolean — when `true`, disabling this node disables the entire parent feature).

#### Scenario: Core node disabled cascades to parent
- **GIVEN** node `chat:access` has `isCoreNode: true` within the Chat feature
- **WHEN** a Super Admin disables node `chat:access`
- **THEN** the entire Chat feature SHALL be treated as disabled and removed from navigation

#### Scenario: Non-core node disabled independently
- **GIVEN** node `chat:attachments` has `isCoreNode: false` within the Chat feature
- **WHEN** a Super Admin disables node `chat:attachments`
- **THEN** the Chat feature SHALL remain visible and accessible, but attachment upload UI elements SHALL be hidden

### Requirement: Feature registry aggregation
The system SHALL provide a `registry.ts` module that automatically aggregates all `*.feature.ts` files and exports a typed `FEATURE_REGISTRY: FeatureModule[]` array and a `getFeatureById(id: string): FeatureModule | undefined` lookup function.

#### Scenario: Registry contains all defined features
- **WHEN** the application imports `FEATURE_REGISTRY` from `src/lib/features/registry.ts`
- **THEN** it SHALL contain entries for every `*.feature.ts` file in the directory

### Requirement: Core features cannot be disabled
The features Dashboard (`dashboard`), Settings (`settings`), Directory (`directory`), and Auth (`auth`) SHALL be marked as `isCore: true` in their module definition and SHALL NOT appear in the Super Admin toggle panel. The system SHALL always treat them as enabled regardless of database state.

#### Scenario: Attempt to disable core feature via API
- **GIVEN** a Super Admin sends a request to disable the feature `dashboard`
- **WHEN** the server action processes the request
- **THEN** it SHALL reject with error "Las características del sistema no pueden desactivarse" and the feature SHALL remain enabled

### Requirement: Database persistence of feature flags
Feature flag state SHALL be persisted in a PostgreSQL table `public.feature_flags` with columns: `org_id` (UUID FK to organizations), `feature_id` (TEXT), `node_id` (TEXT, `'__root__'` for the feature-level toggle), `is_enabled` (BOOLEAN), `updated_by` (UUID FK to profiles), `updated_at` (TIMESTAMPTZ). The composite primary key SHALL be `(org_id, feature_id, node_id)`.

#### Scenario: Feature flag row created on first toggle
- **GIVEN** no row exists in `feature_flags` for org X and feature `payroll`
- **WHEN** the Super Admin toggles payroll OFF
- **THEN** a new row SHALL be inserted with `feature_id = 'payroll'`, `node_id = '__root__'`, `is_enabled = false`

#### Scenario: Missing flag defaults to feature definition
- **GIVEN** no row exists in `feature_flags` for org X and feature `chat`
- **WHEN** the system evaluates whether `chat` is enabled
- **THEN** it SHALL fall back to the `defaultEnabled` value from `ChatFeature` in the registry

### Requirement: RLS policies for feature flags
Row Level Security SHALL enforce: all authenticated users can SELECT feature flags for their own organization (`org_id = get_user_org_id()`). Only users with role `super_admin` (hierarchy level 0) can INSERT, UPDATE, or DELETE feature flags for their organization.

#### Scenario: Non-admin reads feature flags
- **GIVEN** an authenticated user with role `employee` in organization X
- **WHEN** the user queries `feature_flags`
- **THEN** the query SHALL return all rows where `org_id` matches their organization

#### Scenario: Non-admin attempts to modify feature flags
- **GIVEN** an authenticated user with role `admin` (hierarchy level 1) in organization X
- **WHEN** the user attempts to UPDATE a row in `feature_flags`
- **THEN** the operation SHALL be denied by RLS policy

### Requirement: Server-side feature evaluation
The system SHALL provide an async server function `getOrgFeatureFlags(orgId: string): Promise<ResolvedFeatureMap>` that queries `feature_flags` for the organization, merges with `FEATURE_REGISTRY` defaults, and returns a map of `{ [featureId]: { enabled: boolean, nodes: { [nodeId]: boolean } } }`.

#### Scenario: Resolved map includes all registry features
- **WHEN** `getOrgFeatureFlags` is called for org X
- **THEN** the returned map SHALL contain an entry for every feature in `FEATURE_REGISTRY`, using database values where rows exist and `defaultEnabled` values where they do not

### Requirement: Client-side feature hook
The system SHALL provide a React hook `useFeatures()` returning `{ isFeatureEnabled(featureId): boolean, isNodeEnabled(featureId, nodeId): boolean, loading: boolean }`. The hook SHALL read feature state from a React Context populated by the intranet layout.

#### Scenario: Component checks feature availability
- **GIVEN** a component renders a "Subir Archivo" button guarded by `isNodeEnabled('files', 'files:upload')`
- **WHEN** the `files:upload` node is disabled for the organization
- **THEN** the button SHALL NOT be rendered

### Requirement: Dynamic Dock Sidebar
The `DockSidebar` component SHALL consume the Feature Registry context and render only navigation items whose corresponding feature is enabled for the organization. Core features SHALL always appear. The order SHALL follow the registry definition order.

#### Scenario: Feature disabled removes Dock icon
- **GIVEN** the Chat feature is disabled for organization X
- **WHEN** any user in organization X views the intranet
- **THEN** the Chat icon SHALL NOT appear in the Dock Sidebar and no `<a>` element pointing to `/chat` SHALL exist in the DOM

### Requirement: Route-level protection for disabled features
The middleware (or proxy) SHALL check feature flags before allowing access to feature routes. If a feature is disabled, navigation to its route SHALL redirect to `/dashboard` with a toast notification.

#### Scenario: Direct URL access to disabled feature
- **GIVEN** the Payroll feature is disabled for organization X
- **WHEN** a user navigates directly to `/payroll` via URL
- **THEN** the system SHALL redirect to `/dashboard`

### Requirement: Three-layer access resolution
The system SHALL evaluate access in strict order: (1) Feature Registry (org-level), (2) Feature Nodes (org-level), (3) RBAC/PBAC (user-level). If layer 1 or 2 denies access, layer 3 SHALL NOT be evaluated.

#### Scenario: Feature enabled but user lacks RBAC permission
- **GIVEN** the Payroll feature and `payroll:export` node are both enabled
- **WHEN** an `employee` user attempts to export payroll (lacks `payroll:export` permission)
- **THEN** the feature SHALL be visible, but the export action SHALL be denied by RBAC with "Acceso denegado"

#### Scenario: Feature disabled overrides RBAC grant
- **GIVEN** the Payroll feature is disabled for the organization
- **WHEN** a `super_admin` navigates to `/payroll`
- **THEN** the route SHALL redirect to `/dashboard` — even super_admin cannot access disabled features through routes

### Requirement: Super Admin management panel
The system SHALL provide a route `/settings/features` accessible exclusively to users with `hierarchy_level === 0` (super_admin). The panel SHALL display all non-core features as cards with a master toggle and an expandable section showing individual nodes with toggles. Changes SHALL persist immediately via Server Action.

#### Scenario: Panel accessibility
- **GIVEN** a user with role `admin` (hierarchy level 1)
- **WHEN** the user navigates to `/settings/features`
- **THEN** the system SHALL redirect to `/dashboard` with notification "No tienes permisos para acceder a esta sección"

#### Scenario: Toggle feature and persist
- **GIVEN** a Super Admin on `/settings/features`
- **WHEN** they toggle the Chat feature master switch to OFF
- **THEN** the `feature_flags` row SHALL be upserted with `is_enabled = false`, the Dock SHALL reactively hide the Chat icon, and a success toast SHALL appear: "Chat Corporativo desactivado"

### Requirement: Accessibility compliance
All toggle controls in the features panel SHALL meet WCAG 2.2 AA: minimum 4.5:1 contrast ratio, keyboard navigable (`Tab`/`Space`/`Enter`), proper ARIA attributes (`role="switch"`, `aria-checked`, `aria-label`), and visible focus ring (`focus-visible:ring-2 focus-visible:ring-cyan-400`).

#### Scenario: Keyboard toggle
- **GIVEN** a Super Admin focuses on the Chat feature toggle via `Tab`
- **WHEN** they press `Space` or `Enter`
- **THEN** the toggle SHALL change state and announce the change via `aria-live="polite"`
