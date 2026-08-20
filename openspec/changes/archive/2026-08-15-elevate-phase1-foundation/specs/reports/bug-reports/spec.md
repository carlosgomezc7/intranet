## Purpose

Enables users to submit bug reports and feature improvement proposals directly through a simple form requesting name, email, phone, description, and optional attachment.

## ADDED Requirements

### Requirement: Simple issue and suggestion reporting
The system SHALL provide a dedicated form at `/report` with fields for Nombre, Correo, Teléfono, Tipo (Fallo / Mejora / Sugerencia), Descripción, and optional file/photo upload.

#### Scenario: Submitting a bug report with attachment
- **GIVEN** a user with a bug or improvement idea
- **WHEN** submitting the form with valid fields and an attached screenshot
- **THEN** the system SHALL record the report in `bug_reports`, upload the attachment, and display a confirmation message with a reference ID
