## Context

See `proposal.md` for background. Phase 3 implements the enterprise workflow engine: state machine for multi-tier approvals (`draft` -> `pending` -> `in_review` -> `approved` / `rejected`), digital attendance time clock, and confidential payroll receipt views.

## Goals / Non-Goals

**Goals:**
- Provide database migrations `003_workflows.sql`, `004_attendance.sql`, `005_payroll.sql` with complete RLS.
- Create `/requests` portal with new request modal, request list with status filters, and visual timeline view.
- Create `/attendance` view with live digital clock, daily check-in button, and monthly history table.
- Create `/payroll` view with income breakdown cards and receipt downloads.

**Non-Goals:**
- Direct live bank webhook dispatches (handled via external payroll software exports like CONTPAQi).
