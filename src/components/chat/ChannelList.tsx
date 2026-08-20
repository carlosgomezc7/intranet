"use client";

import React from "react";
import Link from "next/link";
import { ChatChannel } from "@/lib/types";
import { Hash, Lock, Plus, MessageSquare } from "lucide-react";

interface ChannelListProps {
  channels: ChatChannel[];
  activeChannelId: string;
  onSelectChannel?: (id: string) => void;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  activeChannelId,
}) => {
  const publicChannels = channels.filter((c) => c.type === "public");
  const privateChannels = channels.filter((c) => c.type === "private");

  return (
    <div className="w-full sm:w-64 border-r border-sky-500/15 bg-slate-950/40 p-4 flex flex-col justify-between select-none">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-500/10">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Canales de Chat
            </h2>
          </div>
          <button
            type="button"
            aria-label="Crear nuevo canal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Public Channels */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 block mb-1.5">
            Canales Públicos
          </span>
          {publicChannels.map((channel) => {
            const isActive = channel.id === activeChannelId;
            return (
              <Link
                key={channel.id}
                href={`/chat/${channel.id}`}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-sky-600/30 to-cyan-500/20 text-cyan-300 border border-sky-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Hash className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} aria-hidden="true" />
                  <span className="truncate">{channel.name}</span>
                </div>
                {channel.unread_count ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 font-bold text-[9px]">
                    {channel.unread_count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Private Channels */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 block mb-1.5">
            Canales Privados
          </span>
          {privateChannels.map((channel) => {
            const isActive = channel.id === activeChannelId;
            return (
              <Link
                key={channel.id}
                href={`/chat/${channel.id}`}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-sky-600/30 to-cyan-500/20 text-cyan-300 border border-sky-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Lock className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-500"}`} aria-hidden="true" />
                  <span className="truncate">{channel.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Online Count Footer */}
      <div className="pt-3 border-t border-sky-500/10 flex items-center gap-2 text-[11px] text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
        <span>200 colaboradores conectados</span>
      </div>
    </div>
  );
};
