import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { RequestItem, statusConfig } from "./data";

interface Props {
  requests: RequestItem[];
  onNewRequest: () => void;
}

export const RequestList: React.FC<Props> = ({ requests, onNewRequest }) => {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon="FileCheck2"
        title="No hay solicitudes registradas"
        description="No se encontraron solicitudes con los filtros aplicados. Puedes crear una nueva solicitud en cualquier momento."
        actionLabel="Crear Solicitud"
        onAction={onNewRequest}
      />
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => {
        const formattedDate = new Intl.DateTimeFormat("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(req.created_at));

        const cfg = statusConfig[req.status] || statusConfig.pending;

        return (
          <div
            key={req.id}
            className="glass-card-elevated p-5 sm:p-6 rounded-3xl border border-sky-500/15 hover:border-sky-400/30 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  {req.type}
                </span>
                <span className="text-slate-600">•</span>
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{formattedDate}</span>
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white">
                {req.title}
              </h2>

              <p className="text-xs text-slate-400">
                Solicitado por <strong className="text-slate-200">{req.requester}</strong> ({req.department})
              </p>

              {/* Step Progress Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Paso {req.current_step} de {req.total_steps}</span>
                  <span className="text-cyan-400 font-semibold">
                    {Math.round((req.current_step / req.total_steps) * 100)}% completado
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${(req.current_step / req.total_steps) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
              <Link
                href={`/requests/${req.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-cyan-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>Ver Línea de Tiempo</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
