import React from "react";

interface Props {
  isSignUp: boolean;
}

export const LoginHeader: React.FC<Props> = ({ isSignUp }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-medium text-cyan-300 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        Modo Demo Local (Fase Alpha)
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
        {isSignUp ? "Crear Nueva Organización" : "Bienvenido de Vuelta"}
      </h1>
      <p className="text-xs sm:text-sm text-slate-400">
        {isSignUp
          ? "Configura tu espacio de trabajo empresarial en Elevate"
          : "Ingresa con tus credenciales para acceder a tu intranet"}
      </p>
    </div>
  );
};
