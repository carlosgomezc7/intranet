## Purpose

Provides employees with confidential, isolated access to view their payment history, salary breakdown, tax retentions, and download digital receipts (PDF / XML).

## ADDED Requirements

### Requirement: Confidential payroll view
The system SHALL strictly restrict payroll receipt access so that non-HR employees can only query their own personal receipts through database Row Level Security.

#### Scenario: Employee downloading receipt
- **GIVEN** an employee viewing `/payroll`
- **WHEN** clicking "Descargar PDF" on a pay period
- **THEN** the system SHALL provide the secure receipt download link
