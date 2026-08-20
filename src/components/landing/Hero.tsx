import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { ArrowRight, ShieldCheck, Zap, Users, Lock } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Ambient Orbs */}
      <div
        className="orb orb-primary w-[500px] h-[500px] -top-24 -left-20"
        aria-hidden="true"
      />
      <div
        className="orb orb-accent w-[400px] h-[400px] top-1/2 -right-20"
        aria-hidden="true"
      />
      <div
        className="orb orb-primary w-[300px] h-[300px] -bottom-10 left-1/3"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-md shadow-lg shadow-sky-500/5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <span>Plataforma Empresarial Segura para 200+ Empleados</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          El espacio digital que{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-200">
            eleva
          </span>{" "}
          tu productividad.
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          {siteConfig.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-500 hover:from-sky-500 hover:to-cyan-400 shadow-xl shadow-sky-600/30 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <span>Iniciar Sesión en Intranet</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <a
            href="#servicios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-sky-500/25 hover:border-sky-400/50 backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <span>Explorar Módulos</span>
          </a>
        </div>

        {/* Key Metrics / Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-panel p-5 rounded-2xl border border-sky-500/15">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400">
                <Zap className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-white">99.9%</span>
            </div>
            <p className="text-xs text-slate-400">Disponibilidad de plataforma en tiempo real</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-sky-500/15">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400">
                <Users className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-white">200+</span>
            </div>
            <p className="text-xs text-slate-400">Colaboradores con roles segmentados</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-sky-500/15">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                <Lock className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-white">Zero-Trust</span>
            </div>
            <p className="text-xs text-slate-400">Seguridad estricta con RLS multi-tenant</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-sky-500/15">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-white">24/7</span>
            </div>
            <p className="text-xs text-slate-400">Acceso cifrado y seguro en la nube</p>
          </div>
        </div>
      </div>
    </section>
  );
};
