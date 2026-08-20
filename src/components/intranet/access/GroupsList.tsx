"use client";

import React, { useState } from "react";
import { Group } from "@/lib/types";
import { Users, Plus, FolderKanban, ShieldCheck } from "lucide-react";
import { createGroupAction } from "@/app/(intranet)/settings/access/actions";

interface Props {
  groups: Group[];
}

export const GroupsList: React.FC<Props> = ({ groups }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Grupos de Usuarios ({groups.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Agrupaciones lógicas para difusión segmentada y asignación masiva de políticas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-md shadow-sky-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Grupo</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g) => (
          <div
            key={g.id}
            className="p-5 rounded-2xl bg-slate-900/40 border border-sky-500/10 hover:border-sky-500/30 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <FolderKanban className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{g.member_count ?? 12} miembros</span>
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-1">{g.name}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{g.description || "Sin descripción"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card-elevated w-full max-w-md p-6 rounded-3xl border border-sky-500/30 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Crear Grupo de Usuarios</span>
            </h3>

            <form
              action={async (formData) => {
                setLoading(true);
                const res = await createGroupAction(formData);
                if (res.success) {
                  setShowModal(false);
                }
                setLoading(false);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="group-name" className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del Grupo *
                </label>
                <input
                  id="group-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Ej. Comité de Auditoría"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/20 text-white text-xs focus:ring-2 focus:ring-cyan-400 outline-none"
                />
              </div>

              <div>
                <label htmlFor="group-desc" className="block text-xs font-semibold text-slate-300 mb-1">
                  Descripción
                </label>
                <textarea
                  id="group-desc"
                  name="description"
                  rows={3}
                  placeholder="Finalidad del grupo y áreas involucradas..."
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
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-md shadow-sky-600/30 transition-all hover:scale-105 disabled:opacity-50"
                >
                  {loading ? "Creando..." : "Guardar Grupo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
