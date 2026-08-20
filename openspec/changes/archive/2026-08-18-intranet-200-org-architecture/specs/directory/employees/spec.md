## MODIFIED Requirements

### Requirement: Employee search and filters
The directory SHALL allow searching employees by name, email, job title, filtering by department or team, and searching across skill-tags and professional competencies.

#### Scenario: Searching for a team member
- **GIVEN** an employee viewing the directory
- **WHEN** typing a name or role in the search input
- **THEN** the list of employee cards SHALL update in real time matching the search query and active department filters

#### Scenario: Searching for a team member by skill tag
- **GIVEN** an employee viewing the directory
- **WHEN** typing a skill tag like "Next.js", "ISO 27001", or "Nómina" in the search input
- **THEN** the list of employee cards SHALL update in real time matching employees who possess those verified skills

## ADDED Requirements

### Requirement: Interactive real-time organizational chart
The directory module SHALL provide an interactive tree-view and graph organigrama showing reporting lines, direct reports, and team leadership structures across the 200-employee organization.

#### Scenario: Navigating reporting hierarchy
- **WHEN** a user opens the "Organigrama" tab in the Directory
- **THEN** the system SHALL render a responsive zoomable organization chart displaying department nodes, executive leadership, team leads, and subordinates with quick-profile preview popovers
