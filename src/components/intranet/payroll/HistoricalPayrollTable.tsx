import React from "react";
import { Calendar, FileText, FileCode } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { PayrollItem } from "./data";

interface Props {
  payrollHistory: PayrollItem[];
}

export const HistoricalPayrollTable: React.FC<Props> = ({ payrollHistory }) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/15 space-y-4">
      <h2 className="text-base font-bold text-white flex items-center gap-2">
        <Calendar className="w-5 h-5 text-cyan-400" aria-hidden="true" />
        <span>Historial de Recibos Anteriores</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-sky-500/15">
            <tr>
              <th className="py-3 px-4">Período</th>
              <th className="py-3 px-4">Percepciones</th>
              <th className="py-3 px-4">Deducciones</th>
              <th className="py-3 px-4">Neto Pagado</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-right">Descargas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {payrollHistory.map((pay) => (
              <tr key={pay.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white">
                  {pay.period_title}
                  <span className="block text-[11px] text-slate-400 font-normal">{pay.period_date}</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-300">{pay.gross_amount}</td>
                <td className="py-3.5 px-4 font-mono text-rose-400">-{pay.deductions}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{pay.net_amount}</td>
                <td className="py-3.5 px-4">
                  <Badge variant="success">Timbrado</Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <a
                      href={pay.pdf_url}
                      aria-label={`Descargar PDF ${pay.period_title}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    >
                      <FileText className="w-4 h-4" />
                    </a>
                    <a
                      href={pay.xml_url}
                      aria-label={`Descargar XML ${pay.period_title}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      <FileCode className="w-4 h-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
