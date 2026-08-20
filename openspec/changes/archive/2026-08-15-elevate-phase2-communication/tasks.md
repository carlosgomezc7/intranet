## 1. Database Migrations & Realtime Setup

- [x] 1.1 Create `src/lib/supabase/schema/002_chat.sql` with tables for chat_channels, chat_channel_members, chat_messages, chat_reactions, chat_mentions, and chat_attachments with RLS [NEW]
- [x] 1.2 Create `src/lib/supabase/schema/007_notifications.sql` with tables for announcements and notifications with RLS [NEW]
- [x] 1.3 Update `src/lib/types.ts` with TypeScript interfaces for chat and notifications [MODIFY]

## 2. Realtime Custom Hooks

- [x] 2.1 Create `src/hooks/useRealtime.ts` for generic Supabase Realtime subscriptions [NEW]
- [x] 2.2 Create `src/hooks/useChat.ts` managing channel messages, sending, typing, and reactions [NEW]
- [x] 2.3 Create `src/hooks/useNotifications.ts` managing unread notifications and realtime push [NEW]

## 3. Chat Components & Views

- [x] 3.1 Create `src/components/chat/ChannelList.tsx` for browsing public/private channels and DMs [NEW]
- [x] 3.2 Create `src/components/chat/MessageBubble.tsx` rendering message content, sender avatar, timestamps, and reactions [NEW]
- [x] 3.3 Create `src/components/chat/MessageInput.tsx` with textarea, emoji picker trigger, and file attachment [NEW]
- [x] 3.4 Create `src/components/chat/ChannelHeader.tsx` with channel topic, member count, and search [NEW]
- [x] 3.5 Create `src/app/(intranet)/chat/page.tsx` and `src/app/(intranet)/chat/[channelId]/page.tsx` assembling full chat client [NEW]

## 4. Announcements & Notifications Views

- [x] 4.1 Create `src/app/(intranet)/announcements/page.tsx` with priority tags, pinning, and department filters [NEW]
- [x] 4.2 Create `src/app/(intranet)/notifications/page.tsx` with mark-as-read, filter by category, and action deep-links [NEW]

## 5. Verification & Build

- [x] 5.1 Run `npm run build` to verify clean compilation of all Phase 2 routes
