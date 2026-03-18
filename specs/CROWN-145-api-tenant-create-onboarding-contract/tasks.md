# Tasks: API Tenant Create Onboarding Contract

**Input**: Design docs from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-145-api-tenant-create-onboarding-contract/`  
**Prerequisites**: `spec.md`, `plan.md`

**Tests**: Contract-level API tests and docs-contract verification are required because this story changes a protected request schema and manual OpenAPI surface.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency conflict)
- **[Story]**: User story identifier (`US1`, `US2`, `US3`)

## Phase 1: Setup

- [ ] T001 Review current `/api/v1/platform/tenant` request handling in `apps/api/src/routes/platform-tenants.ts` and `apps/api/src/tenant/contracts.ts`.
- [ ] T002 [P] Review shared role and management-system enums in `packages/types/src/index.ts`.
- [ ] T003 [P] Review existing contract/docs tests in `apps/api/tests/contract/platform-tenant-provision.contract.spec.ts` and `apps/api/tests/integration/api-docs.spec.ts`.

---

## Phase 2: Foundational (Blocking)

- [ ] T004 Add shared onboarding submission schemas/types in `packages/types/src/index.ts` for tenant info, selected roles, initial users, and response shape.
- [ ] T005 Add v1 schema-level constraints in `packages/types/src/index.ts`:
  - selected roles non-empty and unique
  - every initial user role included in selected roles
  - tenant-admin bootstrap (`tenant_admin` in selected roles and at least one initial user)
- [ ] T006 Re-export/reuse onboarding schemas in `apps/api/src/tenant/contracts.ts` so route validation uses shared contract definitions.

**Checkpoint**: Shared onboarding contract exists and is consumable by API route validation.

---

## Phase 3: User Story 1 - One Guided Submission Contract (P1)

**Goal**: `/api/v1/platform/tenant` validates one guided-flow payload contract.

### Tests for User Story 1

- [ ] T007 [P] [US1] Update success payload assertions in `apps/api/tests/contract/platform-tenant-provision.contract.spec.ts` to send the new onboarding shape.
- [ ] T008 [P] [US1] Add invalid-shape contract test cases for missing nested tenant fields and malformed initial users in `apps/api/tests/contract/platform-tenant-provision.contract.spec.ts`.

### Implementation for User Story 1

- [ ] T009 [US1] Update `apps/api/src/routes/platform-tenants.ts` request mapping to read `tenant.name`, `tenant.slug`, and `tenant.managementSystemTypeCode` while preserving existing `provisionTenant` call behavior.

**Checkpoint**: Endpoint accepts and validates dedicated onboarding payload shape.

---

## Phase 4: User Story 2 - Enforce V1 Constraints (P1)

**Goal**: Contract enforces one-role-per-user and tenant-admin bootstrap semantics.

### Tests for User Story 2

- [ ] T010 [P] [US2] Add contract tests in `apps/api/tests/contract/platform-tenant-provision.contract.spec.ts` for:
  - missing `tenant_admin` in selected roles
  - no initial user with `tenant_admin`
  - initial user role absent from selected roles

### Implementation for User Story 2

- [ ] T011 [US2] Implement/refine `superRefine` validation rules on onboarding schemas in `packages/types/src/index.ts`.

**Checkpoint**: Invalid v1 onboarding constraints fail contract validation with 400 responses.

---

## Phase 5: User Story 3 - Shared + Documented + Scope-Limited (P2)

**Goal**: Shared contract source and OpenAPI docs stay aligned while workflow behavior remains unchanged.

### Tests for User Story 3

- [ ] T012 [P] [US3] Update docs assertions in `apps/api/tests/integration/api-docs.spec.ts` for the revised request schema reference/name.

### Implementation for User Story 3

- [ ] T013 [US3] Update onboarding-related schemas under `apps/api/src/docs/openapi.ts` and ensure `/api/v1/platform/tenant` request body references the new component schema.
- [ ] T014 [US3] Verify no new provisioning side effects were introduced in route/service flow beyond payload validation and field mapping.

**Checkpoint**: API docs and route validation reflect onboarding contract; runtime behavior scope remains contract-only.

---

## Phase 6: Polish & Validation

- [ ] T015 [P] Run focused contract tests:
  - `pnpm --filter @crown/api test -- tests/contract/platform-tenant-provision.contract.spec.ts`
  - `pnpm --filter @crown/api test -- tests/integration/api-docs.spec.ts`
- [ ] T016 Run `pnpm --filter @crown/api typecheck` and fix any regressions.
- [ ] T017 Run `pnpm specify.audit` and address Speckit audit findings.
- [ ] T018 Create/update PR description with Jira linkage (`CROWN-145`), Spec Kit links, scope statement, and validation notes.

## Dependencies & Order

- T004-T006 must complete before story implementation tasks.
- T009 depends on T004-T006.
- T011 depends on T004-T005.
- T013 depends on T004 naming decisions.
- T015-T017 depend on all implementation + test updates.

## Parallel Opportunities

- T002 and T003 can run in parallel.
- T007 and T008 can run in parallel.
- T010 and T012 can run in parallel.
- T015 commands can run independently as focused checks.

## Implementation Strategy

1. Land shared schema + API wiring first.
2. Update route mapping and contract tests second.
3. Align OpenAPI + docs tests third.
4. Run validation and finalize PR/Jira updates.
