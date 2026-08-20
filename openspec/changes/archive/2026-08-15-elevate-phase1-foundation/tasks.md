## 1. Database & Core Infrastructure

- [x] 1.1 Create `src/lib/supabase/schema/001_core.sql` with tables for organizations, departments, teams, team_members, profiles, and bug_reports with RLS policies [NEW]
- [x] 1.2 Create `src/lib/types.ts` defining TypeScript interfaces for profiles, departments, teams, bug reports, and navigation items [NEW]
- [x] 1.3 Create `src/lib/constants.ts` with roles, department types, navigation configuration, and system defaults [NEW]
- [x] 1.4 Update `src/lib/config.ts` with Elevate branding, colors, and metadata [MODIFY]

## 2. Design System & Global Layout

- [x] 2.1 Update `src/app/globals.css` with macOS Dock styles, glassmorphism tokens, focus rings, and custom scrollbars [MODIFY]
- [x] 2.2 Update `src/app/layout.tsx` with Inter font, skip links, and accessible root metadata [MODIFY]
- [x] 2.3 Create shared UI components in `src/components/shared/` (Avatar, Badge, SkipLink, EmptyState, SearchBar) [NEW]

## 3. Landing Page Modularization

- [x] 3.1 Create `src/components/landing/Header.tsx` with responsive navigation and accessible modal menu [NEW]
- [x] 3.2 Create `src/components/landing/Hero.tsx` with branding headline, metrics, and action CTAs [NEW]
- [x] 3.3 Create `src/components/landing/Services.tsx` with capability cards and feature lists [NEW]
- [x] 3.4 Create `src/components/landing/About.tsx` with corporate overview and RBAC preview [NEW]
- [x] 3.5 Create `src/components/landing/Contact.tsx` with client interactive contact form [NEW]
- [x] 3.6 Create `src/components/landing/Footer.tsx` with semantic footer and links [NEW]
- [x] 3.7 Update `src/app/page.tsx` to assemble landing components in clean Server Component [MODIFY]

## 4. Navigation & Layout Structure

- [x] 4.1 Create `src/components/layout/DockSidebar.tsx` implementing macOS Dock vertical navigation with tooltips and active glow [NEW]
- [x] 4.2 Create `src/components/layout/TopBar.tsx` with global search, notification trigger, and profile avatar [NEW]
- [x] 4.3 Create `src/components/layout/UserMenu.tsx` with accessible dropdown actions [NEW]
- [x] 4.4 Create `src/app/(intranet)/layout.tsx` wrapping all intranet routes with DockSidebar and TopBar [NEW]
- [x] 4.5 Create `src/app/(auth)/layout.tsx` for centered glass card authentication views [NEW]
- [x] 4.6 Move and improve login page to `src/app/(auth)/login/page.tsx` with accessible alerts and focus styling [NEW]
- [x] 4.7 Update `src/middleware.ts` to protect `(intranet)` routes and redirect authenticated sessions away from `(auth)` [MODIFY]

## 5. Intranet Views & Custom Hooks

- [x] 5.1 Create `src/hooks/useUser.ts` and `src/hooks/usePermissions.ts` for authenticated state and RBAC checks [NEW]
- [x] 5.2 Create `src/app/(intranet)/dashboard/page.tsx` with KPI metrics, quick actions, and recent activity [NEW]
- [x] 5.3 Create `src/app/(intranet)/directory/page.tsx` with real-time employee search and department filters [NEW]
- [x] 5.4 Create `src/app/(intranet)/settings/page.tsx` for profile management and preferences [NEW]
- [x] 5.5 Create `src/app/(intranet)/report/page.tsx` for bug reporting and improvement suggestions with attachments [NEW]

## 6. Documentation & Verification

- [x] 6.1 Update `AGENTS.md` and `README.md` with complete Elevate architecture and OpenSpec guidelines [MODIFY]
- [x] 6.2 Run `npm run build` and verify zero TypeScript or Next.js build errors
