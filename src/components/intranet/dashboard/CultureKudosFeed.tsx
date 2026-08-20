"use client";

import React, { useState } from "react";
import { Heart, Sparkles, Send, Award, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";

interface KudosItem {
  id: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string | null;
  recipientName: string;
  recipientRole: string;
  recipientAvatar: string | null;
  coreValue: string;
  message: string;
  likesCount: number;
  timeAgo: string;
}

const INITIAL_KUDOS: KudosItem[] = [
  {
    id: "k1",
    senderName: "Carlos Gómez",
    senderRole: "Cloud Architect",
    senderAvatar: null,
    recipientName: "Diego Hernández",
    recipientRole: "Tech Lead",
    recipientAvatar: null,
    coreValue: "Excelencia",
    message: "¡Excelente entrega del refactor de sesiones SSR con cero tiempo de inactividad! Gran trabajo en equipo.",
    likesCount: 14,
    timeAgo: "Hace 2 horas",
  },
  {
    id: "k2",
    senderName: "Mariana Silva",
    senderRole: "Directora de Operaciones",
    senderAvatar: null,
    recipientName: "Valeria Castillo",
    recipientRole: "Cultura & Onboarding",
    recipientAvatar: null,
    coreValue: "Innovación",
    message: "El nuevo itinerario de bienvenida para los 200 colaboradores quedó impecable y muy humano.",
    likesCount: 22,
    timeAgo: "Hace 4 horas",
  },
  {
    id: "k3",
    senderName: "Alejandro Morales",
    senderRole: "Gerente de RH",
    senderAvatar: null,
    recipientName: "Sofía Valenzuela",
    recipientRole: "Coordinadora de Nóminas",
    recipientAvatar: null,
    coreValue: "Compromiso",
    message: "Gracias por timbrar la quincena 15 con total puntualidad y apoyar a los nuevos ingresos con su CFDI.",
    likesCount: 9,
    timeAgo: "Ayer",
  },
];

export const CultureKudosFeed: React.FC = () => {
  const [kudosList, setKudosList] = useState<KudosItem[]>(INITIAL_KUDOS);
  const [showModal, setShowModal] = useState(false);
  const [recipient, setRecipient] = useState("Mariana Silva");
  const [coreValue, setCoreValue] = useState("Colaboración");
  const [message, setMessage] = useState("");

  const handleSendKudos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newKudos: KudosItem = {
      id: `k-${Date.now()}`,
      senderName: "Carlos Gómez",
      senderRole: "Colaborador",
      senderAvatar: null,
      recipientName: recipient,
      recipientRole: "Compañero de Equipo",
      recipientAvatar: null,
      coreValue,
      message,
      likesCount: 1,
      timeAgo: "Hace un momento",
    };

    setKudosList([newKudos, ...kudosList]);
    setMessage("");
    setShowModal(false);
  };

  return (
    <section aria-labelledby="kudos-heading" className="glass-card-elevated p-6 sm:p-8 rounded-3xl border border-sky-500/15 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-sky-500/10">
        <div>
          <h2 id="kudos-heading" className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <span>Muro de Reconocimiento & Cultura (Kudos)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Refuerza los valores corporativos reconociendo a tus compañeros.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-md shadow-amber-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dar Kudos</span>
        </button>
      </div>

      {/* Kudos Feed */}
      <div className="space-y-4">
        {kudosList.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-900/40 border border-sky-500/10 hover:border-sky-400/30 transition-all space-y-3"
          >
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 truncate">
                <Avatar name={item.senderName} src={item.senderAvatar} size="sm" />
                <span className="font-semibold text-white truncate">{item.senderName}</span>
                <span className="text-slate-400 text-[11px]">reconoció a</span>
                <span className="font-bold text-cyan-300 truncate">@{item.recipientName}</span>
              </div>
              <Badge variant="warning" size="sm">
                <span>#{item.coreValue}</span>
              </Badge>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-sky-500/5">
              &ldquo;{item.message}&rdquo;
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{item.timeAgo}</span>
              <button
                type="button"
                onClick={() => {
                  setKudosList((prev) =>
                    prev.map((k) => (k.id === item.id ? { ...k, likesCount: k.likesCount + 1 } : k))
                  );
                }}
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
                <span>{item.likesCount} me gusta</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card-elevated w-full max-w-md p-6 sm:p-8 rounded-3xl border border-sky-500/30 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Enviar Reconocimiento (Kudos)</span>
            </h3>

            <form onSubmit={handleSendKudos} className="space-y-4">
              <div>
                <label htmlFor="kudos-recipient" className="block text-xs font-semibold text-slate-300 mb-1">
                  ¿A quién deseas reconocer?
                </label>
                <input
                  id="kudos-recipient"
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-sky-500/20 text-white text-xs focus:ring-2 focus:ring-cyan-400 outline-none"
                />
              </div>

              <div>
                <label htmlFor="kudos-value" className="block text-xs font-semibold text-slate-300 mb-1">
                  Valor Corporativo
                </label>
                <select
                  id="kudos-value"
                  value={coreValue}
                  onChange={(e) => setCoreValue(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-sky-500/20 text-white text-xs focus:ring-2 focus:ring-cyan-400 outline-none"
                >
                  <option value="Innovación">Innovación & Mejora Continua</option>
                  <option value="Colaboración">Colaboración Excepcional</option>
                  <option value="Excelencia">Excelencia Operativa</option>
                  <option value="Compromiso">Compromiso Institucional</option>
                  <option value="Liderazgo">Liderazgo Inspirador</option>
                  <option value="Integridad">Integridad & Confianza</option>
                </select>
              </div>

              <div>
                <label htmlFor="kudos-message" className="block text-xs font-semibold text-slate-300 mb-1">
                  Mensaje de agradecimiento
                </label>
                <textarea
                  id="kudos-message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe cómo su aporte marcó la diferencia..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-sky-500/20 text-white text-xs focus:ring-2 focus:ring-cyan-400 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-500 shadow-md hover:scale-105 transition-all"
                >
                  Publicar Kudos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
