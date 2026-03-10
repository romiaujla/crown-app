# Tasks: Detailed Tenant-Domain Model For Foundational TMS Baseline

**Input**: Design documents from `/specs/CROWN-29-tenant-domain-model/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Validation tasks are included because this story's output is a design handoff that must be reviewable and audit-safe before downstream implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the design-artifact workspace and downstream touchpoints before foundational modeling work begins

- [X] T001 Review existing tenant baseline inputs in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tenant-migrations/0001_base/` and record relevant carry-forward constraints in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/research.md`
- [X] T002 [P] Review downstream story expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/contracts/tenant-model-handoff-contract.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the cross-story modeling rules that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Consolidate foundational TMS modeling constraints and constitutional naming rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/plan.md`
- [X] T004 [P] Normalize foundational scope boundaries, exclusions, and downstream dependencies in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/spec.md`
- [X] T005 [P] Align the handoff contract with current epic/story sequencing in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/contracts/tenant-model-handoff-contract.md`
- [X] T006 Reconcile the foundational model with the current tenant baseline artifacts in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md`

**Checkpoint**: Foundational modeling rules are stable and downstream handoff constraints are aligned

---

## Phase 3: User Story 1 - Define The Foundational Tenant Model (Priority: P1) 🎯 MVP

**Goal**: Define the foundational TMS-oriented tenant entities, relationships, lifecycle boundaries, and naming rules

**Independent Test**: A reviewer can inspect the artifacts and identify the foundational tenant entities, relationship map, and lifecycle/state boundaries without reopening downstream scope questions

### Validation for User Story 1

- [X] T007 [P] [US1] Cross-check foundational entity coverage and terminology in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/spec.md`
- [X] T008 [P] [US1] Cross-check entity relationships, lifecycle states, and validation rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md`

### Implementation for User Story 1

- [X] T009 [US1] Refine foundational entity definitions and purpose statements in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md`
- [X] T010 [US1] Refine relationship summaries and lifecycle/state boundaries in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md`
- [X] T011 [US1] Align foundational model requirements and success criteria with the refined entity map in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/spec.md`
- [X] T012 [US1] Update foundational modeling decisions and rejected alternatives in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/research.md`

**Checkpoint**: User Story 1 is fully reviewable and can stand alone as the foundational tenant-model definition

---

## Phase 4: User Story 2 - Define Reference Data And Deterministic Fixture Boundaries (Priority: P2)

**Goal**: Separate reusable reference data from seeded fixture records and define stable fixture identifiers for downstream seed/test work

**Independent Test**: A reviewer can identify which model elements are reusable catalogs versus seeded fixtures and can find stable keys/slugs for deterministic downstream use

### Validation for User Story 2

- [X] T013 [P] [US2] Review reference-data and fixture-boundary requirements in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/spec.md`
- [X] T014 [P] [US2] Review stable identifier and fixture profile coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md`

### Implementation for User Story 2

- [X] T015 [US2] Refine reference-data set definitions, controlled catalogs, and validation rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md`
- [X] T016 [US2] Refine seed fixture profile definitions, reset-scope expectations, and deterministic key guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md`
- [X] T017 [US2] Update fixture-boundary requirements, assumptions, and edge cases in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/spec.md`
- [X] T018 [US2] Update reference-data and deterministic-fixture decisions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/research.md`

**Checkpoint**: User Story 2 clearly defines what downstream seed and test stories can treat as catalogs, fixtures, and stable keys

---

## Phase 5: User Story 3 - Establish Foundational Handoff For Migration And Seed Design (Priority: P3)

**Goal**: Produce a scoped, downstream-ready handoff so `CROWN-30` through `CROWN-34` can implement schema and seed work without re-defining the model

**Independent Test**: A reviewer can use the handoff artifacts to understand what downstream stories may rely on and where capability-specific behavior remains intentionally out of scope

### Validation for User Story 3

- [X] T019 [P] [US3] Review downstream dependency and out-of-scope boundaries in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/contracts/tenant-model-handoff-contract.md`
- [X] T020 [P] [US3] Review downstream usage and completion signals in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/quickstart.md`

### Implementation for User Story 3

- [X] T021 [US3] Refine downstream consumer guarantees and review rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/contracts/tenant-model-handoff-contract.md`
- [X] T022 [US3] Refine downstream usage guidance and review steps in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/quickstart.md`
- [X] T023 [US3] Update handoff-focused requirements and success criteria in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/spec.md`
- [X] T024 [US3] Reconcile plan summary and structure decisions with the finalized handoff scope in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/plan.md`

**Checkpoint**: All user stories are independently reviewable and the downstream schema/seed stories have a stable model handoff

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, validation, and artifact readiness across all user stories

- [X] T025 [P] Run artifact validation with `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [X] T026 [P] Update implementation-readiness notes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/quickstart.md`
- [X] T027 Perform final terminology and scope consistency pass across `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/contracts/tenant-model-handoff-contract.md`
- [X] T028 Confirm the final model handoff still defers Prisma 7+ to `CROWN-35` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/spec.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/research.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and should align to the finalized US1 entity set
- **User Story 3 (P3)**: Starts after Foundational and depends on the final outputs of US1 and US2

### Within Each User Story

- Validation tasks should happen before final artifact edits
- Core model definitions before handoff/refinement tasks
- Story-specific requirements should be aligned after the underlying artifact is updated

### Parallel Opportunities

- `T001` and `T002` can run in parallel
- `T004` and `T005` can run in parallel after `T003`
- `T007` and `T008` can run in parallel
- `T013` and `T014` can run in parallel
- `T019` and `T020` can run in parallel
- `T025` and `T026` can run in parallel

---

## Parallel Example: User Story 1

```bash
# Review both foundational model validation surfaces together:
Task: "Cross-check foundational entity coverage and terminology in specs/CROWN-29-tenant-domain-model/spec.md"
Task: "Cross-check entity relationships, lifecycle states, and validation rules in specs/CROWN-29-tenant-domain-model/data-model.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the foundational entity and relationship model before touching fixture boundaries or downstream handoff

### Incremental Delivery

1. Complete Setup + Foundational to stabilize scope and naming
2. Deliver User Story 1 to establish the core TMS tenant model
3. Add User Story 2 to define reference-data and deterministic fixture boundaries
4. Add User Story 3 to finalize downstream handoff for `CROWN-30` through `CROWN-34`
5. Finish with cross-cutting validation and readiness checks

### Parallel Team Strategy

1. One contributor can stabilize the foundational plan/contract artifacts
2. After Foundational is complete:
   - Contributor A: User Story 1 entity/lifecycle refinement
   - Contributor B: User Story 2 fixture/reference-data refinement
3. Once US1 and US2 settle, Contributor C can finalize the downstream handoff package in User Story 3

---

## Notes

- `[P]` tasks touch different files or isolated review surfaces
- `CROWN-29` is a design-first story, so the executable output is a stable artifact set rather than runtime code
- Downstream implementation stories should not proceed until the handoff contract and quickstart guidance are finalized
