# Tasks: Tenant Create Page Shell And Stepper Layout

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/specs/CROWN-96-tenant-create-page-shell-and-stepper-layout/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused Playwright coverage and web typecheck are included because this story changes protected platform routing behavior, stepper interaction, and discard-protection UX.

**Organization**: Tasks are grouped by user story so the dedicated tenant-create shell, placeholder step navigation, and exit warning behavior can be delivered and validated incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Context)

**Purpose**: Confirm the existing tenant-create placeholder route, protected shell behavior, and browser-test seams that `CROWN-96` extends.

- [ ] T001 Review the current tenant-create entry point in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/app/platform/tenants/new/page.tsx`
- [ ] T002 [P] Review the platform shell and protected-route behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/components/platform/platform-shell-frame.tsx` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/components/auth/use-protected-shell.ts`
- [ ] T003 [P] Review the current browser coverage around tenant-directory routing in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/tests/auth-flow.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the reusable tenant-create shell surface and local step-state model required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add a reusable tenant-create shell component in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/components/platform/tenant-create-shell.tsx`
- [ ] T005 [P] Add feature-local step metadata and draft/dirty-state handling in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/components/platform/tenant-create-shell.tsx`
- [ ] T006 [P] Replace the placeholder route content in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/app/platform/tenants/new/page.tsx` so it renders the new shell inside `PlatformShellFrame`

**Checkpoint**: The tenant-create route renders a reusable guided-shell surface inside the existing protected platform layout.

---

## Phase 3: User Story 1 - Open Tenant Creation In A Dedicated Guided Shell (Priority: P1) 🎯 MVP

**Goal**: Super admins can open `/platform/tenants/new` and see a dedicated tenant-create page shell with a visible stepper instead of a placeholder card.

**Independent Test**: Activate `Add new` from the tenant directory and confirm the browser lands on `/platform/tenants/new`, where the page renders a dedicated guided shell with a visible stepper and no drawer presentation.

### Tests for User Story 1

- [ ] T007 [P] [US1] Add browser coverage for tenant-directory `Add new` routing into `/platform/tenants/new` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/tests/auth-flow.spec.ts`
- [ ] T008 [P] [US1] Add browser assertions for the dedicated shell framing and visible stepper in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 1

- [ ] T009 [US1] Render the tenant-create page shell and progress indicator in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/components/platform/tenant-create-shell.tsx`
- [ ] T010 [US1] Ensure `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/app/platform/tenants/new/page.tsx` preserves the existing platform-shell framing and super-admin access boundary

**Checkpoint**: The create route is no longer a simple “coming soon” card and instead shows a proper guided shell.

---

## Phase 4: User Story 2 - Move Through Placeholder Tenant-Create Steps (Priority: P2)

**Goal**: Super admins can move through placeholder tenant-create steps with stable next/back controls and step-aware content.

**Independent Test**: Open `/platform/tenants/new`, move through the placeholder steps with `Next` and `Back`, and verify the active stepper state and content panel update without leaving the route.

### Tests for User Story 2

- [ ] T011 [P] [US2] Add browser assertions for next/back step transitions and first-step back behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/tests/auth-flow.spec.ts`
- [ ] T012 [P] [US2] Add browser assertions that placeholder content remains clearly non-final while step titles update in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 2

- [ ] T013 [US2] Implement ordered placeholder step definitions for `Tenant info`, `Role selection`, `User assignment`, and `Review` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/components/platform/tenant-create-shell.tsx`
- [ ] T014 [US2] Implement `Next` and `Back` navigation wiring plus active/completed/upcoming step rendering in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/components/platform/tenant-create-shell.tsx`
- [ ] T015 [US2] Add placeholder step content and minimal in-progress input state to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/components/platform/tenant-create-shell.tsx` so later stories have a stable extension point

**Checkpoint**: The tenant-create shell supports guided placeholder progression without implementing real onboarding logic.

---

## Phase 5: User Story 3 - Exit Safely Without Losing Orientation (Priority: P3)

**Goal**: Super admins receive a discard warning when leaving the tenant-create shell after entering data, while clean exits remain frictionless.

**Independent Test**: Enter data into a placeholder step, attempt `Cancel` or another supported exit path, and verify the warning appears before data loss; repeat with no entered data and confirm clean exit.

### Tests for User Story 3

- [ ] T016 [P] [US3] Add browser assertions for clean cancel when no data has been entered in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/tests/auth-flow.spec.ts`
- [ ] T017 [P] [US3] Add browser assertions for discard confirmation after entered step data in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 3

- [ ] T018 [US3] Implement `Cancel` navigation and in-app discard confirmation behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/components/platform/tenant-create-shell.tsx`
- [ ] T019 [US3] Implement browser/page-exit dirty-state protection where supported in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/components/platform/tenant-create-shell.tsx`
- [ ] T020 [US3] Verify the protected-shell behavior for `/platform/tenants/new` still blocks non-super-admin users via `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/tests/auth-flow.spec.ts`

**Checkpoint**: Exit flows protect in-progress tenant-create input without widening into persistence or submission logic.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the required validation loop, confirm scope discipline, and prepare the branch for PR creation.

- [ ] T021 [P] Run app-level typecheck in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/package.json`
- [ ] T022 [P] Run focused Playwright coverage for the tenant-create shell flows in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/tests/auth-flow.spec.ts`
- [ ] T023 Run `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app`
- [ ] T024 Review the final behavior against `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/specs/CROWN-96-tenant-create-page-shell-and-stepper-layout/spec.md`
- [ ] T025 Create the PR for `feat/CROWN-96-tenant-create-page-shell-and-stepper-layout` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/specs/CROWN-96-tenant-create-page-shell-and-stepper-layout/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/specs/CROWN-96-tenant-create-page-shell-and-stepper-layout/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/specs/CROWN-96-tenant-create-page-shell-and-stepper-layout/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational and is the MVP slice
- **User Story 2 (P2)**: Depends on the guided shell from User Story 1
- **User Story 3 (P3)**: Depends on the placeholder step state from User Story 2

### Within Each User Story

- Add or adjust browser coverage before finalizing the user-visible behavior it validates
- Keep the route stable at `/platform/tenants/new` while state changes remain internal to the shell
- Keep placeholder wording and discard-protection UX explicit so reviewers can see the story did not widen into real onboarding workflows

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T004`, `T005`, and `T006` can overlap once the shell structure is clear
- `T007` and `T008` can run in parallel
- `T011` and `T012` can run in parallel
- `T016` and `T017` can run in parallel
- `T021` and `T022` can run in parallel

---

## Parallel Example: User Story 2

```bash
# Validate the guided placeholder flow from the two main browser angles in parallel:
Task: "Add browser assertions for next/back step transitions and first-step back behavior in apps/web/tests/auth-flow.spec.ts"
Task: "Add browser assertions that placeholder content remains clearly non-final while step titles update in apps/web/tests/auth-flow.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Replace the current placeholder card at `/platform/tenants/new`
2. Render the dedicated guided page shell and visible stepper
3. Validate route entry plus the non-drawer shell presentation

### Incremental Delivery

1. Add the reusable tenant-create shell seam
2. Deliver the guided shell and visible stepper
3. Layer in placeholder step navigation and local draft state
4. Add discard confirmation and rerun focused validation

---

## Notes

- The primary implementation hotspots are `/apps/web/app/platform/tenants/new/page.tsx`, `/apps/web/components/platform/tenant-create-shell.tsx`, and `/apps/web/tests/auth-flow.spec.ts`
- If the shell begins absorbing real tenant provisioning fields or submission behavior, that work should move to follow-up Jira stories instead of expanding `CROWN-96`
