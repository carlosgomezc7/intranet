import React from "react";
import { FileText, Download, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { FileItem } from "./data";

interface Props {
  files: FileItem[];
}

export const RecentFilesTable: React.FC<Props> = ({ files }) => {
  return (
    <section aria-labelledby="files-heading" className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/15 space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="files-heading" className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" aria-hidden="true" />
          <span>Repositorio de Conocimiento & SOPs Institucionales</span>
        </h2>
        <span className="text-xs text-slate-400">Indexado Semánticamente</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-sky-500/15">
            <tr>
              <th className="py-3 px-4">Documento / Procedimiento</th>
              <th className="py-3 px-4">Versión</th>
              <th className="py-3 px-4">Propietario</th>
              <th className="py-3 px-4">Gobernanza (90 Días)</th>
              <th className="py-3 px-4 text-right">Descargar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-semibold text-white block">{file.name}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {file.tags?.map((t) => (
                          <span key={t} className="text-[10px] text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded-sm">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-cyan-300 font-medium">{file.version || "v1.0"}</td>
                <td className="py-3.5 px-4 text-slate-300">{file.owner || "Recursos Humanos"}</td>
                <td className="py-3.5 px-4">
                  {file.reviewStatus === "needs_review" ? (
                    <Badge variant="warning" size="sm">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Revisión Próxima ({file.daysUntilReview}d)</span>
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>Vigente ({file.daysUntilReview}d restantes)</span>
                    </Badge>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    aria-label={`Descargar ${file.name}`}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
