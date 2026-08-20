"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { usePermissions } from "@/hooks/usePermissions";
import { Badge } from "@/components/shared/Badge";
import { USER_ROLES } from "@/lib/constants";
import { Sparkles, ShieldCheck, PlusCircle } from "lucide-react";

export const WelcomeBanner = () => {
  const { profile } = useUser();
  const { role } = usePermissions();

  const userName = profile?.full_name || "Colaborador";
  const roleInfo = USER_ROLES[role] || USER_ROLES.employee;
  const todayFormatted = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <section
      aria-labelledby="dashboard-welcome-heading"
      className="glass-card-elevated rounded-3xl p-6 sm:p-8 border border-sky-500/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span className="capitalize">{todayFormatted}</span>
        </div>
        <h1
          id="dashboard-welcome-heading"
          className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2"
        >
          Hola, {userName} 👋
        </h1>
        <p className="text-sm text-slate-300 max-w-xl">
          Bienvenido a tu portal corporativo de Elevate. Aquí tienes el resumen del día y accesos directos a tus herramientas.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3">
        <Badge variant="info" size="md">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{roleInfo.label}</span>
        </Badge>
        <Link
          href="/requests"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-md shadow-sky-600/20 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          <span>Nueva Solicitud</span>
        </Link>
      </div>
    </section>
  );
};
