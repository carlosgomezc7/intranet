import React from "react";
import { Users } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

interface Props {
  totalEmployees: number;
}

export const DirectoryHeader: React.FC<Props> = ({ totalEmployees }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Users className="w-7 h-7 text-cyan-400" aria-hidden="true" />
          <span>Directorio de Personal</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Encuentra y contacta a cualquier colaborador de la organización.
        </p>
      </div>

      <Badge variant="info" size="md">
        <span>{totalEmployees} colaboradores</span>
      </Badge>
    </div>
  );
};
