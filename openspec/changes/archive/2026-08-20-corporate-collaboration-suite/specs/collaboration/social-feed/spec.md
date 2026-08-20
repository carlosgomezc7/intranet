## Purpose

Provides a corporate social communication wall allowing employees to publish updates, conduct interactive polls, give peer recognition (Kudos), share attachments, and engage in threaded discussions.

## ADDED Requirements

### Requirement: Interactive Corporate Social Feed
The system SHALL provide a central social feed page at `/feed` displaying chronological posts created within the user's organization, supporting rich text, file attachments, image previews, and pinned announcements.

#### Scenario: Employee publishes a rich social post
- **WHEN** an authenticated user writes a post with text and optional media attachments on `/feed` and clicks "Publicar"
- **THEN** the system SHALL create the post record in PostgreSQL under `public.posts`, broadcast it via Supabase Realtime to all online org members, and provide an ARIA live feedback announcement "Publicación compartida con éxito"

#### Scenario: Reacting and commenting on posts
- **WHEN** a user selects a reaction emoji or submits a comment on a feed post
- **THEN** the system SHALL record the reaction in `public.post_reactions` or insert the comment in `public.post_comments`, updating the engagement counters in real time

### Requirement: Interactive Polling and Surveys
The system SHALL enable users to attach polls with single or multiple choice options to feed posts, tracking unique votes per user and calculating real-time percentage distributions.

#### Scenario: User submits a vote on a poll
- **WHEN** an employee selects an option in an active feed poll and clicks "Votar"
- **THEN** the system SHALL record the vote in `public.poll_votes`, prevent duplicate voting by the same user, and instantly refresh option percentages with high-contrast visual bars

### Requirement: Peer Recognition and Kudos Badges
The system SHALL provide a peer recognition tool ("Muro de Reconocimientos / Kudos") allowing employees to publicly praise colleagues by selecting recognition badges (e.g., "Líder de Equipo", "Innovador del Mes", "Compañerismo Exemplar") with a custom message.

#### Scenario: Manager awards a Kudos badge to an employee
- **WHEN** a user submits a Kudos form selecting a recipient, badge type, and appreciation note
- **THEN** the system SHALL publish the Kudos post to the social feed with a gold highlight border, notify the recipient, and increment the recipient's recognition score
