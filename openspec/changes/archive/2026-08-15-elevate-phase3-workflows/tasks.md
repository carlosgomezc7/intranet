## 1. Database Migrations

- [x] 1.1 Create `src/lib/supabase/schema/003_workflows.sql` with request types, approval chains, requests, and approvals with RLS [NEW]
- [x] 1.2 Create `src/lib/supabase/schema/004_attendance.sql` with attendance_records and imports with RLS [NEW]
- [x] 1.3 Create `src/lib/supabase/schema/005_payroll.sql` with payroll_receipts and integrations with RLS [NEW]

## 2. Workflows & Approvals Views

- [x] 2.1 Create `src/app/(intranet)/requests/page.tsx` with request list, status filters, and new request modal [NEW]
- [x] 2.2 Create `src/app/(intranet)/requests/[requestId]/page.tsx` with interactive approval step timeline [NEW]

## 3. Attendance & Payroll Views

- [x] 3.1 Create `src/app/(intranet)/attendance/page.tsx` with digital time clock, check-in button, and monthly history table [NEW]
- [x] 3.2 Create `src/app/(intranet)/payroll/page.tsx` with salary breakdown, tax retentions, and receipt downloads [NEW]

## 4. Verification & Build

- [x] 4.1 Run `npm run build` to verify clean compilation of all Phase 3 routes
