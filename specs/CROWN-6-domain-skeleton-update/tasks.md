# Tasks: Align Domain Schemas With Management-System Pivot

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included because the feature changes tenant-domain behavior, contracts, and migration semantics that should be verified before rollout.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the feature workspace and align spec artifacts with the Jira-linked implementation branch.

- [X] T001 Update spec metadata and compatibility alias references in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/spec.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/checklists/requirements.md
- [X] T002 Create a migration-audit working note in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/research.md for the current tenant baseline inventory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared tenant-domain foundation that all user stories depend on.

**⚠️ CRITICAL**: No user story work starts before this phase is complete.

- [X] T003 Audit existing tenant-domain references across architecture docs, contracts, and migrations in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/architecture/api-boundaries.md, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/architecture/multi-tenant-model.md, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tenant-migrations/0001_base/
- [X] T004 [P] Define the final management-system baseline entity mapping in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/data-model.md
- [X] T005 [P] Define artifact disposition rules and compatibility handling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/contracts/tenant-domain-audit-contract.md
- [X] T006 [P] Define tenant-domain boundary rules for non-CRM terminology in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/contracts/tenant-domain-boundaries.md
- [X] T007 Update the implementation summary and baseline decisions in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/plan.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/research.md

**Checkpoint**: Domain baseline and compatibility rules are defined; user stories can proceed.

---

## Phase 3: User Story 1 - Audit Existing Tenant Domain Baseline (Priority: P1) 🎯 MVP

**Goal**: Inventory every CRM-shaped tenant-domain artifact and assign an explicit disposition.

**Independent Test**: Review the audit output and confirm every existing tenant-domain artifact has one documented disposition with rationale and compatibility handling.

### Tests for User Story 1

- [X] T008 [P] [US1] Add a contract-style audit completeness checklist in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/contracts/tenant-domain-audit-contract.md
- [X] T009 [P] [US1] Add quickstart validation steps for the audit review in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/quickstart.md

### Implementation for User Story 1

- [X] T010 [P] [US1] Document the current tenant migration artifact inventory in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/research.md
- [X] T011 [P] [US1] Document the current tenant API/domain language inventory in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/research.md
- [X] T012 [US1] Record disposition decisions for `accounts`, `contacts`, `deals`, and `activities` in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/data-model.md
- [X] T013 [US1] Record compatibility handling for pre-pivot tenant environments in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/contracts/tenant-domain-audit-contract.md
- [X] T014 [US1] Update the feature summary and audit outcomes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/spec.md

**Checkpoint**: User Story 1 is independently complete when every pre-pivot artifact has a documented handling path.

---

## Phase 4: User Story 2 - Define Management-System Domain Baseline (Priority: P2)

**Goal**: Replace CRM-only tenant baseline concepts with management-system-oriented entities and boundaries.

**Independent Test**: Review the updated baseline and confirm it can describe at least dealer-management and transportation-management tenants without CRM-only terminology.

### Tests for User Story 2

- [X] T015 [P] [US2] Add baseline applicability examples for multiple tenant system types in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/contracts/tenant-domain-boundaries.md
- [X] T016 [P] [US2] Add validation steps for multi-tenant example review in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/quickstart.md

### Implementation for User Story 2

- [X] T017 [P] [US2] Replace CRM-oriented tenant entity definitions with management-system baseline entities in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/data-model.md
- [X] T018 [P] [US2] Update tenant-scoped API boundary language in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/architecture/api-boundaries.md
- [X] T019 [P] [US2] Update tenant schema baseline language in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/architecture/multi-tenant-model.md
- [X] T020 [US2] Update the feature requirements and success criteria to reflect the approved management-system baseline in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/spec.md
- [X] T021 [US2] Update backlog/domain references from CRM domain skeleton wording in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/specs/backlog-map.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/specs/mvp-scope.md

**Checkpoint**: User Story 2 is independently complete when the baseline is domain-neutral and validated across multiple tenant system types.

---

## Phase 5: User Story 3 - Preserve Existing Tenant Continuity (Priority: P3)

**Goal**: Define how pre-pivot tenant schemas and bootstrap artifacts transition to the new baseline safely.

**Independent Test**: Review the transition guidance and confirm an operator can determine how an already-provisioned tenant maps from the old baseline to the new one.

### Tests for User Story 3

