-- ==============================================================================
-- ELEVATE INTRANET B2B — 014_collaboration_suite.sql
-- Corporate Collaboration Suite: Feeds, Kudos, Polls, Manuals, Ideas & Town Halls
-- ==============================================================================

-- 1. POSTS TABLE (Social Feed)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    post_type TEXT NOT NULL DEFAULT 'post' CHECK (post_type IN ('post', 'poll', 'kudos', 'announcement')),
    attachment_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. POST REACTIONS & COMMENTS
CREATE TABLE IF NOT EXISTS public.post_reactions (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    emoji TEXT NOT NULL DEFAULT '👍',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (post_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. POLLS & VOTES
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of string options e.g. ["Opción A", "Opción B"]
    allow_multiple BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    option_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (poll_id, user_id, option_index)
);

-- 4. KUDOS (PEER RECOGNITION)
CREATE TABLE IF NOT EXISTS public.kudos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    badge_type TEXT NOT NULL, -- e.g. 'team_player', 'innovator', 'leadership'
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. MANUALS & SOPS
CREATE TABLE IF NOT EXISTS public.manuals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    icon TEXT DEFAULT 'BookOpen',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.manual_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manual_id UUID REFERENCES public.manuals(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.manual_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID REFERENCES public.manual_chapters(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. IDEAS CROWDSOURCING
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    status TEXT NOT NULL DEFAULT 'under_review' CHECK (status IN ('draft', 'under_review', 'approved', 'in_development', 'implemented', 'rejected')),
    votes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.idea_votes (
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (idea_id, user_id)
);

-- 7. TOWN HALL & LIVE EVENTS
CREATE TABLE IF NOT EXISTS public.town_halls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    stream_url TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.town_hall_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    town_hall_id UUID REFERENCES public.town_halls(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answering', 'answered', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. INDEXES & RLS POLICIES
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.town_halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.town_hall_questions ENABLE ROW LEVEL SECURITY;

-- Read policies scoped to user organization
CREATE POLICY "Users read posts in org" ON public.posts FOR SELECT USING (org_id = public.get_user_org_id());
CREATE POLICY "Users manage posts in org" ON public.posts FOR ALL USING (org_id = public.get_user_org_id());
CREATE POLICY "Users read manuals in org" ON public.manuals FOR SELECT USING (org_id = public.get_user_org_id());
CREATE POLICY "Users manage manuals in org" ON public.manuals FOR ALL USING (org_id = public.get_user_org_id());
CREATE POLICY "Users read ideas in org" ON public.ideas FOR SELECT USING (org_id = public.get_user_org_id());
CREATE POLICY "Users manage ideas in org" ON public.ideas FOR ALL USING (org_id = public.get_user_org_id());
CREATE POLICY "Users read town halls in org" ON public.town_halls FOR SELECT USING (org_id = public.get_user_org_id());
CREATE POLICY "Users manage town halls in org" ON public.town_halls FOR ALL USING (org_id = public.get_user_org_id());

-- 9. SYSTEM PERMISSIONS SEED
INSERT INTO public.permissions (resource, action, description) VALUES
    ('feed', 'create', 'Publicar en el muro corporativo'),
    ('feed', 'read', 'Ver publicaciones del muro corporativo'),
    ('feed', 'comment', 'Comentar y reaccionar en publicaciones'),
    ('manuals', 'manage', 'Crear y editar manuales y SOPs'),
    ('ideas', 'submit', 'Enviar ideas al buzón de innovación'),
    ('ideas', 'vote', 'Votar por ideas de colaboradores'),
    ('ideas', 'moderate', 'Aprobar y cambiar estado de ideas'),
    ('townhall', 'manage', 'Programar y transmitir Town Halls'),
    ('townhall', 'qna', 'Enviar y votar preguntas en Town Halls')
ON CONFLICT (resource, action) DO NOTHING;
