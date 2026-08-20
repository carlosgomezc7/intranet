"use client";

import React, { useState } from "react";
import { siteConfig } from "@/lib/config";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate contact submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="contacto" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            Atención & Soporte
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ¿Tienes dudas o necesitas asistencia?
          </p>
          <p className="mt-4 text-base text-slate-400">
            Nuestro equipo de soporte técnico y administración está disponible para ayudarte.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-sky-500/15">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 mb-4">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Correo de Contacto</h3>
              <p className="text-xs text-slate-400 mb-2">Para consultas generales y administrativas</p>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-sm font-medium text-cyan-400 hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-sky-500/15">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 mb-4">
                <Phone className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Teléfono Directo</h3>
              <p className="text-xs text-slate-400 mb-2">Lunes a Viernes de 9:00 a 18:00 hrs</p>
              <a
                href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                className="text-sm font-medium text-cyan-400 hover:underline"
              >
                {siteConfig.phone}
              </a>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-sky-500/15">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 mb-4">
                <MapPin className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Ubicación Corporativa</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {siteConfig.address}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 glass-card-elevated p-8 sm:p-10 rounded-3xl border border-sky-500/20">
            {submitted ? (
              <div className="py-12 text-center" role="alert" aria-live="polite">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                  Hemos recibido tu solicitud. Un representante de soporte te responderá a la brevedad.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ nombre: "", correo: "", telefono: "", mensaje: "" });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" aria-label="Formulario de contacto">
                <h3 className="text-xl font-bold text-white mb-2">Envíanos un mensaje directo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contacto-nombre" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nombre completo *
                    </label>
                    <input
                      id="contacto-nombre"
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej. Carlos Gómez"
                      className="w-full px-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="contacto-correo" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Correo corporativo *
                    </label>
                    <input
                      id="contacto-correo"
                      type="email"
                      required
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      placeholder="carlos@empresa.com"
                      className="w-full px-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contacto-telefono" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    id="contacto-telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+52 55 1234 5678"
                    className="w-full px-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contacto-mensaje" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mensaje o solicitud *
                  </label>
                  <textarea
                    id="contacto-mensaje"
                    required
                    rows={4}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    placeholder="Describe en qué podemos ayudarte..."
                    className="w-full px-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-xl shadow-sky-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>{loading ? "Enviando mensaje..." : "Enviar Mensaje"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
