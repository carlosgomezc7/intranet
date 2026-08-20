"use client";

import React from "react";
import { TrendingUp, Users, Activity, Search, RefreshCw, Clock } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

export const GovernanceKPIs: React.FC = () => {
  return (
    <section aria-labelledby="governance-heading" className="glass-card-elevated p-6 sm:p-8 rounded-3xl border border-sky-500/20 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-500/10">
        <div>
          <h2 id="governance-heading" className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            <span>Métricas de Gobernanza, Adopción & Salud (Escala 200 Empleados)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Seguimiento de adopción sociotécnica y efectividad comunicacional contra benchmarks de industria.
          </p>
        </div>

        <Badge variant="success" size="sm">
          <span>Comité Directivo Activo</span>
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* WAU */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Usuarios Semanales (WAU)</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">82%</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>Meta: &ge; 75% (164/200)</span>
          </div>
        </div>

        {/* Stickiness DAU/MAU */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Adherencia (DAU/MAU)</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">67%</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>Meta: &ge; 60%</span>
          </div>
        </div>

        {/* Search Effectiveness */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Efectividad Búsqueda</span>
            <Search className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">91%</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>Meta: &ge; 85% click</span>
          </div>
        </div>

        {/* Document Freshness */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Frescura Docs (90d)</span>
            <RefreshCw className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">88%</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>Meta: &ge; 70%</span>
          </div>
        </div>

        {/* Onboarding SLA */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/10 space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Activación Onboarding</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">24h</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>SLA: &lt; 48 hrs</span>
          </div>
        </div>
      </div>
    </section>
  );
};
