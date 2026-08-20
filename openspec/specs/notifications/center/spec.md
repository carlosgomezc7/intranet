# notifications/center Specification

## Purpose
Provides a centralized in-app notification center that delivers real-time activity alerts, approval notifications, and mentions with deep-linking action URLs.

## Requirements

### Requirement: Real-time in-app notification delivery
The system SHALL push notifications in real time to the recipient's session when they are mentioned in chat, assigned an approval step, or receive a company announcement.

#### Scenario: Marking notifications as read
- **GIVEN** a user with 3 unread notifications
- **WHEN** the user navigates to `/notifications` and clicks "Marcar todas como leídas"
- **THEN** all notifications SHALL update to read status and the TopBar badge SHALL clear
