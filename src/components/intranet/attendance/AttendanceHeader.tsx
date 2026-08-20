import React from "react";
import { Clock } from "lucide-react";

export const AttendanceHeader = () => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
        <Clock className="w-7 h-7 text-cyan-400" aria-hidden="true" />
        <span>Control de Asistencias & Checadas</span>
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 mt-1">
        Registro diario de jornada laboral, checadas biométricas e historial mensual de puntualidad.
      </p>
    </div>
  );
};
