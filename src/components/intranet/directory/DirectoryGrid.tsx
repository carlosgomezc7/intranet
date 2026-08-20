"use client";

import React, { useState } from "react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Mail, Phone, Building, SlidersHorizontal, X } from "lucide-react";
import { Employee } from "./data";
import { usePermissions } from "@/hooks/usePermissions";
import { UserPermissionsPanel } from "@/components/access/UserPermissionsPanel";
import { Profile } from "@/lib/types";

interface Props {
  employees: Employee[];
  onClearFilters: () => void;
}

export const DirectoryGrid: React.FC<Props> = ({ employees, onClearFilters }) => {
  const { isAdmin } = usePermissions();
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  if (employees.length === 0) {
    return (
      <EmptyState
        icon="Users"
        title="No se encontraron colaboradores"
        description="Intenta buscar con otros términos o cambia el filtro de departamento seleccionado."
        actionLabel="Limpiar filtros"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {employees.map((emp) => (
          <article
            key={emp.id}
            className="glass-card-elevated p-5 rounded-2xl border border-sky-500/15 hover:border-sky-400/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <Avatar name={emp.name} src={emp.avatar} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {emp.name}
                  </h3>
                  <p className="text-xs text-sky-400 font-medium truncate mb-1">
                    {emp.role}
                  </p>
                  <Badge variant="neutral" size="sm">
                    <Building className="w-3 h-3" aria-hidden="true" />
                    <span>{emp.department}</span>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sky-500/10 space-y-3">
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${emp.email}`}
                    className="hover:text-cyan-400 transition-colors truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
                  >
                    {emp.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${emp.phone.replace(/[^0-9+]/g, "")}`}
                    className="hover:text-cyan-400 transition-colors truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
                  >
                    {emp.phone}
                  </a>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setSelectedEmp(emp)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-sky-500/10 border border-sky-500/20 hover:border-cyan-400 text-xs font-semibold text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gestionar Permisos</span>
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Permission Drawer Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-sky-500/30 rounded-3xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                <span>Permisos Personalizados de {selectedEmp.name}</span>
              </h3>
              <button
                onClick={() => setSelectedEmp(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <UserPermissionsPanel
              targetUser={{
                id: selectedEmp.id,
                org_id: "demo-org-1",
                username: selectedEmp.email.split("@")[0],
                email: selectedEmp.email,
                full_name: selectedEmp.name,
                avatar_url: selectedEmp.avatar,
                role: "employee",
                department_id: null,
                job_title: selectedEmp.role,
                phone: selectedEmp.phone,
                hire_date: "2026-01-01",
                is_active: true,
                settings_json: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }}
              onClose={() => setSelectedEmp(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};
