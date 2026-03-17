# Tasks: Frontend Reusable Stepper Component (Horizontal + Vertical Support)

**Input**: Design documents from `/specs/CROWN-161-reusable-stepper-component/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/stepper-component-contract.md`, `quickstart.md`

**Tests**: Focused Playwright coverage and `@crown/web` typecheck are required because this story changes shared front-end progress UI behavior.

**Organization**: Tasks are grouped by user story to preserve independently testable increments.

## Phase 1: Setup (Shared Context)

**Purpose**: Prepare implementation context and confirm existing tenant-create shell behavior.

- [ ] T001 Review current tenant-create bespoke progress markup in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx`
- [ ] T002 Review existing tenant-create Playwright coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the reusable Stepper primitive before consumer adoption.

**⚠️ CRITICAL**: No user-story completion is possible until this phase is done.

- [ ] T003 Add shared `Stepper` component and typed prop API in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/ui/stepper.tsx`
- [ ] T004 Implement orientation and position-variant layout behavior (`horizontal`/`vertical`, `top`/`bottom`/`left`/`right`) in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/ui/stepper.tsx`
- [ ] T005 Implement completed/current/upcoming state icon and connector rendering in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/ui/stepper.tsx`
- [ ] T006 Implement optional interactive mode (`clickable`, `onStepClick`) with keyboard and focus-visible behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/ui/stepper.tsx`
- [ ] T007 Implement accessibility semantics including current-step indication in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/ui/stepper.tsx`

**Checkpoint**: A reusable Stepper primitive exists and is ready for domain consumer adoption.

---

## Phase 3: User Story 1 - Shared Stepper Layout and State Rendering (Priority: P1) 🎯 MVP

**Goal**: Use one reusable Stepper for correct horizontal/vertical rendering and state visuals.

**Independent Test**: Render tenant-create flow and verify completed/current/upcoming transitions plus connector visuals use the shared component.

### Tests for User Story 1

- [ ] T008 [P] [US1] Add/adjust Playwright assertions verifying shared stepper presence and state progression in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 1

- [ ] T009 [US1] Replace bespoke tenant-create progress list with shared Stepper usage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx`
- [ ] T010 [US1] Map tenant-create domain steps to shared `StepperStep` data without hardcoded component labels in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx`

**Checkpoint**: Tenant create flow uses shared Stepper and preserves visual state progression behavior.

---

## Phase 4: User Story 2 - Accessible Optional Interactivity (Priority: P2)

**Goal**: Ensure reusable Stepper meets keyboard and ARIA requirements when interactive mode is enabled.

**Independent Test**: Validate keyboard focus and activation behavior plus current-step semantics using focused browser assertions.

### Tests for User Story 2

- [ ] T011 [P] [US2] Add focused accessibility assertions for current-step semantics and focusable step controls in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 2

- [ ] T012 [US2] Finalize step control semantics and keyboard activation wiring in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/ui/stepper.tsx`
- [ ] T013 [US2] Ensure non-interactive mode remains semantic and non-clickable in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/ui/stepper.tsx`

**Checkpoint**: Stepper interaction mode behavior and accessibility contract are complete.

---

## Phase 5: User Story 3 - Tenant Create Usage Example Preservation (Priority: P3)

**Goal**: Keep existing tenant-create navigation and cancel-guard behavior intact after Stepper adoption.

**Independent Test**: Existing tenant-create flow assertions continue to pass while shared Stepper is in place.

### Tests for User Story 3

- [ ] T014 [P] [US3] Ensure tenant-create cancel guard and step navigation assertions remain green in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 3

- [ ] T015 [US3] Keep `Next`, `Back`, and `Cancel` behavior unchanged while wired to shared Stepper state in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx`
- [ ] T016 [US3] Update feature contract/quickstart notes if final implementation differs from draft assumptions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-161-reusable-stepper-component/contracts/stepper-component-contract.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-161-reusable-stepper-component/quickstart.md`

**Checkpoint**: Shared Stepper adoption does not regress existing tenant-create shell behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate final behavior and complete branch readiness for PR.

- [ ] T017 [P] Run `pnpm --filter @crown/web typecheck`
- [ ] T018 [P] Run `pnpm --filter @crown/web test -- tests/auth-flow.spec.ts`
- [ ] T019 Run `pnpm specify.audit` from repository root
- [ ] T020 Mark completed tasks and verify implementation against `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-161-reusable-stepper-component/spec.md`
- [ ] T021 Create PR for `feat/CROWN-161-reusable-stepper-component-horizontal-vertical-support` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-161-reusable-stepper-component/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-161-reusable-stepper-component/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-161-reusable-stepper-component/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 starts immediately.
- Phase 2 blocks all user-story completion.
- User story phases depend on Phase 2 completion.
- Phase 6 runs after implementation tasks for intended stories are complete.

### User Story Dependencies

- **US1 (P1)** is MVP and first delivery slice.
- **US2 (P2)** depends on shared Stepper primitive from US1/Phase 2.
- **US3 (P3)** depends on tenant-create consumer adoption from US1.

### Parallel Opportunities

- T008 and T011 can be developed in parallel once Stepper API is stable.
- T017 and T018 can run in parallel near completion.

## Implementation Strategy

### MVP First (US1)

1. Build reusable Stepper primitive with state visuals and connectors.
2. Replace tenant-create bespoke list with Stepper.
3. Confirm step progression assertions remain valid.

### Incremental Delivery

1. Implement shared Stepper API and base styles.
2. Add accessibility and optional interactivity behavior.
3. Complete tenant-create consumer refactor.
4. Validate with focused tests and typecheck.

## Notes

- Keep changes scoped to `apps/web` and this feature artifact folder only.
- Avoid introducing unrelated styling framework changes or new test runners in this story.
