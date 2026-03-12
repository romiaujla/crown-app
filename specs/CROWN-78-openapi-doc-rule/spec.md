# Feature Specification: Require OpenAPI Document Updates For API Route Changes

**Feature Branch**: `feat/CROWN-78-openapi-doc-rule`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: Jira issue `CROWN-78`

## Summary

Establish a repo-level workflow rule that API route changes must keep `/api/v1/docs` aligned by updating the manually maintained OpenAPI source in `apps/api/src/docs/openapi.ts`. Codify this rule in agent instructions, engineering governance, and Spec Kit workflow guidance so future API work has an explicit documentation obligation.

## User Stories & Testing

### User Story 1 - AI agents follow the OpenAPI update rule for API route work (Priority: P1)

As an AI agent making API changes, I need explicit repo instructions to update `apps/api/src/docs/openapi.ts` whenever API routes are created, edited, or removed so `/api/v1/docs` stays aligned with the implemented route surface.

**Why this priority**: This is the primary behavior the story is meant to enforce.

**Independent Test**: Review the repo instructions and confirm they explicitly require updating `apps/api/src/docs/openapi.ts` for new, changed, and deleted API routes.

**Acceptance Scenarios**:

1. **Given** an agent is adding a new API route, **When** it follows repo workflow guidance, **Then** the guidance explicitly instructs it to add the corresponding route documentation in `apps/api/src/docs/openapi.ts`.
2. **Given** an agent is changing an existing API contract or route behavior, **When** it follows repo workflow guidance, **Then** the guidance explicitly instructs it to update the corresponding OpenAPI entry in `apps/api/src/docs/openapi.ts`.
3. **Given** an agent is deleting an API route, **When** it follows repo workflow guidance, **Then** the guidance explicitly instructs it to remove or revise the corresponding OpenAPI entry in `apps/api/src/docs/openapi.ts`.

---

### User Story 2 - Engineers see the OpenAPI rule in governance and planning sources (Priority: P2)

As an engineer reviewing or planning API work, I need the OpenAPI update rule reflected in governance and Spec Kit workflow docs so the requirement is discoverable outside of agent-only instructions.

**Why this priority**: The rule should not live only in one file; it must be visible in the repository’s process documents as well.

**Independent Test**: Review the governance and Spec Kit workflow docs and confirm they mention the OpenAPI maintenance requirement for API route changes.

**Acceptance Scenarios**:

1. **Given** an engineer reads the engineering constitution, **When** they look for coding or documentation rules around API changes, **Then** they find the OpenAPI maintenance requirement.
2. **Given** an engineer reads the Spec Kit workflow guidance for feature planning, **When** they look for required documentation updates, **Then** they find guidance that API route changes must keep `apps/api/src/docs/openapi.ts` in sync.

---

### User Story 3 - Repo validation covers the new guidance without widening scope (Priority: P3)

As a maintainer, I need the new rule changes to be validated with focused checks so the story improves process guidance without expanding into unrelated tooling automation.

**Why this priority**: The story is about workflow guidance, not full automation enforcement.

**Independent Test**: Run focused validation for changed docs/rules and confirm the story does not introduce unrelated product or automation scope.

**Acceptance Scenarios**:

1. **Given** the story is implemented, **When** validation runs, **Then** the changed guidance files and any affected tests/checks pass.
2. **Given** the story is reviewed, **When** scope is inspected, **Then** the change is limited to repo guidance and closely related validation only.

## Edge Cases

- An API change affects behavior but not the route path; the rule should still require updating `apps/api/src/docs/openapi.ts` when the documented contract changes.
- A route removal leaves stale Swagger entries behind; the rule should explicitly call this out as prohibited.
- Contributors may look only at process docs, not agent instructions; the rule must be visible in both governance and workflow guidance.
- The story should not imply that OpenAPI generation is automatic; the guidance must reflect the current manual `openapi.ts` source of truth.

## Requirements

### Functional Requirements

- **FR-001**: The repository MUST define `apps/api/src/docs/openapi.ts` as the source of truth for the manually maintained OpenAPI route documentation that powers `/api/v1/docs`.
- **FR-002**: The repository MUST state that creating a new API route requires updating `apps/api/src/docs/openapi.ts`.
- **FR-003**: The repository MUST state that editing an existing API route requires updating `apps/api/src/docs/openapi.ts` whenever the documented contract or behavior changes.
- **FR-004**: The repository MUST state that deleting an existing API route requires removing or updating the corresponding entry in `apps/api/src/docs/openapi.ts`.
- **FR-005**: The agent instruction source `AGENTS.md` MUST codify the OpenAPI update rule for API route changes.
- **FR-006**: `docs/process/engineering-constitution.md` MUST include the OpenAPI maintenance requirement in the repository’s engineering rules.
- **FR-007**: `docs/process/spec-kit-workflow.md` MUST include workflow guidance that API route changes keep `apps/api/src/docs/openapi.ts` aligned.
- **FR-008**: The story MUST remain scoped to repo workflow/process guidance and any directly related validation, without introducing separate automation enforcement.

### Key Entities

- **OpenAPI Source Of Truth**: The manually maintained route-documentation file at `apps/api/src/docs/openapi.ts` that backs `/api/v1/docs`.
- **Repo Workflow Guidance**: The repository instruction sources that govern AI-agent behavior, engineering policy, and Spec Kit execution expectations.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Repo instructions explicitly cover OpenAPI updates for created, edited, and deleted API routes.
- **SC-002**: The rule appears in `AGENTS.md`, `docs/process/engineering-constitution.md`, and `docs/process/spec-kit-workflow.md`.
- **SC-003**: Validation for the modified guidance files passes without introducing unrelated product-scope changes.

## Assumptions

- `apps/api/src/docs/openapi.ts` remains the current manual source of truth for `/api/v1/docs`.
- This story is process guidance only; it does not require automated enforcement in CI unless a later story adds it.
