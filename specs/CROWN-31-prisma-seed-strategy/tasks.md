# Tasks: Design Deterministic Prisma Local Seed Strategy For Development And Testing

**Input**: Design documents from `/specs/CROWN-31-prisma-seed-strategy/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Validation tasks are included because this story’s output is a seed-strategy design package that must be reviewable and safe for downstream implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the upstream model and migration inputs before finalizing the seed strategy

- [x] T001 Review the approved tenant-domain source of truth in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/contracts/tenant-model-handoff-contract.md`
- [x] T002 [P] Review the migration baseline source of truth in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/data-model.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/contracts/tenant-migration-handoff-contract.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the baseline scope and strategy boundaries that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Consolidate `CROWN-30` schema-baseline assumptions and seed-strategy scope in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/plan.md`
- [x] T004 [P] Normalize foundational seed-scope boundaries and exclusions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md`
- [x] T005 [P] Align downstream seed-strategy guarantees in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/contracts/prisma-seed-strategy-handoff-contract.md`
- [x] T006 Reconcile the seed strategy entities and baseline areas with `CROWN-29` and `CROWN-30` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/data-model.md`

**Checkpoint**: Foundational seed-strategy boundaries are stable and downstream handoff constraints are aligned

---

## Phase 3: User Story 1 - Define A Resettable Local Seed Baseline (Priority: P1) 🎯 MVP

**Goal**: Define the canonical reset boundary and baseline contents for repeated local and future test seed usage

**Independent Test**: A reviewer can inspect the strategy and determine what data is cleared, what remains outside the reset path, and what baseline state is expected after a rerun

### Validation for User Story 1

- [x] T007 [P] [US1] Cross-check reset-scope requirements and baseline expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md`
- [x] T008 [P] [US1] Cross-check seeded baseline areas and reset-boundary entities in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/data-model.md`

### Implementation for User Story 1

- [x] T009 [US1] Refine the reset-scope boundary and retained-data rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/data-model.md`
- [x] T010 [US1] Refine control-plane and tenant-domain baseline scope expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/data-model.md`
- [x] T011 [US1] Align resettable-baseline requirements and success criteria in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md`
- [x] T012 [US1] Update reset-scope decisions and alternatives in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/research.md`

**Checkpoint**: The canonical resettable baseline is explicit and independently reviewable

---

## Phase 4: User Story 2 - Define Deterministic Fixture Ordering And Lookup Rules (Priority: P2)

**Goal**: Define stable fixture ordering, lookup keys, and representative baseline scope for local and future automated usage

**Independent Test**: A reviewer can identify the deterministic lookup contract, representative baseline scope, and ordering rules without reopening design questions

### Validation for User Story 2

- [x] T013 [P] [US2] Review deterministic fixture requirements and representative-data expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md`
- [x] T014 [P] [US2] Review deterministic fixture keys and ordering-rule entities in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/data-model.md`

### Implementation for User Story 2

- [x] T015 [US2] Refine deterministic fixture key rules and lookup boundaries in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/data-model.md`
- [x] T016 [US2] Refine representative baseline-data scope and ordering expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/data-model.md`
- [x] T017 [US2] Update deterministic fixture decisions and rejected alternatives in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/research.md`
- [x] T018 [US2] Align fixture-focused requirements and assumptions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md`

**Checkpoint**: Stable fixture identifiers and baseline-data expectations are explicit and independently reviewable

---

## Phase 5: User Story 3 - Define Safe Rerun And Failure-Recovery Expectations (Priority: P3)

**Goal**: Define how the seed workflow should recover from interrupted resets or partial loads and remain reusable for local and future containerized execution

**Independent Test**: A reviewer can determine how reruns recover from partial work and what safety expectations later implementation must satisfy

### Validation for User Story 3

- [x] T019 [P] [US3] Review rerun-safety and recovery requirements in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md`
- [x] T020 [P] [US3] Review recovery-expectation entities and downstream usage guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/data-model.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/quickstart.md`

### Implementation for User Story 3

- [x] T021 [US3] Refine rerun-safety, partial-failure, and recovery expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/research.md`
- [x] T022 [US3] Refine downstream handoff guarantees for local and future containerized execution in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/contracts/prisma-seed-strategy-handoff-contract.md`
- [x] T023 [US3] Update recovery-focused requirements and success criteria in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md`
- [x] T024 [US3] Reconcile the final rerun/recovery strategy with implementation-readiness guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/quickstart.md`

**Checkpoint**: Rerun safety and recovery expectations are explicit and independently reviewable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, validation, and readiness checks across all seed-strategy artifacts

- [x] T025 [P] Run artifact validation with `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [x] T026 [P] Update implementation-readiness notes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/quickstart.md`
- [x] T027 Perform final terminology and deterministic-boundary consistency pass across `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/data-model.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/contracts/prisma-seed-strategy-handoff-contract.md`
- [x] T028 Confirm the final seed strategy still aligns to `CROWN-29` and `CROWN-30` handoff guarantees in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/research.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/contracts/prisma-seed-strategy-handoff-contract.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and should align to the finalized reset baseline from US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the reset-scope and deterministic-fixture outputs from US1 and US2

### Within Each User Story

- Validation tasks should happen before final artifact edits
- Boundary definitions before downstream handoff refinements
- Story-specific requirements should be aligned after the underlying artifact is updated

### Parallel Opportunities

- `T001` and `T002` can run in parallel
- `T004` and `T005` can run in parallel after `T003`
- `T007` and `T008` can run in parallel
- `T013` and `T014` can run in parallel
- `T019` and `T020` can run in parallel
- `T025` and `T026` can run in parallel

---

## Parallel Example: User Story 2

```bash
# Review both deterministic-fixture surfaces together:
Task: "Review deterministic fixture requirements and representative-data expectations in specs/CROWN-31-prisma-seed-strategy/spec.md"
Task: "Review deterministic fixture keys and ordering-rule entities in specs/CROWN-31-prisma-seed-strategy/data-model.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the resettable baseline strategy before refining deterministic fixture and recovery concerns

### Incremental Delivery

1. Complete Setup + Foundational to stabilize seed-strategy boundaries
2. Deliver User Story 1 to define the resettable baseline
3. Add User Story 2 to define deterministic fixture and lookup-key rules
4. Add User Story 3 to finalize rerun and recovery expectations for downstream implementation
5. Finish with cross-cutting validation and readiness checks

### Parallel Team Strategy

1. One contributor can stabilize the foundational plan and scope-boundary artifacts
2. After Foundational is complete:
   - Contributor A: User Story 1 reset-baseline refinement
   - Contributor B: User Story 2 deterministic fixture refinement
3. Once US1 and US2 settle, Contributor C can finalize rerun and recovery guidance in User Story 3

---

## Notes

- `[P]` tasks touch different files or isolated review surfaces
- `CROWN-31` is strategy-design-first work, so the executable output is a stable artifact set that later implementation will follow
- Downstream seed implementation should not proceed until the reset scope, deterministic fixture contract, and rerun-safety expectations are finalized
