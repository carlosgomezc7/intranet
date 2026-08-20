import React from "react";
import { Receipt } from "lucide-react";

export const PayrollHeader = () => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
        <Receipt className="w-7 h-7 text-cyan-400" aria-hidden="true" />
        <span>Recibos de Nómina & Compensaciones</span>
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 mt-1">
        Consulta y descarga confidencial de tus recibos de nómina CFDI timbrados en PDF y XML.
      </p>
    </div>
  );
};
