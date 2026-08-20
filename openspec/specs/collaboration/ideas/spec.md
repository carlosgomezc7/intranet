# collaboration/ideas Specification

## Purpose

Provides an organizational crowdsourcing platform ("Buzón de Ideas") enabling employees to submit innovative proposals, vote on community ideas, and track implementation stages.

## Requirements

### Requirement: Employee Idea Submission and Voting Board
The system SHALL provide an idea crowdsourcing portal at `/ideas` where employees can submit innovation proposals with categories, tags, and attachments, and vote on community ideas.

#### Scenario: Submitting and upvoting an innovation idea
- **WHEN** an employee submits an idea titled "Optimización de Horarios Híbridos" and another user clicks "Votar (+1)"
- **THEN** the system SHALL record the vote in `public.idea_votes`, update total votes count, and rank popular ideas on the community leaderboard

### Requirement: Idea Lifecycle Stage Management
The system SHALL support tracking ideas across predefined lifecycle stages: `Borrador`, `En Revisión`, `Aprobada`, `En Desarrollo`, and `Implementada`, controlled by authorized managers.

#### Scenario: Admin promotes an idea to Approved status
- **WHEN** an administrator changes an idea status to "Aprobada" with reviewer notes
- **THEN** the system SHALL update `public.ideas.status`, notify the author, and update the idea status badge on the public board
