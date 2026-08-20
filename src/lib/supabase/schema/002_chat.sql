-- ==============================================================================
-- ELEVATE INTRANET B2B — 002_chat.sql
-- Realtime Corporate Chat Schema, Channels, Messages & Row Level Security (RLS)
-- ==============================================================================

-- 1. CHAT CHANNELS TABLE
CREATE TABLE IF NOT EXISTS public.chat_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'public' CHECK (type IN ('public', 'private', 'dm', 'group_dm')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    avatar_url TEXT,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CHAT CHANNEL MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.chat_channel_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES public.chat_channels(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_muted BOOLEAN DEFAULT false,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (channel_id, profile_id)
);

-- 3. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES public.chat_channels(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    content TEXT NOT NULL,
    parent_message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CHAT REACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.chat_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (message_id, profile_id, emoji)
);

-- 5. CHAT ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS public.chat_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- RLS POLICIES FOR CHAT
-- ==============================================================================

ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_attachments ENABLE ROW LEVEL SECURITY;

-- Channels Policies
CREATE POLICY "Users can view public channels or private channels they belong to" ON public.chat_channels
    FOR SELECT USING (
        org_id = public.get_user_org_id()
        AND (
            type = 'public'
            OR EXISTS (
                SELECT 1 FROM public.chat_channel_members m
                WHERE m.channel_id = chat_channels.id
                AND m.profile_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create channels in their organization" ON public.chat_channels
    FOR INSERT WITH CHECK (org_id = public.get_user_org_id());

-- Channel Members Policies
CREATE POLICY "Members can view channel memberships" ON public.chat_channel_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_channels c
            WHERE c.id = chat_channel_members.channel_id
            AND c.org_id = public.get_user_org_id()
        )
    );

CREATE POLICY "Users can join public channels or be added by admins" ON public.chat_channel_members
    FOR INSERT WITH CHECK (
        profile_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.chat_channels c
            WHERE c.id = chat_channel_members.channel_id
            AND c.org_id = public.get_user_org_id()
            AND (c.created_by = auth.uid() OR public.get_user_role() IN ('super_admin', 'admin'))
        )
    );

-- Messages Policies
CREATE POLICY "Users can view messages in channels they have access to" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_channels c
            WHERE c.id = chat_messages.channel_id
            AND c.org_id = public.get_user_org_id()
            AND (
                c.type = 'public'
                OR EXISTS (
                    SELECT 1 FROM public.chat_channel_members m
                    WHERE m.channel_id = c.id AND m.profile_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Channel members can post messages" ON public.chat_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.chat_channels c
            WHERE c.id = chat_messages.channel_id
            AND c.org_id = public.get_user_org_id()
        )
    );

-- Reactions Policies
CREATE POLICY "Users can view reactions in their accessible channels" ON public.chat_reactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_messages m
            JOIN public.chat_channels c ON c.id = m.channel_id
            WHERE m.id = chat_reactions.message_id
            AND c.org_id = public.get_user_org_id()
        )
    );

CREATE POLICY "Users can add/remove own reactions" ON public.chat_reactions
    FOR ALL USING (profile_id = auth.uid());
