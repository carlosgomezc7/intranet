"use client";

import React, { use } from "react";
import Link from "next/link";
import { Badge } from "@/components/shared/Badge";

import {
  ArrowLeft,
  Calendar,
  User,
  ShieldCheck,
  Building,
  Check,
  X,
} from "lucide-react";

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const resolvedParams = use(params);
  const requestId = resolvedParams.requestId;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Back Link */}
      <Link
        href="/requests"
        className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Volver a Solicitudes</span>
      </Link>

      {/* Request Header Card */}
      <div className="glass-card-elevated p-6 sm:p-8 rounded-3xl border border-sky-500/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="info">Vacaciones</Badge>
            <Badge variant="warning">En Revisión (Paso 2 de 2)</Badge>
          </div>
          <span className="text-xs text-slate-400">ID: {requestId}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Solicitud de Vacaciones de Verano (5 días hábiles)
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed">
          Solicito autorización para ausentarme por período vacacional del 20 al 26 de Julio de 2026. Los pendientes de despliegue en AWS y soporte de infraestructura quedan cubiertos y delegados a Diego Hernández.
        </p>

        <div className="pt-4 border-t border-sky-500/10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Solicitante: <strong className="text-slate-200">Administrador</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Área: <strong className="text-slate-200">Tecnología & DevOps</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Fecha de Creación: <strong className="text-slate-200">14 Ago 2026</strong></span>
          </div>
        </div>
      </div>

      {/* Approval Timeline Component */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/15 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" aria-hidden="true" />
          <span>Cadena de Aprobación Multi-Nivel</span>
        </h2>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-500/20">
          {/* Step 1 */}
          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center text-white" />
            <div className="glass-card-elevated p-4 rounded-2xl border border-emerald-500/30 flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-white">
                  Paso 1: Aprobación de Gerencia Directa
                </h3>
                <Badge variant="success" size="sm">Aprobado</Badge>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                Aprobado por <strong className="text-white">Mariana Silva</strong> (Directora de Operaciones)
              </p>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 italic">
                &ldquo;Aprobado. Las actividades y guardias de infraestructura quedan debidamente cubiertas.&rdquo;
              </div>
              <span className="text-[10px] text-slate-500 block mt-2">14 Ago 2026 • 15:30 hrs</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 w-5 h-5 rounded-full bg-amber-400 border-4 border-slate-950 flex items-center justify-center text-slate-950 animate-pulse" />
            <div className="glass-card-elevated p-4 rounded-2xl border border-amber-400/40 flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-white">
                  Paso 2: Validación de Recursos Humanos
                </h3>
                <Badge variant="warning" size="sm">En Revisión</Badge>
              </div>
              <p className="text-xs text-slate-300">
                Asignado a <strong className="text-white">Alejandro Morales</strong> (Gerente de RH)
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Validando saldo disponible de días de vacaciones según LFT y antigüedad.
              </p>
            </div>
          </div>
        </div>

        {/* Manager Action Bar (Demo) */}
        <div className="pt-6 border-t border-sky-500/10 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            ¿Eres el aprobador designado para este paso?
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span>Rechazar</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Aprobar Solicitud</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
