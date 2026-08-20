"use client";

import React, { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationsHeader } from "@/components/intranet/notifications/NotificationsHeader";
import { NotificationsFilters } from "@/components/intranet/notifications/NotificationsFilters";
import { NotificationsList } from "@/components/intranet/notifications/NotificationsList";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const displayedNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      <NotificationsHeader unreadCount={unreadCount} onMarkAllAsRead={markAllAsRead} />

      <NotificationsFilters
        filter={filter}
        setFilter={setFilter}
        totalCount={notifications.length}
        unreadCount={unreadCount}
      />

      <NotificationsList
        notifications={displayedNotifications}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
}
