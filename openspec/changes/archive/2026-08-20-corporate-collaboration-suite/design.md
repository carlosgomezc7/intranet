## Context

See [proposal.md](proposal.md) for background and motivation. The ELEVATE platform has core intranet foundations (Auth, Dashboard, Directory, Chat, File Management, Payroll, Attendance). To complete the enterprise collaboration capabilities, ELEVATE requires four interconnected collaboration modules: Social Feed ("Muro"), Knowledge Manuals & SOPs, Idea Crowdsourcing ("Buzón de Ideas"), and Town Hall Interactive Live Events.

## Goals / Non-Goals

**Goals:**
- Provide relational schema `014_collaboration_suite.sql` covering feeds, reactions, polls, kudos, manuals, ideas, and town hall Q&As with organization-scoped RLS policies.
- Implement real-time updates for social feed posts, reactions, idea voting, and Town Hall live Q&A via Supabase Realtime subscriptions.
- Integrate WCAG 2.2 AA compliant UI components matching ELEVATE's macOS Dock navigation and glassmorphism design system.
- Enforce Zero-Trust access through `user_permission_overrides` and hierarchy guardrails.

**Non-Goals:**
- External third-party social media cross-posting.
- Native video streaming infrastructure (Town Halls link out to Zoom, Teams, YouTube Live, or custom RTMP URLs).

## Decisions

### Decision 1: Relational Schema vs Unstructured Storage
- **Choice**: Dedicated PostgreSQL tables (`posts`, `post_reactions`, `polls`, `poll_votes`, `kudos`, `manuals`, `manual_chapters`, `manual_articles`, `ideas`, `idea_votes`, `town_halls`, `town_hall_questions`) linked to `profiles(id)` and `organizations(id)`.
- **Rationale**: Enables strict database-level RLS isolation (`org_id = public.get_user_org_id()`), performant indexing, cascade deletion, and SQL aggregation for vote totals and reaction counts.

```sql
-- Core Feed Posts
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

-- Kudos (Peer Recognition)
CREATE TABLE IF NOT EXISTS public.kudos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    badge_type TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ideas Crowdsourcing
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
```

### Decision 2: Realtime Architecture for Feed and Town Hall Q&A
- **Choice**: Use Supabase Realtime channel subscriptions on `posts`, `post_reactions`, `ideas`, and `town_hall_questions`.
- **Implementation**: Client components subscribe to Postgres Changes filtered by `org_id`. When a new post or live Q&A vote occurs, the state updates dynamically without requiring full page refreshes.

### Decision 3: Dock Navigation Expansion
- **Choice**: Extend `DOCK_NAV_ITEMS` in `src/lib/constants.ts` to add direct entries:
  - Muro Corporativo (`/feed`, Icon: `MessageCircleHeart`)
  - Manuales & SOPs (`/manuals`, Icon: `BookOpenCheck`)
  - Buzón de Ideas (`/ideas`, Icon: `Lightbulb`)
  - Town Hall (`/townhalls`, Icon: `Radio`)

## Risks / Trade-offs

- **[Risk]** Large volume of feed posts impacting page performance.
  → **Mitigation**: Paginate feed queries using cursor-based infinite scroll (`created_at < cursor`) loading 15 posts per chunk.
- **[Risk]** Spammed or inappropriate ideas submitted to public board.
  → **Mitigation**: RLS policy and Server Action validation allowing admins/managers to reject or moderate any post or idea.

## Migration Plan

1. **SQL Script**: Apply `014_collaboration_suite.sql` creating tables, indexes, and RLS policies.
2. **Types & Constants**: Update `src/lib/types.ts` and `DOCK_NAV_ITEMS` in `src/lib/constants.ts`.
3. **Server Actions & Hooks**: Implement `src/lib/actions/feed.ts`, `src/lib/actions/manuals.ts`, `src/lib/actions/ideas.ts`, `src/lib/actions/townhalls.ts`.
4. **UI Components**: Build `/feed`, `/manuals`, `/ideas`, `/townhalls` page routes and components.
5. **Rollback Strategy**: Drop migration tables and remove dock items.
