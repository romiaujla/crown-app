# Tasks: Tenant Provisioning and Schema Bootstrap

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/specs/005-crown-5/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included because spec and quickstart define explicit contract/integration testing outcomes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature-specific scaffolding and shared contracts for implementation.

- [X] T001 Create tenant provisioning route module scaffold in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/routes/platform-tenants.ts
- [X] T002 [P] Create tenant provisioning request/response Zod schemas in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/contracts.ts
- [X] T003 [P] Create tenant provisioning service type definitions in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/types.ts
- [X] T004 Wire platform tenant router into API app in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/app.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core infrastructure required by all user stories.

**⚠️ CRITICAL**: No user story work starts before this phase is complete.

- [X] T005 Add provisioning-specific error code schema and response helper in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/types/errors.ts
- [X] T006 [P] Add Prisma client singleton and lifecycle handling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/db/prisma.ts
- [X] T007 [P] Implement slug normalization and schema-name derivation utility in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/slug.ts
- [X] T008 [P] Implement migration file discovery and lexical ordering helper in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/migration-loader.ts
- [X] T009 Implement baseline tenant migrator orchestration with skip-on-applied support in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/migrator.ts
- [X] T010 Implement provisioning service composition (validation, schema creation hook, migration hook) in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/provision-service.ts

**Checkpoint**: Foundation ready - user stories can proceed.

---

## Phase 3: User Story 1 - Provision Tenant with Isolated Schema (Priority: P1) 🎯 MVP

**Goal**: Allow super admins to create a tenant record and isolated `tenant_<slug>` schema with deterministic conflict handling.

**Independent Test**: POST `/api/v1/platform/tenants` with super-admin token creates tenant metadata and schema; duplicate slug returns conflict without side effects.

### Tests for User Story 1

- [X] T011 [P] [US1] Add provisioning endpoint contract tests for 201/400/401/403/409 outcomes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/tests/contract/platform-tenant-provision.contract.spec.ts
- [X] T012 [P] [US1] Add provisioning integration test for schema creation and duplicate slug conflict in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/tests/integration/tenant-provisioning.spec.ts

### Implementation for User Story 1

- [X] T013 [US1] Implement role-gated `POST /platform/tenants` handler in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/routes/platform-tenants.ts
- [X] T014 [US1] Enforce request validation and slug constraints in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/contracts.ts
- [X] T015 [US1] Implement tenant metadata create + unique conflict mapping in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/provision-service.ts
- [X] T016 [US1] Implement `CREATE SCHEMA IF NOT EXISTS` execution with safe identifier handling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/provision-service.ts
- [X] T017 [US1] Add structured provisioning attempt/result logging in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/provision-service.ts

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Bootstrap Baseline CRM Tables (Priority: P1)

**Goal**: Execute baseline tenant SQL migrations during provisioning with deterministic failure reporting.

**Independent Test**: Provisioning applies baseline migrations creating `accounts`, `contacts`, `deals`, and `activities`; simulated SQL failure returns `migration_failed` and stops further versions.

### Tests for User Story 2

- [X] T018 [P] [US2] Add integration test validating baseline table creation in provisioned schema in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/tests/integration/tenant-bootstrap-migrations.spec.ts
- [X] T019 [P] [US2] Add integration test for mid-run migration failure stop behavior in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/tests/integration/tenant-bootstrap-migrations.spec.ts

### Implementation for User Story 2

- [X] T020 [US2] Implement per-migration SQL execution against tenant schema in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/migrator.ts
- [X] T021 [US2] Enforce stop-on-first-failure and `migration_failed` error mapping in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/migrator.ts
- [X] T022 [US2] Integrate migration runner invocation into provisioning flow in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/provision-service.ts
- [X] T023 [US2] Add migration file readability/ordering validation in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/migration-loader.ts

**Checkpoint**: User Story 2 is independently functional and testable.

---

## Phase 5: User Story 3 - Track Provisioning and Schema Version Metadata (Priority: P2)

**Goal**: Persist auditable migration version history and guarantee idempotent-safe retries.

**Independent Test**: After successful and retried provisioning runs, `tenant_schema_versions` records match applied versions without duplicates.

### Tests for User Story 3

