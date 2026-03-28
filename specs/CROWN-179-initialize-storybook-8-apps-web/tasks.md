# Tasks: Initialize Storybook 8 In Apps/Web

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/`  
**Prerequisites**: `plan.md`, `spec.md`, `wireframe.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: Validate with `pnpm --filter @crown/web run typecheck`, Storybook startup, and Storybook static build. Repository hooks will also run the broader test suite during commit.

**Organization**: Tasks are grouped by user story and ordered to satisfy the repository’s UI workflow gate: UI spec tasks first, then Storybook/component tasks, then workspace assembly and validation. No API tasks are required for this story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the Storybook foundation scope, reference sources, and package baseline for `apps/web`.

- [x] T001 Create and review the `CROWN-179` Spec Kit artifacts in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/`
- [x] T002 [P] Review the current `apps/web` package baseline in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json`
- [x] T003 [P] Review the current reusable button primitive in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/ui/button.tsx`
- [x] T004 [P] Review the existing theme and styling inputs in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/platform-theme-provider.tsx` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css`

---

## Phase 2: Foundational UI Spec (Blocking Prerequisites)

**Purpose**: Lock the UI/tooling contract before implementation tasks begin.

**⚠️ CRITICAL**: No Storybook implementation work should begin until this phase is complete.

- [x] T005 Define the Storybook surface requirements and scope in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/spec.md`
- [x] T006 [P] Create the required wireframe spec in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/wireframe.md`
- [x] T007 [P] Capture the clarified Vite-based framework decision and implementation constraints in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/research.md`
- [x] T008 [P] Define the workspace, preview, and story artifact model in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/data-model.md`
- [x] T009 [P] Record the minimum Storybook implementation contract in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/contracts/storybook-foundation-contract.md`
- [x] T010 [P] Produce the implementation plan and validation quickstart in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/plan.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/quickstart.md`

**Checkpoint**: The Storybook foundation contract is clear, the wireframe exists, and implementation can proceed without widening scope.

---

## Phase 3: User Story 1 - Launch a Working Storybook Workspace (Priority: P1) 🎯 MVP

**Goal**: Add a runnable Storybook 8 workspace to `apps/web` using the Vite-based Next.js framework.

**Independent Test**: Run the Storybook dev script for `apps/web` and confirm the workspace boots successfully with no framework, alias, or CSS import errors.

### Implementation for User Story 1

- [ ] T011 [US1] Add the package-scoped Storybook dependencies and scripts in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json`
- [ ] T012 [US1] Create the Storybook framework configuration in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/.storybook/main.ts`
- [ ] T013 [US1] Verify Storybook story discovery and alias compatibility for `apps/web` inside `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/.storybook/main.ts`

**Checkpoint**: `apps/web` can declare and boot a package-scoped Storybook workspace.

---

## Phase 4: User Story 2 - Reuse Crown Theme Context In Preview (Priority: P2)

**Goal**: Make Storybook previews render with Crown styling and the shared platform theme provider.

**Independent Test**: Open a story in Storybook and confirm the preview uses `globals.css`, the Crown font/token baseline, and the `PlatformThemeProvider`.

### Component / Storybook Implementation for User Story 2

- [ ] T014 [US2] Create the shared preview configuration in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/.storybook/preview.ts`
- [ ] T015 [US2] Add the Crown preview decorator in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/.storybook/preview.ts` using `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/platform-theme-provider.tsx`
- [ ] T016 [US2] Ensure the preview imports `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css` and defaults to a stable light-theme baseline

**Checkpoint**: Any Storybook story renders inside the same styling and theme context expected by the app.

---

## Phase 5: User Story 3 - Use a Starter Story As the Team Reference (Priority: P3)

**Goal**: Seed the new workspace with a colocated `Button` story that future reusable components can follow.

**Independent Test**: Open `UI/Button` in Storybook and confirm it renders the existing reusable `Button` primitive successfully.

### Component / Storybook Implementation for User Story 3

- [ ] T017 [US3] Create the starter story in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/ui/button.stories.tsx`
- [ ] T018 [US3] Configure the starter story metadata, args, and baseline example in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/ui/button.stories.tsx`
- [ ] T019 [US3] Confirm the story placement and title align with the reusable-component Storybook conventions defined for `apps/web`

**Checkpoint**: The repo has a working local template for future reusable component stories.

---

## Phase 6: Workspace Assembly & Validation

**Purpose**: Validate the full Storybook foundation as an implementation-ready tooling surface.

- [ ] T020 [P] Run `pnpm --filter @crown/web run typecheck` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T021 [P] Run `pnpm --filter @crown/web run storybook -- --smoke-test` or an equivalent non-interactive startup validation from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T022 [P] Run `pnpm --filter @crown/web run storybook:build` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T023 Review implementation against `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/wireframe.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/contracts/storybook-foundation-contract.md`
- [ ] T024 Mark completed tasks, commit the implementation, push the branch, and prepare the PR with links to `spec.md`, `plan.md`, `tasks.md`, and `wireframe.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Completed and has no remaining blockers.
- **Foundational UI Spec (Phase 2)**: Completed and blocks all implementation until finished.
- **User Story 1 (Phase 3)**: Starts first because the workspace must exist before preview and starter story work.
- **User Story 2 (Phase 4)**: Depends on User Story 1 because preview config lives inside the Storybook workspace.
- **User Story 3 (Phase 5)**: Depends on User Story 1 and should use the preview baseline from User Story 2.
- **Workspace Assembly & Validation (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No user-story dependencies beyond the completed spec/plan artifacts.
- **User Story 2 (P2)**: Depends on Storybook workspace creation from User Story 1.
- **User Story 3 (P3)**: Depends on the Storybook workspace and should render through the shared preview setup.

### Parallel Opportunities

- Phase 1 review tasks were parallelizable and are complete.
- Phase 2 planning artifacts were parallelizable and are complete.
- Phase 6 validation tasks `T020`, `T021`, and `T022` can run in parallel once implementation is done.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Add package scripts and dependencies.
2. Create `.storybook/main.ts`.
3. Verify Storybook can boot with the package-scoped workspace.

### Incremental Delivery

1. Complete the Storybook workspace foundation.
2. Add the Crown preview decorator and shared styles.
3. Add the starter `Button` story.
4. Run typecheck, Storybook startup validation, and static build validation.

## Notes

- This tooling story has no page assembly task because it does not ship a route-level UI surface; the equivalent assembly work is Storybook workspace wiring and preview validation.
- No API tasks are required because the feature does not add or modify backend behavior.
