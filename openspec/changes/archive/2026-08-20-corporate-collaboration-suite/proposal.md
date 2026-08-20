## Why

To expand the ELEVATE Intranet B2B platform with a comprehensive Suite de Colaboración Corporativa. While ELEVATE currently provides basic announcements and static knowledge pages, employees need dynamic social interaction, employee recognition (Kudos), structured documentation with chapter management (Manuales & SOPs), crowdsourced innovation (Buzón de Ideas), and interactive Town Hall meetings with live Q&A.

Integrating these capabilities will foster transparent communication, centralize operational knowledge for 200+ employees, boost employee engagement, and streamline idea management across all departments.

## What Changes

- **Muro Social Corporativo**: Dynamic social feed (`/feed`) supporting post creation with rich text, image attachments, interactive polls/surveys, employee recognition ("Kudos/Reconocimientos"), hashtags, and comment threads with reactions.
- **Manuales & Políticas (SOPs)**: Hierarchical documentation suite (`/manuals`) organized by Manual → Chapter → Article, featuring version history and publishing workflows.
- **Buzón de Ideas**: Innovation crowdsourcing board (`/ideas`) enabling employees to submit proposals, vote on community ideas, and track implementation stages (`Borrador`, `En Revisión`, `Aprobada`, `En Desarrollo`, `Implementada`).
- **Town Hall & Eventos Interactivos**: Event management portal (`/townhalls`) supporting all-hands company meetings, live Q&A submission with upvoting, host moderation, and attendee RSVP tracking.
- **Insignias & Gamificación**: Recognition engine awarding badges (e.g., "Líder de Equipo", "Innovador del Mes") and engagement scores.

## Capabilities

### New Capabilities
- `collaboration/social-feed`: Interactive corporate social feed with polls, kudos recognition, hashtags, and media attachments.
- `collaboration/manuals`: Hierarchical knowledge manuals, SOPs, chapters, and versioned articles.
- `collaboration/ideas`: Idea crowdsourcing board with voting, categorization, and lifecycle stage tracking.
- `collaboration/town-halls`: Town Hall event management, live interactive Q&A, question upvoting, and moderation.

### Modified Capabilities
- `auth/rbac`: Granting granular feature permissions for creating Town Halls, managing Manuals, and moderating Ideas.

## Impact

- **Affected Modules**: Feeds, Manuals, Ideas, Town Halls/Events, Settings, Dock Sidebar Navigation (`DOCK_NAV_ITEMS`).
- **Database Schema**: New migration `014_collaboration_suite.sql` adding tables `posts`, `post_reactions`, `polls`, `poll_votes`, `kudos`, `manuals`, `manual_chapters`, `manual_articles`, `ideas`, `idea_votes`, `town_halls`, and `town_hall_questions`.
- **RBAC & Security**: Integrated with `user_permission_overrides` and hierarchy guardrails. RLS multi-tenant policies enforced per `org_id`.
- **UI/UX & Accessibility**: High-contrast macOS Dock navigation, glassmorphism dark theme, WCAG 2.2 AA compliant focus rings (`focus-visible:ring-2 focus-visible:ring-cyan-400`), keyboard navigation, and ARIA live feedback.

## Rollback Strategy

1. Drop migration tables created in `014_collaboration_suite.sql`.
2. Remove navigation links from `DOCK_NAV_ITEMS` in `src/lib/constants.ts`.
3. Revert page routes under `src/app/(intranet)/`.
