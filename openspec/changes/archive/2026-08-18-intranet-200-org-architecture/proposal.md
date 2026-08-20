## Why

Scaling past 150 employees (the Dunbar Limit) leads to cognitive saturation, communication fragmentation ($r = \frac{n(n-1)}{2} = 19,900$ potential bilateral communication channels for $n=200$), functional silos, and loss of spontaneous collective memory. In a 200-employee enterprise, internal communication can no longer rely on unsegmented broadcast emails or unstructured instant messaging without causing severe notification fatigue. Elevate Intranet must evolve into the central operational hub for institutional information architecture, knowledge governance, talent discovery, and cross-functional collaboration.

## What Changes

- **Segmented Communications & Mandatory Read Receipts**: Upgrade corporate announcements with dynamic micro-targeting (by department, role, operational hierarchy), mandatory read receipts (*acuse de recibo*) for high-priority leadership updates, and micro-video support (<90s).
- **Interactive Org Chart & Skill-Tagging Talent Directory**: Expand the employee directory with a real-time interactive organizational chart tracing reporting lines and cross-functional teams, plus a skill-tagging and competency search engine.
- **Structured Knowledge Base with 90-Day Governance**: Introduce a formal knowledge base for SOPs, compliance manuals, and technical guides with version control, document ownership, automated 90-day expiration/freshness review alerts, and semantic search.
- **Cross-Functional Project Hubs & Communities of Practice**: Add collaborative workspaces for hybrid/distributed project teams (roadmaps, agreements, boards) and thematic informal communities (innovation, sustainability, continuous learning).
- **Peer-to-Peer Recognition (Kudos) & Guided Onboarding Journey**: Implement social recognition linked to corporate values, automated onboarding workflows with mentor assignment, and institutional milestone celebration panels (anniversaries, promotions).
- **Adoption Analytics & Governance Metrics**: Expand executive dashboard metrics to track Weekly Active Users (WAU $\ge 75\%$), Stickiness (DAU/MAU $\ge 60\%$), Search Effectiveness ($\ge 85\%$), Document Freshness ($\ge 70\%$), and New Hire Activation Time ($< 48\text{h}$).

## Capabilities

### New Capabilities
- `knowledge/repository`: Structured knowledge base featuring document ownership, version control, automated 90-day freshness review cycles, and natural language semantic search.
- `collaboration/project-hubs`: Cross-department virtual project hubs with task boards, shared agreements, and thematic communities of practice.
- `culture/recognition-onboarding`: Peer-to-peer social kudos tied to corporate values, automated onboarding journey workflows with mentor assignment, and service milestone celebrations.

### Modified Capabilities
- `announcements/corporate`: Adds audience micro-targeting by department/hierarchy, mandatory read receipts for urgent communications, and rich feedback mechanisms.
- `directory/employees`: Adds real-time interactive org chart visualization, competency & skill-tagging search, and cross-functional team mapping.
- `dashboard/overview`: Adds governance and platform adoption analytics (WAU, DAU/MAU stickiness ratio, search effectiveness, document freshness index).

## Impact

**Affected modules and dependencies:**
- Announcements module (`/announcements`): new read receipt tracking table and audience filtering UI
- Directory module (`/directory`): new interactive org chart component and skill search engine
- Knowledge module (`/files` / `/knowledge`): structured document governance with 90-day expiration triggers
- Projects/Teams module (`/chat` / `/projects`): project hub spaces and practice forums
- Culture & Onboarding module: kudos feed, recognition badges, and onboarding progression tracker
- Dashboard module (`/dashboard`): governance and executive KPI analytics grid

**RBAC roles impacted:**
- `super_admin` & `admin`: full governance oversight, broadcast controls, analytics dashboard
- `hr_manager`: onboarding journey orchestration, culture kudos administration, document compliance
- `manager` & `team_lead`: project hub management, department-level segmented announcements, approval of knowledge docs
- `employee`: skill-tagging on profile, peer kudos creation, read receipt acknowledgment, project hub participation

**Database schema changes:**
- New tables: `knowledge_articles`, `document_revisions`, `document_read_receipts`, `peer_kudos`, `onboarding_journeys`, `project_hubs`, `project_hub_members`
- Enhanced RLS policies for segmented visibility and read confirmations

**Rollback strategy:**
Feature flags and additive schema migrations. Each sub-module (Kudos, Knowledge Base, Org Chart) can be enabled or disabled independently via configuration without breaking core intranet navigation.
