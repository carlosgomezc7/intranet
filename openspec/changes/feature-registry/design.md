# Feature Registry — Technical Design

## Overview

The Feature Registry introduces a three-layer access model where organization-level feature flags sit above the existing RBAC/PBAC engine. Each feature is declared in its own TypeScript file with granular nodes, persisted in PostgreSQL, and evaluated before any user-level permission check.

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Request: User navigates to /payroll                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Middleware/Proxy                                                    │
│     ├─ Extract org_id from session                                     │
│     ├─ Query feature_flags WHERE org_id AND feature_id = 'payroll'     │
│     ├─ Merge with PayrollFeature.defaultEnabled from registry          │
│     └─ DISABLED? → redirect /dashboard (skip all further checks)       │
│                                                                         │
│  2. Layout (Server Component)                                          │
│     ├─ getOrgFeatureFlags(orgId) → ResolvedFeatureMap                  │
│     ├─ Pass to FeatureProvider context                                 │
│     └─ DockSidebar filters nav items by enabled features               │
│                                                                         │
│  3. Page Component                                                      │
│     ├─ useFeatures() → isNodeEnabled('payroll', 'payroll:export')     │
│     └─ Conditionally render UI based on node state                     │
│                                                                         │
│  4. RBAC/PBAC (existing, unchanged)                                    │
│     ├─ usePermissions() → can('payroll', 'export')                    │
│     └─ Evaluate role permissions + user overrides                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## TypeScript Interfaces

### Feature Types (`src/lib/features/types.ts`)

```typescript
export interface FeatureNode {
  id: string;            // Format: 'featureId:capability' (e.g. 'chat:dm')
  name: string;          // Spanish display label
  description?: string;  // Short description
  defaultEnabled: boolean;
  isCoreNode?: boolean;  // If true, disabling this node disables the whole feature
}

export interface FeatureModule {
  id: string;            // Unique kebab-case identifier (e.g. 'chat')
  name: string;          // Spanish display label (e.g. 'Chat Corporativo')
  description: string;
  icon: string;          // Lucide icon name (e.g. 'MessageSquare')
  route: string;         // Primary route path (e.g. '/chat')
  isCore?: boolean;      // true for Dashboard, Settings, Directory, Auth — cannot be toggled
  defaultEnabled: boolean;
  nodes: FeatureNode[];
}

export interface ResolvedFeatureState {
  enabled: boolean;
  nodes: Record<string, boolean>;  // nodeId → enabled
}

export type ResolvedFeatureMap = Record<string, ResolvedFeatureState>;

export interface FeaturesContextValue {
  features: ResolvedFeatureMap;
  isFeatureEnabled: (featureId: string) => boolean;
  isNodeEnabled: (featureId: string, nodeId: string) => boolean;
  loading: boolean;
}
```

## Feature Module Example (`src/lib/features/chat.feature.ts`)

```typescript
import { FeatureModule } from './types';

export const ChatFeature: FeatureModule = {
  id: 'chat',
  name: 'Chat Corporativo',
  description: 'Comunicación interna en tiempo real por canales y mensajes directos',
  icon: 'MessageSquare',
  route: '/chat',
  defaultEnabled: true,
  nodes: [
    {
      id: 'chat:access',
      name: 'Acceso al Chat',
      description: 'Permite visualizar y participar en canales',
      defaultEnabled: true,
      isCoreNode: true,
    },
    {
      id: 'chat:create-channel',
      name: 'Crear Canales',
      description: 'Permite crear canales públicos y privados',
      defaultEnabled: false,
    },
    {
      id: 'chat:dm',
      name: 'Mensajes Directos',
      description: 'Permite enviar mensajes directos entre usuarios',
      defaultEnabled: true,
    },
    {
      id: 'chat:attachments',
      name: 'Adjuntos en Chat',
      description: 'Permite enviar archivos adjuntos en mensajes',
      defaultEnabled: true,
    },
  ],
};
```

## Registry Aggregation (`src/lib/features/registry.ts`)

```typescript
import { FeatureModule } from './types';
import { ChatFeature } from './chat.feature';
import { PayrollFeature } from './payroll.feature';
// ... all other features

export const FEATURE_REGISTRY: FeatureModule[] = [
  ChatFeature,
  PayrollFeature,
  // ... ordered by display preference
];

export function getFeatureById(id: string): FeatureModule | undefined {
  return FEATURE_REGISTRY.find((f) => f.id === id);
}

export function getTogglableFeatures(): FeatureModule[] {
  return FEATURE_REGISTRY.filter((f) => !f.isCore);
}
```

## Database Migration (`015_feature_flags.sql`)