- [X] T024 [P] [US3] Add integration test for version-record persistence across full bootstrap run in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/tests/integration/tenant-schema-versioning.spec.ts
- [X] T025 [P] [US3] Add integration test for retry path skipping already-applied versions in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/tests/integration/tenant-schema-versioning.spec.ts

### Implementation for User Story 3

- [X] T026 [US3] Implement version insert and duplicate-skip semantics using `(tenantId, version)` uniqueness in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/migrator.ts
- [X] T027 [US3] Add provisioning response payload with `applied_versions` and status in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/routes/platform-tenants.ts
- [X] T028 [US3] Persist `appliedBy` actor metadata from JWT `sub` into tenant schema version records in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/src/tenant/migrator.ts
- [X] T029 [US3] Add metadata consistency assertions and helper queries for tenant/version state in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/apps/api/tests/helpers/tenant-provisioning-db.ts

**Checkpoint**: User Story 3 is independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Align docs and run full verification across stories.

- [X] T030 [P] Update tenant provisioning API contract examples and status codes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/specs/005-crown-5/contracts/tenant-provisioning.openapi.yaml
- [X] T031 [P] Update migration runner invariants and retry semantics doc in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/specs/005-crown-5/contracts/tenant-migration-runner-contract.md
- [X] T032 Run quickstart validation command set and record execution notes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/specs/005-crown-5/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies
- Phase 2 -> depends on Phase 1
- Phase 3 (US1) -> depends on Phase 2
- Phase 4 (US2) -> depends on Phase 2 and uses US1 provisioning route path
- Phase 5 (US3) -> depends on Phase 2 and US2 migration execution behavior
- Phase 6 -> depends on completed stories targeted for release

### User Story Dependency Graph

- US1 (P1) -> US2 (P1) -> US3 (P2)

### Parallel Opportunities

- Setup: T002 and T003 can run in parallel after T001.
- Foundation: T006, T007, and T008 can run in parallel before T009/T010 integration tasks.
- US1: T011 and T012 can run in parallel; T015 and T016 can run in parallel once T014 exists.
- US2: T018 and T019 can run in parallel; T021 and T023 can run in parallel after T020 base execution logic.
- US3: T024 and T025 can run in parallel; T027 and T029 can run in parallel after T026.

---

## Parallel Example: User Story 1

```bash
Task: "T011 [US1] Add provisioning endpoint contract tests in apps/api/tests/contract/platform-tenant-provision.contract.spec.ts"
Task: "T012 [US1] Add provisioning integration test in apps/api/tests/integration/tenant-provisioning.spec.ts"

Task: "T015 [US1] Implement tenant metadata create + conflict mapping in apps/api/src/tenant/provision-service.ts"
Task: "T016 [US1] Implement schema creation execution in apps/api/src/tenant/provision-service.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T018 [US2] Add baseline table creation integration test in apps/api/tests/integration/tenant-bootstrap-migrations.spec.ts"
Task: "T019 [US2] Add failure-stop integration test in apps/api/tests/integration/tenant-bootstrap-migrations.spec.ts"

Task: "T021 [US2] Enforce stop-on-failure mapping in apps/api/src/tenant/migrator.ts"
Task: "T023 [US2] Add migration file validation in apps/api/src/tenant/migration-loader.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T024 [US3] Add version persistence integration test in apps/api/tests/integration/tenant-schema-versioning.spec.ts"
Task: "T025 [US3] Add retry skip integration test in apps/api/tests/integration/tenant-schema-versioning.spec.ts"

Task: "T027 [US3] Add provisioning response payload in apps/api/src/routes/platform-tenants.ts"
Task: "T029 [US3] Add metadata helper assertions in apps/api/tests/helpers/tenant-provisioning-db.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently with T011 and T012 before expanding scope.

### Incremental Delivery

1. Deliver US1 isolated schema provisioning.
2. Add US2 baseline migration bootstrap.
3. Add US3 version tracking and retry/idempotency guarantees.
4. Finish with Phase 6 cross-cutting docs and quickstart validation.

### Parallel Team Strategy

1. One developer handles foundation orchestration (T009-T010).
2. One developer handles route/contracts (T013-T014, T027).
3. One developer handles migration/versioning + integration tests (T018-T026, T028-T029).

