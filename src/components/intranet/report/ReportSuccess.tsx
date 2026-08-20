import React from "react";
import { CheckCircle2 } from "lucide-react";

interface Props {
  onReset: () => void;
}

export const ReportSuccess: React.FC<Props> = ({ onReset }) => {
  return (
    <div className="py-12 text-center" role="alert" aria-live="polite">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        ¡Reporte Registrado Exitosamente!
      </h2>
      <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
        Gracias por ayudarnos a mejorar. Nuestro equipo de soporte y sistemas ha recibido tu propuesta y la atenderá en breve.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus:outline-none"
      >
        Enviar otro reporte
      </button>
    </div>
  );
};
