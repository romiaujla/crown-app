# Quickstart: CROWN-78 OpenAPI Doc Rule

## Goal

Validate that repository guidance now explicitly requires `apps/api/src/docs/openapi.ts` updates whenever API routes are created, materially changed, or removed.

## Validation Flow

1. Review `AGENTS.md` and confirm it instructs agents to update `apps/api/src/docs/openapi.ts` for new, changed, and deleted API routes.
2. Review `docs/process/engineering-constitution.md` and confirm the OpenAPI maintenance rule is part of the repository engineering standards.
3. Review `docs/process/spec-kit-workflow.md` and confirm the planning/execution guidance calls out the OpenAPI maintenance rule for API route changes.
4. Confirm the wording across those files consistently reflects that `apps/api/src/docs/openapi.ts` is the current manual source of truth for `/api/v1/docs`.
5. Run any focused verification needed for the touched documentation/process files.

## Out Of Scope Checks

- Automatic OpenAPI generation from routes
- CI or lint enforcement of OpenAPI updates
- Runtime changes to the `/api/v1/docs` implementation
