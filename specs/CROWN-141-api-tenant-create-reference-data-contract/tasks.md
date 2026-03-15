# Tasks: API Tenant Create Reference-Data Contract For Management-System Types And Default Roles

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-141-api-tenant-create-reference-data-contract/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused route, service, and docs coverage are included because this story adds a new protected API route and a shared contract consumed by future web work.

**Organization**: Tasks are grouped by user story so the reference-data route, role-option behavior, and documentation/auth concerns can be delivered and validated incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current platform tenant route, catalog persistence shape, and test/docs surfaces that `CROWN-141` extends

- [ ] T001 Review the current platform tenant router and provisioning contract files in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/contracts.ts`
- [ ] T002 [P] Review the management-system type, role, and junction persistence shape in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/constants.ts`
- [ ] T003 [P] Review existing platform route contract, integration, and docs coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared contract and reference-data service seam required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add shared tenant-create reference-data schemas, inferred types, and any route-specific enums/constants to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/packages/types/src/index.ts`
- [ ] T005 [P] Add a focused Prisma-backed reference-data service in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/tenants/reference-data-service.ts`
- [ ] T006 [P] Extend the platform tenant router wiring in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts` to accept the new reference-data dependency

**Checkpoint**: The codebase has reusable shared tenant-create reference-data contracts plus a dedicated service ready to be mounted

---

## Phase 3: User Story 1 - Load Supported Management-System Types For Tenant Create (Priority: P1) 🎯 MVP

**Goal**: A super admin can request supported management-system types for tenant-create from persisted platform data

**Independent Test**: Call `GET /api/v1/platform/tenant/reference-data` as a super admin and verify the route returns `data.managementSystemTypes` with the agreed type metadata

### Tests for User Story 1

- [ ] T007 [P] [US1] Add contract coverage for `GET /api/v1/platform/tenant/reference-data` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-create-reference-data.contract.spec.ts`
- [ ] T008 [P] [US1] Add service/integration coverage for active management-system type loading and response mapping in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/platform-tenant-create-reference-data.integration.spec.ts`

### Implementation for User Story 1

- [ ] T009 [US1] Implement the protected reference-data route in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`
- [ ] T010 [US1] Implement active management-system type querying and deterministic ordering in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/tenants/reference-data-service.ts`
- [ ] T011 [US1] Ensure the route response uses the shared `data.managementSystemTypes` contract from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/packages/types/src/index.ts`

**Checkpoint**: Super admins can load supported management-system types for tenant-create from persisted platform data

---

## Phase 4: User Story 2 - Load Default Role Options Per Management-System Type (Priority: P1)

**Goal**: Each management-system type includes its role options, default-role flags, and required admin role semantics

**Independent Test**: Call the route and verify each returned type includes nested role options with `isDefault`, plus `isRequired = true` for `tenant_admin`

### Tests for User Story 2

- [ ] T012 [P] [US2] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-create-reference-data.contract.spec.ts` to cover role-option shape, default flags, and required admin-role behavior
- [ ] T013 [P] [US2] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/platform-tenant-create-reference-data.integration.spec.ts` to verify nested role mapping, deterministic ordering, and inactive-type exclusion

### Implementation for User Story 2

- [ ] T014 [US2] Map nested role options from persisted role and junction records in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/tenants/reference-data-service.ts`
- [ ] T015 [US2] Derive `isRequired` for the admin role option while preserving persisted `isDefault` and display metadata in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/tenants/reference-data-service.ts`

**Checkpoint**: The route returns tenant-create role metadata that future UI work can render directly

---

## Phase 5: User Story 3 - Keep The Contract Shared, Protected, And Documented (Priority: P2)

**Goal**: The route preserves existing RBAC behavior, uses one shared contract source, and appears in API docs

**Independent Test**: Review the shared contract package, call the route as unauthenticated and non-super-admin users, and verify the docs surface includes the route and response schema

### Tests for User Story 3

- [ ] T016 [P] [US3] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-create-reference-data.contract.spec.ts` to cover unauthenticated and forbidden access behavior
- [ ] T017 [P] [US3] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/api-docs.contract.spec.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/api-docs.spec.ts` to assert the new route appears in the docs surface

### Implementation for User Story 3

- [ ] T018 [US3] Document the tenant-create reference-data route and shared response schemas in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`
- [ ] T019 [US3] Keep the route explicitly limited to read-only tenant-create reference data in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/tenants/reference-data-service.ts`

**Checkpoint**: The endpoint is standardized, documented, and protected consistently with the rest of the platform API

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the full verification loop, reconcile any planning drift, and prepare the PR

- [ ] T020 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-141-api-tenant-create-reference-data-contract/quickstart.md` or related planning artifacts if implementation details drift materially
- [ ] T021 [P] Run focused `CROWN-141` checks during implementation using `pnpm --filter @crown/api exec vitest run ...` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T022 Run `pnpm --filter @crown/api typecheck`, `pnpm --filter @crown/api test`, and `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`, fix any failures, and repeat until they pass
- [ ] T023 Create the PR for `feat/CROWN-141-api-tenant-create-reference-data-contract` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-141-api-tenant-create-reference-data-contract/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-141-api-tenant-create-reference-data-contract/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-141-api-tenant-create-reference-data-contract/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P1)**: Starts after Foundational and depends on the shared contract and route from User Story 1
- **User Story 3 (P2)**: Starts after Foundational and depends on the route and response contract from User Story 1

### Within Each User Story

- Add or adjust tests before finalizing the runtime behavior they validate
- Build the shared response contract before finalizing the route handler
- Update OpenAPI documentation before the final validation loop

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T004`, `T005`, and `T006` can progress in parallel once the route contract is confirmed
- `T007` and `T008` can run in parallel
- `T012` and `T013` can run in parallel
- `T016` and `T017` can run in parallel
- `T020` and `T021` can run in parallel while preparing final validation

---

## Parallel Example: User Story 1

```bash
# Validate the new reference-data route from both HTTP and service angles in parallel:
Task: "Add contract coverage for GET /api/v1/platform/tenant/reference-data in apps/api/tests/contract/platform-tenant-create-reference-data.contract.spec.ts"
Task: "Add service/integration coverage for active management-system type loading in apps/api/tests/integration/platform-tenant-create-reference-data.integration.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the supported management-system type contract before widening into role-option semantics and docs polish

### Incremental Delivery

1. Add the shared tenant-create reference-data contract and service seam
2. Mount the protected reference-data route and return supported management-system types
3. Add nested role-option mapping with default and required semantics
4. Finalize OpenAPI documentation and complete the validation loop

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `T022` is the explicit full verification loop for the API workspace plus repo-level Spec Kit audit
- The branch should not widen into tenant provisioning submission, mutation behavior, or web UI implementation work
