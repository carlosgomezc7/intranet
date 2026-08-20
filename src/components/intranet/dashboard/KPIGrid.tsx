import React from "react";
import { Users, FileCheck2, Clock, Megaphone } from "lucide-react";

export const KPIGrid = () => {
  return (
    <section aria-labelledby="kpi-metrics-heading">
      <h2 id="kpi-metrics-heading" className="sr-only">
        Métricas principales
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-sky-500/15 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Colaboradores</span>
            <span className="text-2xl font-bold text-white">200+</span>
            <span className="text-[11px] text-emerald-400 block mt-1">Activos en plataforma</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/20 flex items-center justify-center text-sky-400">
            <Users className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-sky-500/15 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Mis Solicitudes</span>
            <span className="text-2xl font-bold text-white">2</span>
            <span className="text-[11px] text-amber-400 block mt-1">En proceso de revisión</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <FileCheck2 className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-sky-500/15 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Registro de Entrada</span>
            <span className="text-2xl font-bold text-white">09:02 AM</span>
            <span className="text-[11px] text-emerald-400 block mt-1">Checada a tiempo</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
            <Clock className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-sky-500/15 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Comunicados</span>
            <span className="text-2xl font-bold text-white">3</span>
            <span className="text-[11px] text-cyan-400 block mt-1">Nuevos esta semana</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
            <Megaphone className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};
