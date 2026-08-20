# collaboration/manuals Specification

## Purpose

Provides a structured organizational knowledge base organized by Manuals, Chapters, and Articles for company policies, standard operating procedures (SOPs), and onboarding guides.

## Requirements

### Requirement: Hierarchical Manual and Chapter Management
The system SHALL provide a structured documentation navigation interface at `/manuals` organizing articles into top-level Manuals (e.g., "Políticas de RH", "Manual de Código", "SOPs Operativos") and nested Chapters.

#### Scenario: HR Manager creates a new Manual and Chapter
- **WHEN** an authorized user submits a new manual title and chapter structure in `/manuals`
- **THEN** the system SHALL create the corresponding `manuals` and `manual_chapters` database records and display them in the hierarchical sidebar tree

### Requirement: Versioned Article Editor and Approval Workflow
The system SHALL provide a rich content editor for creating and updating articles with revision tracking, draft auto-save, and optional manager approval before publishing.

#### Scenario: Publishing an updated SOP article
- **WHEN** an author edits an existing article and submits "Publicar versión"
- **THEN** the system SHALL increment the article version number, update `manual_articles.published_at`, log the revision history, and make the article searchable across the intranet
