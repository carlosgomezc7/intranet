"use client";

import React from "react";
import { Compass, CheckCircle2, UserCheck, Cake, PartyPopper } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

export const OnboardingMilestoneCard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Onboarding Journey Progress */}
      <div className="glass-card-elevated p-6 rounded-3xl border border-sky-500/15 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Itinerario de Inducción (Onboarding)</span>
          </h3>
          <Badge variant="success" size="sm">
            <span>Día 12 de 30</span>
          </Badge>
        </div>

        <p className="text-xs text-slate-300">
          Tu mentor asignado es <strong>Alejandro Morales (RH)</strong>. Completa tus hitos para acelerar tu integración.
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="line-through text-slate-400">Lectura de políticas de seguridad y firma LFPDPPP</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="line-through text-slate-400">Configuración de autenticación Zero-Trust</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 shrink-0" />
            <span>Reunión 1:1 con mentor y presentación con equipo (Día 14)</span>
          </div>
        </div>
      </div>

      {/* Corporate Milestones & Anniversaries */}
      <div className="glass-panel p-6 rounded-3xl border border-sky-500/15 space-y-3 bg-gradient-to-br from-slate-900/60 to-purple-950/20">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
          <PartyPopper className="w-4 h-4 text-purple-400" />
          <span>Hitos y Aniversarios de Servicio</span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">¡3 Años en Elevate!</h4>
            <p className="text-[11px] text-slate-300">
              Felicitamos a <strong>Mariana Silva</strong> por su 3er aniversario liderando Operaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
