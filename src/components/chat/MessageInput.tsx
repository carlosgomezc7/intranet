"use client";

import React, { useState, useRef } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  channelName: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  channelName,
}) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        onSendMessage(content);
        setContent("");
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSendMessage(content);
      setContent("");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="p-3 sm:p-4 bg-slate-950/60 border-t border-sky-500/15"
    >
      <div className="relative glass-panel rounded-2xl border border-sky-500/20 p-2 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={`Enviar mensaje a #${channelName}... (Enter para enviar)`}
          aria-label={`Mensaje para ${channelName}`}
          className="w-full bg-transparent border-0 text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none resize-none px-2 py-1 max-h-32"
        />

        <div className="flex items-center justify-between pt-2 border-t border-sky-500/10 px-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Adjuntar archivo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Paperclip className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Agregar emoji"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Smile className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim()}
            aria-label="Enviar mensaje"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-semibold hover:from-sky-500 hover:to-cyan-400 shadow-md shadow-sky-600/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </form>
  );
};
