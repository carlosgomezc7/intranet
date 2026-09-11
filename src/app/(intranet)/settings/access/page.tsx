"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RolesList } from "@/components/intranet/access/RolesList";
import { RoleModal } from "@/components/intranet/access/RoleModal";
import { UserPermissionsPanel } from "@/components/access/UserPermissionsPanel";
import { BASE_SYSTEM_ROLES, SYSTEM_PERMISSIONS } from "@/lib/auth/constants";
import { ShieldCheck, Users, ArrowLeft, SlidersHorizontal, Search, UserCheck, Sparkles, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";
import { getDefaultProfile } from "@/lib/defaults";

export default function AccessControlPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "users">("roles");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState(BASE_SYSTEM_ROLES);
  
  // User permissions tab state
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setLoadingUsers(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("profiles")
          .select("*, department:departments(*)")
          .order("full_name", { ascending: true });

        if (data && data.length > 0) {
          setUsers(data as Profile[]);
        } else {
          setUsers([getDefaultProfile("admin")]);
        }
      } catch {
        setUsers([getDefaultProfile("admin")]);
      } finally {
        setLoadingUsers(false);
      }
    }

    if (activeTab === "users") {
      loadUsers();
    }
  }, [activeTab]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Configuración</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
            <span>Control de Acceso & Gobernanza (RBAC / PBAC)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Administración jerárquica de roles, políticas por recurso y personalización de permisos por colaborador.
          </p>
        </div>

        <Link
          href="/settings/access/groups"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 border border-sky-500/20 text-xs font-semibold text-white hover:border-cyan-400 transition-all cursor-pointer"
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Gestionar Grupos</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 gap-6">
        <button
          onClick={() => {
            setActiveTab("roles");
            setSelectedUser(null);
          }}
          className={`pb-3.5 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === "roles" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Catálogo de Roles y Políticas</span>
          </div>
          {activeTab === "roles" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3.5 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === "users" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Permisos por Colaborador</span>
          </div>
          {activeTab === "users" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: ROLES */}
      {activeTab === "roles" && (
        <>
          <RolesList
            roles={roles}
            permissions={SYSTEM_PERMISSIONS}
            onOpenCreateModal={() => setIsModalOpen(true)}
          />

          <RoleModal
            isOpen={isModalOpen}
            permissions={SYSTEM_PERMISSIONS}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}

      {/* TAB 2: PERMISOS POR COLABORADOR */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {selectedUser ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a la lista de colaboradores</span>
              </button>

              <UserPermissionsPanel
                targetUser={selectedUser}
                onClose={() => setSelectedUser(null)}
              />
            </div>
          ) : (
            <>
              {/* Search & Filter Controls */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, correo o usuario..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-400 transition-all cursor-pointer"
                  >
                    <option value="all">Todos los roles</option>
                    <option value="super_admin">Super Administrador</option>
                    <option value="admin">Administrador</option>
                    <option value="hr_manager">Recursos Humanos</option>
                    <option value="manager">Gerente de Área</option>
                    <option value="team_lead">Líder de Equipo</option>
                    <option value="employee">Colaborador</option>
                  </select>
                </div>
              </div>

              {/* Users Grid */}
              {loadingUsers ? (
                <div className="p-12 text-center text-xs text-slate-400">Cargando colaboradores...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
                  No se encontraron colaboradores que coincidan con la búsqueda.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/30 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-sm shrink-0">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">{user.full_name}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer shrink-0"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Permisos</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
