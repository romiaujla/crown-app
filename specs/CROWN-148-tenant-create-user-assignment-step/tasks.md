# Tasks: Tenant Create User-Assignment Step

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-148-tenant-create-user-assignment-step/`  
**Prerequisites**: `plan.md`, `spec.md`

**Tests**: Playwright E2E coverage, `pnpm --filter @crown/web typecheck`, and `pnpm specify.audit` are included because this story replaces a visible guided-flow placeholder with real validation and state behavior.

**Organization**: Tasks are grouped by user story so each Jira outcome can be implemented and reviewed in isolation.

## Phase 1: Setup (Shared Context)

**Purpose**: Confirm the current shell wiring and create the task breakdown for this story.

- [ ] T001 Create the `CROWN-148` task breakdown in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-148-tenant-create-user-assignment-step/tasks.md
- [ ] T002 [P] Review the existing tenant-create shell, role-selection step, and Playwright coverage in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-step-role-selection.tsx, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared step-3 state and component scaffolding before user-story behavior is layered on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 Create the step-3 component scaffold in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-step-user-assignment.tsx
- [ ] T004 Implement grouped assignment draft state and validity wiring in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx
- [ ] T005 [P] Replace the step-3 placeholder rendering with the new step component wiring in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx

**Checkpoint**: The tenant-create shell can render a real step-3 component backed by dedicated grouped assignment state.

---

## Phase 3: User Story 1 - Assign Required Tenant Admin Users (Priority: P1) 🎯 MVP

**Goal**: Require at least one tenant-admin assignment before the wizard can advance beyond step 3.

**Independent Test**: Navigate to step 3 with selected roles, leave the tenant-admin group empty, and verify the step blocks progression until a valid tenant-admin row is completed.

### Tests for User Story 1

- [ ] T006 [P] [US1] Add Playwright coverage for the required tenant-admin section and blocked-next behavior in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 1

- [ ] T007 [US1] Render the required tenant-admin assignment section first, with required styling and empty-row handling, in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-step-user-assignment.tsx
- [ ] T008 [US1] Implement tenant-admin row validation and step-3 validity gating in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-step-user-assignment.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx
- [ ] T009 [US1] Ensure the shell `Next` action honors step-3 validity and surfaces validation errors when no tenant admin is assigned in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx

**Checkpoint**: Step 3 renders the required tenant-admin section and prevents advancing without at least one valid tenant-admin user.

---

## Phase 4: User Story 2 - Assign Users For Optional Selected Roles (Priority: P1)

**Goal**: Render grouped optional-role sections so super admins can assign initial users by the roles selected in step 2.

**Independent Test**: Select optional roles in step 2, open step 3, and verify each selected role gets its own editable assignment section while empty optional sections remain non-blocking.

### Tests for User Story 2

- [ ] T010 [P] [US2] Add Playwright coverage for grouped role sections, optional-role warnings, and row persistence across back/next navigation in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 2

- [ ] T011 [US2] Render one assignment section per selected optional role, with independent add/remove row controls, in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-step-user-assignment.tsx
- [ ] T012 [US2] Persist grouped assignment drafts across step navigation and show non-blocking unstaffed warnings for empty optional roles in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-step-user-assignment.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx
- [ ] T013 [US2] Render a recovery-oriented empty state when step 3 has no selected roles to assign in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-step-user-assignment.tsx

**Checkpoint**: Selected optional roles render as editable grouped sections, remain non-blocking when empty, and preserve draft rows across normal navigation.

---

## Phase 5: User Story 3 - Keep Step 3 Aligned With The V1 Onboarding Contract (Priority: P2)

**Goal**: Enforce the current onboarding-contract rules so step 3 collects only supported fields and clears invalid downstream state when upstream selections change.

**Independent Test**: Enter duplicate emails across role groups, navigate back to change role/type selections, and verify duplicate-email validation plus downstream resets behave consistently.

### Tests for User Story 3

- [ ] T014 [P] [US3] Add Playwright coverage for duplicate-email validation and downstream resets after role/type changes in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts

### Implementation for User Story 3

- [ ] T015 [US3] Limit step-3 row fields to contract-aligned `firstName`, `lastName`, and `email` inputs with accessible labels in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-step-user-assignment.tsx
- [ ] T016 [US3] Implement cross-group duplicate-email validation and inline field errors in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-step-user-assignment.tsx and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx
- [ ] T017 [US3] Clear or prune assignment state when management-system-type resets or selected-role changes invalidate downstream rows in /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-create-shell.tsx

**Checkpoint**: Step 3 stays aligned with the onboarding contract and does not preserve invalid downstream assignments after upstream changes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the story end to end, keep planning artifacts aligned, and prepare the branch for PR creation.

- [ ] T018 [P] Run Playwright coverage relevant to the tenant-create flow from /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json
- [ ] T019 [P] Run `pnpm --filter @crown/web typecheck` from /Users/ramanpreetaujla/Documents/AI-Projects/crown-app
- [ ] T020 [P] Run `pnpm specify.audit` from /Users/ramanpreetaujla/Documents/AI-Projects/crown-app
- [ ] T021 Review the final step-3 behavior against /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-148-tenant-create-user-assignment-step/spec.md
- [ ] T022 Create the PR for `feat/CROWN-148-tenant-create-user-assignment-step` with links to /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-148-tenant-create-user-assignment-step/spec.md, /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-148-tenant-create-user-assignment-step/plan.md, and /Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-148-tenant-create-user-assignment-step/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user-story work.
- **User Story Phases (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and delivers the required-admin gating MVP.
- **User Story 2 (P1)**: Builds on the step-3 shell/component foundation and complements US1 by rendering optional-role groups.
- **User Story 3 (P2)**: Builds on the grouped assignment UX from US1 and US2 to enforce contract-safe validation and reset behavior.

### Parallel Opportunities

- Phase 1: T002 can run while T001 is captured.
- Phase 2: T005 can proceed once the shared state shape from T004 is available.
- User stories: T006, T010, and T014 can each be prepared in parallel with their corresponding implementation slices.
- Phase 6: T018, T019, and T020 can run in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete the step-3 component scaffold and shell-state foundation.
2. Render the required tenant-admin section.
3. Block progression until at least one valid tenant-admin row exists.

### Incremental Delivery

1. Build the grouped assignment shell state and real step-3 component.
2. Ship required tenant-admin gating.
3. Add optional selected-role sections and non-blocking warnings.
4. Add contract-aligned validation and downstream reset behavior.

## Notes

- Keep step-3 changes inside `apps/web`; no API or shared-type contract changes are planned for this story.
- If username entry, existing-user search, or submission behavior becomes required, create or link a follow-up Jira issue instead of widening `CROWN-148`.
