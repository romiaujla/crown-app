# Tasks: Validate Canonical Seed Baseline And Setup Expectations

**Input**: Design documents from `/specs/CROWN-34-seed-validation-expectations/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Validation tasks are included because this story proves deterministic seeded lookups, rerun safety, preserved reset boundaries, and contributor-facing setup clarity.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Review the existing validation and setup surfaces that `CROWN-34` extends

- [x] T001 Review canonical seed validation coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed-determinism.spec.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed-recovery.spec.ts`
- [x] T002 [P] Review bootstrap workflow validation and setup guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/local-bootstrap-workflow.spec.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared validation contract and helper surfaces for deterministic lookup and preserved-boundary assertions

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create reusable canonical validation helpers for deterministic lookup and preserved-boundary assertions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/local-seed-db.ts`
- [x] T004 [P] Align root setup guidance wording with the canonical validation contract in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`
- [x] T005 [P] Prepare the focused `CROWN-34` validation story artifacts in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/quickstart.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/contracts/validation-setup-contract.md`

**Checkpoint**: Validation helpers and setup guidance surfaces are ready for story-specific additions

---

## Phase 3: User Story 1 - Prove Deterministic Canonical Seed Records (Priority: P1) 🎯 MVP

**Goal**: Make the canonical seeded tenant, operator, and representative tenant-domain lookups explicitly validated through stable business identifiers

**Independent Test**: A reviewer can see deterministic lookup assertions pass after repeated canonical reruns without relying on generated IDs

### Tests for User Story 1

- [x] T006 [P] [US1] Extend canonical seed determinism coverage for seeded tenant, platform user, and representative tenant-domain lookups in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed-determinism.spec.ts`

### Implementation for User Story 1

- [x] T007 [US1] Add reusable deterministic lookup expectations to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/local-seed-db.ts`
- [x] T008 [US1] Refine the canonical seed validation narrative in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/quickstart.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/data-model.md`

**Checkpoint**: User Story 1 is complete when deterministic seeded lookups are explicit, stable, and reviewable

---

## Phase 4: User Story 2 - Prove Rerun And Reset-Boundary Safety (Priority: P2)

**Goal**: Make canonical rerun behavior and preserved out-of-scope data explicit across seed and bootstrap validation

**Independent Test**: A reviewer can see validation proving that canonical reruns restore the same baseline while preserving unrelated tenant and platform records

### Tests for User Story 2

- [x] T009 [P] [US2] Extend local seed recovery and baseline coverage for preserved unrelated data assertions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed.spec.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed-recovery.spec.ts`
- [x] T010 [P] [US2] Extend bootstrap workflow validation for canonical boundary and rerun expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/local-bootstrap-workflow.spec.ts`

### Implementation for User Story 2

- [x] T011 [US2] Add shared preserved-boundary expectations to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/local-seed-db.ts`
- [x] T012 [US2] Refine rerun and preserved-boundary guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/contracts/validation-setup-contract.md`
- [x] T013 [US2] Align the validation data model and research notes with preserved-boundary assertions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/data-model.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/research.md`

**Checkpoint**: User Story 2 is complete when canonical rerun and preserved-boundary behavior is executable and clearly documented

---

## Phase 5: User Story 3 - Make Reusable Setup Expectations Explicit For Reviewers (Priority: P3)

**Goal**: Make the contributor-facing choice between bootstrap and reseed direct while keeping one shared canonical baseline story

**Independent Test**: A reviewer can read the setup guidance and identify when to bootstrap, when to reseed, and what each command refreshes or preserves

### Tests for User Story 3

- [x] T014 [P] [US3] Extend setup-focused validation narratives and reviewer expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/local-bootstrap-workflow.spec.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/quickstart.md`

### Implementation for User Story 3

- [x] T015 [US3] Clarify bootstrap-versus-seed command guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`
- [x] T016 [US3] Refine the validation-and-setup contract for later workflow reuse in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/contracts/validation-setup-contract.md`
- [x] T017 [US3] Align spec-facing validation expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/quickstart.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/research.md`

**Checkpoint**: User Story 3 is complete when setup-command choice and shared canonical baseline expectations are explicit for contributors and later workflow authors

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and readiness checks across the canonical setup-and-validation contract

- [x] T018 [P] Run targeted API typecheck with `pnpm --filter @crown/api typecheck` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [x] T019 [P] Run focused validation tests with `pnpm --filter @crown/api exec vitest run tests/integration/prisma-local-seed.spec.ts tests/integration/prisma-local-seed-determinism.spec.ts tests/integration/prisma-local-seed-recovery.spec.ts tests/integration/local-bootstrap-workflow.spec.ts` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [x] T020 [P] Run artifact validation with `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [x] T021 Perform final terminology and contract-consistency pass across `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/spec.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/contracts/validation-setup-contract.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and should build on the deterministic lookup helper surfaces from US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the finalized setup-boundary wording from US1 and US2

### Within Each User Story

- Validation tasks should be added before finalizing the associated documentation or helper refinements
- Helper updates before downstream guidance alignment
- Terminology and contract cleanup after the validation surfaces are stable

### Parallel Opportunities

- `T001` and `T002` can run in parallel
- `T004` and `T005` can run in parallel after `T003`
- `T009` and `T010` can run in parallel
- `T018`, `T019`, and `T020` can run in parallel

---

## Parallel Example: User Story 2

```bash
# Extend preserved-boundary validation while refining the related workflow guidance:
Task: "Extend local seed recovery and baseline coverage for preserved unrelated data assertions in apps/api/tests/integration/prisma-local-seed.spec.ts and apps/api/tests/integration/prisma-local-seed-recovery.spec.ts"
Task: "Refine rerun and preserved-boundary guidance in README.md and specs/CROWN-34-seed-validation-expectations/contracts/validation-setup-contract.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate deterministic canonical lookup coverage before expanding rerun and setup guidance

### Incremental Delivery

1. Complete Setup + Foundational to stabilize helper surfaces and setup wording
2. Deliver User Story 1 to prove deterministic canonical seeded lookups
3. Add User Story 2 to prove rerun and preserved-boundary behavior across seed and bootstrap validation
4. Add User Story 3 to make bootstrap-versus-seed guidance explicit
5. Finish with validation commands and contract-consistency checks

### Parallel Team Strategy

1. One contributor can finish Setup and Foundational tasks
2. After Foundational is complete:
   - Contributor A: deterministic seeded lookup validation
   - Contributor B: preserved-boundary validation across seed and bootstrap workflows
3. Once validation surfaces are stable, Contributor C can finalize setup-command guidance and contract cleanup

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `CROWN-34` is validation-and-documentation work, so the main implementation surfaces are API integration tests, shared test helpers, README guidance, and Spec Kit artifacts
- `T006`, `T009`/`T010`, and `T014` are the key independent-test gates for US1, US2, and US3
- Later automated workflows should consume this canonical validation contract rather than define a separate seed-setup story
