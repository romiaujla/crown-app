# Implementation Plan: Enforce Spec Kit Workflow For `Start implementing <JIRA ISSUE>` Prompts

**Branch**: `fix/CROWN-80-enforce-start-implementing-spec-kit-workflow` | **Date**: 2026-03-11 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-80-enforce-start-implementing-spec-kit-workflow/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-80-enforce-start-implementing-spec-kit-workflow/spec.md)
**Input**: Feature specification from `/specs/CROWN-80-enforce-start-implementing-spec-kit-workflow/spec.md`

## Summary

Remove the remaining ambiguity in the prompt-driven start workflow so `Start implementing <JIRA ISSUE>` always begins with `/specify`, mirror that rule across the repository guidance surfaces, and extend `pnpm specify.audit` to catch regressions.

## Technical Context

**Language/Version**: Markdown documentation and Node.js 20 repository tooling  
**Primary Dependencies**: `AGENTS.md`, `README.md`, `docs/process/spec-kit-workflow.md`, `docs/process/spec-kit-installation.md`, `scripts/specify-audit.mjs`  
**Storage**: N/A  
**Testing**: `pnpm specify.audit`  
**Target Platform**: Repository workflow guidance consumed during local AI-agent sessions  
**Project Type**: Documentation/process fix with lightweight validation tooling  
**Performance Goals**: Deterministic prompt-driven workflow behavior with no issue-size reinterpretation during startup  
**Constraints**: Stay scoped to AI-agent workflow enforcement; do not widen into unrelated runtime features or governance rewrites  
**Scale/Scope**: One Jira bug spanning four guidance surfaces and one audit script

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `fix/CROWN-80-enforce-start-implementing-spec-kit-workflow` matches the constitution for a Bug.
- Commit/PR convention: PASS. Work on this branch will use `fix: CROWN-80 - ...` subjects and a squash-safe PR title.
- Scope control: PASS. The fix is limited to prompt-driven workflow enforcement and repository-local validation.
- Planning gate: PASS. This work is proceeding through `/specify`, `/plan`, and `/tasks` before implementation in accordance with the prompt-driven rule being fixed.
- Testing discipline: PASS. `pnpm specify.audit` is sufficient because the change is documentation and repository-tooling only.

Post-design re-check: PASS. The design keeps the fix inside repository guidance and validation surfaces and does not introduce competing workflow definitions.

## Implementation Outline

- Update `AGENTS.md` so the prompt-driven start workflow always begins with `/specify`.
- Update `README.md`, `docs/process/spec-kit-workflow.md`, and `docs/process/spec-kit-installation.md` to mirror the same unconditional rule.
- Extend `scripts/specify-audit.mjs` with explicit checks for the prompt-driven `/specify` requirement in the audited guidance.
- Validate the changes with `pnpm specify.audit`.

## Project Structure

```text
specs/CROWN-80-enforce-start-implementing-spec-kit-workflow/
├── plan.md
├── spec.md
└── tasks.md

AGENTS.md
README.md
docs/process/spec-kit-installation.md
docs/process/spec-kit-workflow.md
scripts/specify-audit.mjs
```

**Structure Decision**: No runtime code or product contracts change. The implementation should stay inside the repository instruction documents and the existing Spec Kit audit script.

## Complexity Tracking

No constitutional exceptions are required for this fix.
