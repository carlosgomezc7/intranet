"use client";

import React, { useState } from "react";
import { BookOpenCheck, ChevronRight, FileText, Folder, Plus, Search, Shield, Sparkles } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { createManual, createChapter, publishArticle } from "@/lib/actions/manuals";

const DEMO_MANUALS = [
  {
    id: "m1",
    title: "Manual de Políticas de Recursos Humanos 2026",
    category: "Políticas & Beneficios",
    chapters: [
      {
        id: "c1",
        title: "Capítulo 1: Trabajo Híbrido & Asistencia",
        articles: [
          { id: "a1", title: "Directrices de Trabajo Remoto", version: "v2.1", date: "Actualizado 2026" },
          { id: "a2", title: "Solicitud de Vacaciones y Permisos", version: "v1.0", date: "2026" },
        ],
      },
      {
        id: "c2",
        title: "Capítulo 2: Código de Conducta y Privacidad",
        articles: [
          { id: "a3", title: "Protección de Datos LFPDPPP", version: "v3.0", date: "2026" },
        ],
      },
    ],
  },
  {
    id: "m2",
    title: "SOPs de Infraestructura & Ciberseguridad",
    category: "Tecnología",
    chapters: [
      {
        id: "c3",
        title: "Capítulo 1: Gestión de Credenciales y Accesos",
        articles: [
          { id: "a4", title: "Protocolo de Zero-Trust y MFA Mandatory", version: "v1.2", date: "2026" },
        ],
      },
    ],
  },
];

export default function ManualsPage() {
  const { can } = usePermissions();
  const [selectedArticle, setSelectedArticle] = useState(DEMO_MANUALS[0].chapters[0].articles[0]);
  const [search, setSearch] = useState("");
  const [showNewManualModal, setShowNewManualModal] = useState(false);
  const [manualTitle, setManualTitle] = useState("");

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;
    await createManual(manualTitle, "Manual corporativo", "general", "BookOpen");
    setManualTitle("");
    setShowNewManualModal(false);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BookOpenCheck className="w-8 h-8 text-cyan-400" />
            <span>Manuales & SOPs Corporativos</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Base de conocimiento estructurada: procedimientos operativos estandarizados y políticas de la empresa.
          </p>
        </div>

        {can("manuals:manage") && (
          <button
            onClick={() => setShowNewManualModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Manual</span>
          </button>
        )}
      </div>

      {/* Main Grid: Navigation Tree + Article Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en manuales..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[600px]">
            {DEMO_MANUALS.map((manual) => (
              <div key={manual.id} className="space-y-2">
                <div className="text-xs font-bold text-sky-400 flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  <span>{manual.title}</span>
                </div>

                <div className="pl-3 space-y-3 border-l border-slate-800">
                  {manual.chapters.map((chapter) => (
                    <div key={chapter.id} className="space-y-1">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {chapter.title}
                      </div>

                      <div className="space-y-1">
                        {chapter.articles.map((art) => (
                          <button
                            key={art.id}
                            onClick={() => setSelectedArticle(art)}
                            className={`w-full text-left p-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                              selectedArticle.id === art.id
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                : "text-slate-300 hover:bg-slate-800/60"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{art.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 shrink-0">{art.version}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Article Content Viewer */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {selectedArticle.version}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{selectedArticle.title}</h2>
              <p className="text-xs text-slate-400">Vigencia: {selectedArticle.date} • Aprobado por la Dirección</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
            <p>
              Este documento establece las políticas obligatorias y guías operativas aplicables a todos los colaboradores de la organización.
            </p>
            <h3 className="text-base font-semibold text-white">1. Alcance y Cobertura</h3>
            <p>
              Aplica a todo el personal contratado bajo la modalidad presencial, híbrida o remota. Todo colaborador debe revisar periódicamente este documento.
            </p>
            <h3 className="text-base font-semibold text-white">2. Lineamientos Principales</h3>
            <ul className="list-disc pl-5 space-y-1">
              <td>Cumplimiento de normatividad de seguridad de la información.</td>
              <td>Uso responsable de herramientas institucionales y canales oficiales.</td>
              <td>Registro y reporte oportuno a través del sistema de control de asistencias.</td>
            </ul>
          </div>
        </div>
      </div>

      {/* New Manual Modal */}
      {showNewManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateManual} className="bg-slate-900 border border-sky-500/30 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Crear Nuevo Manual Corporativo</h3>
            <input
              type="text"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              placeholder="Título del Manual (ej. Manual de Operaciones 2026)"
              className="w-full p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewManualModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-cyan-500 text-xs font-semibold text-white"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
