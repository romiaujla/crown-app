# Tasks: Local API Docs Route With Swagger UI

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-74-api-docs-swagger/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused docs-route contract coverage is included because this story introduces a new runtime endpoint. The user also asked for the standard full verification loop before final handoff.

**Organization**: Tasks are grouped by user story to allow incremental delivery of the docs route and its documented auth-bearing surface.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current auth-bearing route surface and introduce the docs dependencies and module locations

- [ ] T001 Review the existing auth-bearing routes and contracts in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/auth.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/authorization.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/contracts.ts`
- [ ] T002 [P] Add Swagger UI runtime dependencies in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json` and the lockfile as needed
- [ ] T003 [P] Review existing API route coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/` to align the docs surface with already-tested behavior

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared docs document builder and route mounting primitives used by all stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add an OpenAPI document builder for auth-bearing routes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`
- [ ] T005 [P] Add a Swagger UI router or route-mount helper in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/docs.ts`
- [ ] T006 [P] Register the docs route in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/app.ts` without introducing a separate raw JSON docs endpoint

**Checkpoint**: The app can serve `/api/v1/docs` from a dedicated docs module

---

## Phase 3: User Story 1 - Open A Browser-Friendly Docs Page For Auth Routes (Priority: P1) 🎯 MVP

**Goal**: A developer can open `/api/v1/docs` locally and see Swagger UI for the auth-bearing API surface

**Independent Test**: A reviewer can request `/api/v1/docs` from the app and verify the response serves Swagger UI content successfully

### Tests for User Story 1

- [ ] T007 [P] [US1] Add contract coverage for `GET /api/v1/docs` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/api-docs.contract.spec.ts`
- [ ] T008 [P] [US1] Add integration coverage for the docs route mounting in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/` if route-level assertions need to go beyond the contract test

### Implementation for User Story 1

- [ ] T009 [US1] Implement Swagger UI serving for `/api/v1/docs` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/docs.ts`
- [ ] T010 [US1] Ensure the docs page is local/dev-friendly and additive to the existing app wiring in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/app.ts`

**Checkpoint**: `/api/v1/docs` renders Swagger UI successfully

---

## Phase 4: User Story 2 - Understand Auth Contracts And Bearer Requirements (Priority: P2)

**Goal**: A developer can use the docs page to understand login payloads, current-user responses, and bearer-auth expectations for protected routes

**Independent Test**: A reviewer can inspect the generated OpenAPI document through Swagger UI and verify the documented operations, parameters, security requirements, and key responses are present for each auth-bearing route

### Tests for User Story 2

- [ ] T011 [P] [US2] Extend docs-route coverage to assert the rendered page references the auth-bearing operations documented in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/api-docs.contract.spec.ts`
- [ ] T012 [P] [US2] Add targeted assertions for bearer-auth documentation and key request/response examples in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/` if needed

### Implementation for User Story 2

- [ ] T013 [US2] Document login, current-user, logout, and protected authorization routes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`
- [ ] T014 [US2] Document the platform tenant provisioning route and its auth expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`
- [ ] T015 [US2] Reuse or mirror the existing auth contract field shapes from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/contracts.ts` in the docs document so the examples stay aligned with runtime behavior

**Checkpoint**: The docs page clearly describes request payloads, success responses, and bearer-auth requirements for all auth-bearing routes in scope

---

## Phase 5: User Story 3 - Keep The Docs Route Narrow And Maintainable (Priority: P3)

**Goal**: The docs implementation stays scoped to local/dev-first Swagger UI and avoids widening into a separate public docs surface

**Independent Test**: A reviewer can inspect the implementation and verify the app exposes `/api/v1/docs` only, without a separate public raw OpenAPI JSON endpoint

### Tests for User Story 3

- [ ] T016 [P] [US3] Add or extend assertions ensuring no separate `/api/v1/openapi.json` route is introduced in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/api-docs.contract.spec.ts`

### Implementation for User Story 3

- [ ] T017 [US3] Keep the docs document internal to the Swagger UI route implementation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/docs.ts`
- [ ] T018 [US3] Add succinct implementation notes or module comments only where needed to explain the internal document-serving approach in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`

**Checkpoint**: The implementation stays local/dev-first and does not expose a separate raw spec endpoint

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the requested verification loop, finalize planning references, and prepare the PR

- [ ] T019 [P] Update any plan-phase notes that changed during implementation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-74-api-docs-swagger/quickstart.md` or related artifacts if needed
- [ ] T020 [P] Run focused docs-route checks during implementation using `pnpm --filter @crown/api exec vitest run ...` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T021 Run the full API suite with `pnpm --filter @crown/api test` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`, fix any failures, and repeat until it passes
- [ ] T022 Create the PR for `feat/CROWN-74-api-docs-swagger` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-74-api-docs-swagger/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-74-api-docs-swagger/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-74-api-docs-swagger/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and builds on the docs route/document primitives from US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the internal document-serving approach established by US1 and US2

### Within Each User Story

- Add or adjust route tests before finalizing the runtime behavior they validate
- Build the OpenAPI document before finalizing the docs router
- Wire the docs route in the app before running full API verification

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T005` and `T006` can run in parallel after `T004`
- `T007` and `T008` can run in parallel
- `T011` and `T012` can run in parallel
- `T019` and `T020` can run in parallel while preparing final validation

---

## Parallel Example: User Story 1

```bash
# Validate the docs route from both angles in parallel:
Task: "Add contract coverage for GET /api/v1/docs in apps/api/tests/contract/api-docs.contract.spec.ts"
Task: "Add integration coverage for the docs route mounting in apps/api/tests/integration/ if route-level assertions need to go beyond the contract test"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate that `/api/v1/docs` renders before widening the document content

### Incremental Delivery

1. Add the docs dependencies and document builder
2. Mount Swagger UI at `/api/v1/docs`
3. Fill in the auth-bearing route documentation
4. Confirm the implementation does not expose a separate raw spec endpoint
5. Finish with full API verification and PR creation

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `T021` is the explicit full-suite pass/fix loop requested by the user
- The branch should not widen into hosted docs, public spec publishing, or unrelated API documentation work
