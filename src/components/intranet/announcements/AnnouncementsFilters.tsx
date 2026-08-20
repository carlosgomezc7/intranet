import React from "react";
import { Filter } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";
import { CATEGORIES } from "./data";

interface Props {
  search: string;
  setSearch: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
}

export const AnnouncementsFilters: React.FC<Props> = ({
  search, setSearch, selectedCategory, setSelectedCategory
}) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-sky-500/15 flex flex-col md:flex-row items-stretch md:items-center gap-4">
      <div className="flex-1">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar comunicados por título o contenido..."
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0" aria-label="Filtro de categoría">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" aria-hidden="true" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/20"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-sky-500/10"
            }`}
          >
            {cat === "Todos" ? "Todos" : cat.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};
