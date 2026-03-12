# Tasks: Enforce Spec Kit Workflow For `Start implementing <JIRA ISSUE>` Prompts

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-80-enforce-start-implementing-spec-kit-workflow/`
**Prerequisites**: `plan.md`, `spec.md`

**Tests**: `pnpm specify.audit`

## Phase 1: Guidance Alignment

- [x] T001 Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md` so `Start implementing <JIRA ISSUE>` uses Spec Kit by default and `Start implementing <JIRA ISSUE> --skip-speckit` is the only documented override.
- [x] T002 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md` so the repository discovery guidance mirrors the default flow and the `--skip-speckit` override.
- [x] T003 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md` so the prompt-driven contract defines both the default path and the tagged override.
- [x] T004 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-installation.md` so installation guidance reflects the same default flow and tagged override.

## Phase 2: Validation

- [x] T005 Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/scripts/specify-audit.mjs` with checks that enforce both the default `/specify` requirement and the `--skip-speckit` override wording in the guidance surfaces.
- [x] T006 Run `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`.
- [x] T007 Review the final diff to confirm the fix remains scoped to `CROWN-80` and that `--help` remains deferred to `CROWN-86`.
