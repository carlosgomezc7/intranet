"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Clock } from "lucide-react";

interface Props {
  announcementId: string;
  isUrgent: boolean;
  initialConfirmed?: boolean;
  confirmationCount?: number;
}

export const ReadReceiptButton: React.FC<Props> = ({
  isUrgent,
  initialConfirmed = false,
  confirmationCount = 142,
}) => {
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  const [count, setCount] = useState(confirmationCount);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (confirmed) return;
    setLoading(true);
    setTimeout(() => {
      setConfirmed(true);
      setCount((prev) => prev + 1);
      setLoading(false);
    }, 400);
  };

  if (!isUrgent) return null;

  return (
    <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
        <div>
          <span className="text-xs font-bold text-amber-200 block">
            Comunicado Estratégico — Confirmación Obligatoria (*Acuse de Recibo*)
          </span>
          <span className="text-[11px] text-slate-300">
            {count} de 200 colaboradores han confirmado lectura.
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={confirmed || loading}
        onClick={handleConfirm}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
          confirmed
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
            : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95"
        }`}
      >
        {confirmed ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Confirmado de Enterado</span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>{loading ? "Registrando..." : "Confirmar de Enterado"}</span>
          </>
        )}
      </button>
    </div>
  );
};
