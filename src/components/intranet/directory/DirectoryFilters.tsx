import React from "react";
import { Filter } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";
import { DEPARTMENTS } from "./data";

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedDept: string;
  setSelectedDept: (val: string) => void;
}

export const DirectoryFilters: React.FC<Props> = ({
  searchTerm, setSearchTerm, selectedDept, setSelectedDept
}) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-sky-500/15 flex flex-col md:flex-row items-stretch md:items-center gap-4">
      <div className="flex-1">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nombre, cargo o correo..."
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0" aria-label="Filtro por departamento">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" aria-hidden="true" />
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            type="button"
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
              selectedDept === dept
                ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/20"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-sky-500/10"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  );
};
