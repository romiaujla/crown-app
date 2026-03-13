# Tasks: Dashboard Left-Menu Profile Actions

**Input**: Design documents from `/specs/CROWN-115-dashboard-profile-menu/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Playwright coverage and app-level typecheck are included because the story changes shared authenticated shell behavior and the user-visible logout affordance.

**Organization**: Tasks are grouped by user story so each Jira outcome can be validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the story task set and confirm the shared shell change surface.

- [ ] T001 Create the `CROWN-115` task breakdown in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-115-dashboard-profile-menu/tasks.md
- [ ] T002 [P] Review the current standalone authenticated-user block and shared logout affordance in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/logout-button.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared sidebar-profile structure and supporting shell styles before story-specific assertions are layered on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Refactor /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx to remove the top-level authenticated-user card and host a compact profile section beneath the sidebar navigation
- [ ] T004 [P] Add or update shell styling for the compact profile entry and anchored menu in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css
- [ ] T005 [P] Adjust the logout-button presentation for compact menu use in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/logout-button.tsx if needed without changing sign-out behavior

**Checkpoint**: The shared shell supports a compact profile trigger/menu area below the navigation rail.

---

## Phase 3: User Story 1 - Open Profile Actions From The Left Navigation (Priority: P1) 🎯 MVP

**Goal**: Move the authenticated profile affordance into the left navigation shell and remove the old detached user block.

**Independent Test**: Sign in to `/platform`, verify the old `Authenticated as` block is gone, and confirm a compact profile entry appears below the left navigation with initials visible.

### Tests for User Story 1

- [ ] T006 [P] [US1] Add browser assertions for removing the old standalone authenticated-user block in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts
- [ ] T007 [P] [US1] Add browser assertions for the compact left-menu profile entry and initials avatar in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 1

- [ ] T008 [US1] Render the compact profile entry beneath the sidebar navigation in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx
- [ ] T009 [US1] Implement deterministic initials derivation from the authenticated display name in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx
- [ ] T010 [US1] Verify shared shell consumers still pass the needed user context in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/tenant/page.tsx

**Checkpoint**: The old user block is gone and the new profile entry is part of the left shell.

---

## Phase 4: User Story 2 - Review Identity Details In A Compact Menu (Priority: P2)

**Goal**: Open a compact anchored menu that shows the signed-in user's name and role.

**Independent Test**: Activate the profile entry and verify a compact menu opens with the user's display name and role.

### Tests for User Story 2

- [ ] T011 [P] [US2] Add browser assertions for opening and closing the compact profile menu in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts
- [ ] T012 [P] [US2] Add browser assertions for the menu identity details in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 2

- [ ] T013 [US2] Implement the compact profile menu open/close state in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx
- [ ] T014 [US2] Render the signed-in display name and role inside the compact menu in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx
- [ ] T015 [US2] Align the shell contract and quickstart notes with the final profile-menu behavior in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-115-dashboard-profile-menu/contracts/dashboard-profile-menu-contract.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-115-dashboard-profile-menu/quickstart.md

**Checkpoint**: The compact menu opens in place and shows the required identity details.

---

## Phase 5: User Story 3 - Log Out From The New Profile Menu (Priority: P3)

**Goal**: Keep logout available from the new compact profile menu without changing sign-out behavior.

**Independent Test**: Open the compact profile menu, activate logout, and confirm the browser returns to the login page.

### Tests for User Story 3

- [ ] T016 [P] [US3] Update logout browser coverage to use the new compact profile menu interaction in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 3

- [ ] T017 [US3] Place the existing logout action inside the compact profile menu in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/workspace-shell.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/logout-button.tsx
- [ ] T018 [US3] Confirm the shared shell still supports both platform and tenant logout entry points after relocation in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/tenant/page.tsx, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

**Checkpoint**: Logout remains available from the new menu and preserves existing behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the final implementation, keep docs aligned, and prepare the branch for PR creation.

- [ ] T019 [P] Run app-level typecheck in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json
- [ ] T020 [P] Run focused Playwright coverage for the profile-menu and logout flows in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts
- [ ] T021 Run `pnpm specify.audit` from /Users/ramanpreetaujla/Documents/AI-Projects/crown-app
- [ ] T022 Review the final shell behavior against /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-115-dashboard-profile-menu/spec.md
- [ ] T023 Create the PR for `feat/CROWN-115-dashboard-profile-menu` with links to /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-115-dashboard-profile-menu/spec.md, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-115-dashboard-profile-menu/plan.md, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-115-dashboard-profile-menu/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks user-story work.
- **User Story Phases (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and is the MVP slice.
- **User Story 2 (P2)**: Builds on the compact profile entry added in US1.
- **User Story 3 (P3)**: Builds on the compact menu from US2 and preserves the existing logout path.

### Parallel Opportunities

- Phase 2: T004 and T005 can proceed in parallel once the shell refactor shape from T003 is clear.
- US1: T006 and T007 can run in parallel.
- US2: T011 and T012 can run in parallel.
- Polish: T019 and T020 can run in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Remove the detached authenticated-user card from the top of the shell.
2. Render a compact profile entry inside the left navigation area.
3. Verify the new placement and initials avatar in browser coverage.

### Incremental Delivery

1. Refactor the shared shell layout for the new profile placement.
2. Add initials rendering and compact shell presentation.
3. Layer in the open/close profile menu with identity details.
4. Move logout into the compact menu and rerun focused validation.

## Notes

- `workspace-shell.tsx` is the primary implementation hotspot and should be edited carefully because it is shared across authenticated shells.
- If the compact menu starts requiring broader keyboard/focus-management infrastructure than this story can safely absorb, that should be called out as follow-up scope rather than silently widening the implementation.
