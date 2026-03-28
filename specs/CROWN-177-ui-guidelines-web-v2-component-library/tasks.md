# Tasks: UI Guidelines For Web-v2 Component Library

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-177-ui-guidelines-web-v2-component-library/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: This documentation story relies on document review, formatting integrity, `pnpm specify.audit`, and repository commit-hook validation rather than product runtime tests.

**Organization**: Tasks are grouped by user story so each documentation outcome can be validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing guideline baseline, source references, and artifact scaffolding for `CROWN-177`.

- [ ] T001 Create and review the `CROWN-177` Spec Kit artifacts in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-177-ui-guidelines-web-v2-component-library/`
- [ ] T002 [P] Review the current guideline baseline in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/ui-guidlines.md`
- [ ] T003 [P] Review the UI-agent workflow and table-first design guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/.github/agents/ui-ux.agent.md`
- [ ] T004 [P] Review the current web design-token source in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the shared documentation structure and source-of-truth boundaries before user-story sections are updated.

**⚠️ CRITICAL**: No user story implementation should begin until this phase is complete

- [ ] T005 Define the updated section structure and insertion points for `docs/process/ui-guidlines.md` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-177-ui-guidelines-web-v2-component-library/plan.md`
- [ ] T006 [P] Capture the component catalog, workflow stages, token reference groups, and Rich Table rule set in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-177-ui-guidelines-web-v2-component-library/data-model.md`
- [ ] T007 [P] Capture the required guideline coverage and integrity rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-177-ui-guidelines-web-v2-component-library/contracts/ui-guidelines-update-contract.md`

**Checkpoint**: The guideline update structure and coverage rules are defined clearly enough to implement without widening scope.

---

## Phase 3: User Story 1 - Find Approved Web-v2 UI Patterns Quickly (Priority: P1) 🎯 MVP

**Goal**: Make the UI guideline document function as a reusable component-library catalog for web-v2 contributors.

**Independent Test**: Open `docs/process/ui-guidlines.md` and verify the approved reusable pattern catalog is present and clearly covers Rich Table, Toggle, Multi-toggle, Breadcrumb, Skeleton, and Empty State.

### Implementation for User Story 1

- [ ] T008 [US1] Add a component-library catalog section to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/ui-guidlines.md`
- [ ] T009 [US1] Document approved usage guidance for Rich Table, Toggle, Multi-toggle, Breadcrumb, Skeleton, and Empty State in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/ui-guidlines.md`
- [ ] T010 [US1] Reconcile or reorganize overlapping component guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/ui-guidlines.md` so the new catalog does not duplicate or contradict existing rules

**Checkpoint**: Contributors can identify the approved web-v2 patterns and intended reuse directly from the guideline document.

---

## Phase 4: User Story 2 - Follow A Wireframe-First UI Delivery Workflow (Priority: P2)

**Goal**: Document a durable workflow that routes UI delivery through UI-agent-assisted wireframe/spec definition before implementation.

**Independent Test**: Review `docs/process/ui-guidlines.md` and confirm the workflow clearly states UI agent -> wireframe/spec -> implementation handoff, plus the required outputs for each stage.

### Implementation for User Story 2

- [ ] T011 [US2] Add a wireframe-first workflow section to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/ui-guidlines.md`
- [ ] T012 [US2] Document the required handoff outputs for UI work in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/ui-guidlines.md`, including layout intent, primary action hierarchy, state coverage, accessibility expectations, and responsive behavior
- [ ] T013 [US2] Align the workflow language in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/ui-guidlines.md` with `.github/agents/ui-ux.agent.md` without conflicting with `docs/process/engineering-constitution.md` or the tagged Spec Kit workflow

**Checkpoint**: The guideline document teaches a clear, reusable UI delivery flow instead of leaving design handoff implicit.

---

## Phase 5: User Story 3 - Apply Tokens And Advanced Data Patterns Consistently (Priority: P3)

**Goal**: Extend the guidelines with concrete token references and enterprise data-view rules that keep future web-v2 implementations aligned.

**Independent Test**: Review `docs/process/ui-guidlines.md` and verify it references real CSS variables from `apps/web/app/globals.css`, defines a Rich Table pattern with stateful behavior guidance, and clarifies Skeleton and Empty State expectations for data-driven views.

### Implementation for User Story 3

- [ ] T014 [US3] Add a design-token reference section to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/ui-guidlines.md` using the CSS variable source in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css`
- [ ] T015 [US3] Expand the table guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/ui-guidlines.md` into a Rich Table pattern that covers filters, filter chips, pagination, toolbar or bulk actions, and loading/empty/error states
- [ ] T016 [US3] Extend state-pattern guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/ui-guidlines.md` so Skeleton and Empty State behavior are explicit for both empty-data and filtered-no-results conditions

**Checkpoint**: The guideline document anchors future UI work to real tokens and a concrete table-first pattern system.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the documentation update and prepare the branch for review-safe delivery.

- [ ] T017 [P] Run `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T018 [P] Review `docs/process/ui-guidlines.md` against `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-177-ui-guidelines-web-v2-component-library/spec.md`
- [ ] T019 [P] Review `docs/process/ui-guidlines.md` against `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-177-ui-guidelines-web-v2-component-library/contracts/ui-guidelines-update-contract.md`
- [ ] T020 Mark completed tasks, commit the documentation update, push the branch, and prepare the PR with links to `spec.md`, `plan.md`, and `tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks user-story implementation.
- **User Story Phases (Phase 3+)**: Depend on the foundational structure and coverage rules.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and establishes the reusable component-library catalog.
- **User Story 2 (P2)**: Depends on the document structure from Phase 2 and complements the component catalog with workflow guidance.
- **User Story 3 (P3)**: Depends on the same shared document structure and extends the guidance with tokens plus rich data-view rules.

### Parallel Opportunities

- Phase 1: T002, T003, and T004 can proceed in parallel.
- Phase 2: T006 and T007 can proceed in parallel.
- Phase 6: T017, T018, and T019 can proceed in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Confirm the current guideline baseline and reference sources.
2. Define the updated document structure.
3. Add the reusable component-library catalog and the new component-pattern guidance.
4. Review the document for overlap or contradiction before expanding workflow and token guidance.

### Incremental Delivery

1. Establish the document structure and coverage contract.
2. Deliver the component catalog and reusable pattern definitions.
3. Add the wireframe-first workflow and handoff expectations.
4. Add the token reference and Rich Table/state-pattern guidance.
5. Run the audit and final review before PR preparation.

## Notes

- Keep implementation scoped to `docs/process/ui-guidlines.md` plus supporting `CROWN-177` artifacts.
- Avoid introducing guidance that depends on nonexistent components or token names.
- Preserve the guideline document as a practical UI reference rather than turning it into a second engineering constitution.
