"use client";

import React from "react";
import { PayrollHeader } from "@/components/intranet/payroll/PayrollHeader";
import { LatestReceiptCard } from "@/components/intranet/payroll/LatestReceiptCard";
import { PayrollBreakdown } from "@/components/intranet/payroll/PayrollBreakdown";
import { HistoricalPayrollTable } from "@/components/intranet/payroll/HistoricalPayrollTable";
import { MOCK_PAYROLL } from "@/components/intranet/payroll/data";

export default function PayrollPage() {
  const latestReceipt = MOCK_PAYROLL[0];

  return (
    <div className="space-y-8 animate-slide-up">
      <PayrollHeader />
      <LatestReceiptCard latestReceipt={latestReceipt} />
      <PayrollBreakdown latestReceipt={latestReceipt} />
      <HistoricalPayrollTable payrollHistory={MOCK_PAYROLL} />
    </div>
  );
}
