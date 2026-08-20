import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRequestModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Vacaciones");
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Keyboard navigation for closing modal (WCAG)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onClose();
      setNewTitle("");
      setNewDescription("");
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="glass-card-elevated max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-sky-500/25 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-sky-500/10 pb-4">
          <h2 id="modal-title" className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            <span>Iniciar Nueva Solicitud</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md p-1"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="req-type">
              Tipo de Solicitud *
            </label>
            <select
              id="req-type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-sky-500/20 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <option value="Vacaciones">Vacaciones / Días de Descanso</option>
              <option value="Permiso Personal">Permiso de Ausencia Personal</option>
              <option value="Gastos">Reembolso / Aprobación de Gastos</option>
              <option value="Materiales">Solicitud de Recursos / Hardware</option>
              <option value="Accesos">Acceso a Sistemas / Base de Datos</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="req-title">
              Título de la Solicitud *
            </label>
            <input
              id="req-title"
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ej. Vacaciones de Verano (5 días)"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-sky-500/20 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="req-desc">
              Motivo / Justificación *
            </label>
            <textarea
              id="req-desc"
              rows={3}
              required
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Explica las fechas, montos o detalles de la solicitud..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-sky-500/20 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-400 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-xs font-semibold text-white hover:from-sky-500 hover:to-cyan-400 shadow-md shadow-sky-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-70"
            >
              {submitting ? "Enviando..." : "Enviar a Aprobación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
