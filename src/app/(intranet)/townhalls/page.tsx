"use client";

import React, { useState } from "react";
import { Radio, Calendar, ThumbsUp, Send, Users, Video, Clock, MessageSquare } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { scheduleTownHall, submitQuestion, upvoteQuestion } from "@/lib/actions/townhalls";

const DEMO_TOWNHALL = {
  id: "th1",
  title: "Town Hall Trimestral — Resultados Q3 & Estrategia 2026",
  description: "Reunión general con la Dirección General para revisar los avances corporativos y responder preguntas en directo.",
  scheduledAt: "Viernes 28 de Agosto, 10:00 AM",
  streamUrl: "https://meet.jit.si/elevate-townhall-demo",
  status: "scheduled",
};

const DEMO_QUESTIONS = [
  {
    id: "q1",
    author: "Sofía Valenzuela",
    question: "¿Cuáles serán los criterios de ajuste salarial y bono anual para el último trimestre?",
    upvotes: 24,
    status: "pending",
  },
  {
    id: "q2",
    author: "Diego Hernández",
    question: "¿Habrá ampliación del presupuesto para herramientas de desarrollo con Inteligencia Artificial?",
    upvotes: 19,
    status: "pending",
  },
  {
    id: "q3",
    author: "Valeria Castillo",
    question: "¿Se contempla la apertura de una nueva oficina en Guadalajara?",
    upvotes: 11,
    status: "pending",
  },
];

export default function TownHallsPage() {
  const { can } = usePermissions();
  const [questions, setQuestions] = useState(DEMO_QUESTIONS);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    await submitQuestion(DEMO_TOWNHALL.id, newQuestion);
    setQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        author: "Tú",
        question: newQuestion,
        upvotes: 1,
        status: "pending",
      },
    ]);
    setNewQuestion("");
    setSubmitting(false);
  };

  const handleUpvote = async (qId: string) => {
    await upvoteQuestion(qId);
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  return (
    <div className="space-y-8 animate-slide-up max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Radio className="w-8 h-8 text-cyan-400" />
          <span>Town Hall & Eventos Institucionales</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Sesiones generales en vivo con el equipo directivo, transmisión en directo y preguntas en tiempo real.
        </p>
      </div>

      {/* Featured Active Event Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>PRÓXIMO TRANSMISIÓN EN VIVO</span>
          </span>

          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{DEMO_TOWNHALL.scheduledAt}</span>
          </span>
        </div>

        <h2 className="text-xl font-bold text-white">{DEMO_TOWNHALL.title}</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{DEMO_TOWNHALL.description}</p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={DEMO_TOWNHALL.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-xs font-semibold text-white flex items-center gap-2 shadow-lg transition-all"
          >
            <Video className="w-4 h-4" />
            <span>Unirse a la Transmisión</span>
          </a>
        </div>
      </div>

      {/* Live Q&A Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span>Preguntas de la Audiencia (Q&A en vivo)</span>
          </h3>
          <span className="text-xs text-slate-400">{questions.length} preguntas registradas</span>
        </div>

        {/* Question Submission Input */}
        {can("townhall:qna") && (
          <form onSubmit={handleSubmitQuestion} className="flex gap-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Haz tu pregunta a la Dirección..."
              className="flex-1 px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
            />
            <button
              type="submit"
              disabled={submitting || !newQuestion.trim()}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-white rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-40"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Question List sorted by upvotes */}
        <div className="space-y-3">
          {questions
            .sort((a, b) => b.upvotes - a.upvotes)
            .map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-slate-200 font-medium">{q.question}</p>
                  <span className="text-[11px] text-slate-500">Por {q.author}</span>
                </div>

                <button
                  onClick={() => handleUpvote(q.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{q.upvotes}</span>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
