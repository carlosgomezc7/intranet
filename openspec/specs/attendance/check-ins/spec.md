# attendance/check-ins Specification

## Purpose
Provides a digital time clock and attendance recording system with monthly historical logs and status indicators (a tiempo, retardo, falta, justificada).

## Requirements

### Requirement: Digital clock-in and clock-out
The system SHALL allow employees to record their daily check-in (`check_in`) and check-out (`check_out`) with UTC timestamps and source metadata (`web`, `biometric`).

#### Scenario: Registering daily check-in
- **GIVEN** an employee at the start of their workday
- **WHEN** clicking the "Registrar Entrada" button on `/attendance`
- **THEN** the system SHALL record the current timestamp and update the button state to "Registrar Salida"

### Requirement: Monthly attendance calendar
The system SHALL render a monthly grid summarizing work days, recorded hours, and punctual attendance rates.

#### Scenario: Reviewing attendance summary
- **GIVEN** an employee reviewing their monthly record
- **WHEN** navigating across months in the calendar
- **THEN** each day SHALL display green dots for on-time arrivals and yellow dots for delays
