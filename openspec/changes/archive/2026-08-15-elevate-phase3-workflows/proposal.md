## Why

Phase 3 delivers the enterprise operational workflows requested by Elevate: multi-step approval chains (vacations, leaves, expenses, hardware/system access) that pass through multiple department heads/managers, attendance clock-in monitoring with biometric logs, and confidential payroll receipt consultation.

## What Changes

- **NEW**: Database migration `003_workflows.sql` for `request_types`, `approval_chains`, `approval_chain_steps`, `requests`, and `request_approvals` with RLS.
- **NEW**: Database migration `004_attendance.sql` for `attendance_records` and `attendance_imports` with RLS.
- **NEW**: Database migration `005_payroll.sql` for `payroll_receipts` and `external_integrations` with RLS.
- **NEW**: Requests & Approvals portal at `/requests`, `/requests/new`, and `/requests/[requestId]` with visual timeline.
- **NEW**: Attendance tracker at `/attendance` with real-time clock-in/out and monthly calendar.
- **NEW**: Payroll portal at `/payroll` with salary summary, deductions breakdown, and receipt downloads.

## Capabilities

### New Capabilities
- `workflows/approvals`: Configurable multi-level approval workflows with decision timelines (approve, reject, request info).
- `attendance/check-ins`: Clock-in/out recording with geolocation/IP tag and monthly attendance calendar.
- `payroll/receipts`: Secure payroll history viewer with net pay breakdown and PDF/XML receipt downloads.

### Modified Capabilities
_(No existing specs modified in this phase)_

## Impact

### Affected Code & Systems
- Database: 9 new tables for requests, approval steps, attendance, and payroll.
- UI: New routes `/requests`, `/attendance`, `/payroll`.
