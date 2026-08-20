"use client";

import React, { useState } from "react";
import { DirectoryHeader } from "@/components/intranet/directory/DirectoryHeader";
import { DirectoryFilters } from "@/components/intranet/directory/DirectoryFilters";
import { DirectoryGrid } from "@/components/intranet/directory/DirectoryGrid";
import { OrgChartTree } from "@/components/intranet/directory/OrgChartTree";
import { MOCK_EMPLOYEES } from "@/components/intranet/directory/data";
import { Grid, Network } from "lucide-react";

export default function DirectoryPage() {
  const [activeTab, setActiveTab] = useState<"grid" | "orgchart">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("Todos");

  const filteredEmployees = MOCK_EMPLOYEES.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept =
      selectedDept === "Todos" || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DirectoryHeader totalEmployees={filteredEmployees.length} />

        {/* View Switcher: Grid vs Org Chart */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-900/80 border border-sky-500/20">
          <button
            type="button"
            onClick={() => setActiveTab("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "grid"
                ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Grid className="w-4 h-4" aria-hidden="true" />
            <span>Fichas & Habilidades</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orgchart")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "orgchart"
                ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Network className="w-4 h-4" aria-hidden="true" />
            <span>Organigrama</span>
          </button>
        </div>
      </div>

      {activeTab === "grid" ? (
        <>
          <DirectoryFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDept={selectedDept}
            setSelectedDept={setSelectedDept}
          />

          <DirectoryGrid
            employees={filteredEmployees}
            onClearFilters={() => {
              setSearchTerm("");
              setSelectedDept("Todos");
            }}
          />
        </>
      ) : (
        <OrgChartTree />
      )}
    </div>
  );
}
