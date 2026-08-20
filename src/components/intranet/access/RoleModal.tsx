"use client";

import React, { useState } from "react";
import { X, Shield, Plus } from "lucide-react";
import { Permission } from "@/lib/types";
import { createRoleAction } from "@/app/(intranet)/settings/access/actions";

interface Props {
  isOpen: boolean;
  permissions: Permission[];
  onClose: () => void;
}

export const RoleModal: React.FC<Props> = ({ isOpen, permissions, onClose }) => {
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const togglePermission = (id: string) => {
    setSelectedPerms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-sky-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sky-500/10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span>Crear Rol Personalizado</span>
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form
          action={async (formData) => {
            setLoading(true);
            setError(null);
            selectedPerms.forEach((permId) => formData.append("permissions", permId));
            const res = await createRoleAction(formData);
            if (res.success) {
              onClose();
            } else {
              setError(res.error || "Error al crear el rol");
            }
            setLoading(false);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role-name" className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre del Rol *
              </label>
              <input
                id="role-name"
                name="name"
                type="text"
                required
                placeholder="Ej. Auditor de Calidad"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/20 text-white text-xs focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label htmlFor="role-level" className="block text-xs font-semibold text-slate-300 mb-1">
                Nivel Jerárquico
              </label>
              <select
                id="role-level"
                name="hierarchyLevel"
                defaultValue="4"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/20 text-white text-xs focus:ring-2 focus:ring-cyan-400 outline-none"
              >
                <option value="2">Nivel 2 · Operativo Departamental</option>
                <option value="3">Nivel 3 · Colaborador Estándar</option>
                <option value="4">Nivel 4 · Especializado / Auditor</option>
                <option value="5">Nivel 5 · Becario / Temporal</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="role-desc" className="block text-xs font-semibold text-slate-300 mb-1">
              Descripción del Alcance
            </label>
            <textarea
              id="role-desc"
              name="description"
              rows={2}
              placeholder="Describe las responsabilidades y alcance de este rol..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-sky-500/20 text-white text-xs focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          {/* Granular Permissions Selection */}
          <div className="space-y-2 pt-2">
            <span className="block text-xs font-semibold text-slate-300">
              Seleccionar Políticas Habilitadas ({selectedPerms.length} asignadas)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 bg-slate-900/60 rounded-2xl border border-sky-500/10">
              {permissions.map((p) => {
                const isChecked = selectedPerms.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex items-start gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isChecked ? "bg-cyan-500/20 text-white" : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePermission(p.id)}
                      className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                    />
                    <div>
                      <div className="font-mono text-[11px] text-slate-200">{p.resource}:{p.action}</div>
                      <div className="text-[10px] text-slate-400">{p.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-sky-500/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-md shadow-sky-600/30 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? "Creando..." : "Guardar Rol"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
