import React from "react";
import { Calendar, FileText, FileCode } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { PayrollItem } from "./data";

interface Props {
  latestReceipt: PayrollItem;
}

export const LatestReceiptCard: React.FC<Props> = ({ latestReceipt }) => {
  return (
    <div className="glass-card-elevated p-6 sm:p-8 rounded-3xl border border-sky-500/25 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
            Último Período Pagado
          </span>
          <Badge variant="success">Timbrado SAT (CFDI)</Badge>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {latestReceipt.period_title}
        </h2>
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Período: {latestReceipt.period_date}</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-sky-500/20 text-left sm:text-right">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
            Neto a Recibir
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {latestReceipt.net_amount}
          </span>
          <span className="text-[10px] text-slate-500 block">MXN</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
          <a
            href={latestReceipt.pdf_url}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-xs font-semibold text-white shadow-md shadow-sky-600/20 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>Descargar PDF</span>
          </a>
          <a
            href={latestReceipt.xml_url}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <FileCode className="w-4 h-4" aria-hidden="true" />
            <span>XML Timbrado</span>
          </a>
        </div>
      </div>
    </div>
  );
};
