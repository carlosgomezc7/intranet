import React from "react";
import { LifeBuoy, Sparkles } from "lucide-react";

export const ReportHeader = () => {
  return (
    <div>
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Atención Continua</span>
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
        <LifeBuoy className="w-8 h-8 text-cyan-400" aria-hidden="true" />
        <span>Proponer Mejora o Reportar Fallo</span>
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
        Tu retroalimentación nos ayuda a perfeccionar la intranet de Elevate. Completa los datos a continuación y agrega capturas o archivos si es necesario.
      </p>
    </div>
  );
};
