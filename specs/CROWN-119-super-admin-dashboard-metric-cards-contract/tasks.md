# Tasks: API Super Admin Dashboard Key Metric Cards Contract

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused API contract and integration tests are included because this story extends an existing protected route contract and defines time-window aggregation behavior that must stay deterministic.

**Organization**: Tasks are grouped by user story so each Jira outcome can be validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the story artifacts and confirm the current dashboard overview baseline before editing code.

- [x] T001 Create the `CROWN-119` Spec Kit artifacts in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/
- [x] T002 [P] Review the existing dashboard overview contract, service, route, tests, and OpenAPI docs in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/contracts.ts, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/overview-service.ts, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-dashboard-overview.contract.spec.ts, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/platform-dashboard-overview.integration.spec.ts, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared windowed metric contract and service calculation helpers before route assertions are updated.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Extend the dashboard overview response schemas with ordered metric-window entries in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/contracts.ts
- [x] T004 [P] Implement trailing-window and comparison-window aggregation helpers in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/overview-service.ts
- [x] T005 [P] Align the shared web overview schema with the API contract in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/types.ts

**Checkpoint**: The route contract and aggregation service can express deterministic week/month/year metrics.

---

## Phase 3: User Story 1 - Retrieve The Dashboard Metric Card Totals And New-Tenant Windows (Priority: P1) 🎯 MVP

**Goal**: Extend the overview payload with total counts plus week/month/year new-tenant counts under the existing `widgets.tenant_summary` envelope.

**Independent Test**: Call `GET /api/v1/platform/dashboard/overview` as a `super_admin` and verify the response includes `total_tenant_count`, `tenant_user_count`, and `new_tenant_counts` entries for `week`, `month`, and `year`.

### Tests for User Story 1

- [x] T006 [P] [US1] Extend the route contract tests for the new metric-card fields in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-dashboard-overview.contract.spec.ts
- [x] T007 [P] [US1] Add aggregation coverage for week/month/year new-tenant counts in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/platform-dashboard-overview.integration.spec.ts

### Implementation for User Story 1

- [x] T008 [US1] Return `new_tenant_counts` from the overview service in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/overview-service.ts
- [x] T009 [US1] Keep the existing route wiring and response parsing aligned with the expanded contract in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-dashboard-overview.ts
- [x] T010 [US1] Update the feature contract notes for the new metric-card count fields in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/contracts/dashboard-metric-cards-contract.md

**Checkpoint**: The overview response returns the total counts and deterministic new-tenant windows required by `CROWN-98`.

---

## Phase 4: User Story 2 - Retrieve Growth-Rate Windows With Documented Metric Definitions (Priority: P2)

**Goal**: Add week/month/year tenant growth-rate metrics with explicit calculation rules and zero-handling semantics.

**Independent Test**: Seed counts across current and prior comparison windows, then verify `tenant_growth_rates` returns the documented percentage values for `week`, `month`, and `year`.

### Tests for User Story 2

- [x] T011 [P] [US2] Extend the route contract tests for the growth-rate fields in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-dashboard-overview.contract.spec.ts
- [x] T012 [P] [US2] Add integration coverage for comparison-window growth-rate math and divide-by-zero handling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/platform-dashboard-overview.integration.spec.ts

### Implementation for User Story 2

- [x] T013 [US2] Return `tenant_growth_rates` from the overview service in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/overview-service.ts
- [x] T014 [US2] Document the window definitions and growth-rate formula in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/research.md, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/data-model.md, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/contracts/dashboard-metric-cards-contract.md
- [x] T015 [US2] Update the manual OpenAPI schemas and route description for the new metric-card windows in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts

**Checkpoint**: The overview route exposes documented growth-rate metrics with deterministic window semantics.

---

## Phase 5: User Story 3 - Preserve The Existing Protected Overview Boundary (Priority: P3)

**Goal**: Keep the route super-admin-only and limited to dashboard summary metrics while aligning docs and validation.

**Independent Test**: Verify unauthenticated and forbidden-role requests still fail as before, and confirm the OpenAPI docs plus quickstart match the implemented route shape.

### Tests for User Story 3

- [x] T016 [P] [US3] Confirm unauthorized and forbidden-role route coverage still passes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-dashboard-overview.contract.spec.ts

### Implementation for User Story 3

- [x] T017 [US3] Review the route scope and preserve the existing auth/authorization middleware in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-dashboard-overview.ts
- [x] T018 [US3] Capture validation guidance in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/quickstart.md

**Checkpoint**: Access control and route scope remain stable while the metric-card contract expands.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the implementation and prepare the branch for review-safe delivery.

- [x] T019 [P] Run focused API tests in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json
- [x] T020 [P] Run API typecheck in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json
- [x] T021 [P] Run `pnpm specify.audit` from /Users/ramanpreetaujla/Documents/AI-Projects/crown-app
- [x] T022 Review the final implementation against /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/spec.md
- [x] T023 Create the PR for `feat/CROWN-119-super-admin-dashboard-metric-cards-contract` with links to /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/spec.md, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/plan.md, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user-story implementation.
- **User Story Phases (Phase 3+)**: Depend on the foundational contract and aggregation helpers.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and delivers the MVP route extension for total and new-tenant counts.
- **User Story 2 (P2)**: Builds on the windowed metric structure from US1.
- **User Story 3 (P3)**: Confirms the route boundary and docs remain correct after US1 and US2.

### Parallel Opportunities

- Phase 2: T004 and T005 can proceed in parallel once the contract shape from T003 is clear.
- US1: T006 and T007 can run in parallel.
- US2: T011 and T012 can run in parallel.
- Polish: T019, T020, and T021 can run in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Extend the shared response contract with ordered metric-window entries.
2. Add new-tenant count aggregation for week/month/year.
3. Verify the route returns the expanded payload for `super_admin`.

### Incremental Delivery

1. Establish the shared windowed-metric structure.
2. Deliver the new-tenant count windows.
3. Layer in growth-rate calculations and documented metric definitions.
4. Re-run auth, OpenAPI, and repository audit validation.

## Notes

- Keep the current `widgets.tenant_summary` envelope stable so `CROWN-98` receives additive contract growth rather than a breaking reorganization.
- Document the window semantics in both feature artifacts and `apps/api/src/docs/openapi.ts` to avoid API/UI drift.
- If a later story requires calendar-aligned reporting instead of trailing windows, that should be handled as follow-up scope rather than silently changing this contract.
