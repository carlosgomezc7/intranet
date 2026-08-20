import React from "react";
import { Bell, CheckCheck } from "lucide-react";

interface Props {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export const NotificationsHeader: React.FC<Props> = ({ unreadCount, onMarkAllAsRead }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Bell className="w-7 h-7 text-cyan-400" aria-hidden="true" />
          <span>Centro de Notificaciones</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Revisa tus alertas de menciones, aprobaciones y comunicados en tiempo real.
        </p>
      </div>

      {unreadCount > 0 && (
        <button
          type="button"
          onClick={onMarkAllAsRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <CheckCheck className="w-4 h-4" aria-hidden="true" />
          <span>Marcar todas como leídas ({unreadCount})</span>
        </button>
      )}
    </div>
  );
};
