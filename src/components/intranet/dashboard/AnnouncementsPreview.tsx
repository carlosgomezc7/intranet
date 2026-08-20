import React from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";

export const AnnouncementsPreview = () => {
  return (
    <section aria-labelledby="announcements-preview-heading" className="glass-card-elevated p-6 rounded-3xl border border-sky-500/20">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="w-4 h-4 text-cyan-400" aria-hidden="true" />
        <h2 id="announcements-preview-heading" className="text-base font-bold text-white">
          Comunicado Destacado
        </h2>
      </div>
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-sky-500/20 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1 block">
          Recursos Humanos
        </span>
        <h3 className="text-sm font-bold text-white mb-2">
          Actualización de Protocolos de Seguridad y Accesos
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          A partir de esta semana, todos los accesos a la intranet cuentan con autenticación reforzada y verificación de sesiones.
        </p>
      </div>
      <Link
        href="/announcements"
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
      >
        <span>Ver todos los comunicados</span>
      </Link>
    </section>
  );
};
