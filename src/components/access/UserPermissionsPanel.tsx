"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertCircle,
  User,
  SlidersHorizontal,
} from "lucide-react";
import { Profile } from "@/lib/types";
import {
  getUserPermissionMatrix,
  setUserPermissionOverride,
  removeUserPermissionOverride,
  resetUserOverrides,
  PermissionMatrixItem,
} from "@/lib/auth/permission-actions";

interface Props {
  targetUser: Profile;
  onClose?: () => void;
}

const MODULE_LABELS: Record<string, string> = {
  chat: "Chat Corporativo",
  payroll: "Recibos de Nómina",
  attendance: "Control de Asistencia",
  announcements: "Comunicados Corporativos",
  knowledge: "Base de Conocimiento",
  projects: "Project Hubs",
  users: "Gestión de Usuarios",
  roles: "Roles y Políticas",
  groups: "Grupos de Colaboradores",
};

export const UserPermissionsPanel: React.FC<Props> = ({ targetUser, onClose }) => {
  const [matrix, setMatrix] = useState<PermissionMatrixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadMatrix = useCallback(async () => {
    setLoading(true);
    const res = await getUserPermissionMatrix(targetUser.id);
    if (res.success && res.matrix) {
      setMatrix(res.matrix);
    } else {
      setFeedback({ type: "error", message: res.error || "No se pudo cargar la matriz de permisos" });
    }
    setLoading(false);
  }, [targetUser.id]);

  useEffect(() => {
    loadMatrix();
  }, [loadMatrix]);

  const handleToggle = async (item: PermissionMatrixItem, currentGranted: boolean) => {
    setSavingId(item.permission_id);
    setFeedback(null);

    const newGranted = !currentGranted;
    const res = await setUserPermissionOverride(targetUser.id, item.permission_id, newGranted);

    if (res.success) {
      setFeedback({
        type: "success",
        message: `Permiso "${item.resource}:${item.action}" ${newGranted ? "concedido" : "bloqueado"} con éxito.`,
      });
      await loadMatrix();
    } else {
      setFeedback({ type: "error", message: res.error || "Error al actualizar el permiso" });
    }
    setSavingId(null);
  };

  const handleResetSingle = async (item: PermissionMatrixItem) => {
    setSavingId(item.permission_id);
    setFeedback(null);

    const res = await removeUserPermissionOverride(targetUser.id, item.permission_id);
    if (res.success) {
      setFeedback({
        type: "success",
        message: `Permiso "${item.resource}:${item.action}" restablecido a valores del rol.`,
      });
      await loadMatrix();
    } else {
      setFeedback({ type: "error", message: res.error || "Error al restablecer el permiso" });
    }
    setSavingId(null);
  };

  const handleResetAll = async () => {
    if (!window.confirm(`¿Restablecer todos los permisos personalizados de ${targetUser.full_name} a sus valores predeterminados por rol?`)) {
      return;
    }
    setResetting(true);
    setFeedback(null);

    const res = await resetUserOverrides(targetUser.id);
    if (res.success) {
      setFeedback({
        type: "success",
        message: "Todos los permisos fueron restablecidos a los valores del rol.",
      });
      await loadMatrix();
    } else {
      setFeedback({ type: "error", message: res.error || "Error al restablecer los permisos" });
    }
    setResetting(false);
  };

  // Group matrix items by module/resource
  const grouped = matrix.reduce<Record<string, PermissionMatrixItem[]>>((acc, item) => {
    const key = item.resource;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const totalOverrides = matrix.filter(
    (i) => i.status === "explicitly_allowed" || i.status === "explicitly_blocked"
  ).length;

  return (
    <div className="space-y-6 text-slate-100">
      {/* User Header */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/20 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-lg">
            {targetUser.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{targetUser.full_name}</h3>
              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20">
                {targetUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400">{targetUser.email} • {targetUser.job_title || "Colaborador"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {totalOverrides > 0 && (
            <button
              onClick={handleResetAll}
              disabled={resetting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {resetting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              <span>Restablecer a valores del rol ({totalOverrides})</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>

      {/* ARIA Live Region for feedback */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {feedback?.message}
      </div>

      {feedback && (
        <div
          role="alert"
          className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              : "bg-rose-500/10 text-rose-300 border-rose-500/30"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Matrix Content */}
      {loading ? (
        <div className="p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Cargando matriz de permisos...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([resource, items]) => (
            <div
              key={resource}
              className="rounded-2xl bg-slate-900/40 border border-slate-800 p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-sm font-semibold text-sky-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span>{MODULE_LABELS[resource] || resource}</span>
                </h4>
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                  {items.length} {items.length === 1 ? "permiso" : "permisos"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {items.map((item) => {
                  const isSaving = savingId === item.permission_id;
                  const isOverridden =
                    item.status === "explicitly_allowed" || item.status === "explicitly_blocked";

                  return (
                    <div
                      key={item.permission_id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        item.status === "explicitly_allowed"
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : item.status === "explicitly_blocked"
                          ? "bg-rose-500/5 border-rose-500/30"
                          : item.status === "inherited"
                          ? "bg-slate-800/40 border-slate-700/50"
                          : "bg-slate-900/60 border-slate-800 opacity-60"
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {item.action}
                          </span>

                          {/* Status Badge */}
                          {item.status === "inherited" && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-700/50 text-slate-300 border border-slate-600/40">
                              Heredado del Rol
                            </span>
                          )}
                          {item.status === "explicitly_allowed" && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Permitido (Override)
                            </span>
                          )}
                          {item.status === "explicitly_blocked" && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                              <XCircle className="w-2.5 h-2.5" /> Bloqueado (Override)
                            </span>
                          )}
                          {item.status === "denied" && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-800 text-slate-500 border border-slate-700">
                              No asignado
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isOverridden && (
                          <button
                            onClick={() => handleResetSingle(item)}
                            disabled={isSaving}
                            title="Restablecer este permiso al valor del rol"
                            aria-label={`Restablecer permiso ${item.resource}:${item.action} al valor del rol`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.is_granted}
                          aria-label={`Permiso ${item.resource}:${item.action} para ${targetUser.full_name}`}
                          onClick={() => handleToggle(item, item.is_granted)}
                          disabled={isSaving || item.source === "super_admin_bypass"}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-40 disabled:cursor-not-allowed ${
                            item.is_granted ? "bg-cyan-500" : "bg-slate-700"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                              item.is_granted ? "translate-x-5" : "translate-x-0"
                            }`}
                          >
                            {isSaving && <Loader2 className="w-3 h-3 text-slate-600 animate-spin" />}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
