import React from "react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { Notification } from "@/lib/types";
import {
  Bell,
  MessageSquare,
  FileCheck2,
  Megaphone,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

const notifIconMap: { [key: string]: React.ElementType } = {
  chat: MessageSquare,
  mention: MessageSquare,
  approval: FileCheck2,
  request: FileCheck2,
  announcement: Megaphone,
  system: ShieldAlert,
};

interface Props {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationsList: React.FC<Props> = ({ notifications, onMarkAsRead }) => {
  if (notifications.length === 0) {
    return (
      <EmptyState
        icon="Bell"
        title="Sin notificaciones pendientes"
        description="Estás al día con todas tus actividades y mensajes."
      />
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notif) => {
        const IconComponent = notifIconMap[notif.type] || Bell;
        const formattedTime = new Intl.DateTimeFormat("es-MX", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(notif.created_at));

        return (
          <div
            key={notif.id}
            onClick={() => !notif.is_read && onMarkAsRead(notif.id)}
            className={`glass-card-elevated p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
              !notif.is_read
                ? "border-cyan-400/40 bg-gradient-to-r from-slate-900/90 to-sky-950/30 shadow-lg shadow-cyan-500/5"
                : "border-sky-500/10 opacity-75 hover:opacity-100"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                <IconComponent className="w-5 h-5" aria-hidden="true" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white">
                    {notif.title}
                  </h3>
                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-1">
                  {notif.body}
                </p>
                <span className="text-[10px] text-slate-500 font-medium">
                  {formattedTime}
                </span>
              </div>
            </div>

            {notif.action_url && (
              <Link
                href={notif.action_url}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notif.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-cyan-300 transition-colors self-end sm:self-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>Ver</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};
