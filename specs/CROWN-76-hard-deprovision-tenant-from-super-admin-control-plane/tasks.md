# Tasks: API Hard Deprovision Tenant From The Super-Admin Control Plane

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-76-hard-deprovision-tenant-from-super-admin-control-plane/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused route and lifecycle-service coverage are included because this story changes protected tenant-management behavior and destructive schema handling. The standard API verification loop also remains required before handoff.

**Organization**: Tasks are grouped by user story so the shared endpoint contract, hard-deprovision behavior, and docs updates can be delivered and validated incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current tenant lifecycle, schema DDL, and API contract surfaces that `CROWN-76` extends

- [ ] T001 Review the current shared deprovision route and lifecycle modules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/lifecycle-service.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/types.ts`
- [ ] T002 [P] Review the current schema-management path in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/provision-service.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/migrator.ts` so hard deprovision mirrors the existing `pg` DDL style
- [ ] T003 [P] Review existing deprovision route, error, and OpenAPI coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-soft-deprovision.contract.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-soft-deprovision.spec.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared contract and lifecycle primitives required by both soft and hard deprovision paths

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add a shared deprovision request schema plus success schemas and `DeprovisionTypeEnum` usage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/contracts.ts`
- [ ] T005 [P] Extend tenant lifecycle result types for soft and hard deprovision outcomes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/types.ts`
- [ ] T006 [P] Expand the tenant lifecycle service in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/lifecycle-service.ts` to dispatch shared deprovision requests to soft or hard flows
- [ ] T007 [P] Add the database-access seams needed for schema drop and tenant-scoped cleanup in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/lifecycle-service.ts`
- [ ] T008 [P] Update the platform tenant router in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts` to accept the shared deprovision request contract and call the shared lifecycle entry point

**Checkpoint**: The codebase has a reusable shared deprovision contract with the branching primitives required for both soft and hard behavior

---

## Phase 3: User Story 1 - Hard Deprovision A Tenant Through The Existing Deprovision Endpoint (Priority: P1) 🎯 MVP

**Goal**: A super admin can use the existing deprovision endpoint with `deprovisionType: "hard"` to remove tenant schema data while retaining the tenant record

**Independent Test**: Call the shared deprovision route as a super admin with `deprovisionType: "hard"` and verify the tenant schema is dropped while the tenant row remains in `inactive`

### Tests for User Story 1

- [ ] T009 [P] [US1] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-soft-deprovision.contract.spec.ts` to cover the optional `deprovisionType`, soft defaulting, and hard success response
- [ ] T010 [P] [US1] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-soft-deprovision.spec.ts` to cover hard lifecycle behavior, retained inactive tenant state, and schema-drop execution

### Implementation for User Story 1

- [ ] T011 [US1] Implement shared request parsing and default-soft behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`
- [ ] T012 [US1] Implement hard deprovision schema teardown and retained inactive tenant updates in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/lifecycle-service.ts`
- [ ] T013 [US1] Return the shared hard-deprovision success contract from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/contracts.ts`

**Checkpoint**: Super admins can hard deprovision a tenant through the shared endpoint and receive a deterministic destructive lifecycle response

---

## Phase 4: User Story 2 - Retain Control-Plane Identity Records While Removing Tenant-Scoped Access (Priority: P2)

**Goal**: Hard deprovision removes tenant-scoped memberships and tenant version metadata without deleting global `PlatformUser` identities

**Independent Test**: Hard deprovision a tenant with memberships and confirm tenant-scoped rows are removed while related `PlatformUser` rows remain

### Tests for User Story 2

- [ ] T014 [P] [US2] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-soft-deprovision.spec.ts` to assert tenant membership cleanup, tenant schema version cleanup, and retained `PlatformUser` rows during hard deprovision

### Implementation for User Story 2

- [ ] T015 [US2] Add tenant-scoped membership and schema-version cleanup to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/lifecycle-service.ts`
- [ ] T016 [US2] Keep `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/lifecycle-service.ts` explicitly scoped away from `PlatformUser` deletion logic

**Checkpoint**: Hard deprovision removes tenant-scoped access artifacts but preserves global identities

---

## Phase 5: User Story 3 - Keep Soft And Hard Deprovision In One Explicit Contract (Priority: P3)

**Goal**: The shared route, request schema, and manual OpenAPI docs make soft and hard behavior explicit while keeping soft as the default

**Independent Test**: Review the route contract and docs to confirm `deprovisionType` is optional, defaults to soft, and clearly documents hard behavior on the same endpoint

### Tests for User Story 3

- [ ] T017 [P] [US3] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/api-docs.contract.spec.ts` if needed to assert the shared deprovision route remains present in the docs surface
- [ ] T018 [P] [US3] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-soft-deprovision.contract.spec.ts` to cover validation failure for unsupported `deprovisionType`

### Implementation for User Story 3

- [ ] T019 [US3] Update the shared deprovision route documentation, request schema, and success responses in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`
- [ ] T020 [US3] Add succinct lifecycle comments only where needed in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/lifecycle-service.ts` to explain the retained tenant record and no-user-deletion rule

**Checkpoint**: The API contract and docs clearly distinguish soft and hard behavior on the same route

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the full verification loop, reconcile planning drift, and prepare the PR

- [ ] T021 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-76-hard-deprovision-tenant-from-super-admin-control-plane/quickstart.md` or related planning artifacts if implementation details change materially
- [ ] T022 [P] Run focused `CROWN-76` checks during implementation using `pnpm --filter @crown/api exec vitest run ...` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T023 Run `pnpm --filter @crown/api typecheck`, `pnpm --filter @crown/api test`, and `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`, fix any failures, and repeat until they pass
- [ ] T024 Create the PR for `feat/CROWN-76-hard-deprovision-tenant` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-76-hard-deprovision-tenant-from-super-admin-control-plane/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-76-hard-deprovision-tenant-from-super-admin-control-plane/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-76-hard-deprovision-tenant-from-super-admin-control-plane/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and depends on the shared hard-deprovision flow from User Story 1
- **User Story 3 (P3)**: Starts after Foundational and depends on the shared request/response contract from User Story 1

### Within Each User Story

- Add or adjust tests before finalizing the runtime behavior they validate
- Build the shared lifecycle result contract before finalizing the route handler
- Update OpenAPI documentation before the final validation loop

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T004`, `T005`, `T006`, `T007`, and `T008` can progress in parallel once the route contract is confirmed
- `T009` and `T010` can run in parallel
- `T014` and `T015` can run in parallel
- `T017` and `T018` can run in parallel
- `T021` and `T022` can run in parallel while preparing final validation

---

## Parallel Example: User Story 1

```bash
# Validate shared endpoint behavior from both HTTP and service angles in parallel:
Task: "Extend platform-tenant-soft-deprovision.contract.spec.ts for deprovisionType branching and hard success behavior"
Task: "Extend tenant-soft-deprovision.spec.ts for retained inactive tenant state and schema-drop execution"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the shared endpoint contract and hard schema teardown before widening into tenant-scoped cleanup details

### Incremental Delivery

1. Add the shared deprovision contract, enum, and lifecycle branching
2. Implement hard schema teardown while preserving the tenant row
3. Add tenant-scoped cleanup without global user deletion
4. Update OpenAPI documentation and finish with full API verification plus PR creation

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `T023` is the explicit full verification loop for the API workspace plus repo-level Spec Kit audit
- The branch should not widen into global user deletion, tenant restoration, or super-admin web UI work
