# knowledge/repository Specification

## Purpose
Establishes a governed institutional knowledge repository for standard operating procedures (SOPs), corporate policies, and technical manuals, enforcing strict document ownership, version control, automated 90-day freshness cycles, and natural language semantic search.

## Requirements

### Requirement: Document ownership and version governance
The system SHALL require every published knowledge article, procedure, or policy to have an assigned owner (profile_id), department, category, and revision history.

#### Scenario: Publishing a new SOP
- **WHEN** an authorized manager creates a standard operating procedure in `/knowledge`
- **THEN** the system SHALL record the author, designate the assigned owner, assign version `1.0`, and register an audit log entry in `document_revisions`

### Requirement: Automated 90-day freshness review cycle
The system SHALL track the `last_reviewed_at` timestamp for each document and automatically flag documents reaching 90 days without review as `stale` / `requiring_review`.

#### Scenario: Expiration review notification
- **WHEN** a document exceeds 90 days since its last approved review date
- **THEN** the system SHALL send an automated notification to the document owner and display a "Requiere Revisión (90 días)" badge in the knowledge dashboard

### Requirement: Semantic and natural language search
The system SHALL provide a search interface supporting natural language queries, keyword matching, and faceted filters by department, document type, and tag.

#### Scenario: Natural language query resolution
- **WHEN** an employee enters a question such as "cómo tramitar gastos de viaje" in the global search
- **THEN** the search engine SHALL return relevant travel policy articles ranked by semantic relevance with direct link anchors to the pertinent section
