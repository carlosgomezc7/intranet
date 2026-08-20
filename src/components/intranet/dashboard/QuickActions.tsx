import React from "react";
import Link from "next/link";
import { MessageSquare, Receipt, Clock, Users } from "lucide-react";

export const QuickActions = () => {
  return (
    <section aria-labelledby="quick-access-heading" className="glass-panel p-6 rounded-3xl border border-sky-500/15">
      <h2 id="quick-access-heading" className="text-base font-bold text-white mb-4">
        Accesos Rápidos
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/chat"
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-sky-500/15 hover:border-sky-400/40 flex flex-col items-center text-center transition-all group hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 mb-2 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-slate-200">Chat</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Canales & DMs</span>
        </Link>

        <Link
          href="/payroll"
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-sky-500/15 hover:border-sky-400/40 flex flex-col items-center text-center transition-all group hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-emerald-400 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
            <Receipt className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-slate-200">Mi Nómina</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Recibos CFDI</span>
        </Link>

        <Link
          href="/attendance"
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-sky-500/15 hover:border-sky-400/40 flex flex-col items-center text-center transition-all group hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-slate-200">Asistencias</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Checadas</span>
        </Link>

        <Link
          href="/directory"
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-sky-500/15 hover:border-sky-400/40 flex flex-col items-center text-center transition-all group hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-slate-200">Directorio</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Equipo</span>
        </Link>
      </div>
    </section>
  );
};
