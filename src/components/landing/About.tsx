import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { ArrowRight, UserCheck, Layers, Cpu, Sparkles } from "lucide-react";

export const About: React.FC = () => {
  return (
    <section id="empresa" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 lg:p-16 border border-sky-500/20 relative overflow-hidden">
          {/* Ambient glow inside card */}
          <div
            className="orb orb-primary w-96 h-96 -top-20 -right-20 opacity-30"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sobre {siteConfig.name}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                Infraestructura corporativa con arquitectura Zero-Trust
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                {siteConfig.name} está construida desde sus cimientos para empresas que requieren alta disponibilidad, estricto aislamiento de datos entre departamentos y una experiencia de usuario fluida sin fricción.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
                    <UserCheck className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Segmentación RBAC Multi-Rol</h4>
                    <p className="text-xs sm:text-sm text-slate-400">Control granular de accesos para directores, gerentes, líderes de equipo y colaboradores.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Layers className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Organizaciones y Equipos Transversales</h4>
                    <p className="text-xs sm:text-sm text-slate-400">Estructura jerárquica por departamentos complementada con equipos dinámicos por proyecto.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Cpu className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Integración con Sistemas Externos</h4>
                    <p className="text-xs sm:text-sm text-slate-400">Compatibilidad con CONTPAQi, NOI y terminales biométricas para nóminas y asistencias.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Box */}
            <div className="glass-card-elevated p-8 rounded-3xl border border-sky-500/25 relative text-center lg:text-left">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
                ¿Eres colaborador de Elevate?
              </span>
              <h3 className="text-2xl font-bold text-white mb-4">
                Ingresa con tus credenciales corporativas
              </h3>
              <p className="text-sm text-slate-300 mb-8">
                Accede a tu panel personal, consulta tus recibos, chatea con tu equipo y gestiona tus permisos en segundos.
              </p>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-xl shadow-sky-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Acceder a mi espacio</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
