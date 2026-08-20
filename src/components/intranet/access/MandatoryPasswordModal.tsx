"use client";

import React, { useState } from "react";
import { Lock, ShieldAlert, KeyRound, ArrowRight } from "lucide-react";
import { updateMandatoryPasswordAction } from "@/app/(intranet)/settings/access/actions";

interface Props {
  isOpen: boolean;
}

export const MandatoryPasswordModal: React.FC<Props> = ({ isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="glass-card-elevated w-full max-w-md p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Actualización de Contraseña Obligatoria</h2>
          <p className="text-xs text-slate-300">
            Has iniciado sesión con credenciales por defecto. Por seguridad institucional, debes establecer una nueva contraseña antes de continuar.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form
          action={async (formData) => {
            setLoading(true);
            setError(null);
            const res = await updateMandatoryPasswordAction(formData);
            if (!res.success) {
              setError(res.error || "Error al actualizar contraseña.");
            }
            setLoading(false);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nueva Contraseña (mínimo 8 caracteres) *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" />
              <input
                id="new-password"
                name="newPassword"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-sky-500/20 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Confirmar Nueva Contraseña *
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" />
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-sky-500/20 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber-600/30 disabled:opacity-50"
          >
            <span>{loading ? "Actualizando..." : "Actualizar Contraseña y Acceder"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
