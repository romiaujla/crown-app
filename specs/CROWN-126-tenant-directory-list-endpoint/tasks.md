# Tasks: API Tenant Directory List Endpoint For Super Admins

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-126-tenant-directory-list-endpoint/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused route and directory-service coverage are included because this story adds a new protected API route and a shared contract consumed by the web control plane.

**Organization**: Tasks are grouped by user story so the collection route, filter behavior, and standardized response contract can be delivered and validated incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current platform tenant route, shared type surface, and docs/tests that `CROWN-126` extends

- [ ] T001 Review the current platform tenant route and existing tenant-management contracts in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/contracts.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/packages/types/src/index.ts`
- [ ] T002 [P] Review the current Prisma tenant model and platform dashboard service patterns in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/overview-service.ts`
- [ ] T003 [P] Review existing platform route contract, auth, and docs coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared contract and directory primitives required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add shared tenant directory list schemas, inferred types, and response envelope definitions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/packages/types/src/index.ts`
- [ ] T005 [P] Add API-side query validation and mapping helpers for tenant directory filters in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/contracts.ts` or a new route-local contract module if that keeps collection-read concerns separate
- [ ] T006 [P] Add a tenant directory service that queries and maps persisted tenant records in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/tenants/directory-service.ts`
- [ ] T007 [P] Extend the platform tenant router wiring in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts` to accept the new collection route dependencies

**Checkpoint**: The codebase has reusable shared directory contracts plus a dedicated tenant directory service ready to be mounted

---

## Phase 3: User Story 1 - List Tenants For The Control Plane (Priority: P1) 🎯 MVP

**Goal**: A super admin can request the tenant directory and receive persisted tenant records in the agreed `{ data, meta }` envelope

**Independent Test**: Call `GET /api/v1/platform/tenants` as a super admin and verify the route returns `data.tenantList` with camelCase tenant fields plus `meta.totalRecords`

### Tests for User Story 1

- [ ] T008 [P] [US1] Add contract coverage for `GET /api/v1/platform/tenants` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-directory.contract.spec.ts`
- [ ] T009 [P] [US1] Add service/integration coverage for tenant directory mapping and empty-result behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/platform-tenant-directory.integration.spec.ts`

### Implementation for User Story 1

- [ ] T010 [US1] Implement the collection route in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`
- [ ] T011 [US1] Implement directory record mapping to camelCase response properties in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/tenants/directory-service.ts`
- [ ] T012 [US1] Ensure the route response uses the shared `data.tenantList` plus `meta` contract from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/packages/types/src/index.ts`

**Checkpoint**: Super admins can load the tenant directory from persisted data

---

## Phase 4: User Story 2 - Filter The Tenant Directory By Search And Status (Priority: P2)

**Goal**: The tenant directory applies `search` and `status` filters before returning results

**Independent Test**: Call the route with `search` and `status` query parameters and verify only matching tenants are returned while the applied filters are echoed in `meta.filters`

### Tests for User Story 2

- [ ] T013 [P] [US2] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-directory.contract.spec.ts` to cover `search`, `status`, and combined filter behavior
- [ ] T014 [P] [US2] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/platform-tenant-directory.integration.spec.ts` to verify filtered Prisma query behavior and echoed filters

### Implementation for User Story 2

- [ ] T015 [US2] Implement name-search filtering in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/tenants/directory-service.ts`
- [ ] T016 [US2] Implement persisted status filtering in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/tenants/directory-service.ts`
- [ ] T017 [US2] Echo effective `search` and `status` values in the route response metadata in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`

**Checkpoint**: The directory behaves like a filterable collection endpoint for the control plane

---

## Phase 5: User Story 3 - Keep The Contract Standardized And Auth-Protected (Priority: P3)

**Goal**: The route preserves existing platform RBAC behavior and locks in the agreed response standard

**Independent Test**: Review the docs and call the endpoint as unauthenticated and non-super-admin users to confirm protected-route behavior and the `{ data, meta }` contract

### Tests for User Story 3

- [ ] T018 [P] [US3] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-directory.contract.spec.ts` to cover unauthenticated, forbidden, and invalid-query behavior
- [ ] T019 [P] [US3] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/api-docs.contract.spec.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/api-docs.spec.ts` to assert the new route appears in the docs surface

### Implementation for User Story 3

- [ ] T020 [US3] Document the tenant directory route, query parameters, and shared response schemas in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`
- [ ] T021 [US3] Keep the route explicitly limited to tenant collection data without nested relations such as `userList` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/tenants/directory-service.ts`

**Checkpoint**: The endpoint is standardized, documented, and protected consistently with other platform routes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the full verification loop, reconcile any planning drift, and prepare the PR

- [ ] T022 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-126-tenant-directory-list-endpoint/quickstart.md` or related planning artifacts if implementation details change materially
- [ ] T023 [P] Run focused `CROWN-126` checks during implementation using `pnpm --filter @crown/api exec vitest run ...` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T024 Run `pnpm --filter @crown/api typecheck`, `pnpm --filter @crown/api test`, and `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`, fix any failures, and repeat until they pass
- [ ] T025 Create the PR for `feat/CROWN-126-tenant-directory-list-endpoint` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-126-tenant-directory-list-endpoint/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-126-tenant-directory-list-endpoint/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-126-tenant-directory-list-endpoint/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and depends on the directory route plus shared contract from User Story 1
- **User Story 3 (P3)**: Starts after Foundational and depends on the route and response contract from User Story 1

### Within Each User Story

- Add or adjust tests before finalizing the runtime behavior they validate
- Build the shared directory contract before finalizing the route handler
- Update OpenAPI documentation before the final validation loop

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T004`, `T005`, `T006`, and `T007` can progress in parallel once the route contract is confirmed
- `T008` and `T009` can run in parallel
- `T013` and `T014` can run in parallel
- `T018` and `T019` can run in parallel
- `T022` and `T023` can run in parallel while preparing final validation

---

## Parallel Example: User Story 1

```bash
# Validate the new collection route from both HTTP and service angles in parallel:
Task: "Add contract coverage for GET /api/v1/platform/tenants in apps/api/tests/contract/platform-tenant-directory.contract.spec.ts"
Task: "Add service/integration coverage for tenant directory mapping in apps/api/tests/integration/platform-tenant-directory.integration.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the collection response envelope before widening into filter and docs refinement

### Incremental Delivery

1. Add the shared directory contract and service seams
2. Mount the collection route and return the agreed response envelope
3. Add `search` and `status` filtering behavior
4. Finalize OpenAPI documentation and complete the validation loop

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `T024` is the explicit full verification loop for the API workspace plus repo-level Spec Kit audit
- The branch should not widen into tenant detail, tenant update, nested related collections, or web implementation work