- [X] T022 [P] [US3] Add transition review scenarios for existing tenants in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/quickstart.md
- [X] T023 [P] [US3] Add migration compatibility acceptance rules in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/contracts/tenant-domain-audit-contract.md

### Implementation for User Story 3

- [X] T024 [P] [US3] Define the target replacement migration set and compatibility notes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/research.md
- [X] T025 [P] [US3] Update baseline tenant migration filenames and table definitions in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tenant-migrations/0001_base/001_accounts.sql, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tenant-migrations/0001_base/002_contacts.sql, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tenant-migrations/0001_base/003_deals.sql, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tenant-migrations/0001_base/004_activities.sql
- [X] T026 [US3] Update provisioning contract examples and applied version documentation in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/005-crown-5/contracts/tenant-provisioning.openapi.yaml and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/005-crown-5/contracts/tenant-migration-runner-contract.md
- [X] T027 [US3] Update tenant migration loader and dependent tests for renamed baseline artifacts in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/migration-loader.ts, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-bootstrap-migrations.spec.ts, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-schema-versioning.spec.ts
- [X] T028 [US3] Update compatibility guidance and operator-facing transition notes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/quickstart.md

**Checkpoint**: User Story 3 is independently complete when old and new tenant baseline handling is fully documented and reflected in migration artifacts.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across stories and close remaining cross-cutting updates.

- [X] T029 [P] Update auth and provisioning specs that still describe tenant-scoped CRM operations in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/001-jwt-rbac-foundation/spec.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/005-crown-5/spec.md
- [X] T030 [P] Update architecture and planning artifacts that still reference CRM-only tenant operations in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/001-jwt-rbac-foundation/plan.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/005-crown-5/plan.md
- [X] T031 Run quickstart validation and record final notes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/quickstart.md
- [X] T032 Run targeted validation for tenant-domain pivot changes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-bootstrap-migrations.spec.ts and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-schema-versioning.spec.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies
- Phase 2 -> depends on Phase 1
- Phase 3 (US1) -> depends on Phase 2
- Phase 4 (US2) -> depends on Phase 2 and benefits from US1 audit outputs
- Phase 5 (US3) -> depends on Phase 2 and the approved baseline from US2
- Phase 6 -> depends on completed stories targeted for release

### User Story Dependencies

- US1 (P1) -> US2 (P2) -> US3 (P3)

### Parallel Opportunities

- Setup: T001 and T002 can run in parallel.
- Foundational: T004, T005, and T006 can run in parallel after T003.
- US1: T008 and T009 can run in parallel; T010 and T011 can run in parallel before T012.
- US2: T015 and T016 can run in parallel; T017, T018, and T019 can run in parallel before T020.
- US3: T022 and T023 can run in parallel; T024 and T025 can run in parallel before T026/T027.
- Polish: T029 and T030 can run in parallel before T031/T032.

---

## Parallel Example: User Story 2

```bash
# Launch validation additions for User Story 2 together:
Task: "Add baseline applicability examples in specs/CROWN-6-domain-skeleton-update/contracts/tenant-domain-boundaries.md"
Task: "Add multi-tenant example review steps in specs/CROWN-6-domain-skeleton-update/quickstart.md"

# Launch baseline definition updates together:
Task: "Replace tenant entity definitions in specs/CROWN-6-domain-skeleton-update/data-model.md"
Task: "Update tenant API boundary language in docs/architecture/api-boundaries.md"
Task: "Update tenant schema baseline language in docs/architecture/multi-tenant-model.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate that every pre-pivot tenant artifact has a documented disposition
5. Stop and review before changing migration files

### Incremental Delivery

1. Finish Setup + Foundational to establish the audit framework
2. Deliver US1 audit outcomes and validate completeness
3. Deliver US2 baseline renaming and boundary updates
4. Deliver US3 migration and compatibility updates
5. Run final validation and merge once tenant-domain pivot artifacts are aligned

### Parallel Team Strategy

1. One contributor completes Setup + Foundational
2. After the audit framework exists:
   - Contributor A: US1 artifact inventory and disposition records
   - Contributor B: US2 architecture and baseline entity updates
   - Contributor C: US3 migration/test compatibility updates
3. Rejoin for final validation and polish

---

## Notes

- [P] tasks indicate different files and no dependency on incomplete tasks
- [US1], [US2], and [US3] labels map directly to user stories in spec.md
- Each user story includes its own independent test criteria
- Task descriptions include exact file paths
- Suggested MVP scope is User Story 1 only
