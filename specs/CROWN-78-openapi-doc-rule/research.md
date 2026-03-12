# Research: CROWN-78 OpenAPI Doc Rule

## Decision: Treat `apps/api/src/docs/openapi.ts` as the explicit source of truth for `/api/v1/docs`

- **Why**: The current API docs implementation is manual and lives in TypeScript, not generated from route scanning, annotations, or a standalone JSON artifact. The new rule must reflect the real workflow contributors follow today.
- **Alternatives considered**:
  - Describe the docs as automatically generated: rejected because it is incorrect and would create misleading guidance.
  - Leave the source-of-truth implicit: rejected because contributors need a single concrete file to update.

## Decision: Codify the rule in multiple repository guidance layers

- **Why**: The user specifically wants the rule to appear in agent instructions, governance, and Spec Kit workflow guidance. That makes the obligation visible in day-to-day coding, policy review, and planning workflows.
- **Alternatives considered**:
  - Put the rule only in `AGENTS.md`: rejected because human reviewers and planners may not rely on that file alone.
  - Put the rule only in the constitution: rejected because agents and workflow implementers also need operationally specific wording.

## Decision: Keep this story scoped to guidance, not automated enforcement

- **Why**: Jira scope is about adding the rule and making it explicit in repo workflow sources. It does not require CI guards, lint rules, or tests that diff routes against the OpenAPI document.
- **Alternatives considered**:
  - Add enforcement automation in the same story: rejected because it widens scope and would need additional design and validation surfaces.
  - Skip validation entirely: rejected because the changed guidance should still be reviewed and verified for consistency.

## Decision: Phrase the rule around route creation, behavior-changing edits, and removal

- **Why**: The requirement should cover the three operational cases most likely to cause drift: new endpoints, changed contracts/behavior, and deleted endpoints.
- **Alternatives considered**:
  - Mention only new routes: rejected because behavior changes and deletions also create docs drift.
  - Require OpenAPI updates for every file touch under `apps/api`: rejected because the rule should stay tied to API route/documentation changes, not unrelated internals.
