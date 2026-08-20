## Why

Phase 1 established the foundation (Auth, RBAC, Layout, Dashboard, Directory). Phase 2 delivers the core communication engine for 200+ employees: Slack-like real-time chat (channels, DMs, threads, reactions, mentions) powered by Supabase Realtime, plus corporate announcements and a centralized notifications center.

## What Changes

- **NEW**: Database migration `002_chat.sql` for `chat_channels`, `chat_channel_members`, `chat_messages`, `chat_reactions`, `chat_mentions`, and `chat_attachments` with RLS.
- **NEW**: Database migration `007_notifications.sql` for `announcements` and `notifications` with RLS.
- **NEW**: Custom hooks `useChat.ts`, `useRealtime.ts`, and `useNotifications.ts`.
- **NEW**: Chat components in `src/components/chat/`: `ChannelList`, `MessageList`, `MessageInput`, `MessageBubble`, `ThreadPanel`, `ReactionPicker`, and `ChannelHeader`.
- **NEW**: Full-featured chat interface at `/chat` and `/chat/[channelId]`.
- **NEW**: Announcements page at `/announcements` with priority tags and category filters.
- **NEW**: Notifications center at `/notifications` with mark-as-read and action redirects.
- **MODIFY**: TopBar notification indicator with live unread counter.
- **MODIFY**: DockSidebar badge for chat and notifications.

## Capabilities

### New Capabilities
- `chat/channels`: Channel creation, membership management, public/private channel types, and direct messages (DMs).
- `chat/messages`: Realtime messaging, reply threads, emoji reactions, user mentions (@), and file attachments.
- `announcements/corporate`: Publishing, pinning, and filtering company-wide and department-specific announcements.
- `notifications/center`: In-app notification center receiving realtime events with direct action deep-links.

### Modified Capabilities
_(No existing specs modified in this phase)_

## Impact

### Affected Code & Systems
- Database: 8 new tables with Supabase Realtime replication enabled on `chat_messages` and `notifications`.
- UI: New routes `/chat`, `/chat/[channelId]`, `/announcements`, `/notifications`.
- Dependencies: Uses Supabase Realtime client (already installed via `@supabase/ssr` / `@supabase/supabase-js`).
