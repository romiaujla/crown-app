# Tasks: UI Super Admin Dashboard Key Metric Cards

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-98-super-admin-dashboard-key-metric-cards/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Playwright coverage, web typecheck, and `pnpm specify.audit` are included because this story changes protected dashboard behavior and introduces new user-visible metric definitions.

**Organization**: Tasks are grouped by user story so each Jira outcome can be validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the story task set and confirm the current dashboard overview baseline plus the `CROWN-119` contract dependency.

- [X] T001 Create the `CROWN-98` Spec Kit artifacts in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-98-super-admin-dashboard-key-metric-cards/
- [X] T002 [P] Review the current dashboard implementation and the `CROWN-119` overview contract in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/types.ts, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/spec.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared formatting and layout structure for the metric-card area before story-specific assertions are layered on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Refactor the dashboard overview section structure in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx so primary metric cards and supporting status content can coexist cleanly
- [X] T004 [P] Add reusable dashboard metric-label and value-formatting helpers in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T005 [P] Review the existing Playwright overview fixture for coverage of the metric-card fields in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

**Checkpoint**: The dashboard page has a stable structure and formatting helpers for the metric-card UI.

---

## Phase 3: User Story 1 - Review Core Platform Counts At A Glance (Priority: P1) 🎯 MVP

**Goal**: Render prominent total-tenants and total-users cards on the protected super-admin dashboard.

**Independent Test**: Sign in as a `super_admin`, open `/platform`, and verify the dashboard shows visible cards for total tenants and total users.

### Tests for User Story 1

- [X] T006 [P] [US1] Add Playwright assertions for the total-tenant and total-user metric cards in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 1

- [X] T007 [US1] Render the total-tenants metric card in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T008 [US1] Render the total-users metric card in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T009 [US1] Update supporting dashboard copy so the metric-card section clearly communicates platform scale in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx

**Checkpoint**: The dashboard foregrounds the requested headline platform totals.

---

## Phase 4: User Story 2 - Review Tenant Growth Windows And Rates (Priority: P2)

**Goal**: Render week/month/year new-tenant and growth-rate values with labels that stay aligned to the documented metric definitions.

**Independent Test**: Load the dashboard with overview data that includes windowed metrics and verify the UI shows explicit week, month, and year values for both new tenants and tenant growth rate.

### Tests for User Story 2

- [X] T010 [P] [US2] Extend Playwright coverage for the new-tenant window values in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts
- [X] T011 [P] [US2] Extend Playwright coverage for the tenant-growth-rate values and labels in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 2

- [X] T012 [US2] Render the grouped new-tenant metric card with week/month/year entries in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T013 [US2] Render the grouped tenant-growth-rate metric card with percentage formatting in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T014 [US2] Align the dashboard labels and supporting copy with the `CROWN-119` trailing-window definitions in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-98-super-admin-dashboard-key-metric-cards/contracts/dashboard-metric-cards-ui-contract.md

**Checkpoint**: The dashboard displays the full set of requested trend metrics with clear definitions.

---

## Phase 5: User Story 3 - Preserve Dashboard Clarity And Protected Access (Priority: P3)

**Goal**: Keep the metric-card area resilient, readable, and contained within the existing protected dashboard experience.

**Independent Test**: Verify loading and error states still render inside the platform shell, the metric cards remain readable on narrower widths, and tenant-scoped users remain blocked by the existing shell flow.

### Tests for User Story 3

- [X] T015 [P] [US3] Extend Playwright coverage for the metric-card loading and error states in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts
- [X] T016 [P] [US3] Add responsive assertions for the metric-card area in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 3

- [X] T017 [US3] Refine the success, loading, and error layouts for the metric-card area in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T018 [US3] Keep the tenant-status breakdown as supporting context below the primary metric cards in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T019 [US3] Capture final validation guidance for the metric-card dashboard behavior in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-98-super-admin-dashboard-key-metric-cards/quickstart.md

**Checkpoint**: The overview area remains resilient, readable, and safely scoped to the protected super-admin dashboard.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the implementation and prepare the branch for review-safe delivery.

- [X] T020 [P] Run focused web Playwright coverage in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json
- [X] T021 [P] Run web typecheck in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json
- [X] T022 [P] Run `pnpm specify.audit` from /Users/ramanpreetaujla/Documents/AI-Projects/crown-app
- [X] T023 Review the final dashboard behavior against /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-98-super-admin-dashboard-key-metric-cards/spec.md
- [X] T024 Create the PR for `feat/CROWN-98-super-admin-dashboard-key-metric-cards` with links to /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-98-super-admin-dashboard-key-metric-cards/spec.md, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-98-super-admin-dashboard-key-metric-cards/plan.md, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-98-super-admin-dashboard-key-metric-cards/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks user-story work.
- **User Story Phases (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and delivers the headline dashboard totals.
- **User Story 2 (P2)**: Builds on the metric-card surface from US1.
- **User Story 3 (P3)**: Builds on the shared metric-card surface and preserves the surrounding protected-shell experience.

### Parallel Opportunities

- Phase 2: T004 and T005 can proceed in parallel after the overview-section refactor shape from T003 is clear.
- US2: T010 and T011 can run in parallel.
- US3: T015 and T016 can run in parallel.
- Phase 6: T020, T021, and T022 can run in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Refactor the dashboard overview section for the new card layout.
2. Render the total-tenants and total-users cards.
3. Verify the new headline cards in browser coverage.

### Incremental Delivery

1. Establish the shared metric-card layout and formatting helpers.
2. Deliver the headline total cards.
3. Add the windowed new-tenant and growth-rate cards with clear copy.
4. Reconfirm resilient loading/error behavior and responsive readability.

## Notes

- Keep the dashboard tied to the existing overview API contract rather than introducing UI-specific data remapping layers.
- If the `CROWN-119` contract changes materially during implementation, reconcile that drift explicitly instead of silently changing the UI semantics.
