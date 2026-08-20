"use client";

import React, { useState } from "react";
import { Role, Permission } from "@/lib/types";
import { Badge } from "@/components/shared/Badge";
import { Shield, ShieldAlert, Users, Trash2, KeyRound, Plus, Lock } from "lucide-react";
import { deleteRoleAction } from "@/app/(intranet)/settings/access/actions";

interface Props {
  roles: Role[];
  permissions: Permission[];
  onOpenCreateModal: () => void;
}

export const RolesList: React.FC<Props> = ({ roles, permissions, onOpenCreateModal }) => {
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0] || null);

  const getHierarchyBadge = (level: number) => {
    switch (level) {
      case 0:
        return <Badge variant="danger" size="sm">Nivel 0 · SuperAdmin</Badge>;
      case 1:
        return <Badge variant="warning" size="sm">Nivel 1 · Admin</Badge>;
      case 2:
        return <Badge variant="info" size="sm">Nivel 2 · Gerente</Badge>;
      default:
        return <Badge variant="default" size="sm">Nivel {level} · Estándar</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Roles Navigation List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Roles del Sistema ({roles.length})</span>
          </h3>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-md shadow-sky-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Rol</span>
          </button>
        </div>

        <div className="space-y-2">
          {roles.map((r) => {
            const isSelected = selectedRole?.id === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                    : "bg-slate-900/40 border-sky-500/10 hover:border-sky-500/30"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{r.name}</span>
                    {r.is_system && (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">
                        Sistema
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{r.description || "Sin descripción"}</p>
                </div>
                <div>{getHierarchyBadge(r.hierarchy_level)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Permissions Matrix Detail */}
      <div className="lg:col-span-2 glass-card-elevated p-6 sm:p-8 rounded-3xl border border-sky-500/15 space-y-6">
        {selectedRole ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-500/10">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-white">{selectedRole.name}</h2>
                  {getHierarchyBadge(selectedRole.hierarchy_level)}
                </div>
                <p className="text-xs text-slate-300">{selectedRole.description}</p>
              </div>

              {!selectedRole.is_system && (
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm(`¿Estás seguro de eliminar el rol "${selectedRole.name}"?`)) {
                      await deleteRoleAction(selectedRole.id);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Rol</span>
                </button>
              )}
            </div>

            {/* Permissions Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>Matriz de Políticas Habilitadas</span>
                </h4>
                <span className="text-xs text-slate-400">
                  {selectedRole.hierarchy_level === 0 ? "Bypass Total (Todas las Políticas)" : "Políticas Granulares"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {permissions.map((p) => {
                  const isEnabled =
                    selectedRole.hierarchy_level === 0 ||
                    (selectedRole.hierarchy_level === 1) ||
                    (selectedRole.hierarchy_level === 2 && ["announcements", "knowledge", "attendance", "projects"].includes(p.resource)) ||
                    (selectedRole.hierarchy_level === 3 && p.action.startsWith("read"));

                  return (
                    <div
                      key={p.id}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition-all ${
                        isEnabled
                          ? "bg-slate-900/60 border-cyan-500/30 text-white"
                          : "bg-slate-950/40 border-slate-800 text-slate-500 opacity-60"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${isEnabled ? "bg-cyan-400 shadow-sm shadow-cyan-400" : "bg-slate-700"}`} />
                      <div>
                        <div className="font-semibold text-slate-200 font-mono text-[11px]">
                          {p.resource}:{p.action}
                        </div>
                        <div className="text-[11px] text-slate-400">{p.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-slate-400">Selecciona un rol para ver sus permisos.</div>
        )}
      </div>
    </div>
  );
};
