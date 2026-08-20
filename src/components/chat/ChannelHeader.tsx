"use client";

import React from "react";
import { ChatChannel } from "@/lib/types";
import { Hash, Lock, Users, Info } from "lucide-react";

interface ChannelHeaderProps {
  channel: ChatChannel;
}

export const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channel }) => {
  return (
    <div className="h-14 border-b border-sky-500/15 bg-slate-950/40 px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 min-w-0">
        {channel.type === "private" ? (
          <Lock className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
        ) : (
          <Hash className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
        )}
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-white truncate">
            {channel.name}
          </h1>
          {channel.description && (
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {channel.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-sky-500/15 text-slate-300 text-xs font-medium">
          <Users className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
          <span>{channel.members_count || 200}</span>
        </div>

        <button
          type="button"
          aria-label="Detalles del canal"
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Info className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
