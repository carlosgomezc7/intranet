"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";
import { ChatChannel, ChatMessage, ChatReaction } from "@/lib/types";

// Default Initial Channels Mock for Instant Presentation & Live Fallback
const DEFAULT_CHANNELS: ChatChannel[] = [
  {
    id: "general",
    org_id: "default",
    name: "general",
    description: "Anuncios, noticias y temas de interés para toda la empresa",
    type: "public",
    created_by: null,
    avatar_url: null,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    unread_count: 0,
    members_count: 200,
  },
  {
    id: "tecnologia",
    org_id: "default",
    name: "tecnología-devops",
    description: "Desarrollo, infraestructura AWS, despliegues y sistemas",
    type: "public",
    created_by: null,
    avatar_url: null,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    unread_count: 2,
    members_count: 18,
  },
  {
    id: "recursos-humanos",
    org_id: "default",
    name: "rh-comunicacion",
    description: "Dudas de personal, eventos, beneficios y comunicados",
    type: "public",
    created_by: null,
    avatar_url: null,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    unread_count: 0,
    members_count: 200,
  },
  {
    id: "proyectos-estrategicos",
    org_id: "default",
    name: "proyectos-2026",
    description: "Canal privado para seguimiento de iniciativas estratégicas",
    type: "private",
    created_by: null,
    avatar_url: null,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    unread_count: 0,
    members_count: 12,
  },
];

const DEFAULT_MESSAGES: { [channelId: string]: ChatMessage[] } = {
  general: [
    {
      id: "msg-1",
      channel_id: "general",
      sender_id: "usr-1",
      content: "¡Bienvenidos a la nueva intranet de Elevate! 🚀 Cualquier duda con accesos o módulos pueden consultar en este canal.",
      parent_message_id: null,
      is_edited: false,
      is_deleted: false,
      metadata_json: {},
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      sender: {
        id: "usr-1",
        org_id: "default",
        email: "admin@elevate.com.mx",
        full_name: "Administrador",
        avatar_url: null,
        role: "admin",
        department_id: null,
        job_title: "Administrador",
        phone: null,
        hire_date: "2024-01-15",
        is_active: true,
        settings_json: {},
        created_at: "",
        updated_at: "",
      },
      reactions: [
        { id: "r1", message_id: "msg-1", profile_id: "usr-2", emoji: "🚀", count: 8, created_at: "" },
        { id: "r2", message_id: "msg-1", profile_id: "usr-3", emoji: "🙌", count: 5, created_at: "" },
      ],
    },
    {
      id: "msg-2",
      channel_id: "general",
      sender_id: "usr-2",
      content: "Excelente plataforma. El diseño estilo macOS y la velocidad de carga están increíbles.",
      parent_message_id: null,
      is_edited: false,
      is_deleted: false,
      metadata_json: {},
      created_at: new Date(Date.now() - 1800000).toISOString(),
      updated_at: new Date(Date.now() - 1800000).toISOString(),
      sender: {
        id: "usr-2",
        org_id: "default",
        email: "mariana.silva@elevate.com.mx",
        full_name: "Mariana Silva",
        avatar_url: null,
        role: "manager",
        department_id: null,
        job_title: "Directora de Operaciones",
        phone: null,
        hire_date: "2024-02-01",
        is_active: true,
        settings_json: {},
        created_at: "",
        updated_at: "",
      },
      reactions: [
        { id: "r3", message_id: "msg-2", profile_id: "usr-1", emoji: "❤️", count: 4, created_at: "" },
      ],
    },
  ],
  tecnologia: [
    {
      id: "msg-tech-1",
      channel_id: "tecnologia",
      sender_id: "usr-1",
      content: "Canal listo para coordinar despliegues de la infraestructura y pipelines CI/CD.",
      parent_message_id: null,
      is_edited: false,
      is_deleted: false,
      metadata_json: {},
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString(),
      sender: {
        id: "usr-1",
        org_id: "default",
        email: "admin@elevate.com.mx",
        full_name: "Administrador",
        avatar_url: null,
        role: "admin",
        department_id: null,
        job_title: "Administrador",
        phone: null,
        hire_date: "2024-01-15",
        is_active: true,
        settings_json: {},
        created_at: "",
        updated_at: "",
      },
    },
  ],
};

export function useChat(activeChannelId: string = "general") {
  const { profile } = useUser();
  const [channels] = useState<ChatChannel[]>(DEFAULT_CHANNELS);
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES[activeChannelId] || []);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Load active channel messages from DB or fallback
  useEffect(() => {
    async function loadMessages() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*, sender:profiles(*)")
          .eq("channel_id", activeChannelId)
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          setMessages(data);
        } else {
          setMessages(DEFAULT_MESSAGES[activeChannelId] || []);
        }
      } catch {
        setMessages(DEFAULT_MESSAGES[activeChannelId] || []);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [activeChannelId, supabase]);

  // Send Message with Optimistic Update
  const sendMessage = useCallback(
    async (content: string, attachmentUrls: string[] = []) => {
      if (!content.trim() && attachmentUrls.length === 0) return;

      const tempId = `temp-${Date.now()}`;
      const newMessage: ChatMessage = {
        id: tempId,
        channel_id: activeChannelId,
        sender_id: profile?.id || "anonymous",
        content,
        parent_message_id: null,
        is_edited: false,
        is_deleted: false,
        metadata_json: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender: profile ?? {
          id: "anonymous",
          org_id: "default",
          email: "tu@empresa.com",
          full_name: "Tú",
          avatar_url: null,
          role: "employee",
          department_id: null,
          job_title: "Colaborador",
          phone: null,
          hire_date: "2024-01-01",
          is_active: true,
          settings_json: {},
          created_at: "",
          updated_at: "",
        },
        status: "sending",
      };

      setMessages((prev) => [...prev, newMessage]);

      try {
        if (profile?.id) {
          await supabase.from("chat_messages").insert({
            channel_id: activeChannelId,
            sender_id: profile.id,
            content,
          });
        }
      } catch (err) {
        console.error("Error inserting message to DB:", err);
      }
    },
    [activeChannelId, profile, supabase]
  );

  // Add reaction
  const addReaction = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;

        const existing = msg.reactions || [];
        const found = existing.find((r) => r.emoji === emoji);

        let updatedReactions: ChatReaction[];
        if (found) {
          updatedReactions = existing.map((r) =>
            r.emoji === emoji ? { ...r, count: (r.count || 1) + 1 } : r
          );
        } else {
          updatedReactions = [
            ...existing,
            {
              id: `r-${Date.now()}`,
              message_id: messageId,
              profile_id: "current",
              emoji,
              count: 1,
              created_at: new Date().toISOString(),
            },
          ];
        }

        return { ...msg, reactions: updatedReactions };
      })
    );
  }, []);

  return {
    channels,
    messages,
    loading,
    sendMessage,
    addReaction,
    activeChannel: channels.find((c) => c.id === activeChannelId) || channels[0],
  };
}
