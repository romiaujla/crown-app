# Tasks: Prompt-Driven End-To-End Spec Kit Implementation Workflow

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-79-support-prompt-driven-spec-kit-implementation-workflow/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: `pnpm specify.audit` is required because this story changes repository workflow and governance guidance. Manual review against the quickstart and Jira acceptance criteria is also included.

**Organization**: Tasks are grouped by user story so the workflow entrypoint, phase gates, and PR handoff expectations can be reviewed incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing agent and Spec Kit guidance surfaces that must stay aligned

- [ ] T001 Review the current agent workflow guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md`
- [ ] T002 [P] Review the installation and governance references in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-installation.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/scripts/specify-audit.mjs`
- [ ] T003 [P] Confirm the planning artifact paths and PR checklist references for this story in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-79-support-prompt-driven-spec-kit-implementation-workflow/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the shared prompt-driven workflow vocabulary and repository entrypoint before user-story details are added

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add a prompt-driven implementation workflow section to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`
- [ ] T005 [P] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md` with the explicit phase sequence and stage-gate expectations
- [ ] T006 [P] Keep `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-installation.md` aligned with the new workflow entrypoint and required artifact flow

**Checkpoint**: The repository has one explicit place for agents to start and matching human-readable workflow references

---

## Phase 3: User Story 1 - Start A Jira-Scoped Workflow From One Prompt (Priority: P1) 🎯 MVP

**Goal**: An agent can respond to `Start implementing <JIRA ISSUE>` using a documented repository-aligned start path

**Independent Test**: A reviewer can read `AGENTS.md` and confirm it explains how to resolve the Jira issue, apply the constitution, create or validate the correct branch, and begin with `/specify`

### Tests for User Story 1

- [ ] T007 [P] [US1] Review the final `AGENTS.md` guidance against `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-79-support-prompt-driven-spec-kit-implementation-workflow/quickstart.md`

### Implementation for User Story 1

- [ ] T008 [US1] Document the `Start implementing <JIRA ISSUE>` entrypoint and Jira-resolution behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`
- [ ] T009 [US1] Add a repository-facing discovery example for the prompt-driven start path in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`

**Checkpoint**: The prompt-driven start behavior is documented and discoverable

---

## Phase 4: User Story 2 - Advance Through Spec Kit Phases With Explicit Completion Gates (Priority: P2)

**Goal**: The documented workflow advances through `/specify`, `/plan`, `/tasks`, implementation, and PR creation in a fixed order with commit/push gates

**Independent Test**: A reviewer can inspect the workflow docs and confirm each phase transition is gated by completion plus commit/push when unresolved clarification is absent

### Tests for User Story 2

- [ ] T010 [P] [US2] Review the documented phase order and gate language in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md` against the CROWN-79 contract

### Implementation for User Story 2

- [ ] T011 [US2] Add the explicit `specify -> plan -> tasks -> implement -> PR` sequence to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`
- [ ] T012 [US2] Document the commit-and-push checkpoint required after `/specify`, `/plan`, `/tasks`, and implementation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`
- [ ] T013 [US2] Mirror the same stage-gate expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md`

**Checkpoint**: The phase order and reviewable gates are explicit in both agent and process guidance

---

## Phase 5: User Story 3 - Pause On Ambiguity And Produce A Policy-Compliant PR Handoff (Priority: P3)

**Goal**: The documented workflow stops when blocked and defines the required PR handoff contents

**Independent Test**: A reviewer can inspect the guidance and confirm it calls out clarification stop conditions and the required PR description fields

### Tests for User Story 3

- [ ] T014 [P] [US3] Review the clarification-stop and PR-handoff guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`

### Implementation for User Story 3

- [ ] T015 [US3] Document the ambiguity and dirty-state pause conditions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`
- [ ] T016 [US3] Add the required PR description contents and scope statement expectations to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md`
- [ ] T017 [US3] Keep `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md` scoped to prompt-driven workflow discovery without widening into unrelated delivery policy

**Checkpoint**: The workflow guidance stops safely and finishes with a compliant PR handoff definition

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the updated workflow guidance and prepare the final PR

- [ ] T018 [P] Update any plan-phase notes that changed during implementation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-79-support-prompt-driven-spec-kit-implementation-workflow/quickstart.md` if needed
- [ ] T019 [P] Run `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T020 Review the final diff to confirm the change remains scoped to `CROWN-79`
- [ ] T021 Create the PR for `feat/CROWN-79-support-prompt-driven-spec-kit-implementation-workflow` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-79-support-prompt-driven-spec-kit-implementation-workflow/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-79-support-prompt-driven-spec-kit-implementation-workflow/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-79-support-prompt-driven-spec-kit-implementation-workflow/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on later stories
- **User Story 2 (P2)**: Starts after Foundational and builds on the entrypoint vocabulary established for US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the phase-gate workflow defined for US1 and US2

### Within Each User Story

- Review the target guidance surface before finalizing the edited text
- Keep `AGENTS.md` as the primary agent entrypoint and mirror, not duplicate, the process guidance elsewhere
- Finish the documentation updates before running governance verification

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T005` and `T006` can run in parallel after `T004`
- `T007` and `T009` can run in parallel once the core `AGENTS.md` entrypoint is drafted
- `T019` and `T020` can run in parallel while preparing the final PR

---

## Parallel Example: User Story 2

```bash
# Review the same phase-gate behavior in both guidance surfaces:
Task: "Review the documented phase order and gate language in AGENTS.md and docs/process/spec-kit-workflow.md against the CROWN-79 contract"
Task: "Keep README.md and docs/process/spec-kit-installation.md aligned with the new workflow entrypoint and required artifact flow"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate that the prompt-driven start path is explicit before widening into later phase details

### Incremental Delivery

1. Establish the agent entrypoint and aligned process references
2. Add the explicit phase order and commit/push gates
3. Add the clarification stop conditions and PR handoff requirements
4. Run governance verification and open the PR

---

## Notes

- `CROWN-79` should remain a repository workflow change rather than a runtime feature
- `pnpm specify.audit` is the required automated governance check for this story
- The final PR should stay limited to `AGENTS.md`, process docs, repository discovery guidance, and the `CROWN-79` Spec Kit artifacts
