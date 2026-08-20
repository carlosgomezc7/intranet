import React from "react";
import { PayrollItem } from "./data";

interface Props {
  latestReceipt: PayrollItem;
}

export const PayrollBreakdown: React.FC<Props> = ({ latestReceipt }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="glass-panel p-5 rounded-2xl border border-sky-500/15">
        <span className="text-xs text-slate-400 block mb-1">Percepciones Brutas</span>
        <span className="text-xl font-bold text-white font-mono">{latestReceipt.gross_amount}</span>
        <span className="text-[11px] text-slate-500 block mt-1">Sueldo base + vales</span>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-sky-500/15">
        <span className="text-xs text-slate-400 block mb-1">Deducciones de Ley</span>
        <span className="text-xl font-bold text-rose-400 font-mono">-{latestReceipt.deductions}</span>
        <span className="text-[11px] text-slate-500 block mt-1">ISR retenido + IMSS</span>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-sky-500/15">
        <span className="text-xs text-slate-400 block mb-1">Fuente de Nómina</span>
        <span className="text-base font-bold text-cyan-300 block">CONTPAQi Nóminas</span>
        <span className="text-[11px] text-emerald-400 block mt-1">Sincronización activa</span>
      </div>
    </div>
  );
};
