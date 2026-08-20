"use client";

import React, { useState } from "react";
import { Lightbulb, Plus, ThumbsUp, Sparkles, Filter, CheckCircle2, Clock, Flame } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { submitIdea, voteIdea, updateIdeaStatus } from "@/lib/actions/ideas";

const DEMO_IDEAS = [
  {
    id: "i1",
    title: "Implementación de Viernes de Innovación & Capacitación",
    description: "Dedicar 2 horas los viernes a la exploración de nuevas tecnologías e IA para mejorar procesos internos.",
    category: "Cultura & Capacitación",
    author: "Roberto Mendoza",
    votes: 34,
    status: "approved",
    statusLabel: "Aprobada",
  },
  {
    id: "i2",
    title: "Automatización de Recibos de Nómina vía WhatsApp Bot",
    description: "Permitir a los colaboradores descargar sus recibos timbrados directamente solicitándolos al bot corporativo.",
    category: "Tecnología & Procesos",
    author: "Gabriel Torres",
    votes: 48,
    status: "in_development",
    statusLabel: "En Desarrollo",
  },
  {
    id: "i3",
    title: "Programa de Becas y Certificaciones AWS / Supabase",
    description: "Crear un fondo anual reembolsable para colaboradores que obtengan certificaciones técnicas oficiales.",
    category: "Beneficios",
    author: "Diego Hernández",
    votes: 29,
    status: "under_review",
    statusLabel: "En Revisión",
  },
];

export default function IdeasPage() {
  const { can } = usePermissions();
  const [ideas, setIdeas] = useState(DEMO_IDEAS);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tecnología");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    await submitIdea(title, description, category);
    setTitle("");
    setDescription("");
    setShowSubmitModal(false);
    setSubmitting(false);
  };

  const handleVote = async (ideaId: string) => {
    await voteIdea(ideaId);
    setIdeas((prev) =>
      prev.map((item) =>
        item.id === ideaId ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-cyan-400" />
            <span>Buzón de Ideas e Innovación</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Propón mejoras, vota por las mejores iniciativas de tus compañeros e impulsa la transformación de la empresa.
          </p>
        </div>

        {can("ideas:submit") && (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Proponer Idea</span>
          </button>
        )}
      </div>

      {/* Ideas Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ideas.map((idea) => (
          <article
            key={idea.id}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/30 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  {idea.category}
                </span>

                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                    idea.status === "approved"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : idea.status === "in_development"
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {idea.statusLabel}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{idea.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{idea.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Por {idea.author}</span>

              {can("ideas:vote") && (
                <button
                  onClick={() => handleVote(idea.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{idea.votes}</span>
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Submit Idea Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-sky-500/30 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-base font-bold text-white">Proponer Nueva Idea de Mejora</h3>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Título de la Idea *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Implementación de Viernes de Innovación"
                className="w-full p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
              >
                <option>Tecnología & Procesos</option>
                <option>Cultura & Capacitación</option>
                <option>Beneficios & Bienestar</option>
                <option>Operaciones</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Descripción Detallada *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Explica en qué consiste la propuesta y qué beneficio aportará a la empresa..."
                className="w-full p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-xs font-semibold text-white"
              >
                {submitting ? "Enviando..." : "Enviar Idea"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
