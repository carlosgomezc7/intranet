## 1. Database Schema & Migration

- [x] 1.1 Create migration `014_collaboration_suite.sql` defining `posts`, `post_reactions`, `post_comments`, `polls`, `poll_votes`, `kudos`, `manuals`, `manual_chapters`, `manual_articles`, `ideas`, `idea_votes`, `town_halls`, `town_hall_questions` with foreign keys, indexes, and org RLS policies.
- [x] 1.2 Update system permissions seed in `014_collaboration_suite.sql` to include new permissions: `feed:create`, `feed:read`, `feed:comment`, `manuals:manage`, `ideas:submit`, `ideas:vote`, `ideas:moderate`, `townhall:manage`, `townhall:qna`.

## 2. Navigation & Data Types

- [x] 2.1 Update `src/lib/types.ts` with TypeScript interfaces for `Post`, `PostReaction`, `Poll`, `Kudos`, `Manual`, `ManualChapter`, `ManualArticle`, `Idea`, `TownHall`, and `TownHallQuestion`.
- [x] 2.2 Update `DOCK_NAV_ITEMS` in `src/lib/constants.ts` to add macOS Dock navigation items for Muro (`/feed`), Manuales (`/manuals`), Ideas (`/ideas`), and Town Hall (`/townhalls`).

## 3. Server Actions & Backend Core

- [x] 3.1 Create `src/lib/actions/feed.ts` with Server Actions: `createPost`, `addReaction`, `votePoll`, `sendKudos`, `getFeedPosts`.
- [x] 3.2 Create `src/lib/actions/manuals.ts` with Server Actions: `createManual`, `createChapter`, `saveArticleDraft`, `publishArticle`, `getManualsTree`.
- [x] 3.3 Create `src/lib/actions/ideas.ts` with Server Actions: `submitIdea`, `voteIdea`, `updateIdeaStatus`, `getIdeasBoard`.
- [x] 3.4 Create `src/lib/actions/townhalls.ts` with Server Actions: `scheduleTownHall`, `submitQuestion`, `upvoteQuestion`, `updateQuestionStatus`, `rsvpTownHall`.

## 4. User Interface & Realtime Components

- [x] 4.1 Create `/feed` page (`src/app/(intranet)/feed/page.tsx`) and components: `PostComposer.tsx`, `FeedList.tsx`, `PollWidget.tsx`, `KudosModal.tsx` with Supabase Realtime subscriptions.
- [x] 4.2 Create `/manuals` page (`src/app/(intranet)/manuals/page.tsx`) and components: `ManualSidebarTree.tsx`, `ArticleViewer.tsx`, `ArticleEditor.tsx`.
- [x] 4.3 Create `/ideas` page (`src/app/(intranet)/ideas/page.tsx`) and components: `IdeaCard.tsx`, `IdeaModal.tsx`, `IdeaKanbanBoard.tsx`.
- [x] 4.4 Create `/townhalls` page (`src/app/(intranet)/townhalls/page.tsx`) and components: `TownHallCard.tsx`, `LiveQnaPanel.tsx`, `QuestionItem.tsx`.
- [x] 4.5 Ensure full WCAG 2.2 AA accessibility across all 4 new modules: high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-cyan-400`), keyboard navigation, and ARIA live notifications.

## 5. Verification & End-to-End Testing

- [x] 5.1 Test Social Feed: publish post, vote on poll, award Kudos, verify real-time update.
- [x] 5.2 Test Manuals: create manual/chapter, publish article, verify tree navigation.
- [x] 5.3 Test Ideas: submit proposal, upvote idea, promote status to "Aprobada".
- [x] 5.4 Test Town Hall: schedule event, submit live Q&A question, upvote question.
- [x] 5.5 Run `npm run build` and `npx tsc --noEmit` to verify zero TypeScript or build regressions.
