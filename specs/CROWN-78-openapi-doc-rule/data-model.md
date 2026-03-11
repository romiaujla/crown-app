# Data Model: CROWN-78 OpenAPI Doc Rule

## Documentation Entities

### OpenAPI Source Of Truth

- **Definition**: The manually maintained OpenAPI document at `apps/api/src/docs/openapi.ts`.
- **Role in `CROWN-78`**: The target file that must stay aligned with API route changes.
- **Rules**:
  - Creating API routes requires adding corresponding documentation.
  - Editing API routes requires updating corresponding documentation when the documented contract or behavior changes.
  - Deleting API routes requires removing or revising corresponding documentation.

### Agent Workflow Guidance

- **Definition**: Repository instructions consumed by AI agents during implementation work.
- **Primary file**: `AGENTS.md`
- **Role in `CROWN-78`**: Operationally direct contributors to keep `openapi.ts` in sync during API work.

### Engineering Governance Guidance

- **Definition**: Canonical policy statements that govern repository engineering behavior.
- **Primary file**: `docs/process/engineering-constitution.md`
- **Role in `CROWN-78`**: Elevate the OpenAPI maintenance rule into the repository’s formal engineering standards.

### Spec Kit Workflow Guidance

- **Definition**: Planning and execution guidance for major features.
- **Primary file**: `docs/process/spec-kit-workflow.md`
- **Role in `CROWN-78`**: Ensure feature planning and implementation expectations call out OpenAPI maintenance when API routes change.

## Validation Surfaces

### Guidance Consistency

- **Definition**: Alignment between `AGENTS.md`, the constitution, and Spec Kit workflow text.
- **Rules**:
  - The rule wording can vary by context but must not conflict.
  - The guidance must accurately reflect that `openapi.ts` is manually maintained.

### Scope Boundary

- **Definition**: The story’s intentional limit to documentation/process changes only.
- **Rules**:
  - No automatic route-to-OpenAPI generation is required.
  - No CI enforcement or lint rule is required in this story.
