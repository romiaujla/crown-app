# Tasks: Tenant Create Role-Selection Step

**Input**: Design documents from `/specs/CROWN-143-tenant-create-role-selection-step/`
**Prerequisites**: `plan.md` (required), `spec.md` (required)

**Tests**: Playwright E2E assertions are included because this story replaces a placeholder step with real interactive behavior.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1–US4) this task belongs to

## Phase 1: Step Component (Blocking)

**Purpose**: Create the presentational role-selection step component

- [x] T001 [US1] Create `apps/web/components/platform/tenant-create-step-role-selection.tsx` with props for role options, selected role codes, onToggle callback, and empty-state rendering
- [x] T002 [P] [US4] Add a static fallback rationale map for role codes with null descriptions inside the step component
- [x] T003 [US2] Implement the required-role lock: checkbox checked and disabled for roles where `isRequired` is `true`
- [x] T004 [US3] Implement optional-role toggle: clicking a card or checkbox toggles the role code in the selected set

**Checkpoint**: The step component renders role cards with correct selection, lock, and toggle behavior

---

## Phase 2: Shell Integration (Depends on Phase 1)

**Purpose**: Wire the new step component into the tenant-create shell

- [x] T005 [US1] Add `selectedRoleCodes: Set<RoleCode>` state and role-code initialization logic to `apps/web/components/platform/tenant-create-shell.tsx`
- [x] T006 [US1] Replace the step 2 placeholder block with `TenantCreateStepRoleSelection` in the shell's render
- [x] T007 [US3] Wire `handleRoleToggle` callback and update `downstreamDataExists` to include role-selection state
- [x] T008 [US1] Clear and re-initialize `selectedRoleCodes` when management-system type changes (downstream reset flow)

**Checkpoint**: The shell renders the real role-selection step and preserves state across navigation

---

## Phase 3: Playwright Tests (Depends on Phase 2)

**Purpose**: Validate role-selection behavior end-to-end

- [x] T009 [US1] Add Playwright test: navigate to step 2 after selecting Transportation, assert role cards for Tenant Admin, Dispatcher, Driver render
- [x] T010 [US2] Add Playwright assertion: Tenant Admin checkbox is checked and disabled
- [x] T011 [US3] Add Playwright test: toggle Dispatcher off, navigate back to step 1, return to step 2, assert Dispatcher remains deselected
- [x] T012 [US1] Update existing placeholder-based step 2 assertions in `apps/web/tests/auth-flow.spec.ts` to reflect real role-selection content

**Checkpoint**: All Playwright tests pass for step 2 behavior

---

## Phase 4: Validation & Polish

**Purpose**: Final verification loop

- [x] T013 [P] Run `pnpm --filter @crown/web typecheck` and fix any errors
- [x] T014 [P] Run `pnpm specify.audit` and fix any drift
- [x] T015 Run Playwright tests via `pnpm --filter @crown/web test -- tests/auth-flow.spec.ts` and fix any failures

---

## Dependencies & Execution Order

- **Phase 1** → **Phase 2** → **Phase 3** → **Phase 4**
- Within Phase 1: T001 must complete before T003/T004; T002 can run in parallel with T001
- Within Phase 2: T005 must complete before T006/T007/T008
- Within Phase 3: T009 should run before T010/T011/T012
- Phase 4: T013 and T014 can run in parallel; T015 runs last
