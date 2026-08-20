## Context

See `proposal.md` for background. Phase 2 implements the Slack-like real-time communication stack using Supabase Realtime (PostgreSQL replication via WebSocket channels `supabase_realtime`), optimistic local state updates in React, and clean UI components for channels, direct messages, message bubbles, reactions, and announcements.

## Goals / Non-Goals

**Goals:**
- Provide database migration `002_chat.sql` with tables for channels, channel memberships, messages, reactions, mentions, and attachments with RLS.
- Provide database migration `007_notifications.sql` with tables for announcements and notifications with RLS.
- Implement reusable React hooks: `useChat`, `useRealtime`, `useNotifications`.
- Build Slack-like chat interface with channel sidebar, active conversation area, message input with emoji/attachment support, and thread panel.
- Implement `/announcements` and `/notifications` pages with filters and action deep-links.

**Non-Goals:**
- Audio/video calling (WebRTC) — out of scope for Phase 2.
- Multi-step approval workflows execution (reserved for Phase 3).

## Decisions

### 1. Supabase Realtime Channels vs Polling
- **Decision**: Use Supabase Realtime `postgres_changes` listener filtered by `channel_id` for instant message delivery.
- **Rationale**: Zero polling latency, optimal battery/network efficiency on client devices, and automatic reconnection handling.

### 2. Optimistic UI Updates on Message Send
- **Decision**: Append message to local React state immediately with a `status: 'sending'` indicator before server confirmation.
- **Rationale**: Delivers instant feedback matching Slack/Discord expectations.

## Risks / Trade-offs

- **[Risk]** WebSocket connection limits on Supabase free tier → **Mitigation**: Unsubscribe from inactive channel channels on unmount; maintain single global notification channel.
