# Tasks: Tenant Create Review And Submit Step

**Input**: Design documents from `/specs/CROWN-147-tenant-create-review-and-submit-step/`
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: Playwright coverage is required by the feature spec.

**Organization**: Tasks are grouped by user story so each slice remains independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story the task maps to (`US1`, `US2`, `US3`)

## Phase 1: Setup

**Purpose**: Create the feature artifact files and align the implementation surface.

- [ ] T001 Create the `specs/CROWN-147-tenant-create-review-and-submit-step/` artifact set and capture the review/submit scope in `spec.md`, `plan.md`, and `tasks.md`.

---

## Phase 2: Foundational

**Purpose**: Add the shared plumbing that all review-step behavior depends on.

- [ ] T002 [P] Add `submitTenantCreateOnboarding()` to `apps/web/lib/auth/api.ts` using the shared onboarding request/response schemas.
- [ ] T003 [P] Add step-4 payload derivation and submission state handling in `apps/web/components/platform/tenant-create-shell.tsx`.

**Checkpoint**: The shell can construct a validated onboarding payload and call the existing provisioning API.

---

## Phase 3: User Story 1 - Review The Full Tenant Setup Before Submission (Priority: P1) 🎯 MVP

**Goal**: Replace the step-4 placeholder with a read-only summary of the wizard state.

**Independent Test**: Complete steps 1-3, open step 4, and verify the review sections show current tenant info, selected roles, tenant admins, and per-role assignments.

### Tests for User Story 1

- [ ] T004 [P] [US1] Update `apps/web/tests/auth-flow.spec.ts` with a step-4 summary test that asserts the review content mirrors the latest draft state.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Create `apps/web/components/platform/tenant-create-step-review.tsx` with read-only summary sections for tenant info, selected roles, tenant admins, and per-role assignments.
- [ ] T006 [US1] Replace the review placeholder in `apps/web/components/platform/tenant-create-shell.tsx` with the new `TenantCreateStepReview` component and derived review data.
- [ ] T007 [US1] Add read-only warning and empty-state treatment in `apps/web/components/platform/tenant-create-step-review.tsx` for unstaffed optional roles and missing admin coverage.

**Checkpoint**: Step 4 renders a complete review summary and is independently demoable without submission success.

---

## Phase 4: User Story 2 - Submit A Valid Tenant Create Request From Step 4 (Priority: P1)

**Goal**: Let the review step create the tenant through the existing provisioning API and route to tenant details on success.

**Independent Test**: Complete a valid draft, submit from step 4, and verify loading treatment plus redirect to `/platform/tenants/[slug]`.

### Tests for User Story 2

- [ ] T008 [P] [US2] Extend `apps/web/tests/auth-flow.spec.ts` with a successful review-step submission test that mocks `POST /platform/tenant`, asserts disabled actions while pending, and confirms redirect.

### Implementation for User Story 2

- [ ] T009 [US2] Wire the `Create tenant` action in `apps/web/components/platform/tenant-create-shell.tsx` to call `submitTenantCreateOnboarding()` with the derived payload.
- [ ] T010 [US2] Add submitting-state UI and disabled stepper/footer actions in `apps/web/components/platform/tenant-create-shell.tsx`.
- [ ] T011 [US2] Trigger success feedback and route to `/platform/tenants/${slug}` from `apps/web/components/platform/tenant-create-shell.tsx` after a successful response.

**Checkpoint**: Valid step-4 submissions create a tenant and navigate to the detail route.

---

## Phase 5: User Story 3 - Keep Review-Step Validation And Failure Handling Clear (Priority: P2)

**Goal**: Surface clear blocking validation and retry-safe API failure handling on step 4.

**Independent Test**: Mock invalid review data or API failure, attempt to submit, and verify the UI blocks or retries without losing draft state.

### Tests for User Story 3

- [ ] T012 [P] [US3] Extend `apps/web/tests/auth-flow.spec.ts` with a review-step failure test covering server error handling and retry-safe persistence on step 4.

### Implementation for User Story 3

- [ ] T013 [US3] Reuse the existing assignment validation and payload parsing in `apps/web/components/platform/tenant-create-shell.tsx` so invalid review states stay blocked from submission.
- [ ] T014 [US3] Add blocking and non-blocking review alerts plus retry-friendly API error treatment in `apps/web/components/platform/tenant-create-step-review.tsx`.
- [ ] T015 [US3] Preserve draft state and allow retry/back navigation after failed submission in `apps/web/components/platform/tenant-create-shell.tsx`.

**Checkpoint**: Step 4 handles both validation failures and API failures clearly without data loss.

---

## Phase 6: Polish & Validation

**Purpose**: Finish verification and artifact hygiene across the feature.

- [ ] T016 [P] Run `pnpm --filter @crown/web typecheck`.
- [ ] T017 [P] Run `pnpm --filter @crown/web exec playwright test apps/web/tests/auth-flow.spec.ts`.
- [ ] T018 [P] Run `pnpm specify.audit`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: No dependencies.
- **Phase 2**: Depends on Phase 1 and blocks all story work.
- **Phase 3**: Depends on Phase 2.
- **Phase 4**: Depends on Phase 2 and integrates with Phase 3’s review UI.
- **Phase 5**: Depends on Phases 3 and 4 because it extends the review-step behavior.
- **Phase 6**: Depends on all implementation phases.

### User Story Dependencies

- **US1**: Starts after foundational payload and shell plumbing exist.
- **US2**: Depends on the review-step UI from US1 plus the API client from Phase 2.
- **US3**: Depends on US1 and US2 because it refines review-step validation and failure states.

### Parallel Opportunities

- `T002` and `T003` can run in parallel.
- `T004` and `T005` can run in parallel once Phase 2 is complete.
- `T008` can be prepared while `T009` and `T010` are implemented.
- `T012` can be prepared alongside `T014`.
- Validation tasks `T016` through `T018` can run independently once code changes are complete.

## Implementation Strategy

### MVP First

1. Complete Phase 2 foundational payload and submit-state plumbing.
2. Deliver Phase 3 so step 4 becomes a real review surface.
3. Validate the review summary independently before wiring submission.

### Incremental Delivery

1. Ship the read-only review step.
2. Add the successful create flow.
3. Add retry-safe failure handling and final validation.
