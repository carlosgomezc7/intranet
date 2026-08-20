import React from "react";

interface Props {
  isSignUp: boolean;
  onToggle: () => void;
}

export const LoginToggle: React.FC<Props> = ({ isSignUp, onToggle }) => {
  return (
    <div className="mt-6 pt-6 border-t border-sky-500/15 text-center">
      <button
        type="button"
        onClick={onToggle}
        className="text-xs text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
      >
        {isSignUp
          ? "¿Ya tienes una cuenta registrada? Inicia sesión aquí"
          : "¿Primera vez administrando tu empresa? Regístrate aquí"}
      </button>
    </div>
  );
};
