## MODIFIED Requirements

### Requirement: Dashboard metric widgets
The dashboard SHALL display high-level KPI cards (active requests, team attendance count, unread announcements, and quick shortcuts) tailored to the user's role and department, and SHALL provide executive governance analytics for administrative roles.

#### Scenario: Employee dashboard view
- **GIVEN** an employee accessing `/dashboard`
- **WHEN** the page loads
- **THEN** the dashboard SHALL display personalized greeting, pending personal requests, recent corporate announcements, and quick action buttons

## ADDED Requirements

### Requirement: Enterprise adoption & governance metrics
For `admin` and `super_admin` roles, the dashboard SHALL provide a Governance & Analytics panel tracking platform adoption and operational health benchmarks.

#### Scenario: Viewing governance KPIs
- **GIVEN** an administrator viewing the executive dashboard
- **WHEN** accessing the "Gobernanza & Métricas" tab
- **THEN** the system SHALL display metric cards for:
  - Weekly Active Users (WAU target $\ge 75\%$)
  - Platform Stickiness (DAU/MAU ratio target $\ge 60\%$)
  - Search Effectiveness (click-through target $\ge 85\%$)
  - Document Freshness Index (reviewed within 90 days target $\ge 70\%$)
  - New Hire Activation SLA (completion $< 48\text{h}$)
