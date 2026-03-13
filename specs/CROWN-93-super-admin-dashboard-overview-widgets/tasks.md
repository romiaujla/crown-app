# Tasks: Super-Admin Dashboard Overview Widgets

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-93-super-admin-dashboard-overview-widgets/`  
**Prerequisites**: `plan.md`, `spec.md`

**Tests**: Playwright browser coverage, web typecheck, and `pnpm specify.audit` are included because this story changes protected dashboard behavior and needs route-level UI validation.

**Organization**: Tasks are grouped by user story so each Jira outcome can be validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the story task set and confirm the current dashboard UI and API-consumer baseline.

- [X] T001 Create the `CROWN-93` task breakdown in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-93-super-admin-dashboard-overview-widgets/tasks.md
- [X] T002 [P] Review the existing platform dashboard page and the `CROWN-116` overview API contract in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/platform/dashboard/contracts.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared web-side overview contract and fetch helper before dashboard rendering work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create the web-side dashboard overview schemas and types in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/types.ts
- [X] T004 [P] Add a dashboard overview API fetch helper that uses the authenticated bearer token in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/api.ts
- [X] T005 [P] Confirm the current protected-shell flow supplies the session information needed for overview requests in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/use-protected-shell.ts

**Checkpoint**: The web app has one reusable dashboard overview fetch path with validated response types.

---

## Phase 3: User Story 1 - Review Platform Tenant Counts At A Glance (Priority: P1) 🎯 MVP

**Goal**: Replace the static dashboard placeholder cards with a live tenant-summary widget that shows total tenants and per-status counts.

**Independent Test**: Sign in as a super admin, open `/platform`, and verify the dashboard shows the total tenant count plus all returned tenant-status counts from the overview API.

### Tests for User Story 1

- [X] T006 [P] [US1] Add Playwright coverage for the successful dashboard overview widget render in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 1

- [X] T007 [US1] Replace the static dashboard overview cards with live overview widget rendering in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T008 [US1] Render the total tenant count prominently in the tenant-summary widget in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T009 [US1] Render the per-status tenant counts, including explicit zero values returned by the API, in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx

**Checkpoint**: The dashboard home shows live tenant-summary data instead of static placeholder overview cards.

---

## Phase 4: User Story 2 - Understand Platform Status Distribution Without Noise (Priority: P2)

**Goal**: Keep the first dashboard widget focused on tenant-summary visibility and avoid widening into recent-activity or tenant-change features.

**Independent Test**: Open the dashboard and confirm the visible overview content remains limited to the tenant-summary widget area with no recent-activity or tenant-change widget present.

### Tests for User Story 2

- [X] T010 [P] [US2] Extend Playwright assertions to confirm the overview area stays limited to tenant-summary content in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 2

- [X] T011 [US2] Remove or replace static non-summary dashboard copy that widens beyond the tenant-summary scope in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T012 [US2] Keep the dashboard layout structured for the first overview widget without introducing activity-feed or recent-change UI in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx

**Checkpoint**: The delivered dashboard remains intentionally narrow and aligned with Jira scope.

---

## Phase 5: User Story 3 - Preserve Room For Future Platform Widgets (Priority: P3)

**Goal**: Provide loading/error states and a stable layout that can accept future overview widgets without redesigning the initial tenant-summary section.

**Independent Test**: Verify the dashboard shows intentional loading and error states for the overview request and that the widget area remains readable on desktop and narrower viewports.

### Tests for User Story 3

- [X] T013 [P] [US3] Add Playwright coverage for dashboard overview error handling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts
- [X] T014 [P] [US3] Extend viewport assertions to confirm the tenant-summary widget remains readable in the existing responsive shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 3

- [X] T015 [US3] Add a non-empty loading state for the overview request in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T016 [US3] Add a contained error state that preserves the platform shell when overview data fails to load in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T017 [US3] Refine the dashboard widget layout so future overview widgets can be added without redesigning the tenant-summary section in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx

**Checkpoint**: The overview area is resilient, readable, and ready for future widget expansion.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the final web behavior, keep planning artifacts aligned, and prepare the branch for PR creation.

- [X] T018 [P] Run web Playwright coverage in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json
- [X] T019 [P] Run web typecheck in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json
- [X] T020 [P] Run `pnpm specify.audit` from /Users/ramanpreetaujla/Documents/AI-Projects/crown-app
- [X] T021 Review the final dashboard behavior against /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-93-super-admin-dashboard-overview-widgets/spec.md
- [X] T022 Create the PR for `feat/CROWN-93-ui-super-admin-dashboard-overview-widgets` with links to /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-93-super-admin-dashboard-overview-widgets/spec.md, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-93-super-admin-dashboard-overview-widgets/plan.md, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-93-super-admin-dashboard-overview-widgets/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks user-story work.
- **User Story Phases (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and is the MVP slice.
- **User Story 2 (P2)**: Builds on the live dashboard widget surface delivered in US1.
- **User Story 3 (P3)**: Builds on the overview request path and widget surface from US1.

### Parallel Opportunities

- Phase 2: T004 and T005 can proceed in parallel after the web-side overview schema shape is clear.
- US3: T013 and T014 can run in parallel.
- Phase 6: T018 and T019 can run in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Add the validated web-side overview contract and fetch helper.
2. Replace the static dashboard cards with the live tenant-summary widget.
3. Verify the successful dashboard overview behavior in Playwright.

### Incremental Delivery

1. Establish the web-side API consumer and types.
2. Deliver the live tenant-summary widget.
3. Trim the dashboard overview back to the intended Jira scope.
4. Add resilient loading/error states and preserve the future-widget layout.

## Notes

- Keep the web-side response typing aligned with the existing API `snake_case` contract rather than remapping fields.
- If the existing API contract from `CROWN-116` changes materially during implementation, stop and reconcile that drift instead of silently widening the UI story.
