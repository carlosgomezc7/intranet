"use client";

import React, { useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChannelList } from "@/components/chat/ChannelList";
import { ChannelHeader } from "@/components/chat/ChannelHeader";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";

export default function ChatPage() {
  const { channels, messages, activeChannel, sendMessage, addReaction } = useChat("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-[calc(100vh-8rem)] glass-panel rounded-3xl border border-sky-500/20 overflow-hidden flex flex-col sm:flex-row shadow-2xl animate-slide-up">
      {/* Channels Sidebar */}
      <ChannelList channels={channels} activeChannelId="general" />

      {/* Main Conversation Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-950/20">
        <ChannelHeader channel={activeChannel} />

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onReact={addReaction}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Message Input */}
        <MessageInput
          onSendMessage={sendMessage}
          channelName={activeChannel.name}
        />
      </div>
    </div>
  );
}
