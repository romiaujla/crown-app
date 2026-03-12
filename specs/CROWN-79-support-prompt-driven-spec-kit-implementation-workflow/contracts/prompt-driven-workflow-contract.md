# Contract: Prompt-Driven Spec Kit Implementation Workflow

## Invocation

- **Input pattern**: `Start implementing <JIRA ISSUE>`
- **Scope rule**: The named Jira issue is the only delivery scope unless the user explicitly broadens it.

## Required Start Behavior

1. Resolve the Jira issue and determine the issue type, summary, and working scope.
2. Use `docs/process/engineering-constitution.md` as the governing policy.
3. Create or validate the Jira-linked branch and matching spec artifact location.
4. Begin major-feature delivery with `/specify`.

## Required Phase Order

1. `/specify`
2. `/plan`
3. `/tasks`
4. Implementation
5. Pull request creation

The workflow must not skip or reorder these phases for major feature work.

## Phase Gate Rules

- `/specify` may advance only after the specification is complete, no unresolved clarification remains, and the phase changes are committed and pushed.
- `/plan` may advance only after the planning artifacts are complete, no unresolved clarification remains, and the phase changes are committed and pushed.
- `/tasks` may advance only after the task breakdown is complete, no unresolved clarification remains, and the phase changes are committed and pushed.
- Implementation may advance to pull request creation only after the scoped work is complete, validation is captured, no unresolved clarification remains, and the phase changes are committed and pushed.

## Stop Conditions

- Ambiguous or conflicting issue scope
- Missing or contradictory requirements
- Dirty repository state that conflicts with the target issue
- Branch, spec artifact, or PR metadata drift away from the Jira issue
- Incomplete validation evidence required for a compliant pull request

If any stop condition is active, the workflow pauses for clarification instead of auto-advancing.

## Pull Request Output Requirements

The final pull request description must include:

- Jira linkage
- Links to `spec.md`, `plan.md`, and `tasks.md`
- A scope statement describing the bounded change
- Validation notes describing checks run and their outcomes
