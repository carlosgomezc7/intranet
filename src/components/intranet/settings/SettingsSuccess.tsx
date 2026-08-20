import React from "react";
import { CheckCircle2 } from "lucide-react";

export const SettingsSuccess = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-slide-up"
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
      <span>Tus cambios han sido guardados exitosamente.</span>
    </div>
  );
};
