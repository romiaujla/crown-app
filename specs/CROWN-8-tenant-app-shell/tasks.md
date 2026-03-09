# Tasks: Tenant App UI Shell

**Input**: Design documents from `/specs/CROWN-8-tenant-app-shell/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Playwright and typecheck tasks are included because the plan explicitly requires tenant-shell browser validation and role-boundary verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the `CROWN-8` task artifact set and align repo-level references for the tenant shell.

- [X] T001 Create the `CROWN-8` task breakdown artifact in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-8-tenant-app-shell/tasks.md
- [X] T002 [P] Align top-level tenant-shell references in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/specs/backlog-map.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/architecture/system-overview.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shell separation and tenant-entry primitives before user-story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Define tenant-shell content model and tenant navigation constants in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T004 [P] Add tenant-shell structural styles and responsive layout tokens in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css
- [X] T005 [P] Update app metadata to support tenant workspace framing in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/layout.tsx
- [X] T006 Define tenant-role entry expectations for the shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Enter a Tenant Workspace (Priority: P1) 🎯 MVP

**Goal**: Give tenant-scoped users a dedicated tenant workspace shell with powered-by-Crown branding that is distinct from the `super_admin` control plane.

**Independent Test**: Load the tenant shell as a tenant-scoped user and confirm the user sees a tenant workspace with powered-by-Crown identity; confirm `super_admin` users do not remain in the tenant shell.

### Tests for User Story 1

- [X] T007 [P] [US1] Expand smoke coverage for tenant-shell entry and workspace identity in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts
- [X] T008 [P] [US1] Add role-separation smoke coverage for `super_admin` access handling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts

### Implementation for User Story 1

- [X] T009 [US1] Implement the tenant workspace landing shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T010 [US1] Add powered-by-Crown branding and tenant workspace orientation copy in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T011 [US1] Implement tenant-role shell gating or placeholder redirect behavior in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T012 [US1] Refine tenant-shell hero and workspace layout styling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Navigate Core Tenant Areas (Priority: P2)

**Goal**: Provide tenant-first navigation so users can move through the workspace without platform-admin framing.

**Independent Test**: Open the tenant shell and confirm the primary navigation exposes clear tenant workspace destinations while remaining understandable with placeholder data.

### Tests for User Story 2

- [X] T013 [P] [US2] Add tenant-navigation rendering checks in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts
- [X] T014 [P] [US2] Add tenant-shell placeholder-data navigation checks in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts

### Implementation for User Story 2

- [X] T015 [US2] Implement tenant workspace navigation sections in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T016 [US2] Implement tenant overview entry-point presentation in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T017 [US2] Add responsive tenant navigation styling for desktop and mobile layouts in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css
- [X] T018 [US2] Update tenant-shell contracts to match implemented navigation behavior in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-8-tenant-app-shell/contracts/tenant-shell-ui-contract.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-8-tenant-app-shell/contracts/tenant-role-entry-contract.md

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: User Story 3 - See Tenant Context With Management-System Language (Priority: P3)

**Goal**: Make the tenant shell communicate a management-system workspace through overview content, branding, and empty states.

**Independent Test**: Review headings, labels, overview cards, and empty states to confirm they use management-system language and reinforce a tenant workspace powered by Crown.

### Tests for User Story 3

- [X] T019 [P] [US3] Add tenant-shell copy assertions for management-system framing in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts
- [X] T020 [P] [US3] Add tenant-shell empty-state rendering checks in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts

### Implementation for User Story 3

- [X] T021 [US3] Implement tenant overview cards and no-data states in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx
- [X] T022 [US3] Replace residual CRM-style tenant wording with management-system language in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/layout.tsx
- [X] T023 [US3] Add overview-card, powered-by-Crown, and empty-state styling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css
- [X] T024 [US3] Update planning quickstart notes to reflect final tenant-shell validation expectations in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-8-tenant-app-shell/quickstart.md

**Checkpoint**: All user stories are independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cross-story cleanup.

- [X] T025 [P] Run app-level typecheck for the tenant shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json
- [X] T026 [P] Run Playwright smoke coverage for the tenant shell in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts
- [X] T027 Review tenant-shell docs and backlog wording for drift in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/specs/backlog-map.md and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-8-tenant-app-shell/spec.md
- [X] T028 Remove or reconcile the temporary numeric spec-kit stub in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/001-tenant-app-shell

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user-story work.
- **User Story Phases (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and is the MVP slice.
- **User Story 2 (P2)**: Starts after Phase 2 and builds on the tenant shell created in US1.
- **User Story 3 (P3)**: Starts after Phase 2 and layers management-system framing and tenant overview behavior on top of US1/US2.

### Within Each User Story

- Tests should be written or expanded before implementation changes for that story.
- `page.tsx` work must remain sequential within each story because the same file is touched repeatedly.
- `globals.css` styling tasks can follow the corresponding structural/content changes.
- Contract and quickstart updates follow the implemented behavior they describe.

### Parallel Opportunities

- Phase 1: T001 and T002 can proceed in parallel.
- Phase 2: T004 and T005 can run in parallel after T003; T006 can proceed once the tenant shell shape is defined.
- US1: T007 and T008 can run in parallel.
- US2: T013 and T014 can run in parallel.
- US3: T019 and T020 can run in parallel.
- Polish: T025 and T026 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "Expand smoke coverage for tenant-shell entry and workspace identity in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
Task: "Add role-separation smoke coverage for `super_admin` access handling in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
```

## Parallel Example: User Story 2

```bash
Task: "Add tenant-navigation rendering checks in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
Task: "Add tenant-shell placeholder-data navigation checks in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
```

## Parallel Example: User Story 3

```bash
Task: "Add tenant-shell copy assertions for management-system framing in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
Task: "Add tenant-shell empty-state rendering checks in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup.
2. Complete Foundational work.
3. Deliver User Story 1.
4. Validate that tenant-scoped users land in a tenant workspace shell and that `super_admin` users do not remain in it.

### Incremental Delivery

1. Establish the tenant shell frame and entry gating.
2. Add tenant navigation and workspace entry points.
3. Add overview cards, empty states, and management-system-aligned tenant copy.
4. Finish with validation and stub cleanup.

### Parallel Team Strategy

1. One contributor handles `page.tsx` tenant-shell structure while another expands Playwright coverage.
2. Once the shell structure is stable, styling work in `globals.css` can proceed in parallel with contract/quickstart updates.
3. Final validation and temporary stub cleanup run after all story work is in place.

---

## Notes

- All tasks follow the required checklist format.
- `apps/web/app/page.tsx` is the main implementation hotspot and should be edited sequentially.
- `specs/001-tenant-app-shell` exists only because the spec-kit creation script required a numeric feature branch and should not remain the canonical feature path.
