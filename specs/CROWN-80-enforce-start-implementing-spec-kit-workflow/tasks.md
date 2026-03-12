# Tasks: Enforce Spec Kit Workflow For `Start implementing <JIRA ISSUE>` Prompts

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-80-enforce-start-implementing-spec-kit-workflow/`
**Prerequisites**: `plan.md`, `spec.md`

**Tests**: `pnpm specify.audit`

## Phase 1: Guidance Alignment

- [x] T001 Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md` so `Start implementing <JIRA ISSUE>` always begins with `/specify` and no longer depends on a major-feature qualifier.
- [x] T002 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md` so the repository discovery guidance mirrors the unconditional prompt-driven Spec Kit rule.
- [x] T003 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md` so the prompt-driven contract and phase sequence are unconditional for `Start implementing <JIRA ISSUE>`.
- [x] T004 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-installation.md` so installation guidance no longer describes prompt-driven Spec Kit flow as major-feature-only.

## Phase 2: Validation

- [x] T005 Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/scripts/specify-audit.mjs` with checks that enforce the prompt-driven `/specify` requirement in the guidance surfaces.
- [x] T006 Run `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`.
- [x] T007 Review the final diff to confirm the fix remains scoped to `CROWN-80`.
