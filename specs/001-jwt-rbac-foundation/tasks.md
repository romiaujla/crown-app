# Tasks: Global Auth and RBAC Foundation

**Input**: Design documents from `/specs/001-jwt-rbac-foundation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included because authorization behavior changes require verification coverage per repository standards.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare route/middleware/test scaffolding for auth and RBAC contracts.

- [X] T001 Create auth route scaffold in `apps/api/src/routes/auth.ts`
- [X] T002 Create authorization route scaffold in `apps/api/src/routes/authorization.ts`
- [X] T003 [P] Create authentication middleware scaffold in `apps/api/src/middleware/authenticate.ts`
- [X] T004 [P] Create authorization middleware scaffold in `apps/api/src/middleware/authorize.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared claim validation, policy evaluation, and common denial handling.

**⚠️ CRITICAL**: No user story work starts until this phase completes.

- [X] T005 Implement strict JWT claims validation rules in `packages/types/src/index.ts`
- [X] T006 [P] Add shared authorization denial response types in `apps/api/src/types/errors.ts`
- [X] T007 Implement claim extraction and normalization middleware in `apps/api/src/middleware/authenticate.ts`
- [X] T008 Implement namespace-based policy evaluation core in `apps/api/src/auth/policy.ts`
- [X] T009 Wire shared middleware into API bootstrap pipeline in `apps/api/src/app.ts`
- [X] T010 [P] Add foundational middleware tests for invalid/missing claims in `apps/api/tests/integration/authenticate.middleware.spec.ts`
- [X] T011 Add test helpers for role and tenant identity fixtures in `apps/api/tests/helpers/auth-fixtures.ts`

**Checkpoint**: Shared claims and policy primitives are ready.

---

## Phase 3: User Story 1 - Enforce Platform-Level Access (Priority: P1) 🎯 MVP

**Goal**: Permit platform operations only to `super_admin`.

**Independent Test**: Platform route allows `super_admin` and denies `tenant_admin`/`tenant_user` with safe denial responses.

### Tests for User Story 1

- [X] T012 [P] [US1] Add contract tests for platform role outcomes in `apps/api/tests/contract/platform-auth.contract.spec.ts`
- [X] T013 [P] [US1] Add integration tests for platform role mismatch denials in `apps/api/tests/integration/platform-rbac.spec.ts`

### Implementation for User Story 1

- [X] T014 [US1] Implement platform-only role policy rules in `apps/api/src/auth/policy.ts`
- [X] T015 [US1] Implement platform guard middleware branch in `apps/api/src/middleware/authorize.ts`
- [X] T016 [US1] Implement protected platform route behavior in `apps/api/src/routes/authorization.ts`
- [X] T017 [US1] Register platform protected route namespace in `apps/api/src/app.ts`

**Checkpoint**: US1 is independently functional and testable.

---

## Phase 4: User Story 2 - Enforce Tenant Administration Scope (Priority: P2)

**Goal**: Permit tenant administration only for `tenant_admin` in matching tenant scope.

**Independent Test**: Tenant-admin route allows matching `tenant_id` and denies cross-tenant requests.

### Tests for User Story 2

- [X] T018 [P] [US2] Add contract tests for tenant-admin allow/deny matrix in `apps/api/tests/contract/tenant-admin-auth.contract.spec.ts`
- [X] T019 [P] [US2] Add integration tests for tenant-admin tenant mismatch in `apps/api/tests/integration/tenant-admin-rbac.spec.ts`

### Implementation for User Story 2

- [X] T020 [US2] Implement tenant-admin namespace policy rules in `apps/api/src/auth/policy.ts`
- [X] T021 [US2] Implement tenant scope comparison checks in `apps/api/src/middleware/authorize.ts`
- [X] T022 [US2] Implement tenant-admin protected route behavior in `apps/api/src/routes/authorization.ts`
- [X] T023 [US2] Register tenant-admin protected route namespace in `apps/api/src/app.ts`

**Checkpoint**: US2 is independently functional and testable.

---

## Phase 5: User Story 3 - Enforce Tenant User Limits (Priority: P3)

**Goal**: Permit tenant user operations only in matching tenant scope and deny admin/platform operations.

**Independent Test**: Tenant-user route allows user-level action with matching tenant and denies admin/platform paths.

### Tests for User Story 3

- [X] T024 [P] [US3] Add contract tests for tenant-user permission boundaries in `apps/api/tests/contract/tenant-user-auth.contract.spec.ts`
- [X] T025 [P] [US3] Add integration tests for tenant-user admin denial paths in `apps/api/tests/integration/tenant-user-rbac.spec.ts`

### Implementation for User Story 3

- [X] T026 [US3] Implement tenant-user policy rules and admin denial logic in `apps/api/src/auth/policy.ts`
- [X] T027 [US3] Implement tenant-user protected route behavior in `apps/api/src/routes/authorization.ts`
- [X] T028 [US3] Register tenant-user protected route namespace in `apps/api/src/app.ts`
- [X] T029 [US3] Add malformed-claim tenant-user rejection coverage in `apps/api/tests/integration/tenant-user-rbac.spec.ts`

**Checkpoint**: US3 is independently functional and testable.

---

## Phase 6: Auth Route Contracts (Cross-Story)

**Purpose**: Implement `/auth/login`, `/auth/refresh`, and `/auth/logout` request/response contracts.

- [X] T030 Add auth route request/response schema module in `apps/api/src/auth/contracts.ts`
- [X] T031 Implement login/refresh/logout route handlers in `apps/api/src/routes/auth.ts`
- [X] T032 Add auth route contract tests in `apps/api/tests/contract/auth-routes.contract.spec.ts`
- [X] T033 Register `/api/v1/auth` router in `apps/api/src/app.ts`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final alignment, documentation, and validation across all stories.

- [X] T034 [P] Update RBAC architecture documentation with finalized policy matrix in `docs/architecture/auth-rbac.md`
- [X] T035 [P] Update API boundary documentation with protected namespaces in `docs/architecture/api-boundaries.md`
- [X] T036 Run API auth/RBAC test suite and record execution notes in `specs/001-jwt-rbac-foundation/quickstart.md`
- [X] T037 Verify auth contract artifact matches implemented behavior in `specs/001-jwt-rbac-foundation/contracts/auth-routes.openapi.yaml`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> {Phase 3, Phase 4, Phase 5, Phase 6} -> Phase 7

### User Story Dependencies

- US1 starts after Phase 2 and is MVP.
- US2 starts after Phase 2 and is independently testable.
- US3 starts after Phase 2 and is independently testable.

### Within Each User Story

- Story tests first.
- Policy/middleware implementation next.
- Route wiring last.
- Validate independent test criteria before moving on.

---

## Parallel Execution Examples

### User Story 1

- Run in parallel: `T012` and `T013`

### User Story 2

- Run in parallel: `T018` and `T019`

### User Story 3

- Run in parallel: `T024` and `T025`

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independent test criteria.

### Incremental Delivery

1. Deliver US1 (platform boundary).
2. Deliver US2 (tenant-admin scope).
3. Deliver US3 (tenant-user least privilege).
4. Deliver auth contracts and polish tasks.

### Parallel Team Strategy

1. Team completes Phase 1 and Phase 2 together.
2. Split by story: US1, US2, US3 in parallel.
3. Execute Phase 6 once foundational middleware is stable.
