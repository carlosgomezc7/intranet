import React from "react";
import Link from "next/link";
import { User, ShieldCheck } from "lucide-react";

export const SettingsHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <User className="w-7 h-7 text-cyan-400" aria-hidden="true" />
          <span>Configuración de Perfil</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Administra tu información de contacto, rol asignado y preferencias de la plataforma.
        </p>
      </div>

      <Link
        href="/settings/access"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600/20 to-cyan-500/20 hover:from-sky-600/30 hover:to-cyan-500/30 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-all hover:scale-105"
      >
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>Control de Acceso (RBAC)</span>
      </Link>
    </div>
  );
};
