## Purpose

Enables managers and HR to broadcast corporate announcements, pin critical notices, and segment visibility by department.

## ADDED Requirements

### Requirement: Priority announcements and pinning
The system SHALL support publishing announcements with priority tags (`urgent`, `high`, `normal`, `low`) and pinning important notices to the top of the feed.

#### Scenario: Viewing a pinned urgent notice
- **GIVEN** an urgent company announcement published by HR
- **WHEN** an employee visits `/announcements` or `/dashboard`
- **THEN** the urgent announcement SHALL appear pinned at the top with a distinct warning badge
