## Purpose

Provides corporate Town Hall event management and live interactive Q&A capabilities, allowing company-wide virtual all-hands sessions with moderated question submission and attendee upvoting.

## ADDED Requirements

### Requirement: Town Hall Event Scheduling and RSVP
The system SHALL provide an event management portal at `/townhalls` allowing executive leaders and HR managers to schedule company-wide Town Hall events, attach video/stream links, and collect attendee RSVPs.

#### Scenario: Executive schedules a Town Hall event
- **WHEN** an administrator creates a Town Hall titled "Reunión Trimestral Q3 2026" with date, time, and stream URL
- **THEN** the system SHALL create the `town_halls` record, publish an announcement to the feed, and enable RSVP tracking for all employees

### Requirement: Interactive Moderated Live Q&A
The system SHALL allow employees to submit questions prior to or during a Town Hall event, upvote questions submitted by peers, and allow event moderators to mark questions as "En Respuesta" or "Responded".

#### Scenario: Employee submits and upvotes a Town Hall question
- **WHEN** an employee submits a question "¿Cuáles son las metas de crecimiento para el próximo semestre?" and peers click the upvote button
- **THEN** the system SHALL record the question in `public.town_hall_questions`, sort questions dynamically by vote count on the moderator screen, and update question status in real time
