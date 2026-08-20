# layout/topbar Specification

## Purpose
Provides a header bar with global search, quick action shortcuts, notification summary, and a user profile dropdown menu.

## Requirements

### Requirement: Top bar header layout
The system SHALL provide a persistent top navigation bar containing global search input, notification bell trigger, and user profile avatar with dropdown actions.

#### Scenario: User profile dropdown actions
- **GIVEN** an authenticated user on any intranet page
- **WHEN** clicking on the user profile avatar in the top bar
- **THEN** a menu SHALL appear offering "Mi Perfil", "Configuración", "Reportar problema", and "Cerrar sesión"
