# layout/dock-sidebar Specification

## Purpose
Provides a macOS Dock-style navigation experience with smooth visual interactions, active indicators, tooltip labels, and accessible keyboard navigation.

## Requirements

### Requirement: macOS Dock visual styling and behavior
The navigation sidebar SHALL display as a sleek vertical dock on the left side of the screen with rounded icon containers, glowing active indicators, and smooth scale transitions on hover.

#### Scenario: Active route indicator
- **GIVEN** a user navigating through the intranet
- **WHEN** the route matches a dock item (e.g., `/dashboard` or `/directory`)
- **THEN** the dock item SHALL render with an active cyan glow accent and highlight state

### Requirement: Dock tooltips and accessibility
The dock icons SHALL display floating tooltips on hover/focus with Spanish labels and adhere to WCAG 2.2 AA standards with appropriate `aria-label` and `aria-current` attributes.

#### Scenario: Keyboard navigation across dock items
- **GIVEN** a keyboard-only user
- **WHEN** pressing `Tab` or arrow keys across the dock
- **THEN** each item SHALL receive a visible high-contrast focus ring and announce its destination to screen readers
