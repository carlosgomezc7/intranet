## Purpose

Enables employees to submit structured requests that traverse multi-level approval hierarchies with full traceability and step-by-step decision audit logs.

## ADDED Requirements

### Requirement: Multi-level approval sequence
The system SHALL route submitted requests through an ordered chain of approvers based on department heads, team leads, or designated roles before reaching a final `approved` status.

#### Scenario: Request advancing to step 2
- **GIVEN** a pending vacation request awaiting manager approval (Step 1)
- **WHEN** the manager clicks "Aprobar" with optional comments
- **THEN** the request SHALL advance to HR approval (Step 2) and notify the HR team

### Requirement: Visual approval timeline
The system SHALL display an interactive visual timeline showing all steps, approver names, decision timestamps, and reviewer comments.

#### Scenario: Viewing request details
- **GIVEN** an employee viewing their active request
- **WHEN** accessing `/requests/[requestId]`
- **THEN** the system SHALL display the current step, past approvals with checkmarks, and pending approvers
