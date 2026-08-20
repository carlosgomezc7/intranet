"use client";

import React, { useState } from "react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { Building, ChevronRight, Mail, Phone, Sparkles, UserCheck } from "lucide-react";
import { Employee, MOCK_EMPLOYEES } from "./data";

export const OrgChartTree: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(MOCK_EMPLOYEES[1]); // Default COO

  // Build tree nodes: Top is Director / COO (managerId === null)
  const rootEmployees = MOCK_EMPLOYEES.filter((e) => !e.managerId);
  const getSubordinates = (id: string) => MOCK_EMPLOYEES.filter((e) => e.managerId === id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
      {/* Tree Visualization */}
      <div className="lg:col-span-2 glass-card-elevated p-6 sm:p-8 rounded-3xl border border-sky-500/20">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-sky-500/10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <span>Organigrama Dinámico en Tiempo Real</span>
            </h3>
            <p className="text-xs text-slate-400">
              Explora las líneas de reporte y jerarquías organizacionales para 200 colaboradores.
            </p>
          </div>
          <Badge variant="info" size="sm">
            <span>6 Nodos Mapeados</span>
          </Badge>
        </div>

        {/* Tree Render */}
        <div className="space-y-4">
          {rootEmployees.map((root) => (
            <div key={root.id} className="space-y-3">
              {/* Root Node */}
              <button
                type="button"
                onClick={() => setSelectedEmployee(root)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  selectedEmployee.id === root.id
                    ? "bg-gradient-to-r from-sky-900/60 to-cyan-900/40 border-cyan-400/60 shadow-lg shadow-cyan-500/10"
                    : "bg-slate-900/60 border-sky-500/15 hover:border-sky-400/40"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Avatar name={root.name} src={root.avatar} size="md" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{root.name}</h4>
                    <span className="text-xs text-cyan-300 font-medium block">{root.role}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{root.department}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Level 1 Subordinates */}
              <div className="pl-6 sm:pl-10 space-y-2 border-l-2 border-sky-500/20 ml-6">
                {getSubordinates(root.id).map((sub) => {
                  const subReports = getSubordinates(sub.id);
                  return (
                    <div key={sub.id} className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setSelectedEmployee(sub)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                          selectedEmployee.id === sub.id
                            ? "bg-sky-900/50 border-cyan-400/60 shadow-md"
                            : "bg-slate-900/40 border-sky-500/10 hover:border-sky-400/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar name={sub.name} src={sub.avatar} size="sm" />
                          <div>
                            <h5 className="text-xs font-bold text-white">{sub.name}</h5>
                            <span className="text-[11px] text-sky-300">{sub.role}</span>
                          </div>
                        </div>
                        <Badge variant="neutral" size="sm">
                          <span>{sub.department}</span>
                        </Badge>
                      </button>

                      {/* Level 2 Subordinates */}
                      {subReports.length > 0 && (
                        <div className="pl-6 space-y-1.5 border-l border-sky-500/15 ml-4">
                          {subReports.map((leaf) => (
                            <button
                              key={leaf.id}
                              type="button"
                              onClick={() => setSelectedEmployee(leaf)}
                              className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                                selectedEmployee.id === leaf.id
                                  ? "bg-sky-950/60 border-cyan-400/50"
                                  : "bg-slate-950/30 border-sky-500/5 hover:border-sky-400/20"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Avatar name={leaf.name} src={leaf.avatar} size="sm" />
                                <div className="text-[11px]">
                                  <span className="font-semibold text-slate-200 block">{leaf.name}</span>
                                  <span className="text-slate-400">{leaf.role}</span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Employee Detail & Skills Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/20 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={selectedEmployee.name} src={selectedEmployee.avatar} size="xl" />
            <div>
              <h3 className="text-lg font-bold text-white">{selectedEmployee.name}</h3>
              <p className="text-xs text-cyan-300 font-medium">{selectedEmployee.role}</p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                <Building className="w-3 h-3 text-sky-400" />
                <span>{selectedEmployee.department}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-sky-500/10 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <a href={`mailto:${selectedEmployee.email}`} className="hover:text-cyan-300 transition-colors">
                  {selectedEmployee.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>{selectedEmployee.phone}</span>
              </div>
            </div>

            {/* Skill Tags */}
            <div>
              <span className="text-xs font-bold text-slate-200 block mb-2">
                Habilidades & Competencias Clave
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEmployee.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {selectedEmployee.certifications && (
              <div>
                <span className="text-xs font-bold text-slate-200 block mb-2">
                  Certificaciones Oficiales
                </span>
                <div className="space-y-1">
                  {selectedEmployee.certifications.map((cert) => (
                    <div key={cert} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-sky-500/10 mt-6 flex justify-between items-center text-xs text-slate-400">
          <span>Reportes Directos: <strong>{selectedEmployee.directReportsCount ?? 0}</strong></span>
          <Badge variant="info" size="sm">Activo</Badge>
        </div>
      </div>
    </div>
  );
};
