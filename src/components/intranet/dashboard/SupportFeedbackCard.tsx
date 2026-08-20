import React from "react";
import Link from "next/link";

export const SupportFeedbackCard = () => {
  return (
    <section aria-labelledby="support-box-heading" className="glass-panel p-6 rounded-3xl border border-sky-500/15">
      <h2 id="support-box-heading" className="text-sm font-bold text-white mb-2">
        ¿Detectaste un fallo o tienes una mejora?
      </h2>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Tu opinión nos ayuda a optimizar Elevate. Envía tu reporte con capturas directamente al equipo de TI.
      </p>
      <Link
        href="/report"
        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-xs font-semibold text-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-none"
      >
        <span>Enviar reporte / sugerencia</span>
      </Link>
    </section>
  );
};
