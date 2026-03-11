# Contract: OpenAPI Document Maintenance Rule

## Purpose

Define the repository rule that API route changes must keep the manual OpenAPI source aligned.

## Rule Statement

- `apps/api/src/docs/openapi.ts` is the current source of truth for the manually maintained OpenAPI document that powers `/api/v1/docs`.
- Creating a new API route requires updating `apps/api/src/docs/openapi.ts`.
- Editing an existing API route requires updating `apps/api/src/docs/openapi.ts` when the documented contract or behavior changes.
- Deleting an existing API route requires removing or revising the corresponding entry in `apps/api/src/docs/openapi.ts`.

## Guidance Surfaces

- `AGENTS.md` must instruct AI agents to follow the rule during API work.
- `docs/process/engineering-constitution.md` must codify the rule as part of repository engineering standards.
- `docs/process/spec-kit-workflow.md` must include the rule in feature workflow/planning guidance for API route changes.

## Non-Goals

- This contract does not require automatic OpenAPI generation.
- This contract does not require standalone `swagger.json` output.
- This contract does not require CI enforcement in this story.
