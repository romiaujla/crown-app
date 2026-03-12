# Spec Kit Workflow (Tagged Command Contract)

Canonical governance policy lives in:
- `docs/process/engineering-constitution.md`

For prompts in the form `--speckit CROWN-<id>`, complete these artifacts before implementation:
1. `/constitution`
2. `/specify`
3. `/plan`
4. `/tasks`

## Constitution Rule
- This repository has one canonical constitution: `docs/process/engineering-constitution.md`.
- Feature documentation must extend planning detail only and must not introduce alternate constitutions.

## Prerequisite Setup
- Install/use Spec Kit at project level via `docs/process/spec-kit-installation.md`.

## Enforcement
- Jira issue must link completed planning artifacts before implementation starts.
- PR description must reference corresponding spec/plan/tasks artifacts.

## Prompt-Driven Start Contract
For tagged workflow commands:

1. Resolve the Jira issue and determine the issue type before branch creation.
2. Use `docs/process/engineering-constitution.md` as the canonical policy source.
3. Create or validate the Jira-linked branch and matching feature artifact location.
4. If the prompt is `--implement CROWN-<id>`, skip `/specify`, `/plan`, and `/tasks` and proceed directly to implementation.
5. If the prompt is `--speckit CROWN-<id>`, start the workflow with `/specify`.

## Required Phase Sequence
For work started with `--speckit CROWN-<id>`, advance in this order only:

1. `/specify`
2. `/plan`
3. `/tasks`
4. implementation
5. pull request creation

The workflow must not skip or reorder these phases unless the user explicitly changes scope or direction.

When the prompt is `--implement CROWN-<id>`, the workflow bypasses `/specify`, `/plan`, and `/tasks` and starts at implementation.

## Phase Gate Rules
- `/specify` may advance to `/plan` only after the specification is complete, no unresolved clarification remains, and the phase changes are committed and pushed.
- `/plan` may advance to `/tasks` only after the planning artifacts are complete, no unresolved clarification remains, and the phase changes are committed and pushed.
- `/tasks` may advance to implementation only after the task breakdown is complete, no unresolved clarification remains, and the phase changes are committed and pushed.
- Implementation may advance to pull request creation only after the scoped work is complete, validation is captured, no unresolved clarification remains, and the phase changes are committed and pushed.

## Clarification Stop Conditions
- Ambiguous or conflicting issue scope
- Missing or contradictory requirements
- Dirty repository state that conflicts with the target issue
- Branch, spec artifact, or PR metadata drift away from the Jira issue
- Incomplete validation evidence required for a compliant pull request

If any stop condition is active, pause for user clarification instead of auto-advancing.

### Required PR Checklist Gates (Major Features)
- Jira key present in branch name.
- PR title matches `<type>: CROWN-<id> - <message>` so squash merge produces a release-safe commit subject on `main`.
- Links to artifact files for `spec`, `plan`, and `tasks`.
- `pnpm specify.audit` passes.
- Scope statement confirms changes map to Jira issue scope.
- Validation evidence included (tests/lint/typecheck as applicable).
- Documentation updates included for behavior/process changes.
- Pull request is created only after implementation has been committed and pushed.
- API route changes must keep the manual OpenAPI source in `apps/api/src/docs/openapi.ts` aligned for created, materially changed, and deleted routes.

## Convention Source of Truth
- Branch naming, commit formatting, Jira linkage, and type mapping are defined in:
  - `docs/process/engineering-constitution.md`
- This workflow document intentionally references, but does not duplicate, those conventions.

## Ownership
- Policy definition lives in architecture/planning scope (`CROWN-2`).
- Automated enforcement lives in CI quality gates (`CROWN-9`).

## Drift Logging
- Small manual changes should be recorded via `pnpm specify.drift -- "<reason>"`.
- Drift entries are stored in `docs/features/drift/` and should be linked from Jira/PR when relevant.
