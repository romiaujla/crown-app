# Tasks: Enforce Tagged AI-Agent Workflow Commands

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-80-enforce-start-implementing-spec-kit-workflow/`
**Prerequisites**: `plan.md`, `spec.md`

**Tests**: `pnpm specify.audit`

## Phase 1: Guidance Alignment

- [x] T001 Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md` so `--speckit CROWN-<id>` and `--implement CROWN-<id>` are the canonical workflow commands.
- [x] T002 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md` so the repository discovery guidance mirrors the tagged-command contract.
- [x] T003 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md` so the workflow contract defines `--speckit` and `--implement`.
- [x] T004 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-installation.md` so installation guidance reflects the same tagged-command contract.

## Phase 2: Validation

- [x] T005 Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/scripts/specify-audit.mjs` with checks that enforce both the `--speckit` and `--implement` wording in the guidance surfaces.
- [x] T006 Run `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`.
- [x] T007 Review the final diff to confirm the fix remains scoped to `CROWN-80` and that `--help` remains deferred.
