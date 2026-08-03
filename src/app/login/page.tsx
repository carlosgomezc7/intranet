"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login, signup } from "./actions";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config";

function LoginForm() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");
  const successMessage = searchParams.get("message");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signup(formData);
      } else {
        await login(formData);
      }
    } catch {
      // Redirect will throw, which is expected
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Hero */}
      <div className="login-hero hidden lg:flex lg:w-[58%] flex-col justify-between p-12 relative">
        {/* Floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Top: Logo & Back Link */}
        <div className="relative z-10 animate-in flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="logo-icon w-10 h-10 rounded-xl flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-white/90 font-semibold text-lg tracking-tight">
              {siteConfig.name}
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-medium text-blue-200/80 hover:text-white border border-blue-400/20 bg-blue-500/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm transition-all flex items-center gap-1.5"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Volver al Sitio Web
          </Link>
        </div>

        {/* Center: Tagline */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight animate-in-delay-1">
            Tu Intranet
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Inteligente
            </span>
          </h1>
          <p className="mt-5 text-blue-200/60 text-lg leading-relaxed animate-in-delay-2">
            Accede a la base de conocimiento de {siteConfig.name} con búsqueda profunda
            impulsada por IA. Todo tu contexto corporativo, al alcance de una
            conversación.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap gap-3 animate-in-delay-3">
            {["Deep Search IA", "RBAC Seguro", "SSO Integrado"].map(
              (feature) => (
                <span
                  key={feature}
                  className="px-4 py-2 rounded-full text-sm font-medium text-blue-200/80 border border-blue-400/20 bg-blue-500/10 backdrop-blur-sm"
                >
                  {feature}
                </span>
              )
            )}
          </div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 animate-in-delay-4">
          <p className="text-blue-300/30 text-sm">
            © {new Date().getFullYear()} {siteConfig.name} — Intranets Empresariales B2B
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-6 sm:p-10 bg-[#080e1a]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 animate-in">
            <div className="logo-icon w-9 h-9 rounded-lg flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-white/90 font-semibold text-base tracking-tight">
              {siteConfig.name}
            </span>
          </div>

          {/* Header */}
          <div className="mb-8 animate-in">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isSignUp ? "Crear Cuenta" : "Bienvenido de vuelta"}
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              {isSignUp
                ? "Registra tu cuenta corporativa para acceder a la Intranet"
                : "Ingresa tus credenciales para acceder a la Intranet"}
            </p>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="error-alert rounded-lg px-4 py-3 mb-6 text-sm flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorMessage}
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="success-alert rounded-lg px-4 py-3 mb-6 text-sm flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form action={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2 animate-in-delay-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-300"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  required
                  autoComplete="email"
                  className="login-input w-full pl-11 pr-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 animate-in-delay-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-300"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                      ry="2"
                    />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  minLength={6}
                  className="login-input w-full pl-11 pr-12 py-3 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password link (only on login) */}
            {!isSignUp && (
              <div className="flex justify-end animate-in-delay-3">
                <button
                  type="button"
                  className="text-xs text-blue-400/70 hover:text-blue-300 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Submit button */}
            <div className="animate-in-delay-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary-gradient w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner" />
                    {isSignUp ? "Creando cuenta..." : "Ingresando..."}
                  </>
                ) : isSignUp ? (
                  "Crear Cuenta"
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="animate-in-delay-4">
              <div className="divider-text my-6">
                <span>
                  {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
                </span>
              </div>
            </div>

            {/* Toggle sign up / login */}
            <div className="animate-in-delay-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full py-3 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all"
              >
                {isSignUp
                  ? "Iniciar Sesión en su lugar"
                  : "Crear una Cuenta Nueva"}
              </button>
            </div>
          </form>

          {/* Footer (mobile) */}
          <p className="mt-10 text-center text-slate-500/40 text-xs lg:hidden">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080e1a] flex items-center justify-center">
          <div className="loading-spinner" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
