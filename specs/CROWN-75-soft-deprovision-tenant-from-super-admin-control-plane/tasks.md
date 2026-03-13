# Tasks: API Soft Deprovision Tenant From The Super-Admin Control Plane

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused route, auth-resolution, and lifecycle-service coverage are included because this story changes protected tenant-management behavior and tenant access enforcement. The standard API verification loop also remains required before handoff.

**Organization**: Tasks are grouped by user story so the route surface, inactive-tenant auth enforcement, and contract/documentation work can be delivered and validated incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current tenant-management and auth-resolution surfaces that `CROWN-75` extends

- [ ] T001 Review the current platform tenant route and tenant lifecycle modules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/provision-service.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/types.ts`
- [ ] T002 [P] Review the current auth identity and membership-resolution flow in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/default-auth-service.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/identity.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/role-resolution.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/middleware/authenticate.ts`
- [ ] T003 [P] Review existing tenant route and auth coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/` to align the new behavior with current API contracts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared lifecycle contract and auth-resolution primitives used by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add the soft deprovision request/result schemas in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/contracts.ts`
- [ ] T005 [P] Extend tenant lifecycle result types for soft deprovision outcomes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/types.ts`
- [ ] T006 [P] Add a tenant soft deprovision lifecycle service in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/lifecycle-service.ts`
- [ ] T007 [P] Extend the shared API error-code surface for deterministic not-found handling in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/claims.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/types/errors.ts`
- [ ] T008 Update auth identity lookup and membership-resolution inputs to include tenant lifecycle status in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/identity.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/role-resolution.ts`

**Checkpoint**: The codebase has a reusable soft deprovision service contract plus tenant-status-aware auth resolution primitives

---

## Phase 3: User Story 1 - Soft Deprovision A Tenant Without Deleting Its Data (Priority: P1) 🎯 MVP

**Goal**: A super admin can transition an existing tenant to `inactive` without deleting the tenant record or schema

**Independent Test**: Call the soft deprovision route as a super admin and verify the tenant becomes inactive while its schema and control-plane record remain intact

### Tests for User Story 1

- [ ] T009 [P] [US1] Add contract coverage for `POST /api/v1/platform/tenants/:tenantId/deprovision` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-soft-deprovision.contract.spec.ts`
- [ ] T010 [P] [US1] Add service/integration coverage for tenant lifecycle state changes and preserved schema behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-soft-deprovision.spec.ts`

### Implementation for User Story 1

- [ ] T011 [US1] Implement the soft deprovision route in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`
- [ ] T012 [US1] Wire the route to the lifecycle service and deterministic `404`/`409` outcomes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/lifecycle-service.ts`
- [ ] T013 [US1] Ensure the route response uses the shared soft deprovision contract in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/contracts.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`

**Checkpoint**: Super admins can soft deprovision a tenant and receive a non-destructive lifecycle response

---

## Phase 4: User Story 2 - Block Tenant Access After Soft Deprovision (Priority: P2)

**Goal**: Inactive tenants no longer resolve as active tenant memberships during login, current-user resolution, or tenant-scoped protected flows

**Independent Test**: Mark a tenant inactive, then verify login, `/api/v1/auth/me`, and tenant-scoped protected routes deny that tenant context while super-admin platform access still succeeds

### Tests for User Story 2

- [ ] T014 [P] [US2] Extend auth contract coverage for inactive-tenant login and current-user denials in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/auth-routes.contract.spec.ts`
- [ ] T015 [P] [US2] Add focused inactive-tenant auth or middleware regression coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-auth-inactive.spec.ts`

### Implementation for User Story 2

- [ ] T016 [US2] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/default-auth-service.ts` so inactive tenants no longer produce allowed tenant contexts during login or current-user resolution
- [ ] T017 [US2] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/identity.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/role-resolution.ts` so inactive tenant memberships are excluded from active membership resolution
- [ ] T018 [US2] Verify `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/middleware/authenticate.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/authorization.ts` surface the inactive-tenant denial through the existing auth error envelope

**Checkpoint**: Tenant-scoped auth flows stop treating inactive tenants as active memberships

---

## Phase 5: User Story 3 - Keep The Contract Explicitly Non-Destructive And Narrowly Scoped (Priority: P3)

**Goal**: The API contract and docs make clear that this story performs a soft deprovision status transition, not a destructive deletion

**Independent Test**: Review the route contract, Swagger/OpenAPI document, and error behavior to confirm the operation preserves tenant data and does not imply hard delete semantics

### Tests for User Story 3

- [ ] T019 [P] [US3] Extend docs-route coverage to assert the soft deprovision route appears in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/api-docs.contract.spec.ts` if route-document visibility needs an automated check

### Implementation for User Story 3

- [ ] T020 [US3] Document the soft deprovision route, schemas, and error responses in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`
- [ ] T021 [US3] Add succinct lifecycle comments only where needed to explain the non-destructive status-transition approach in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/lifecycle-service.ts`

**Checkpoint**: The API contract and docs clearly distinguish soft deprovision from hard deletion

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the full verification loop, reconcile any planning drift, and prepare the PR

- [ ] T022 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/quickstart.md` or related planning artifacts if implementation details change materially
- [ ] T023 [P] Run focused `CROWN-75` checks during implementation using `pnpm --filter @crown/api exec vitest run ...` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T024 Run `pnpm --filter @crown/api typecheck`, `pnpm --filter @crown/api test`, and `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`, fix any failures, and repeat until they pass
- [ ] T025 Create the PR for `feat/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and depends on the tenant lifecycle and auth-resolution primitives established earlier
- **User Story 3 (P3)**: Starts after Foundational and depends on the route and response contract from US1

### Within Each User Story

- Add or adjust tests before finalizing the runtime behavior they validate
- Build the lifecycle result contract before finalizing the route handler
- Update OpenAPI documentation before the final validation loop

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T004`, `T005`, `T006`, and `T007` can progress in parallel once the route contract is confirmed
- `T009` and `T010` can run in parallel
- `T014` and `T015` can run in parallel
- `T022` and `T023` can run in parallel while preparing final validation

---

## Parallel Example: User Story 2

```bash
# Validate inactive-tenant enforcement from both HTTP and auth-resolution angles in parallel:
Task: "Extend auth contract coverage for inactive-tenant login and current-user denials in apps/api/tests/contract/auth-routes.contract.spec.ts"
Task: "Add focused inactive-tenant auth or middleware regression coverage in apps/api/tests/integration/tenant-auth-inactive.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the non-destructive tenant status transition before widening into auth enforcement

### Incremental Delivery

1. Add the lifecycle contract, result types, and service
2. Mount the soft deprovision action in the existing platform tenant router
3. Make auth resolution tenant-status-aware
4. Document the route and non-destructive behavior in OpenAPI
5. Finish with full API verification and PR creation

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `T024` is the explicit full verification loop for the API workspace plus repo-level Spec Kit audit
- The branch should not widen into hard delete, tenant restoration, or control-plane UI work
