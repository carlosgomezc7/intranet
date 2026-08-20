# core/departments Specification

## Purpose
Manages the organizational hierarchy of departments, establishing reporting lines, department heads, and department-scoped access.

## Requirements

### Requirement: Hierarchical department management
The system SHALL support parent-child relationships between departments to represent deep organizational structures (e.g., Dirección General -> Dirección de Operaciones -> Gerencia de Logística).

#### Scenario: Department tree traversal
- **GIVEN** a department with parent and sub-departments
- **WHEN** an administrator views the organization chart
- **THEN** the system SHALL display the full department hierarchy with head of department designations

### Requirement: Department head assignment
The system SHALL allow assigning an active employee as the head (`head_user_id`) of each department.

#### Scenario: Head of department responsibilities
- **GIVEN** an employee designated as department head
- **WHEN** requests from members of their department are submitted
- **THEN** the department head SHALL be eligible to receive approval notifications for their department scope
