## Purpose

Displays an overview dashboard with key organizational metrics, quick access cards to frequently used modules, and an activity feed.

## ADDED Requirements

### Requirement: Dashboard metric widgets
The dashboard SHALL display high-level KPI cards (active requests, team attendance count, unread announcements, and quick shortcuts) tailored to the user's role and department.

#### Scenario: Employee dashboard view
- **GIVEN** an employee accessing `/dashboard`
- **WHEN** the page loads
- **THEN** the dashboard SHALL display personalized greeting, pending personal requests, recent corporate announcements, and quick action buttons
