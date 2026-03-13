# Tasks: API Super-Admin Dashboard Overview Widgets Contract

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: API contract coverage, aggregation integration coverage, API typecheck, and `pnpm specify.audit` are included because the story introduces a new protected route and documented OpenAPI surface.

**Organization**: Tasks are grouped by user story so each Jira outcome can be validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the story task set and confirm the existing platform API surfaces this route will extend.

- [X] T001 Create the `CROWN-116` task breakdown in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/tasks.md
- [X] T002 [P] Review the current platform route wiring and manual OpenAPI coverage in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/app.ts and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared overview response-contract and aggregation foundation before route-specific assertions are layered on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create the dashboard overview response schemas in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/contracts.ts
- [X] T004 [P] Implement the tenant-summary aggregation service with deterministic zero-filled status buckets in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/overview-service.ts
- [X] T005 [P] Confirm the existing shared status-enum exports are sufficient for the overview response in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/domain/status-enums.ts

**Checkpoint**: The API has one reusable contract module and one aggregation service capable of producing the initial tenant-summary widget payload.

---

## Phase 3: User Story 1 - Retrieve Tenant Summary Overview Data (Priority: P1) 🎯 MVP

**Goal**: Expose the initial dashboard overview widget contract with total tenant count and per-status tenant counts.

**Independent Test**: Call `GET /api/v1/platform/dashboard/overview` as a super admin and confirm the response contains `widgets.tenant_summary.total_tenant_count`, `widgets.tenant_summary.tenant_user_count`, and deterministic `tenant_status_counts` entries for every current `TenantStatus`.

### Tests for User Story 1

- [X] T006 [P] [US1] Add contract tests for the successful dashboard overview response in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-dashboard-overview.contract.spec.ts
- [X] T007 [P] [US1] Add aggregation integration coverage for mixed and zero-count tenant statuses in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/platform-dashboard-overview.integration.spec.ts

### Implementation for User Story 1

- [X] T008 [US1] Implement the protected dashboard overview route in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-dashboard-overview.ts
- [X] T009 [US1] Wire the new platform dashboard overview router into /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/app.ts
- [X] T010 [US1] Return the initial `widgets.tenant_summary` payload from the route using the overview service and response contract in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-dashboard-overview.ts

**Checkpoint**: The super-admin route returns the initial tenant-summary overview widget contract.

---

## Phase 4: User Story 2 - Keep The Overview Contract Restricted And Predictable (Priority: P2)

**Goal**: Preserve the super-admin-only boundary and keep the endpoint payload narrowly scoped to overview summary data.

**Independent Test**: Verify missing-auth and tenant-scoped calls are rejected with the existing auth error behavior, then confirm the successful response does not include recent-activity or unrelated dashboard data.

### Tests for User Story 2

- [X] T011 [P] [US2] Add contract coverage for unauthenticated and forbidden-role outcomes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-dashboard-overview.contract.spec.ts

### Implementation for User Story 2

- [X] T012 [US2] Reuse existing platform authentication and authorization middleware on the overview route in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-dashboard-overview.ts
- [X] T013 [US2] Verify the response remains limited to overview widget data and excludes recent-activity fields in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/contracts.ts and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-dashboard-overview.contract.spec.ts

**Checkpoint**: The route is protected consistently and returns only the intended dashboard-summary data.

---

## Phase 5: User Story 3 - Extend The Dashboard Response Without Breaking The First Widget (Priority: P3)

**Goal**: Document and implement the widgets-envelope pattern so future dashboard widgets can be added safely.

**Independent Test**: Inspect the route contract, OpenAPI docs, and successful response to confirm the initial `tenant_summary` widget is stable inside an extensible `widgets` envelope.

### Tests for User Story 3

- [X] T014 [P] [US3] Add response-shape assertions that pin the `widgets.tenant_summary` envelope contract in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-dashboard-overview.contract.spec.ts

### Implementation for User Story 3

- [X] T015 [US3] Document the route and schemas in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts
- [X] T016 [US3] Confirm the feature contract and quickstart guidance remain aligned with the implemented widgets envelope in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/contracts/dashboard-overview-widgets-contract.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/quickstart.md

**Checkpoint**: The implemented route and docs clearly preserve a future-safe widget extension pattern.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the final route, keep docs aligned, and prepare the branch for PR creation.

- [X] T017 [P] Run API test coverage in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json
- [X] T018 [P] Run API typecheck in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json
- [X] T019 [P] Run `pnpm specify.audit` from /Users/ramanpreetaujla/Documents/AI-Projects/crown-app
- [X] T020 Review the final endpoint behavior against /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/spec.md
- [X] T021 Create the PR for `feat/CROWN-116-super-admin-dashboard-overview-widgets-contract` with links to /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/spec.md, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/plan.md, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks user-story work.
- **User Story Phases (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and is the MVP slice.
- **User Story 2 (P2)**: Builds on the route added in US1.
- **User Story 3 (P3)**: Builds on the response envelope from US1 and the documented route surface from US2.

### Parallel Opportunities

- Phase 2: T004 and T005 can proceed in parallel once the contract shape from T003 is clear.
- US1: T006 and T007 can run in parallel.
- Phase 6: T017 and T018 can run in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Define the overview response contract.
2. Implement the tenant-summary aggregation service.
3. Expose the protected route and verify the successful response contract.

### Incremental Delivery

1. Build the response-contract and aggregation foundation.
2. Add the route and route wiring for the initial tenant-summary widget.
3. Lock down auth behavior and narrow payload scope.
4. Update OpenAPI and feature docs to preserve the future-widget extension pattern.

## Notes

- Keep the route payload in `snake_case` to stay consistent with the existing API response style.
- If future dashboard requirements need trend lines or recent-activity data, create a follow-up Jira issue instead of widening `CROWN-116`.
