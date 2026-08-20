import React from "react";
import { MapPin } from "lucide-react";

interface Props {
  currentTime: string;
  isCheckedIn: boolean;
  checkInTime: string;
  onToggleCheck: () => void;
}

export const LiveClockWidget: React.FC<Props> = ({
  currentTime, isCheckedIn, checkInTime, onToggleCheck
}) => {
  return (
    <div className="lg:col-span-2 glass-card-elevated p-6 sm:p-8 rounded-3xl border border-sky-500/25 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="text-center sm:text-left space-y-2">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block">
          Hora Local Actual (CDMX)
        </span>
        <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
          {currentTime || "09:00:00 AM"}
        </div>
        <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
          <MapPin className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
          <span>Ubicación: Oficina Central / Conexión Segura</span>
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onToggleCheck}
          className={`w-44 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
            isCheckedIn
              ? "bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-rose-600/25"
              : "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-600/25"
          }`}
        >
          {isCheckedIn ? "Registrar Salida" : "Registrar Entrada"}
        </button>
        <span className="text-[11px] text-slate-400">
          {isCheckedIn ? `Entrada registrada a las ${checkInTime}` : "No has registrado entrada hoy"}
        </span>
      </div>
    </div>
  );
};
