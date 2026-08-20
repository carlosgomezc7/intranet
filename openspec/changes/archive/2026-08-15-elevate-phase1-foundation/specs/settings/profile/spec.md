## Purpose

Allows employees to view and update their personal profile details, contact information, avatar, and system preferences.

## ADDED Requirements

### Requirement: Profile editing and persistence
The system SHALL allow users to update their full name, phone number, avatar URL, and theme preferences, saving changes directly to their profile record in Supabase.

#### Scenario: Successful profile update
- **GIVEN** an authenticated user on `/settings`
- **WHEN** updating their phone number and clicking "Guardar cambios"
- **THEN** the profile SHALL be updated and a confirmation toast message SHALL appear
