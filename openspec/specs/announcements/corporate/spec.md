# announcements/corporate Specification

## Purpose
Enables managers and HR to broadcast corporate announcements, pin critical notices, and segment visibility by department.

## Requirements

### Requirement: Priority announcements and pinning
The system SHALL support publishing announcements with priority tags (`urgent`, `high`, `normal`, `low`), pinning important notices to the top of the feed, enforcing mandatory read receipts (*acuse de recibo*) for urgent notices, and supporting embedded micro-videos (<90s).

#### Scenario: Viewing a pinned urgent notice
- **GIVEN** an urgent company announcement published by HR
- **WHEN** an employee visits `/announcements` or `/dashboard`
- **THEN** the urgent announcement SHALL appear pinned at the top with a distinct warning badge

#### Scenario: Viewing a pinned urgent notice with mandatory read receipt
- **GIVEN** an urgent company announcement published by leadership requiring read confirmation
- **WHEN** an employee visits `/announcements` or `/dashboard`
- **THEN** the announcement SHALL appear pinned at the top with a distinct warning badge and an interactive "Confirmar de Enterado / Acuse de Recibo" button
- **THEN** clicking the button SHALL record the confirmation timestamp in `document_read_receipts`

### Requirement: Dynamic audience micro-targeting
The system SHALL allow authors to target communications selectively by department array, employee role hierarchy, and geographic location to eliminate broadcast email fatigue.

#### Scenario: Publishing a department-specific operational alert
- **WHEN** Operations publishes an announcement targeted exclusively to the "Operaciones" and "Tecnología" departments
- **THEN** only members of those departments SHALL receive push notifications and view the announcement in their tailored corporate feed
