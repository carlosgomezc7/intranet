"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Shield, Menu, X, ArrowRight } from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-sky-500/15 py-3.5 shadow-2xl shadow-black/40"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-xl p-1"
          aria-label={`${siteConfig.name} Inicio`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
              {siteConfig.name}
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-sky-400 font-semibold">
              Intranet B2B
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300"
          aria-label="Navegación principal"
        >
          <a
            href="#servicios"
            className="hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-400"
          >
            Servicios
          </a>
          <a
            href="#empresa"
            className="hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-400"
          >
            Nosotros
          </a>
          <a
            href="#contacto"
            className="hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-400"
          >
            Contacto
          </a>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-lg shadow-sky-600/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <span>Acceder a Intranet</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/60 border border-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden glass-panel border-t border-sky-500/20 mt-3 px-6 py-6 space-y-4 animate-slide-up"
        >
          <nav className="flex flex-col space-y-3" aria-label="Menú móvil">
            <a
              href="#servicios"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 hover:text-cyan-400 py-1"
            >
              Servicios
            </a>
            <a
              href="#empresa"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 hover:text-cyan-400 py-1"
            >
              Nosotros
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 hover:text-cyan-400 py-1"
            >
              Contacto
            </a>
          </nav>
          <div className="pt-4 border-t border-slate-800">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 shadow-lg shadow-sky-600/30"
            >
              <span>Acceder a Intranet</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
