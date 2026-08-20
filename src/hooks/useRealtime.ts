"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

interface UseRealtimeOptions {
  table: string;
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  schema?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvent: (payload: any) => void;
}

export function useRealtime({
  table,
  filter,
  event = "*",
  schema = "public",
  onEvent,
}: UseRealtimeOptions) {
  const supabase = createClient();

  useEffect(() => {
    const channelName = `realtime_${table}_${filter || "all"}_${Date.now()}`;
    const channel: RealtimeChannel = supabase.channel(channelName);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscriptionConfig: any = {
      event,
      schema,
      table,
    };

    if (filter) {
      subscriptionConfig.filter = filter;
    }

    channel
      .on("postgres_changes", subscriptionConfig, (payload) => {
        onEvent(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, event, schema, onEvent, supabase]);
}
