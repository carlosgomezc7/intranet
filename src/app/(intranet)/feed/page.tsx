"use client";

import React, { useState } from "react";
import { MessageCircleHeart, Send, ThumbsUp, Heart, Sparkles, Trophy, Award, Image as ImageIcon, BarChart2, MessageSquare } from "lucide-react";
import { createPost, addReaction, sendKudos, votePoll } from "@/lib/actions/feed";
import { usePermissions } from "@/hooks/usePermissions";

const DEMO_POSTS = [
  {
    id: "p1",
    author: "Carlos Gómez",
    role: "Administrador",
    avatar: "CG",
    time: "Hace 20 min",
    type: "post",
    content: "¡Bienvenidos al nuevo Muro Social Corporativo de ELEVATE! Aquí podemos compartir noticias, reconocimientos, hacer encuestas y conectarnos con todas las áreas.",
    reactions: { "👍": 12, "❤️": 5, "🎉": 8 },
  },
  {
    id: "p2",
    author: "Alejandro Morales",
    role: "Recursos Humanos",
    avatar: "AM",
    time: "Hace 1 hora",
    type: "kudos",
    content: "¡Felicitaciones a Mario Operador por liderar la migración de infraestructura con cero tiempo de inactividad! 🚀",
    kudosRecipient: "Mario Operador",
    kudosBadge: "Innovador del Mes",
    reactions: { "👏": 18, "🔥": 9 },
  },
  {
    id: "p3",
    author: "Mariana Silva",
    role: "Gerente de Operaciones",
    avatar: "MS",
    time: "Hace 3 horas",
    type: "poll",
    content: "Encuesta semanal de bienestar:",
    pollQuestion: "¿Qué formato de capacitación prefieres para el próximo mes?",
    pollOptions: [
      { text: "Talleres presenciales interactivos", votes: 42 },
      { text: "Sesiones virtuales en vivo (Zoom)", votes: 28 },
      { text: "Módulos de autoaprendizaje en Manuales", votes: 15 },
    ],
    reactions: { "👍": 6 },
  },
];

export default function SocialFeedPage() {
  const { can } = usePermissions();
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"post" | "poll" | "kudos">("post");
  const [kudosRecipient, setKudosRecipient] = useState("");
  const [kudosBadge, setKudosBadge] = useState("Innovador del Mes");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    let res;
    if (postType === "kudos") {
      res = await sendKudos(kudosRecipient || "Mario Operador", kudosBadge, postContent);
    } else {
      const formData = new FormData();
      formData.append("content", postContent);
      formData.append("postType", postType);
      res = await createPost(formData);
    }

    if (res.success) {
      setPostContent("");
      setFeedback("¡Publicación realizada con éxito!");
    } else {
      setFeedback(res.error || "Error al publicar");
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8 animate-slide-up max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <MessageCircleHeart className="w-8 h-8 text-cyan-400" />
          <span>Muro Social Corporativo</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Comparte novedades, reconoce a tus colaboradores y participa en encuestas de la organización.
        </p>
      </div>

      {/* Post Composer */}
      {can("feed:create") && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-900/60 border border-sky-500/20 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setPostType("post")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                postType === "post" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              Publicación
            </button>
            <button
              type="button"
              onClick={() => setPostType("kudos")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                postType === "kudos" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Dar Kudos</span>
            </button>
            <button
              type="button"
              onClick={() => setPostType("poll")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                postType === "poll" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Encuesta</span>
            </button>
          </div>

          {postType === "kudos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div>
                <label className="block text-[11px] font-semibold text-amber-300 mb-1">Receptor del Reconocimiento</label>
                <input
                  type="text"
                  value={kudosRecipient}
                  onChange={(e) => setKudosRecipient(e.target.value)}
                  placeholder="Nombre del colaborador (ej. Mario Operador)"
                  className="w-full px-3 py-1.5 bg-slate-950/70 border border-amber-500/30 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-amber-300 mb-1">Insignia / Distinción</label>
                <select
                  value={kudosBadge}
                  onChange={(e) => setKudosBadge(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/70 border border-amber-500/30 rounded-lg text-xs text-slate-200 focus:outline-none"
                >
                  <option>Innovador del Mes</option>
                  <option>Líder de Equipo Exemplar</option>
                  <option>Compañerismo & Apoyo</option>
                  <option>Excelencia Operativa</option>
                </select>
              </div>
            </div>
          )}

          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={3}
            placeholder={postType === "kudos" ? "Escribe las palabras de reconocimiento..." : "¿Qué quieres compartir con la organización?"}
            className="w-full p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all resize-none"
          />

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400 cursor-pointer hover:text-cyan-400" />
              <span>Formatos soportados: Imágenes, enlaces</span>
            </div>

            <button
              type="submit"
              disabled={submitting || !postContent.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <span>{submitting ? "Publicando..." : "Publicar"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {feedback && <div className="text-xs text-cyan-400 font-medium">{feedback}</div>}
        </form>
      )}

      {/* Feed List */}
      <div className="space-y-5">
        {DEMO_POSTS.map((post) => (
          <article
            key={post.id}
            className={`p-5 rounded-2xl bg-slate-900/40 border transition-all ${
              post.type === "kudos" ? "border-amber-500/30 bg-amber-500/5" : "border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xs">
                  {post.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{post.author}</h4>
                  <p className="text-[11px] text-slate-400">{post.role} • {post.time}</p>
                </div>
              </div>

              {post.type === "kudos" && (
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{post.kudosBadge}</span>
                </span>
              )}
            </div>

            <p className="text-sm text-slate-200 leading-relaxed mb-4">{post.content}</p>

            {/* Poll Display */}
            {post.type === "poll" && post.pollOptions && (
              <div className="space-y-2 mb-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h5 className="text-xs font-semibold text-cyan-300 mb-2">{post.pollQuestion}</h5>
                {post.pollOptions.map((opt, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-cyan-400/50 transition-all">
                    <span className="text-slate-300">{opt.text}</span>
                    <span className="text-xs font-semibold text-cyan-400">{opt.votes} votos</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reactions */}
            <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
              {Object.entries(post.reactions).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => addReaction(post.id, emoji)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:border-cyan-400/40 flex items-center gap-1 cursor-pointer"
                >
                  <span>{emoji}</span>
                  <span className="font-semibold text-slate-400">{count}</span>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
