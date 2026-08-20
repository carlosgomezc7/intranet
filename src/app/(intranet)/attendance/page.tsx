"use client";

import React, { useState, useEffect } from "react";
import { AttendanceHeader } from "@/components/intranet/attendance/AttendanceHeader";
import { LiveClockWidget } from "@/components/intranet/attendance/LiveClockWidget";
import { AttendanceKpiCard } from "@/components/intranet/attendance/AttendanceKpiCard";
import { AttendanceHistoryTable } from "@/components/intranet/attendance/AttendanceHistoryTable";
import { MOCK_ATTENDANCE } from "@/components/intranet/attendance/data";

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState("09:02 AM");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleCheck = () => {
    if (!isCheckedIn) {
      setCheckInTime(currentTime);
      setIsCheckedIn(true);
    } else {
      setIsCheckedIn(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <AttendanceHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LiveClockWidget
          currentTime={currentTime}
          isCheckedIn={isCheckedIn}
          checkInTime={checkInTime}
          onToggleCheck={handleToggleCheck}
        />
        <AttendanceKpiCard />
      </div>

      <AttendanceHistoryTable attendanceData={MOCK_ATTENDANCE} />
    </div>
  );
}
