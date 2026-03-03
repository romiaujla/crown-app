# Spec Kit Workflow (Required for Major Features)

Canonical governance policy lives in:
- `docs/process/engineering-constitution.md`

For major features, complete these artifacts before implementation:
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

### Required PR Checklist Gates (Major Features)
- Jira key present in branch name and PR title.
- Links to artifact files for `spec`, `plan`, and `tasks`.
- `pnpm specify.audit` passes.
- Scope statement confirms changes map to Jira issue scope.
- Validation evidence included (tests/lint/typecheck as applicable).
- Documentation updates included for behavior/process changes.

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
