## Context

When organizations scale from 50 to 200 employees, the Dunbar limit (150 individuals) is surpassed, and bilateral communication complexity surges combinatorially to $r = \frac{200 \times 199}{2} = 19,900$ potential channels. This transition causes communication breakdowns, functional silos, and loss of informal tribal knowledge. Elevate Intranet must bridge this gap by transitioning from a basic tool to a comprehensive sociotechnical orchestration platform.

## Goals / Non-Goals

**Goals:**
- Implement structured corporate communication with micro-targeting and mandatory read confirmations.
- Support real-time interactive organizational chart and skill-tagging talent discovery.
- Establish a governed knowledge repository with 90-day review lifecycles and semantic search.
- Provide cross-functional project hubs and communities of practice to combat organizational silos.
- Facilitate peer recognition (kudos) and automated new hire onboarding pathways.
- Deliver executive adoption KPIs (WAU $\ge 75-80\%$, DAU/MAU $\ge 60\%$, Search effectiveness $\ge 85\%$, Document freshness $\ge 70\%$, Onboarding activation $<48\text{h}$).

**Non-Goals:**
- External customer-facing social network features.
- Full ERP / payroll accounting engine (payroll remains focused on receipt distribution and CONTPAQi/NOI ingestion).

## Decisions

### Decision 1: Relational & Vector Search Architecture for Knowledge & Talent

**Choice**: PostgreSQL text search combined with JSONB arrays for skill tags and full-text search indexes (`tsvector`) for knowledge articles.

**Rationale**: Supabase's native PostgreSQL provides full-text search, GIN indexes, and pgvector extensions without introducing external dependencies (like Elasticsearch or Pinecone) at the 200-user scale.

### Decision 2: Read Receipts Architecture (*Acuse de Recibo*)

**Choice**: Explicit table `announcement_read_receipts (announcement_id, profile_id, read_at, confirmed_at)`.

**Rationale**: Guarantees non-repudiation for urgent HR/safety communications and allows HR managers to filter who has/has not confirmed receipt in real time.

### Decision 3: Interactive Org Chart Component

**Choice**: SVG-based recursive tree layout with CSS transition zoom/pan, integrated with the existing macOS-dock theme and glassmorphism design tokens.

**Rationale**: Pure React 19 + SVG components provide high performance for a 200-node graph without bloated third-party chart libraries.

### Decision 4: 90-Day Freshness Lifecycle Automation

**Choice**: Database cron function / scheduled edge trigger flagging documents where `CURRENT_DATE - last_reviewed_at > INTERVAL '90 days'`.

**Rationale**: Automated background check keeps the knowledge base clean without requiring manual audits by administrators.

## Data Model Extensions

```sql
-- Knowledge Repository
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    version TEXT DEFAULT '1.0',
    last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'stale', 'archived', 'draft')),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Read Receipts for Strategic Announcements
CREATE TABLE IF NOT EXISTS public.announcement_read_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (announcement_id, profile_id)
);

-- Peer-to-Peer Kudos & Recognition
CREATE TABLE IF NOT EXISTS public.peer_kudos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    core_value TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## Risks / Trade-offs

- **[Risk] High volume of kudos/reactions causing notification fatigue** → *Mitigation*: Daily digest options and mute settings in `user_preferences`.
- **[Risk] Document owners ignoring 90-day review notifications** → *Mitigation*: Automatic escalation notifications to department managers after 14 days of unresolved review flags.
- **[Risk] Org chart performance with complex nested hierarchies** → *Mitigation*: Client-side node virtualization and lazy-loading of deep department branches.
