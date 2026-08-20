import React from "react";
import { FolderKanban, PlusCircle } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

export const ProjectsHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <FolderKanban className="w-7 h-7 text-cyan-400" aria-hidden="true" />
          <span>Project Hubs & Colaboración Cruzada</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Espacios de trabajo interdepartamentales para alinear equipos y neutralizar silos organizacionales.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="info" size="md">
          <span>3 Proyectos Activos</span>
        </Badge>
      </div>
    </div>
  );
};
