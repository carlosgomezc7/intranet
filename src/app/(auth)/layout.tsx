import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="orb orb-primary w-[500px] h-[500px] -top-20 -left-20" aria-hidden="true" />
      <div className="orb orb-accent w-[400px] h-[400px] -bottom-20 -right-20" aria-hidden="true" />

      {/* Brand Header */}
      <div className="relative z-10 text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-2xl p-2"
          aria-label={`${siteConfig.name} Inicio`}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-sky-400 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
              {siteConfig.name}
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-cyan-400 font-semibold">
              Espacio Corporativo Seguro
            </span>
          </div>
        </Link>
      </div>

      {/* Centered Auth Card Container */}
      <main id="main-content" tabIndex={-1} className="relative z-10 w-full max-w-md focus:outline-none">
        {children}
      </main>

      {/* Footer info */}
      <div className="relative z-10 mt-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {siteConfig.legalName}. Todos los derechos reservados.
      </div>
    </div>
  );
}
