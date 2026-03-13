# Tasks: Super-Admin Control-Plane Navigation Shell

**Input**: Design documents from `/specs/CROWN-92-super-admin-control-plane-navigation-shell/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Playwright coverage and app-level typecheck are included because the story changes protected navigation behavior, responsive layout behavior, and shell presentation.

**Organization**: Tasks are grouped by user story to preserve independent validation against the Jira acceptance criteria.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the story artifact set and establish the shared navigation model before route-specific behavior is added.

- [X] T001 Create the `CROWN-92` task breakdown in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-92-super-admin-control-plane-navigation-shell/tasks.md
- [X] T002 [P] Define the control-plane navigation inventory and section metadata in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Refactor the shared shell to support a persistent sidebar and route-aware section rendering.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Refactor /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx to support a left navigation rail, active state, and section content panel
- [X] T004 [P] Add shell layout, active-state, collapsed-rail, and tooltip styling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css
- [X] T005 [P] Implement lightweight in-shell tooltip presentation for icon-only navigation items in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx

**Checkpoint**: The shared shell supports platform navigation rendering and responsive rail behavior.

---

## Phase 3: User Story 1 - Navigate Core Super-Admin Areas (Priority: P1) 🎯 MVP

**Goal**: Give super admins a persistent left navigation shell with the full control-plane information architecture and a clear active state.

**Independent Test**: Open `/platform` as a super admin, confirm the nine required navigation items render in the left rail, select different items, and verify the active state plus right-side content updates.

### Tests for User Story 1

- [X] T006 [P] [US1] Expand protected shell/browser coverage for the required platform navigation inventory in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts
- [X] T007 [P] [US1] Add active-navigation and section-switching assertions for the platform shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 1

- [X] T008 [US1] Populate the platform route with the nine required super-admin destinations in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T009 [US1] Wire the active destination and right-side section content into /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx
- [X] T010 [US1] Preserve super-admin-only access behavior while rendering the navigation shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

**Checkpoint**: The super-admin shell is navigable and the main control-plane information architecture is visible.

---

## Phase 4: User Story 2 - Understand Unbuilt Areas Without Leaving The Shell (Priority: P2)

**Goal**: Provide stable placeholder states for unfinished destinations so the shell remains complete without widening scope into downstream feature work.

**Independent Test**: Select unfinished destinations and confirm the right-side content panel renders `<Menu title> Coming Soon`.

### Tests for User Story 2

- [X] T011 [P] [US2] Add placeholder-section assertions for unfinished platform destinations in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 2

- [X] T012 [US2] Implement the shared placeholder content model for unfinished platform sections in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx
- [X] T013 [US2] Render `<Menu title> Coming Soon` states in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx
- [X] T014 [US2] Align the shell contract and quickstart notes with the implemented placeholder behavior in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-92-super-admin-control-plane-navigation-shell/contracts/control-plane-navigation-shell-contract.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-92-super-admin-control-plane-navigation-shell/quickstart.md

**Checkpoint**: Placeholder destinations behave consistently without leaving the shell.

---

## Phase 5: User Story 3 - Use The Shell On Desktop And iPad Layouts (Priority: P3)

**Goal**: Make the left navigation adapt to desktop and iPad-sized layouts while preserving destination clarity through icon-only tooltips.

**Independent Test**: Validate desktop and iPad-sized viewports, confirming label visibility on desktop, icon-only collapse on iPad-sized layouts and below, and tooltip labeling in collapsed mode.

### Tests for User Story 3

- [X] T015 [P] [US3] Add responsive shell assertions for expanded and collapsed platform navigation in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts
- [X] T016 [P] [US3] Add tooltip-visibility assertions for collapsed navigation items in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 3

- [X] T017 [US3] Implement desktop label visibility and tablet collapsed-rail behavior in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css
- [X] T018 [US3] Implement tooltip labeling for collapsed platform navigation items in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx
- [X] T019 [US3] Verify the shell remains extensible for future sections by keeping navigation additions data-driven in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx

**Checkpoint**: Responsive navigation behavior matches the Jira acceptance criteria.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the required validation, finalize docs, and prepare the branch for PR creation.

- [X] T020 [P] Run app-level typecheck in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json
- [X] T021 [P] Run focused Playwright coverage for the platform shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts
- [X] T022 Run `pnpm specify.audit` from /Users/ramanpreetaujla/Documents/AI-Projects/crown-app
- [X] T023 Review the final shell against the Jira acceptance criteria and feature docs in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-92-super-admin-control-plane-navigation-shell/spec.md
- [X] T024 Create the PR for `feat/CROWN-92-super-admin-control-plane-navigation-shell` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-92-super-admin-control-plane-navigation-shell/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-92-super-admin-control-plane-navigation-shell/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-92-super-admin-control-plane-navigation-shell/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks user-story work.
- **User Story Phases (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and is the MVP slice.
- **User Story 2 (P2)**: Builds on the active navigation/content structure from US1.
- **User Story 3 (P3)**: Builds on the shared shell after US1 and can overlap with final styling work from US2.

### Parallel Opportunities

- Phase 2: T004 and T005 can proceed in parallel once the shell refactor shape from T003 is clear.
- US1: T006 and T007 can run in parallel.
- US3: T015 and T016 can run in parallel.
- Polish: T020 and T021 can run in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Refactor the shared shell into a left-rail layout.
2. Add the required control-plane navigation inventory.
3. Validate section switching and active-state behavior.

### Incremental Delivery

1. Establish the reusable shell layout and data model.
2. Add the full navigation inventory and section switching.
3. Layer in placeholder states for unfinished destinations.
4. Finish with responsive collapse and tooltip behavior.

## Notes

- The platform route and shared shell component are the primary implementation hotspots and should be edited carefully to avoid tenant-shell regressions.
- If a destination starts requiring non-placeholder business logic, that work should move to a follow-up Jira issue rather than expanding `CROWN-92`.
