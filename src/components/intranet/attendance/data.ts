export interface AttendanceRecord {
  date: string;
  check_in: string;
  check_out: string;
  status: "on_time" | "late";
  hours: string;
}

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { date: "15 Ago 2026", check_in: "09:02 AM", check_out: "En curso", status: "on_time", hours: "4.5 hrs" },
  { date: "14 Ago 2026", check_in: "08:58 AM", check_out: "06:05 PM", status: "on_time", hours: "9.1 hrs" },
  { date: "13 Ago 2026", check_in: "09:12 AM", check_out: "06:15 PM", status: "late", hours: "9.0 hrs" },
  { date: "12 Ago 2026", check_in: "08:55 AM", check_out: "06:02 PM", status: "on_time", hours: "9.1 hrs" },
  { date: "11 Ago 2026", check_in: "09:00 AM", check_out: "06:00 PM", status: "on_time", hours: "9.0 hrs" },
];
