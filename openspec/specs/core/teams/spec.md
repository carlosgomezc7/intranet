# core/teams Specification

## Purpose
Manages cross-functional teams and project groups that span across departments, enabling flexible collaboration and team-specific resource access.

## Requirements

### Requirement: Cross-functional team creation and membership
The system SHALL allow creating transversal project teams and adding members from any department with specific team roles (`lead`, `member`, `guest`).

#### Scenario: Cross-department team composition
- **GIVEN** an active team created by a manager or administrator
- **WHEN** adding members to the team
- **THEN** the system SHALL allow selecting profiles across different departments and assigning their role within the team
