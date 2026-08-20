"use client";

import React from "react";
import { ShieldCheck, RefreshCw, AlertCircle, FileText } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

export const KnowledgeGovernanceBanner: React.FC = () => {
  return (
    <section
      aria-label="Gobernanza de Conocimiento"
      className="glass-card-elevated p-6 rounded-3xl border border-sky-500/20 bg-gradient-to-r from-slate-950 via-sky-950/40 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-sky-600/30 shrink-0">
          <ShieldCheck className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Gobernanza y Ciclo de Vida Documental</span>
            <Badge variant="info" size="sm">Norma 90 Días</Badge>
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Los procedimientos operativos estándar (SOPs) y políticas corporativas cuentan con propietarios designados y revisiones obligatorias cada 90 días para evitar obsolescencia operativa en la organización.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs shrink-0">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-sky-500/15 text-emerald-300">
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span><strong>88%</strong> Frescura Documental</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-sky-500/15 text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span><strong>2</strong> Docs por Revisar</span>
        </div>
      </div>
    </section>
  );
};
