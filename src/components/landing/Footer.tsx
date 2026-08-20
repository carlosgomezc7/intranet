import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Shield } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-sky-500/15 bg-slate-950/80 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <Shield className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-wide">
              {siteConfig.name}
            </span>
            <span className="text-xs text-slate-400 block">
              {siteConfig.legalName}
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400" aria-label="Enlaces de pie de página">
          <a href="#servicios" className="hover:text-cyan-400 transition-colors">
            Servicios
          </a>
          <a href="#empresa" className="hover:text-cyan-400 transition-colors">
            Nosotros
          </a>
          <a href="#contacto" className="hover:text-cyan-400 transition-colors">
            Contacto
          </a>
          <Link href="/login" className="hover:text-cyan-400 transition-colors">
            Acceso Intranet
          </Link>
          <Link href="/report" className="hover:text-cyan-400 transition-colors">
            Reportar un problema
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-slate-500">
          © {currentYear} {siteConfig.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
