import React from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { AttendanceRecord } from "./data";

interface Props {
  attendanceData: AttendanceRecord[];
}

export const AttendanceHistoryTable: React.FC<Props> = ({ attendanceData }) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/15 space-y-4">
      <h2 className="text-base font-bold text-white flex items-center gap-2">
        <Calendar className="w-5 h-5 text-cyan-400" aria-hidden="true" />
        <span>Historial Reciente de Checadas</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-sky-500/15">
            <tr>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Entrada</th>
              <th className="py-3 px-4">Salida</th>
              <th className="py-3 px-4">Horas Efectivas</th>
              <th className="py-3 px-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {attendanceData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white">{row.date}</td>
                <td className="py-3.5 px-4 text-slate-200">{row.check_in}</td>
                <td className="py-3.5 px-4 text-slate-200">{row.check_out}</td>
                <td className="py-3.5 px-4 font-mono text-cyan-300">{row.hours}</td>
                <td className="py-3.5 px-4">
                  {row.status === "on_time" ? (
                    <Badge variant="success">A tiempo</Badge>
                  ) : (
                    <Badge variant="warning">Retardo (12m)</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
