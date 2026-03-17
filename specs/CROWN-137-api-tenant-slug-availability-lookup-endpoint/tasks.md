# Tasks: API Tenant Slug Availability Lookup Endpoint

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/specs/CROWN-137-api-tenant-slug-availability-lookup-endpoint/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused route, service, and docs coverage are included because this story adds a new protected API route and a shared contract intended for later web consumption.

**Organization**: Tasks are grouped by user story so the availability verdict, provisioning-consistent validation behavior, and documentation/auth concerns can be delivered and validated incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current platform tenant route, slug-validation path, and docs/tests that `CROWN-137` extends

- [ ] T001 Review the current platform tenant route and tenant slug rule files in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/routes/platform-tenants.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/tenant/contracts.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/tenant/slug.ts`
- [ ] T002 [P] Review the current Prisma tenant model and provisioning conflict behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/prisma/schema.prisma` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/tenant/provision-service.ts`
- [ ] T003 [P] Review existing platform route contract, integration, and docs coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/tests/contract/`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/tests/integration/`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/docs/openapi.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared contract and lookup service seam required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add shared tenant slug-availability request and response schemas plus inferred types in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/packages/types/src/index.ts`
- [ ] T005 [P] Add a focused Prisma-backed slug-availability service in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/platform/tenants/slug-availability-service.ts`
- [ ] T006 [P] Extend the platform tenant router wiring in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/routes/platform-tenants.ts` to accept the new slug-availability dependency

**Checkpoint**: The codebase has reusable shared slug-availability contracts plus a dedicated lookup service ready to be mounted

---

## Phase 3: User Story 1 - Check Whether A Tenant Slug Is Available (Priority: P1) 🎯 MVP

**Goal**: A super admin can check one tenant slug and receive a clear available or unavailable result

**Independent Test**: Call `POST /api/v1/platform/tenant/slug-availability` as a super admin and verify the route returns `data.slug` plus `data.isAvailable` for both available and taken slugs

### Tests for User Story 1

- [ ] T007 [P] [US1] Add contract coverage for `POST /api/v1/platform/tenant/slug-availability` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/tests/contract/platform-tenant-slug-availability.contract.spec.ts`
- [ ] T008 [P] [US1] Add service/integration coverage for available, unavailable, and retained-slug behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/tests/integration/platform-tenant-slug-availability.integration.spec.ts`

### Implementation for User Story 1

- [ ] T009 [US1] Implement the protected slug-availability route in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/routes/platform-tenants.ts`
- [ ] T010 [US1] Implement persisted slug lookup and compact response mapping in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/platform/tenants/slug-availability-service.ts`
- [ ] T011 [US1] Ensure the route response uses the shared `data.slug` plus `data.isAvailable` contract from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/packages/types/src/index.ts`

**Checkpoint**: Super admins can check slug availability from persisted tenant data

---

## Phase 4: User Story 2 - Apply Provisioning-Consistent Slug Validation For Repeated Checks (Priority: P1)

**Goal**: The lookup route follows provisioning-consistent normalization/validation and stays safe for repeated debounced requests

**Independent Test**: Call the route with valid, normalized, and invalid slug inputs and verify the route evaluates the normalized slug, rejects invalid values, and remains on the read-oriented rate-limit path

### Tests for User Story 2

- [ ] T012 [P] [US2] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/tests/contract/platform-tenant-slug-availability.contract.spec.ts` to cover normalization, invalid payloads, and rate-limited lookup behavior
- [ ] T013 [P] [US2] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/tests/integration/platform-tenant-slug-availability.integration.spec.ts` to verify normalization before lookup and conflict alignment with provisioning behavior

### Implementation for User Story 2

- [ ] T014 [US2] Apply provisioning-consistent slug normalization and validation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/platform/tenants/slug-availability-service.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/routes/platform-tenants.ts`
- [ ] T015 [US2] Reuse or adapt the existing read-oriented lookup rate-limit middleware path for the new endpoint in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/routes/platform-tenants.ts`

**Checkpoint**: Lookup results stay aligned with provisioning rules and tolerate repeated UI checks safely

---

## Phase 5: User Story 3 - Keep The Contract Narrow, Reusable, And Documented (Priority: P2)

**Goal**: The route preserves existing RBAC behavior, uses one shared contract source, and appears in API docs without widening scope

**Independent Test**: Review the shared contract package, call the route as unauthenticated and non-super-admin users, and verify the docs surface includes the route and shared schemas

### Tests for User Story 3

- [ ] T016 [P] [US3] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/tests/contract/platform-tenant-slug-availability.contract.spec.ts` to cover unauthenticated and forbidden access behavior
- [ ] T017 [P] [US3] Extend `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/tests/contract/api-docs.contract.spec.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/tests/integration/api-docs.spec.ts` to assert the new route appears in the docs surface

### Implementation for User Story 3

- [ ] T018 [US3] Document the slug-availability route and shared request/response schemas in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/docs/openapi.ts`
- [ ] T019 [US3] Keep the route explicitly limited to slug lookup behavior without leaking tenant details or reservation semantics in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/routes/platform-tenants.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/platform/tenants/slug-availability-service.ts`

**Checkpoint**: The endpoint is standardized, documented, and protected consistently with the rest of the platform API

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the full verification loop, reconcile any planning drift, and prepare the PR

- [ ] T020 [P] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/specs/CROWN-137-api-tenant-slug-availability-lookup-endpoint/quickstart.md` or related planning artifacts if implementation details drift materially
- [ ] T021 [P] Run focused `CROWN-137` checks during implementation using `pnpm --filter @crown/api exec vitest run ...` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app`
- [ ] T022 Run `pnpm --filter @crown/api typecheck`, `pnpm --filter @crown/api test`, and `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app`, fix any failures, and repeat until they pass
- [ ] T023 Create the PR for `feat/CROWN-137-api-tenant-slug-availability-lookup-endpoint` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/specs/CROWN-137-api-tenant-slug-availability-lookup-endpoint/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/specs/CROWN-137-api-tenant-slug-availability-lookup-endpoint/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/specs/CROWN-137-api-tenant-slug-availability-lookup-endpoint/tasks.md`

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
- Build the shared availability contract before finalizing the route handler
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
# Validate the new lookup route from both HTTP and service angles in parallel:
Task: "Add contract coverage for POST /api/v1/platform/tenant/slug-availability in apps/api/tests/contract/platform-tenant-slug-availability.contract.spec.ts"
Task: "Add service/integration coverage for slug availability mapping in apps/api/tests/integration/platform-tenant-slug-availability.integration.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the availability response envelope before widening into normalization, rate-limit, and docs refinement

### Incremental Delivery

1. Add the shared slug-availability contract and service seam
2. Mount the protected lookup route and return the compact availability result
3. Align normalization and validation behavior with provisioning plus repeated lookup protection
4. Finalize OpenAPI documentation and complete the validation loop

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `T022` is the explicit full verification loop for the API workspace plus repo-level Spec Kit audit
- The branch should not widen into tenant creation, slug reservation, tenant detail disclosure, or web implementation work
