import React from "react";
import { Megaphone, Plus } from "lucide-react";

export const AnnouncementsHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Megaphone className="w-7 h-7 text-cyan-400" aria-hidden="true" />
          <span>Comunicados Corporativos</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Noticias oficiales, políticas y avisos importantes de Elevate.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-md shadow-sky-600/20 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        <span>Nuevo Comunicado</span>
      </button>
    </div>
  );
};
