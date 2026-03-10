# Tasks: Implement Resettable Local Seed Runner And Baseline Dataset

**Input**: Design documents from `/specs/CROWN-32-prisma-local-seed-runner/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Integration and validation tasks are included because this story changes local data-reset behavior and must prove rerun safety, deterministic fixtures, and preserved out-of-scope data.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the local Prisma seed entrypoint surface and shared seed scaffolding

- [ ] T001 Add the canonical local seed command and Prisma seed configuration in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json`
- [ ] T002 [P] Create canonical seed constants for tenant identity, schema name, and seeded operator identities in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/constants.ts`
- [ ] T003 [P] Create shared seed execution types and DB assertion helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/types.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/local-seed-db.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the reusable seed infrastructure that every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create the Prisma seed entrypoint shell and execution orchestration in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed.ts`
- [ ] T005 [P] Implement control-plane ensure helpers for tenant and platform memberships in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts`
- [ ] T006 [P] Implement tenant-domain reset helpers with schema-scoped deletion ordering in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/reset.ts`
- [ ] T007 [P] Implement tenant-domain load orchestration contracts in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/load.ts`
- [ ] T008 Create seed result reporting and failure-surface helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/reporting.ts`

**Checkpoint**: Prisma seed command surface, control-plane ensure, tenant reset, tenant load, and reporting infrastructure are ready for story-level implementation

---

## Phase 3: User Story 1 - Reset And Reload The Canonical Local Baseline (Priority: P1) 🎯 MVP

**Goal**: Provide one local workflow that clears the approved tenant-domain scope and reloads the canonical baseline dataset

**Independent Test**: Starting from stale or previously seeded local data, running the seed workflow produces the same canonical tenant baseline without manual cleanup

### Tests for User Story 1

- [ ] T009 [P] [US1] Add integration coverage for first-run seed and stale-baseline rerun behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed.spec.ts`

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create canonical reference-data and business-party fixtures in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/baseline/reference-data.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/baseline/organizations.ts`
- [ ] T011 [P] [US1] Create canonical people, role, asset, load, and stop fixtures in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/baseline/operations.ts`
- [ ] T012 [US1] Implement the tenant-domain reload pipeline for the canonical baseline in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/load.ts`
- [ ] T013 [US1] Wire reset-and-reload orchestration plus success summary output in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/reporting.ts`

**Checkpoint**: User Story 1 is complete when one supported seed command rebuilds the canonical tenant baseline from stale local state

---

## Phase 4: User Story 2 - Preserve Deterministic Seeded Records For Downstream Use (Priority: P2)

**Goal**: Keep canonical seeded records stable across reruns through explicit business-key lookups and predictable fixture relationships

**Independent Test**: After repeated reruns, reviewers can resolve the same seeded tenant, operator, and tenant-domain records through the same business keys

### Tests for User Story 2

- [ ] T014 [P] [US2] Add integration coverage for deterministic lookup keys and representative baseline contents in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed-determinism.spec.ts`

### Implementation for User Story 2

- [ ] T015 [P] [US2] Implement stable tenant and platform-user lookup or upsert helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts`
- [ ] T016 [P] [US2] Implement tenant-domain lookup maps and fixture-key helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/lookups.ts`
- [ ] T017 [US2] Refactor canonical fixture loaders to resolve relationships through deterministic lookup helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/baseline/reference-data.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/baseline/organizations.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/baseline/operations.ts`
- [ ] T018 [US2] Document the canonical seeded records and stable lookup-key expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-32-prisma-local-seed-runner/quickstart.md`

**Checkpoint**: User Story 2 is complete when the seeded baseline exposes stable, documented lookup keys for downstream local workflows and tests

---

## Phase 5: User Story 3 - Safely Recover From Repeated Or Interrupted Seed Runs (Priority: P3)

**Goal**: Make reruns and failure recovery reliable without widening the reset boundary or requiring manual repair steps

**Independent Test**: A repeated rerun or a rerun after a controlled partial failure restores the canonical baseline while preserving out-of-scope data

### Tests for User Story 3

- [ ] T019 [P] [US3] Add integration coverage for repeated reruns, preserved out-of-scope data, and partial-failure recovery in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed-recovery.spec.ts`
- [ ] T020 [P] [US3] Extend seed DB helpers for partial-failure setup and boundary assertions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/local-seed-db.ts`

### Implementation for User Story 3

- [ ] T021 [US3] Implement rerun-safe control-plane ensure and non-destructive boundary behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/reset.ts`
- [ ] T022 [US3] Add controlled failure injection seams for load-phase recovery testing in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/load.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/types.ts`
- [ ] T023 [US3] Implement failure-aware rerun handling and terminal status reporting in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/reporting.ts`

**Checkpoint**: User Story 3 is complete when reruns recover the canonical baseline after interruptions without manual cleanup or destructive out-of-scope resets

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and implementation-readiness checks across the seed runner

- [ ] T024 [P] Update implementation and validation guidance for the runnable seed workflow in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-32-prisma-local-seed-runner/quickstart.md`
- [ ] T025 [P] Run targeted API typecheck with `pnpm --filter @crown/api typecheck` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T026 [P] Run targeted API test coverage with `pnpm --filter @crown/api exec vitest` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T027 Run artifact validation with `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and should build on the canonical baseline loaders from US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the rerunnable baseline plus deterministic lookup behavior from US1 and US2

### Within Each User Story

- Integration tests should be written before the story implementation is finalized
- Fixture definitions before orchestration wiring
- Lookup helpers before deterministic fixture refactors
- Recovery seams before final rerun-handling polish

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T005`, `T006`, and `T007` can run in parallel after `T004`
- `T010` and `T011` can run in parallel
- `T015` and `T016` can run in parallel
- `T019` and `T020` can run in parallel
- `T025` and `T026` can run in parallel

---

## Parallel Example: User Story 1

```bash
# Build the two baseline fixture surfaces together:
Task: "Create canonical reference-data and business-party fixtures in apps/api/prisma/seed/baseline/reference-data.ts and apps/api/prisma/seed/baseline/organizations.ts"
Task: "Create canonical people, role, asset, load, and stop fixtures in apps/api/prisma/seed/baseline/operations.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the canonical reset-and-reload flow before adding deterministic fixture and recovery refinements

### Incremental Delivery

1. Complete Setup + Foundational to stabilize the seed entrypoint and reset infrastructure
2. Deliver User Story 1 so local developers can rebuild the canonical baseline
3. Add User Story 2 to lock down stable fixture keys and representative baseline coverage
4. Add User Story 3 to prove rerun safety and failure recovery
5. Finish with validation commands and documentation polish

### Parallel Team Strategy

1. One contributor can finish the Setup and Foundational phases
2. After Foundational is complete:
   - Contributor A: User Story 1 baseline fixtures and reload flow
   - Contributor B: User Story 2 deterministic lookup helpers and documentation
3. Once the seeded baseline is stable, Contributor C can finish User Story 3 recovery behavior and validation coverage

---

## Notes

- `[P]` tasks are split across isolated files or test surfaces
- The seed entrypoint and orchestration modules are foundational because every user story depends on them
- `T009`, `T014`, and `T019` are the key independent-test gates for US1, US2, and US3
- Keep the initial baseline intentionally foundational; later stories can extend it without redefining the reset contract
