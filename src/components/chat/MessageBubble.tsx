"use client";

import React, { useState } from "react";
import { ChatMessage } from "@/lib/types";
import { Avatar } from "@/components/shared/Avatar";
import { } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
  onReact?: (messageId: string, emoji: string) => void;
}

const QUICK_EMOJIS = ["👍", "❤️", "🚀", "🙌", "🔥"];

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReact,
}) => {
  const [] = useState(false);

  const senderName = message.sender?.full_name || "Colaborador";
  const senderRole = message.sender?.job_title || message.sender?.role || "Personal";
  const formattedTime = new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(message.created_at));

  return (
    <div className="group relative flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-900/50 transition-colors">
      <Avatar name={senderName} src={message.sender?.avatar_url} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-white truncate">{senderName}</span>
          <span className="text-[10px] text-sky-400 font-medium">{senderRole}</span>
          <span className="text-[10px] text-slate-500">{formattedTime}</span>
          {message.status === "sending" && (
            <span className="text-[10px] text-slate-500 italic">enviando...</span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Reactions List */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.reactions.map((reaction) => (
              <button
                key={reaction.id}
                type="button"
                onClick={() => onReact && onReact(message.id, reaction.emoji)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-sky-500/20 text-xs text-slate-200 transition-colors"
              >
                <span>{reaction.emoji}</span>
                <span className="text-[10px] font-semibold text-sky-300">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover Action Bar */}
      <div className="absolute right-3 top-3 hidden group-hover:flex items-center gap-1 bg-slate-900/90 border border-sky-500/20 rounded-xl p-1 shadow-lg backdrop-blur-md z-10 animate-slide-up">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onReact && onReact(message.id, emoji)}
            className="p-1 rounded-lg hover:bg-slate-800 text-xs transition-transform hover:scale-125"
            aria-label={`Reaccionar con ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
