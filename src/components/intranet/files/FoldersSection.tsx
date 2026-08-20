import React from "react";
import { Folder } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { FolderItem } from "./data";

interface Props {
  folders: FolderItem[];
}

export const FoldersSection: React.FC<Props> = ({ folders }) => {
  return (
    <section aria-labelledby="folders-heading" className="space-y-4">
      <h2 id="folders-heading" className="text-sm font-bold text-slate-300 uppercase tracking-wider">
        Carpetas Departamentales
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            tabIndex={0}
            className="glass-card-elevated p-5 rounded-2xl border border-sky-500/15 hover:border-sky-400/30 transition-all cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <Folder className="w-5 h-5" aria-hidden="true" />
              </div>
              <Badge variant={folder.visibility === "Público" ? "info" : "neutral"} size="sm">
                {folder.visibility}
              </Badge>
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
              {folder.name}
            </h3>
            <p className="text-[11px] text-slate-400">{folder.items} • {folder.dept}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
