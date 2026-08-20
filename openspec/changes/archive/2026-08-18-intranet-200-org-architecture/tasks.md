## 1. Database Schema Extensions

- [x] 1.1 Create migration `010_enterprise_scale.sql` defining tables: `knowledge_articles`, `document_revisions`, `announcement_read_receipts`, `peer_kudos`, `onboarding_journeys`, `project_hubs`, `project_hub_members` [NEW]
- [x] 1.2 Add RLS policies for multi-tenant isolation and audience targeting across all newly created tables [NEW]
- [x] 1.3 Add full-text search indexes (`tsvector`) and GIN indexes on skills and knowledge articles tags [NEW]

## 2. Strategic Communications & Read Receipts

- [x] 2.1 Update `src/components/intranet/announcements/` to support audience micro-targeting selection (departments & roles) [MODIFY]
- [x] 2.2 Implement mandatory read receipt confirmation dialog and tracking component (*Acuse de Recibo*) [NEW]
- [x] 2.3 Add support for micro-video embed player (<90s) in announcement articles [MODIFY]

## 3. Dynamic Talent Directory & Interactive Org Chart

- [x] 3.1 Implement skill-tagging editor on user profile in `/settings` and add skill search filters to `/directory` [MODIFY]
- [x] 3.2 Create SVG-based interactive organizational chart component (`src/components/intranet/directory/OrgChartTree.tsx`) [NEW]
- [x] 3.3 Add quick-preview popover cards with reporting line details upon selecting an org chart node [NEW]

## 4. Structured Knowledge Base & Governance

- [x] 4.1 Create `/knowledge` route with category browsing (SOPs, Compliance, Tech Guides) and faceted filters [NEW]
- [x] 4.2 Implement 90-day review reminder badges and automated review status workflows [NEW]
- [x] 4.3 Implement semantic search input in TopBar / Knowledge view with relevance ranking [MODIFY]

## 5. Cross-Functional Collaboration & Project Hubs

- [x] 5.1 Create project workspace view (`/projects/[projectId]`) with shared roadmaps, agreements, and team rosters [NEW]
- [x] 5.2 Create thematic communities of practice feed (`/communities/[communityId]`) with discussions and reactions [NEW]

## 6. Culture, Kudos & Guided Onboarding

- [x] 6.1 Implement peer-to-peer kudos creation form and live recognition feed tied to corporate core values [NEW]
- [x] 6.2 Implement new-hire Onboarding Journey dashboard with day 1-30 milestones and mentor card [NEW]
- [x] 6.3 Add work anniversary and promotion milestone celebration banner to `/dashboard` [MODIFY]

## 7. Enterprise Governance & Adoption Dashboard

- [x] 7.1 Implement executive metrics analytics panel on `/dashboard` (WAU $\ge 75\%$, DAU/MAU $\ge 60\%$, Search $\ge 85\%$, Freshness $\ge 70\%$) [MODIFY]
- [x] 7.2 Run end-to-end verification, type checking, and WCAG 2.2 AA accessibility audit across all new modules
