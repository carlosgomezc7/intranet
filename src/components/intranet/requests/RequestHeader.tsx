import React from "react";
import { FileCheck2, Plus } from "lucide-react";

interface Props {
  onNewRequest: () => void;
}

export const RequestHeader: React.FC<Props> = ({ onNewRequest }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <FileCheck2 className="w-7 h-7 text-cyan-400" aria-hidden="true" />
          <span>Solicitudes & Flujos de Aprobación</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Gestiona tus solicitudes de vacaciones, permisos y gastos con seguimiento multi-nivel paso a paso.
        </p>
      </div>

      <button
        type="button"
        onClick={onNewRequest}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-lg shadow-sky-600/25 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        <span>Nueva Solicitud</span>
      </button>
    </div>
  );
};
