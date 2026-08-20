"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";
import { Notification } from "@/lib/types";

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    org_id: "default",
    profile_id: "usr-1",
    type: "approval",
    title: "Nueva Solicitud Asignada",
    body: "Mariana Silva solicitó aprobación para adquisición de licencias Cloud AWS.",
    is_read: false,
    action_url: "/requests",
    metadata_json: {},
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "notif-2",
    org_id: "default",
    profile_id: "usr-1",
    type: "mention",
    title: "Mención en Canal #tecnología-devops",
    body: "Diego Hernández te mencionó: '@carlos.gomez ¿podemos revisar la migración del cluster?'",
    is_read: false,
    action_url: "/chat",
    metadata_json: {},
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "notif-3",
    org_id: "default",
    profile_id: "usr-1",
    type: "announcement",
    title: "Comunicado Institucional Publicado",
    body: "Recursos Humanos publicó: 'Actualización de Protocolos de Seguridad y Accesos'.",
    is_read: true,
    action_url: "/announcements",
    metadata_json: {},
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export function useNotifications() {
  const { profile } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadNotifications() {
      if (!profile?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("profile_id", profile.id)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setNotifications(data);
        }
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [profile, supabase]);

  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );

    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }, [supabase]);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      if (profile?.id) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("profile_id", profile.id);
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  }, [profile, supabase]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}
