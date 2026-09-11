"use client";

import React, { useState } from "react";
import { Lock, User, Building, ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import { loginAction, signupAction } from "@/app/(auth)/login/actions";
import { DEFAULT_CREDENTIALS } from "@/lib/defaults";

interface Props {
  isSignUp: boolean;
}

export const LoginForm: React.FC<Props> = ({ isSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={isSignUp ? signupAction : loginAction} className="space-y-4">
      {isSignUp && (
        <>
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nombre Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" aria-hidden="true" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required={isSignUp}
                defaultValue="Administrador"
                placeholder="Nombre y Apellidos"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="orgName" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nombre de tu Empresa *
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" aria-hidden="true" />
              <input
                id="orgName"
                name="orgName"
                type="text"
                required={isSignUp}
                defaultValue="Elevate Solutions"
                placeholder="Ej. Mi Empresa S.A."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signupEmail" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Correo Electrónico Corporativo
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" aria-hidden="true" />
              <input
                id="signupEmail"
                name="email"
                type="email"
                placeholder="tu.correo@empresa.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label htmlFor="username" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Nombre de Usuario *
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" aria-hidden="true" />
          <input
            id="username"
            name="username"
            type="text"
            required
            autoCapitalize="none"
            autoCorrect="off"
            defaultValue={DEFAULT_CREDENTIALS.username}
            placeholder="usuario o admin"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Contraseña *
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" aria-hidden="true" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            defaultValue={DEFAULT_CREDENTIALS.password}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-500 hover:from-sky-500 hover:to-cyan-400 shadow-xl shadow-sky-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
      >
        <span>{isSignUp ? "Crear Cuenta & Organización" : "Iniciar Sesión"}</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </form>
  );
};
