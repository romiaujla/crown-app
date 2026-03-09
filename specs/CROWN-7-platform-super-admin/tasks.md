# Tasks: Super-Admin Control Plane UI Shell

**Input**: Design documents from `/specs/CROWN-7-platform-super-admin/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Playwright and typecheck tasks are included because the plan explicitly requires browser behavior validation and type-safety validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the feature workspace and align app metadata with the new platform-shell direction.

- [X] T001 Create the `CROWN-7` task breakdown artifact in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-7-platform-super-admin/tasks.md
- [X] T002 [P] Align top-level feature references for the platform shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/specs/backlog-map.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/architecture/system-overview.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared shell primitives and role-entry rules before user-story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create shared platform-shell content model and navigation constants in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T004 [P] Add platform-shell structural styles and responsive layout tokens in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css
- [X] T005 [P] Update app metadata to reflect the Crown platform control plane in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/layout.tsx
- [X] T006 Define role-entry behavior expectations for the shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Enter the Platform Control Plane (Priority: P1) 🎯 MVP

**Goal**: Give `super_admin` users a distinct main-app control-plane shell and keep non-super-admin users out of it.

**Independent Test**: Sign in or simulate entry as `super_admin` and confirm the user lands in a platform-specific shell with clear Crown operator identity; confirm non-super-admin access is denied or redirected.

### Tests for User Story 1

- [X] T007 [P] [US1] Expand shell-entry smoke coverage for super-admin platform identity in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts
- [X] T008 [P] [US1] Add role-entry scenario coverage for non-super-admin handling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts

### Implementation for User Story 1

- [X] T009 [US1] Implement the super-admin control-plane landing shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T010 [US1] Add operator identity, entry-state copy, and shell framing in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T011 [US1] Implement role-aware shell gating or placeholder redirect behavior in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T012 [US1] Refine shell layout and hero treatment for the control-plane landing state in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Navigate Platform Management Areas (Priority: P2)

**Goal**: Provide platform-first navigation so a super admin can move through the control plane without entering a tenant workspace.

**Independent Test**: Open the shell and confirm the primary navigation exposes clear platform destinations for tenant management, platform oversight, and future expansion areas while remaining usable with no tenant selected.

### Tests for User Story 2

- [X] T013 [P] [US2] Add navigation rendering checks for platform destinations in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts
- [X] T014 [P] [US2] Add no-tenant-selected shell behavior checks in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts

### Implementation for User Story 2

- [X] T015 [US2] Implement primary platform navigation sections in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T016 [US2] Implement tenant-management entry-point presentation in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T017 [US2] Add responsive navigation styling for desktop and mobile layouts in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css
- [X] T018 [US2] Update platform-shell contracts to match implemented navigation behavior in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-7-platform-super-admin/contracts/platform-shell-ui-contract.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-7-platform-super-admin/contracts/platform-role-entry-contract.md

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: User Story 3 - See Platform State Without CRM Framing (Priority: P3)

**Goal**: Make the super-admin shell communicate Crown's management-system platform positioning through overview content and empty states.

**Independent Test**: Review headings, labels, summary cards, and empty states to confirm they use management-system language and remain meaningful even when platform data is sparse.

### Tests for User Story 3

- [X] T019 [P] [US3] Add copy and overview-state assertions for management-system framing in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts
- [X] T020 [P] [US3] Add empty-state rendering checks for no-data platform conditions in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts

### Implementation for User Story 3

- [X] T021 [US3] Implement platform overview cards and no-data states in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T022 [US3] Replace residual CRM-style shell wording with management-system language in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/layout.tsx
- [X] T023 [US3] Add overview-card and empty-state styling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css
- [X] T024 [US3] Update planning quickstart notes to reflect final shell validation expectations in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-7-platform-super-admin/quickstart.md

**Checkpoint**: All user stories are independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cross-story cleanup.

- [X] T025 [P] Run app-level typecheck for the web shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json
- [X] T026 [P] Run Playwright smoke coverage for the platform shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts
- [X] T027 Review shell docs and backlog wording for drift in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/specs/backlog-map.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-7-platform-super-admin/spec.md
- [X] T028 Confirm Jira wording changes needed for `CROWN-7` before any Jira update in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-7-platform-super-admin/spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user-story work.
- **User Story Phases (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and is the MVP slice.
- **User Story 2 (P2)**: Starts after Phase 2 and builds on the shell created in US1.
- **User Story 3 (P3)**: Starts after Phase 2 and can layer on top of US1/US2 presentation work while remaining independently testable as copy/overview behavior.

### Within Each User Story

- Tests should be written or expanded before implementation changes for that story.
- `page.tsx` work must remain sequential within each story because the same file is touched repeatedly.
- `globals.css` styling tasks can follow the corresponding structural/content changes.
- Contract and quickstart updates follow the implemented behavior they describe.

### Parallel Opportunities

- Phase 1: T001 and T002 can proceed in parallel.
- Phase 2: T004 and T005 can run in parallel after T003; T006 can proceed once the shell shape is defined.
- US1: T007 and T008 can run in parallel.
- US2: T013 and T014 can run in parallel.
- US3: T019 and T020 can run in parallel.
- Polish: T025 and T026 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "Expand shell-entry smoke coverage for super-admin platform identity in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
Task: "Add role-entry scenario coverage for non-super-admin handling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
```

## Parallel Example: User Story 2

```bash
Task: "Add navigation rendering checks for platform destinations in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
Task: "Add no-tenant-selected shell behavior checks in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
```

## Parallel Example: User Story 3

```bash
Task: "Add copy and overview-state assertions for management-system framing in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
Task: "Add empty-state rendering checks for no-data platform conditions in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup.
2. Complete Foundational work.
3. Deliver User Story 1.
4. Validate that `super_admin` users land in a distinct platform shell and that non-super-admin access is blocked or redirected.

### Incremental Delivery

1. Establish the shell frame and gating.
2. Add platform navigation and tenant-management entry points.
3. Add overview cards and management-system-aligned empty states.
4. Finish with validation and Jira wording confirmation.

### Parallel Team Strategy

1. One contributor handles `page.tsx` shell structure while another expands Playwright coverage.
2. Once shell structure is stable, styling work in `globals.css` can proceed in parallel with contract/quickstart updates.
3. Final validation tasks run after all story work is in place.

---

## Notes

- All tasks follow the required checklist format.
- `apps/web/app/page.tsx` is the main implementation hotspot and should be edited sequentially.
- Jira updates remain out of scope until the user confirms them explicitly.
