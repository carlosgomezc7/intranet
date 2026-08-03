"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: siteConfig.services[0].id,
    message: "",
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        email: "",
        service: siteConfig.services[0].id,
        message: "",
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#080e1a] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080e1a]/80 border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="logo-icon w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
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
              <span className="text-white font-bold text-xl tracking-tight">
                {siteConfig.name}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#inicio"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Inicio
              </a>
              <a
                href="#servicios"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Servicios
              </a>
              <a
                href="#nosotros"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Nosotros
              </a>
              <a
                href="#contacto"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Contacto
              </a>
            </nav>

            {/* CTA Button: Access Intranet */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="btn-primary-gradient px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Acceder a Intranet
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#080e1a]/95 border-b border-white/10 px-4 pt-2 pb-6 space-y-4">
            <a
              href="#inicio"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-200 hover:text-blue-400 py-2"
            >
              Inicio
            </a>
            <a
              href="#servicios"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-200 hover:text-blue-400 py-2"
            >
              Servicios
            </a>
            <a
              href="#nosotros"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-200 hover:text-blue-400 py-2"
            >
              Nosotros
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-200 hover:text-blue-400 py-2"
            >
              Contacto
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary-gradient w-full py-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2 mt-4"
            >
              Acceder a Intranet
            </Link>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section
        id="inicio"
        className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-in backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          {siteConfig.shortName} — Innovación Corporativa
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight max-w-4xl animate-in-delay-1">
          Soluciones Tecnológicas e{" "}
          <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Intranet Inteligente
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed animate-in-delay-2">
          {siteConfig.description}
        </p>

        {/* Hero Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-in-delay-3 w-full sm:w-auto">
          <a
            href="#servicios"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10 transition-all text-center"
          >
            Explorar Servicios
          </a>
          <Link
            href="/login"
            className="w-full sm:w-auto btn-primary-gradient px-8 py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30"
          >
            Acceder a la Intranet
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* Metric cards grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl animate-in-delay-4">
          <div className="glass-card p-6 rounded-2xl text-center border border-white/10">
            <p className="text-3xl font-extrabold text-blue-400">99.9%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Disponibilidad Cloud</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center border border-white/10">
            <p className="text-3xl font-extrabold text-blue-400">Deep Search</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Búsqueda IA Avanzada</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center border border-white/10">
            <p className="text-3xl font-extrabold text-blue-400">ISO/IEC</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Seguridad Estándar</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center border border-white/10">
            <p className="text-3xl font-extrabold text-blue-400">24/7</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Soporte Especializado</p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="servicios" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Nuestro Portafolio
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Servicios Diseñados para Potenciar tu Empresa
          </h3>
          <p className="mt-4 text-slate-400 text-lg">
            Soluciones integrales de tecnología que combinan seguridad, velocidad y la última tecnología en inteligencia artificial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {siteConfig.services.map((service) => (
            <div
              key={service.id}
              className="glass-card rounded-2xl p-8 border border-white/10 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/30 border border-blue-400/30 flex items-center justify-center mb-6 text-blue-300 group-hover:scale-110 transition-transform">
                  {service.id === "intranet" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                  {service.id === "software" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  )}
                  {service.id === "cloud" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  )}
                </div>

                <h4 className="text-xl font-bold text-white mb-3">{service.title}</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{service.description}</p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#contacto"
                className="w-full py-3 rounded-xl bg-white/[0.04] hover:bg-blue-600/20 hover:text-blue-300 text-slate-200 text-xs font-semibold text-center border border-white/10 transition-colors block"
              >
                Solicitar Cotización
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US / INTRANET INTEGRATION BANNER */}
      <section id="nosotros" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-blue-500/20 relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-[#080e1a] to-blue-900/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-300 bg-blue-500/20 border border-blue-400/30">
                Plataforma Unificada
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 leading-tight">
                ¿Ya eres cliente de {siteConfig.shortName}?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                Accede a tu Intranet Corporativa para gestionar expedientes, realizar búsquedas de conocimiento con IA, y colaborar con tu equipo en un entorno seguro de alta privacidad.
              </p>
              <Link
                href="/login"
                className="btn-primary-gradient px-7 py-3.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                Iniciar Sesión en la Intranet
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

            <div className="space-y-4">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Control de Accesos RBAC</h4>
                  <p className="text-slate-400 text-xs mt-1">Permisos diferenciados por rol corporativo y departamentos.</p>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Búsqueda Profunda (Deep Search IA)</h4>
                  <p className="text-slate-400 text-xs mt-1">Encuentra documentos y procesos internos al instante.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contacto" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Contact info */}
          <div>
            <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
              Ponte en Contacto
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
              Hablemos de tu Próximo Proyecto Tecnológico
            </h3>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              ¿Quieres implementar una Intranet Corporativa o requieres desarrollo a la medida para {siteConfig.name}? Escríbenos y un especialista se pondrá en contacto contigo.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-300 text-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span>{siteConfig.contactEmail}</span>
              </div>

              <div className="flex items-center gap-4 text-slate-300 text-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span>{siteConfig.contactPhone}</span>
              </div>

              <div className="flex items-center gap-4 text-slate-300 text-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span>{siteConfig.address}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            {formSubmitted ? (
              <div className="text-center py-12 success-alert rounded-xl p-6">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <h4 className="text-xl font-bold text-white mb-2">¡Mensaje Enviado Con Éxito!</h4>
                <p className="text-slate-300 text-sm">
                  Gracias por comunicarte con {siteConfig.name}. Nos pondremos en contacto contigo en breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="login-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Correo Electrónico Corporativo
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="juan@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="login-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Servicio de Interés
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="login-input w-full px-4 py-3 rounded-xl text-sm bg-[#0a1628]"
                  >
                    {siteConfig.services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Mensaje / Detalles del Proyecto
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe los requerimientos o dudas acerca de nuestros servicios..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="login-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-gradient w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-white/10 bg-[#050912] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="logo-icon w-8 h-8 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              {siteConfig.name}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
            <a href="#inicio" className="hover:text-white transition-colors">Inicio</a>
            <a href="#servicios" className="hover:text-white transition-colors">Servicios</a>
            <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
            <Link href="/login" className="hover:text-blue-400 transition-colors">Intranet</Link>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
