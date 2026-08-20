"use client";

import React from "react";
import { Pin, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { Avatar } from "@/components/shared/Avatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Announcement } from "@/lib/types";
import { ReadReceiptButton } from "./ReadReceiptButton";
import { priorityVariants } from "./data";

interface Props {
  announcements: Announcement[];
}

export const AnnouncementsList: React.FC<Props> = ({ announcements }) => {
  if (announcements.length === 0) {
    return (
      <EmptyState
        icon="Megaphone"
        title="No se encontraron comunicados"
        description="Intenta buscar con otros términos o cambia la categoría seleccionada."
      />
    );
  }

  return (
    <div className="space-y-6">
      {announcements.map((ann) => {
        const formattedDate = new Intl.DateTimeFormat("es-MX", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(ann.created_at));

        const isUrgent = ann.priority === "urgent";

        return (
          <article
            key={ann.id}
            className={`glass-card-elevated p-6 sm:p-8 rounded-3xl border transition-all ${
              ann.is_pinned
                ? "border-cyan-400/40 shadow-xl shadow-cyan-500/5 bg-gradient-to-br from-slate-900/90 to-sky-950/40"
                : "border-sky-500/15 hover:border-sky-400/30"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {ann.is_pinned && (
                  <Badge variant="info">
                    <Pin className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                    <span>Fijado</span>
                  </Badge>
                )}
                <Badge variant={priorityVariants[ann.priority] || "info"}>
                  <span className="capitalize">{ann.priority}</span>
                </Badge>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  #{ann.category}
                </span>

                {/* Audience Micro-Targeting Indicator */}
                {ann.target_departments && ann.target_departments.length > 0 ? (
                  <Badge variant="neutral" size="sm">
                    <Users className="w-3 h-3" aria-hidden="true" />
                    <span>Segmentado ({ann.target_departments.length} depts)</span>
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm">
                    <Users className="w-3 h-3" aria-hidden="true" />
                    <span>Toda la Organización</span>
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              {ann.title}
            </h2>

            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap mb-4">
              {ann.content}
            </div>

            {/* Read Receipt Action for Urgent / High priority Strategic Notices */}
            <ReadReceiptButton
              announcementId={ann.id}
              isUrgent={isUrgent}
            />

            <div className="pt-4 mt-6 border-t border-sky-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  name={ann.author?.full_name || "Elevate"}
                  src={ann.author?.avatar_url}
                  size="sm"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {ann.author?.full_name || "Elevate"}
                  </span>
                  <span className="text-[10px] text-sky-400">
                    {ann.author?.job_title || "Recursos Humanos"}
                  </span>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
