## Purpose

Provides a searchable, filterable directory of all organization employees with department breakdowns and contact cards.

## ADDED Requirements

### Requirement: Employee search and filters
The directory SHALL allow searching employees by name, email, job title, and filtering by department or team.

#### Scenario: Searching for a team member
- **GIVEN** an employee viewing the directory
- **WHEN** typing a name or role in the search input
- **THEN** the list of employee cards SHALL update in real time matching the search query and active department filters
