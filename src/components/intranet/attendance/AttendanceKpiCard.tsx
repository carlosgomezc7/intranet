import React from "react";
import { TrendingUp } from "lucide-react";

export const AttendanceKpiCard = () => {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-sky-500/15 flex flex-col justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Resumen del Mes (Agosto)
        </span>
        <div className="text-3xl font-extrabold text-emerald-400 flex items-center gap-2">
          <span>98.5%</span>
          <TrendingUp className="w-5 h-5" aria-hidden="true" />
        </div>
        <p className="text-xs text-slate-300">Índice de puntualidad</p>
      </div>

      <div className="pt-4 border-t border-sky-500/10 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-slate-900/60">
          <span className="text-slate-400 block text-[10px]">Días Trabajados</span>
          <span className="font-bold text-white">11 días</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-900/60">
          <span className="text-slate-400 block text-[10px]">Retardos</span>
          <span className="font-bold text-amber-400">1</span>
        </div>
      </div>
    </div>
  );
};
