# Tasks: Expand Tenant Schema Migrations For Foundational TMS Entities

**Input**: Design documents from `/specs/CROWN-30-tenant-schema-migrations/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Validation tasks are included because this story's output is a migration baseline that must be reviewable and safe for downstream seed and bootstrap work.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the upstream model inputs and current migration baseline before foundational migration changes begin

- [X] T001 Review the approved tenant-domain source of truth in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/contracts/tenant-model-handoff-contract.md`
- [X] T002 [P] Review the current tenant migration baseline in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tenant-migrations/0001_base/` and record carry-forward constraints in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/research.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the migration placement and review rules that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Consolidate the `core` versus `tenant_<tenant_slug>` placement rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/plan.md`
- [X] T004 [P] Normalize foundational migration scope boundaries and exclusions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md`
- [X] T005 [P] Align downstream migration guarantees and placement rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/contracts/tenant-migration-handoff-contract.md`
- [X] T006 Reconcile the migration-backed table set with the approved `CROWN-29` model in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/data-model.md`

**Checkpoint**: Foundational migration rules are stable and downstream handoff constraints are aligned

---

## Phase 3: User Story 1 - Expand The Foundational Tenant Migration Baseline (Priority: P1) 🎯 MVP

**Goal**: Translate the approved foundational TMS entity model into a migration-backed tenant schema baseline

**Independent Test**: A reviewer can inspect the migration design artifacts and verify that the in-scope foundational TMS entities are represented as tenant tables inside `tenant_<tenant_slug>`

### Validation for User Story 1

- [X] T007 [P] [US1] Cross-check foundational tenant table coverage and placement in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md`
- [X] T008 [P] [US1] Cross-check migration-backed table definitions and relationships in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/data-model.md`

### Implementation for User Story 1

- [X] T009 [US1] Refine the foundational tenant table list and schema placement definitions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/data-model.md`
- [X] T010 [US1] Refine relationship, state, and validation guidance for migration-backed tables in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/data-model.md`
- [X] T011 [US1] Align migration requirements and success criteria with the finalized table set in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md`
- [X] T012 [US1] Update foundational migration decisions and alternatives in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/research.md`

**Checkpoint**: User Story 1 is fully reviewable and establishes the foundational migration-backed tenant baseline

---

## Phase 4: User Story 2 - Preserve Foundational Boundaries And Migration Safety (Priority: P2)

**Goal**: Keep migration work foundational, make the delta from the earlier baseline explicit, and prevent later capability scope from leaking in

**Independent Test**: A reviewer can compare the new migration baseline to the earlier minimal baseline and understand the foundational delta without seeing API or product-scope drift

### Validation for User Story 2

- [X] T013 [P] [US2] Review foundational boundary and migration-safety requirements in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md`
- [X] T014 [P] [US2] Review migration delta narrative and shared-versus-tenant boundary notes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/data-model.md`

### Implementation for User Story 2

- [X] T015 [US2] Refine the migration delta summary and baseline replacement narrative in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/data-model.md`
- [X] T016 [US2] Refine foundational-boundary edge cases and assumptions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md`
- [X] T017 [US2] Update migration-safety decisions and rejected alternatives in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/research.md`
- [X] T018 [US2] Align the plan summary and constraints with the finalized foundational migration boundary in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/plan.md`

**Checkpoint**: User Story 2 clearly explains the migration delta and keeps the story constrained to foundational schema work

---

## Phase 5: User Story 3 - Prepare Downstream Seed And Bootstrap Work (Priority: P3)

**Goal**: Produce a migration baseline that downstream seed, bootstrap, and validation stories can consume directly

**Independent Test**: A reviewer can use the handoff artifacts to understand what downstream stories may rely on without redefining schema placement or foundational table structure

### Validation for User Story 3

- [X] T019 [P] [US3] Review downstream consumer guarantees and placement rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/contracts/tenant-migration-handoff-contract.md`
- [X] T020 [P] [US3] Review downstream usage guidance and completion signals in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/quickstart.md`

### Implementation for User Story 3

- [X] T021 [US3] Refine downstream migration handoff guarantees in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/contracts/tenant-migration-handoff-contract.md`
- [X] T022 [US3] Refine downstream usage guidance for seed and bootstrap stories in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/quickstart.md`
- [X] T023 [US3] Update handoff-focused requirements and success criteria in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md`
- [X] T024 [US3] Reconcile the final downstream handoff with `CROWN-29` references in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/plan.md`

**Checkpoint**: All user stories are independently reviewable and downstream stories have a stable migration handoff

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, validation, and readiness checks across all migration design artifacts

- [X] T025 [P] Run artifact validation with `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [X] T026 [P] Update implementation-readiness notes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/quickstart.md`
- [X] T027 Perform final terminology and placement consistency pass across `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/data-model.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/contracts/tenant-migration-handoff-contract.md`
- [X] T028 Confirm the final migration handoff still aligns to `CROWN-29` placement rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/research.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and should align to the finalized US1 table set
- **User Story 3 (P3)**: Starts after Foundational and depends on the final outputs of US1 and US2

### Within Each User Story

- Validation tasks should happen before final artifact edits
- Table placement and table-set definition before handoff refinements
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
# Review both migration validation surfaces together:
Task: "Cross-check foundational tenant table coverage and placement in specs/CROWN-30-tenant-schema-migrations/spec.md"
Task: "Cross-check migration-backed table definitions and relationships in specs/CROWN-30-tenant-schema-migrations/data-model.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the foundational migration-backed table baseline before refining migration delta and downstream handoff concerns

### Incremental Delivery

1. Complete Setup + Foundational to stabilize migration placement and review rules
2. Deliver User Story 1 to establish the foundational TMS migration baseline
3. Add User Story 2 to make the migration delta and safety boundary explicit
4. Add User Story 3 to finalize downstream handoff for `CROWN-31` through `CROWN-34`
5. Finish with cross-cutting validation and readiness checks

### Parallel Team Strategy

1. One contributor can stabilize the foundational plan and placement-rule artifacts
2. After Foundational is complete:
   - Contributor A: User Story 1 migration-backed table refinement
   - Contributor B: User Story 2 migration delta and scope-boundary refinement
3. Once US1 and US2 settle, Contributor C can finalize downstream handoff guidance in User Story 3

---

## Notes

- `[P]` tasks touch different files or isolated review surfaces
- `CROWN-30` is migration-design-first work, so the executable output is a stable artifact set that later implementation will follow
- Downstream seed and bootstrap stories should not proceed until the migration handoff contract and quickstart guidance are finalized
