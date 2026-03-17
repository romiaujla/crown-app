# Tasks: Integrate Schema And Seed Baseline Into Bootstrap And Test Workflows

**Input**: Design documents from `/specs/CROWN-33-bootstrap-test-workflows/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Workflow validation tasks are included because this story must prove empty-environment bootstrap, rerun behavior, and reusable baseline preparation for later automated workflows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align the repository workflow surfaces that the integrated bootstrap path will use

- [x] T001 Review and align repository bootstrap command surfaces in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/package.json` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json`
- [x] T002 [P] Review the current local setup and seed guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-32-prisma-local-seed-runner/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the reusable bootstrap orchestration and validation surfaces that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create a repository-level local bootstrap script that sequences control-plane setup and canonical seed preparation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/scripts/bootstrap-local-env.mjs`
- [x] T004 [P] Add a root bootstrap command for the canonical local workflow in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/package.json`
- [x] T005 [P] Add reusable bootstrap test helpers for command ordering and preserved-boundary assertions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/bootstrap-workflow.ts`
- [x] T006 Create focused workflow validation entrypoints for bootstrap integration in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/local-bootstrap-workflow.spec.ts`

**Checkpoint**: Repository bootstrap orchestration, bootstrap command surface, and validation helpers are ready for story-specific workflow integration

---

## Phase 3: User Story 1 - Run A Complete Local Bootstrap Workflow (Priority: P1) 🎯 MVP

**Goal**: Provide one repeatable local workflow that prepares control-plane schema state, canonical tenant schema state, and the canonical seeded baseline

**Independent Test**: From an empty or partially prepared local environment, one supported bootstrap command reaches the same canonical baseline without manual repair steps

### Tests for User Story 1

- [x] T007 [P] [US1] Add validation for empty-environment bootstrap ordering and partial-state reruns in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/local-bootstrap-workflow.spec.ts`

### Implementation for User Story 1

- [x] T008 [US1] Implement the root bootstrap workflow sequencing for database setup and canonical seed preparation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/scripts/bootstrap-local-env.mjs`
- [x] T009 [US1] Wire the documented local bootstrap command and setup flow in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/package.json` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`
- [x] T010 [US1] Align API-local setup guidance with the canonical bootstrap order in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/quickstart.md`

**Checkpoint**: User Story 1 is complete when maintainers have one repeatable bootstrap command and matching guidance for reaching the canonical local baseline

---

## Phase 4: User Story 2 - Reuse The Same Baseline In Test Preparation Workflows (Priority: P2)

**Goal**: Ensure local bootstrap and later automated or container-based preparation reuse the same canonical schema-plus-seed contract

**Independent Test**: A reviewer can see one baseline contract reused across local setup and later test-preparation guidance without a separate test-only seed path

### Tests for User Story 2

- [x] T011 [P] [US2] Extend workflow validation to assert reusable baseline preparation outputs in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/local-bootstrap-workflow.spec.ts`

### Implementation for User Story 2

- [x] T012 [US2] Add automation-neutral bootstrap and test-preparation guidance to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/quickstart.md`
- [x] T013 [US2] Refine the bootstrap workflow contract for future e2e and container-based reuse in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/contracts/bootstrap-workflow-contract.md`
- [x] T014 [US2] Align the bootstrap workflow data model and plan notes with shared baseline reuse in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/data-model.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/plan.md`

**Checkpoint**: User Story 2 is complete when local and future automated preparation clearly share one canonical baseline contract

---

## Phase 5: User Story 3 - Define Multi-Tenant And Rerun Expectations For Workflow Integration (Priority: P3)

**Goal**: Make canonical rerun boundaries and foundational multi-tenant workflow assumptions explicit for later validation stories

**Independent Test**: A reviewer can determine what the bootstrap flow refreshes, what it preserves, and how later tenant-scoped validation may build on the canonical baseline

### Tests for User Story 3

- [x] T015 [P] [US3] Extend workflow validation for preserved unrelated tenant data and rerun boundary behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/local-bootstrap-workflow.spec.ts`

### Implementation for User Story 3

- [x] T016 [US3] Document canonical versus unrelated tenant rerun expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/quickstart.md`
- [x] T017 [US3] Refine foundational multi-tenant coverage assumptions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/data-model.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/contracts/bootstrap-workflow-contract.md`
- [x] T018 [US3] Align research and quickstart guidance with preserved-boundary and later validation expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/research.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/quickstart.md`

**Checkpoint**: User Story 3 is complete when rerun boundaries and foundational multi-tenant expectations are explicit for later validation work

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and readiness checks across the integrated bootstrap workflow

- [x] T019 [P] Run targeted API typecheck with `pnpm --filter @crown/api typecheck` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [x] T020 [P] Run targeted API workflow tests with `pnpm --filter @crown/api exec vitest run tests/integration/local-bootstrap-workflow.spec.ts` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [x] T021 [P] Run artifact validation with `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [x] T022 Perform final terminology and workflow-boundary consistency pass across `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/spec.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and should build on the bootstrap command and guidance from US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the finalized workflow surfaces from US1 and US2

### Within Each User Story

- Validation tasks should be added before finalizing workflow implementation
- Workflow command and orchestration changes before downstream documentation refinements
- Boundary and multi-tenant guidance after the canonical bootstrap path is stable

### Parallel Opportunities

- `T001` and `T002` can run in parallel
- `T004` and `T005` can run in parallel after `T003`
- `T011` and `T012` can run in parallel
- `T015` and `T016` can run in parallel
- `T019`, `T020`, and `T021` can run in parallel

---

## Parallel Example: User Story 2

```bash
# Update both reusable-baseline guidance surfaces together:
Task: "Add automation-neutral bootstrap and test-preparation guidance to README.md and specs/CROWN-33-bootstrap-test-workflows/quickstart.md"
Task: "Refine the bootstrap workflow contract for future e2e and container-based reuse in specs/CROWN-33-bootstrap-test-workflows/contracts/bootstrap-workflow-contract.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the canonical local bootstrap flow before expanding reusable test-preparation guidance

### Incremental Delivery

1. Complete Setup + Foundational to stabilize bootstrap orchestration and validation surfaces
2. Deliver User Story 1 to provide one repeatable local bootstrap path
3. Add User Story 2 to align local and future automated baseline reuse
4. Add User Story 3 to make rerun boundaries and foundational multi-tenant expectations explicit
5. Finish with validation commands and cross-cutting terminology checks

### Parallel Team Strategy

1. One contributor can finish the Setup and Foundational phases
2. After Foundational is complete:
   - Contributor A: User Story 1 bootstrap command and local guidance
   - Contributor B: User Story 2 reusable baseline and automation-neutral workflow guidance
3. Once the canonical bootstrap path is stable, Contributor C can finalize User Story 3 multi-tenant boundary guidance and validation coverage

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `CROWN-33` is workflow-integration work, so the main implementation surfaces are repository commands, bootstrap orchestration, validation coverage, and setup documentation
- `T007`, `T011`, and `T015` are the key independent-test gates for US1, US2, and US3
- Later validation stories should build on this canonical bootstrap contract rather than redefine it
