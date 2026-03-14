# Tasks: Tenant Management-System Type And Default Role Template Model

**Input**: Design documents from `/specs/CROWN-140-tenant-management-system-type-default-role-template-model/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused validation is required because this story changes shared control-plane persistence and the deterministic local seed baseline used by downstream work.

**Organization**: Tasks are grouped by user story to preserve independent review and validation paths.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current control-plane schema and seed baseline touchpoints before implementation begins

- [ ] T001 Review the current control-plane Prisma schema in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma` and capture carry-forward constraints in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/research.md`
- [ ] T002 [P] Review the local seed baseline touchpoints in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/constants.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the new control-plane schema shape and deterministic baseline contract

**⚠️ CRITICAL**: No user story implementation should begin until this phase is complete

- [ ] T003 Define the new control-plane entities, enums, and seed baseline contract in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/data-model.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/contracts/management-system-type-role-template-contract.md`
- [ ] T004 [P] Align implementation scope, assumptions, and validation boundaries in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/plan.md`

**Checkpoint**: The target schema shape and baseline catalog are stable enough to implement without reopening scope

---

## Phase 3: User Story 1 - Persist Approved Management-System Types (Priority: P1) 🎯 MVP

**Goal**: Add a control-plane catalog for approved management-system types with stable lookup keys and lifecycle metadata

**Independent Test**: A reviewer can inspect the Prisma schema, migration, and baseline records and identify the approved management-system type catalog without relying on hard-coded arrays

### Validation for User Story 1

- [ ] T005 [P] [US1] Add focused validation coverage for the management-system type baseline in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`

### Implementation for User Story 1

- [ ] T006 [US1] Add the management-system type model and availability enum to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`
- [ ] T007 [US1] Generate and inspect the Prisma migration for the new management-system type catalog in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/migrations/`
- [ ] T008 [US1] Add deterministic baseline management-system type records to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/constants.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts`

**Checkpoint**: Approved management-system types are persisted and deterministically available through the local control-plane baseline

---

## Phase 4: User Story 2 - Persist Default Role Templates Per Management-System Type (Priority: P1)

**Goal**: Add related default role-template records per management-system type with stable role codes and display metadata

**Independent Test**: A reviewer can inspect persistence and baseline records and confirm each approved management-system type owns a relation-backed default role-template set

### Validation for User Story 2

- [ ] T009 [P] [US2] Extend focused validation coverage for default role-template baseline records in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`

### Implementation for User Story 2

- [ ] T010 [US2] Add the management-system role-template model and relations to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`
- [ ] T011 [US2] Extend the Prisma migration with role-template constraints in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/migrations/`
- [ ] T012 [US2] Add deterministic baseline default role-template records to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/constants.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/types.ts`

**Checkpoint**: Each approved management-system type owns a deterministic persisted default role-template set

---

## Phase 5: User Story 3 - Represent The Required Admin Template For Tenant Bootstrap (Priority: P2)

**Goal**: Persist explicit bootstrap metadata for the required admin role template so later onboarding stories can map it to baseline setup and the v1 tenant-admin path

**Independent Test**: A reviewer can inspect the persisted template metadata and identify the required admin-template mapping without relying only on role labels

### Validation for User Story 3

- [ ] T013 [P] [US3] Add focused assertions for required-admin bootstrap metadata in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`

### Implementation for User Story 3

- [ ] T014 [US3] Add the bootstrap-mapping enum and required-template metadata fields to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`
- [ ] T015 [US3] Seed explicit bootstrap metadata for the required admin templates in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/constants.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts`
- [ ] T016 [US3] Align the local seed type surface for the new control-plane records in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/types.ts`

**Checkpoint**: The required admin role template is persisted with deterministic required/setup and bootstrap mapping metadata

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, validation, and artifact readiness across the feature

- [ ] T017 [P] Run artifact validation with `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T018 [P] Run focused API validation with `pnpm --filter @crown/api exec vitest run tests/integration/prisma-local-seed.spec.ts` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T019 Perform a final consistency pass across `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/data-model.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/contracts/management-system-type-role-template-contract.md`
- [ ] T020 Create the PR for `feat/CROWN-140-db-tenant-management-system-type-default-role-template-model` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks user story implementation
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other user stories
- **User Story 2 (P1)**: Starts after User Story 1 stabilizes the parent type catalog
- **User Story 3 (P2)**: Starts after User Story 2 adds the role-template entity and can then layer explicit bootstrap metadata on top

### Parallel Opportunities

- `T001` and `T002` can run in parallel
- `T003` and `T004` can run in parallel after initial setup review
- `T005`, `T009`, and `T013` can be prepared in parallel with the matching schema work
- `T017` and `T018` can run in parallel during polish

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Add the management-system type catalog model.
2. Generate the control-plane migration.
3. Load deterministic management-system type baseline records.
4. Validate the baseline before layering role templates.

### Incremental Delivery

1. Stabilize the parent type catalog and migration.
2. Add related default role templates.
3. Add explicit required-admin bootstrap metadata.
4. Finish with focused validation and final Spec Kit audit.

## Notes

- This story is intentionally control-plane scoped and should not widen into tenant-create route or UI implementation.
- Seed updates are part of the deliverable because the Jira story requires a real persisted source of truth, not only empty tables.