```sql
-- Feature Flags Table (Organization-Level Feature Toggles)
CREATE TABLE IF NOT EXISTS public.feature_flags (
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    feature_id TEXT NOT NULL,
    node_id TEXT NOT NULL DEFAULT '__root__',
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (org_id, feature_id, node_id)
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_org ON public.feature_flags(org_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_feature ON public.feature_flags(feature_id);

-- RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read their org's flags
CREATE POLICY "Users can read feature flags"
    ON public.feature_flags FOR SELECT TO authenticated
    USING (org_id = public.get_user_org_id());

-- Only super_admin can modify flags
CREATE POLICY "Super admins can manage feature flags"
    ON public.feature_flags FOR ALL TO authenticated
    USING (
        org_id = public.get_user_org_id()
        AND public.get_user_role() = 'super_admin'
    );
```

## Server-Side Resolution (`src/lib/features/server.ts`)

```typescript
import { createClient } from '@/lib/supabase/server';
import { FEATURE_REGISTRY } from './registry';
import { ResolvedFeatureMap } from './types';

export async function getOrgFeatureFlags(orgId: string): Promise<ResolvedFeatureMap> {
  const supabase = await createClient();
  const { data: flags } = await supabase
    .from('feature_flags')
    .select('feature_id, node_id, is_enabled')
    .eq('org_id', orgId);

  const flagMap = new Map<string, boolean>();
  for (const f of flags || []) {
    flagMap.set(`${f.feature_id}:${f.node_id}`, f.is_enabled);
  }

  const resolved: ResolvedFeatureMap = {};
  for (const feature of FEATURE_REGISTRY) {
    const rootKey = `${feature.id}:__root__`;
    const featureEnabled = flagMap.has(rootKey)
      ? flagMap.get(rootKey)!
      : feature.defaultEnabled;

    const nodes: Record<string, boolean> = {};
    for (const node of feature.nodes) {
      const nodeKey = `${feature.id}:${node.id}`;
      nodes[node.id] = flagMap.has(nodeKey)
        ? flagMap.get(nodeKey)!
        : node.defaultEnabled;
      // Core node cascade
      if (node.isCoreNode && !nodes[node.id]) {
        resolved[feature.id] = { enabled: false, nodes };
        break;
      }
    }
    resolved[feature.id] = resolved[feature.id] || { enabled: feature.isCore || featureEnabled, nodes };
  }

  return resolved;
}
```

## Client Hook (`src/hooks/useFeatures.ts`)

```typescript
"use client";

import { createContext, useContext } from 'react';
import { FeaturesContextValue } from '@/lib/features/types';

const FeaturesContext = createContext<FeaturesContextValue>({
  features: {},
  isFeatureEnabled: () => true,
  isNodeEnabled: () => true,
  loading: true,
});

export const FeaturesProvider = FeaturesContext.Provider;

export function useFeatures(): FeaturesContextValue {
  return useContext(FeaturesContext);
}
```

## Layout Integration (`src/app/(intranet)/layout.tsx`)

The intranet layout server component resolves feature flags and passes them to a `FeaturesProvider` wrapping the page content. `DockSidebar` receives the resolved map and filters `DOCK_NAV_ITEMS` to only include features where `isFeatureEnabled(item.featureId)` returns `true`.

## DockSidebar Modification

Current `DOCK_NAV_ITEMS` in `constants.ts` will be extended with a `featureId` field linking each nav item to its registry entry. The `DockSidebar` component will read from `useFeatures()` and filter items before rendering.

## Super Admin Panel (`/settings/features`)

### Component Structure
```
src/app/(intranet)/settings/features/
├── page.tsx                          # < 50 lines, composes components
└── components/
    ├── FeaturesHeader.tsx            # Page title and description
    ├── FeatureCard.tsx               # Individual feature card with master toggle
    ├── FeatureNodeList.tsx           # Expandable node list within a card
    └── FeatureToggle.tsx             # Accessible toggle switch (role="switch")
```

### Server Action (`src/app/(intranet)/settings/features/actions.ts`)
```typescript
"use server";

export async function updateFeatureFlag(
  featureId: string,
  nodeId: string,
  isEnabled: boolean
): Promise<{ success: boolean; error?: string }> {
  // 1. Verify caller is super_admin
  // 2. Verify feature is not core (isCore !== true)
  // 3. Upsert into feature_flags
  // 4. Revalidate layout
}
```

## Existing Patterns Referenced

- **Permission evaluation pattern**: Follows `usePermissions.ts` hook convention with context provider
- **Server-side data loading**: Mirrors `getEffectivePermissions()` in `src/lib/auth/rbac.ts`
- **Component modularity**: Settings pages follow `SettingsHeader` + content component pattern
- **RLS policies**: Follows `013_user_permission_overrides.sql` organization-scoped policy pattern
- **Server Actions**: Follows `permission-actions.ts` pattern for form mutations with error handling
