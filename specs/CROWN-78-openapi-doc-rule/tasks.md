# Tasks: Require OpenAPI Document Updates For API Route Changes

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-78-openapi-doc-rule/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: This story is process/documentation work, so focused validation of the touched files plus any lightweight repo checks is sufficient.

**Organization**: Tasks are grouped by user story to keep the rule additions traceable across agent guidance, governance, and workflow documentation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current guidance surfaces and the manual OpenAPI source they need to reference

- [ ] T001 Review the current guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/engineering-constitution.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md`
- [ ] T002 [P] Review the current manual OpenAPI source in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts` so the new rule describes the existing workflow accurately

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the consistent wording for the OpenAPI maintenance rule before editing the three guidance surfaces

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Define the canonical rule wording for created, changed, and deleted API routes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-78-openapi-doc-rule/contracts/openapi-doc-rule-contract.md`
- [ ] T004 [P] Confirm the wording reflects the current manual `apps/api/src/docs/openapi.ts` source-of-truth model in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-78-openapi-doc-rule/research.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-78-openapi-doc-rule/data-model.md`

**Checkpoint**: The rule wording is consistent and ready to apply across repo guidance files

---

## Phase 3: User Story 1 - AI Agents Follow The OpenAPI Update Rule For API Work (Priority: P1) 🎯 MVP

**Goal**: AI-agent instructions explicitly require updating `apps/api/src/docs/openapi.ts` whenever API routes are created, materially changed, or removed

**Independent Test**: Read `AGENTS.md` and confirm it clearly instructs agents to update `apps/api/src/docs/openapi.ts` for those three API route change cases

### Implementation for User Story 1

- [ ] T005 [US1] Add the OpenAPI maintenance rule to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`
- [ ] T006 [US1] Keep the wording operational and specific to API route work without implying automatic OpenAPI generation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`

**Checkpoint**: Agent guidance explicitly covers the OpenAPI update obligation

---

## Phase 4: User Story 2 - Engineers See The Rule In Governance And Planning Sources (Priority: P2)

**Goal**: The same OpenAPI maintenance rule is discoverable in governance and Spec Kit workflow guidance

**Independent Test**: Read the constitution and Spec Kit workflow docs and confirm both mention keeping `apps/api/src/docs/openapi.ts` aligned when API routes change

### Implementation for User Story 2

- [ ] T007 [US2] Add the OpenAPI maintenance rule to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/engineering-constitution.md`
- [ ] T008 [US2] Add the OpenAPI maintenance rule to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md`
- [ ] T009 [US2] Ensure the wording in those files stays consistent with `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md` and the planning contract

**Checkpoint**: Governance and planning guidance both reinforce the rule

---

## Phase 5: User Story 3 - Validate The Guidance Without Widening Into Automation (Priority: P3)

**Goal**: The story lands as a documentation/process improvement with focused validation only

**Independent Test**: Review the touched files and validation outputs to confirm the story remains limited to guidance updates and does not introduce unrelated enforcement tooling

### Tests for User Story 3

- [ ] T010 [P] [US3] Perform a focused review of `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/AGENTS.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/engineering-constitution.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/process/spec-kit-workflow.md` for consistency

### Implementation for User Story 3

- [ ] T011 [US3] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-78-openapi-doc-rule/quickstart.md` if implementation wording needs to refine the validation checklist
- [ ] T012 [US3] Keep the story scoped to guidance only and avoid adding automation/enforcement changes outside the three repository guidance files

**Checkpoint**: The rule is validated and remains process-only

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run final verification, confirm worktree cleanliness, and prepare the PR

- [ ] T013 [P] Run any lightweight verification needed for the touched documentation/process files from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T014 [P] Run `pnpm --filter @crown/api exec tsc -p tsconfig.typecheck.json --noEmit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app` if a final repo check is needed
- [ ] T015 Create the PR for `feat/CROWN-78-openapi-doc-rule` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-78-openapi-doc-rule/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-78-openapi-doc-rule/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-78-openapi-doc-rule/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and should align with the wording established in US1
- **User Story 3 (P3)**: Starts after Foundational and validates the combined output of US1 and US2

### Within Each User Story

- Finalize the rule wording before editing repo guidance files
- Update `AGENTS.md` before aligning the broader governance/workflow docs
- Perform focused validation after all three guidance files are updated

### Parallel Opportunities

- `T001` and `T002` can run in parallel
- `T003` and `T004` can run in parallel once the story framing is confirmed
- `T013` and `T014` can run in parallel during final verification

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Confirm `AGENTS.md` makes the OpenAPI rule explicit before widening to governance/workflow docs

### Incremental Delivery

1. Define the rule wording clearly
2. Add it to `AGENTS.md`
3. Add it to the constitution and Spec Kit workflow docs
4. Run focused validation and prepare the PR

---

## Notes

- `[P]` tasks are split across isolated review/validation surfaces
- This story intentionally stops short of CI or lint enforcement
