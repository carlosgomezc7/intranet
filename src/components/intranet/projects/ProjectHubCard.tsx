import React from "react";
import { ProjectHub } from "@/lib/types";
import { Badge } from "@/components/shared/Badge";
import { CheckCircle2, Clock, Users, ArrowRight, Shield } from "lucide-react";

interface Props {
  project: ProjectHub;
}

export const ProjectHubCard: React.FC<Props> = ({ project }) => {
  const completedMilestones = project.roadmap_json.filter((m) => m.completed).length;
  const totalMilestones = project.roadmap_json.length;
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <article className="glass-card-elevated p-6 sm:p-8 rounded-3xl border border-sky-500/15 hover:border-sky-400/40 transition-all flex flex-col justify-between space-y-6">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="info" size="sm">
            <span className="capitalize">{project.status.replace("_", " ")}</span>
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-cyan-300">
            <Users className="w-3.5 h-3.5" />
            <span>{project.target_departments.join(", ")}</span>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">{project.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-300">Hitos Cumplidos ({completedMilestones}/{totalMilestones})</span>
          <span className="text-cyan-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Agreements Snapshot */}
      {project.agreements_json.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-sky-500/10 space-y-2">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Último Acuerdo Interdepartamental
          </span>
          <div className="text-xs text-slate-200 flex items-center justify-between">
            <span className="truncate pr-2">📌 {project.agreements_json[0].title}</span>
            <span className="text-cyan-400 shrink-0 font-medium">{project.agreements_json[0].assignedTo}</span>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-sky-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <span>Lead: <strong>{project.lead?.full_name || "Líder Asignado"}</strong></span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Ver Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
