import React from "react";
import Link from "next/link";
import { ArrowUpRight, FileCheck2, Receipt, Megaphone } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

export const RecentActivity = () => {
  return (
    <section aria-labelledby="activity-heading" className="glass-panel p-6 rounded-3xl border border-sky-500/15">
      <div className="flex items-center justify-between mb-4">
        <h2 id="activity-heading" className="text-base font-bold text-white">
          Actividad Reciente
        </h2>
        <Link 
          href="/requests" 
          className="text-xs text-cyan-400 hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none rounded-md px-1"
        >
          <span>Ver historial</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="space-y-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-sky-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 shrink-0">
              <FileCheck2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Solicitud de Permiso Personal</span>
              <span className="text-[11px] text-slate-400">Enviada hace 2 horas • Aprobación 1 de 2</span>
            </div>
          </div>
          <Badge variant="warning">En Revisión</Badge>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-sky-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
              <Receipt className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Recibo de Nómina Quincenal</span>
              <span className="text-[11px] text-slate-400">Disponible para descarga • Quincena 15</span>
            </div>
          </div>
          <Badge variant="success">Disponible</Badge>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-sky-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 shrink-0">
              <Megaphone className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Nuevo Comunicado General</span>
              <span className="text-[11px] text-slate-400">Actualización de políticas internas de seguridad</span>
            </div>
          </div>
          <Badge variant="info">Anuncio</Badge>
        </div>
      </div>
    </section>
  );
};
