# Tasks: API Auth Foundation For Login And Current User Context

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-61-api-auth-foundation/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused auth contract and integration tasks are included because the story explicitly introduces new API behavior and the user requested end-to-end verification before final handoff.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the auth route, middleware, and current-user surfaces that `CROWN-61` will extend

- [ ] T001 Review existing auth route, token, and principal-resolution code in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/auth.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/app.ts`
- [ ] T002 [P] Review current auth-related contract and integration coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared auth-route and principal-context primitives needed by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Add shared login request validation and authenticated response shaping support in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/contracts.ts` and related auth-support modules
- [ ] T004 [P] Add current-user response shaping and app-target derivation helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/`
- [ ] T005 [P] Align request-authenticated context typing so downstream handlers can consume the resolved principal cleanly in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/types/`

**Checkpoint**: Shared auth request/response and principal-context helpers are ready for story work

---

## Phase 3: User Story 1 - Sign In With Username Or Email (Priority: P1) 🎯 MVP

**Goal**: Deliver credential login that accepts either username or email and returns consistent auth responses

**Independent Test**: A reviewer can call the login endpoint with username/password and email/password for a supported user and verify both produce the same authenticated result, while invalid credentials and disabled accounts return the defined auth errors

### Tests for User Story 1

- [ ] T006 [P] [US1] Add login contract coverage for username, email, invalid credentials, and disabled-account behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/auth-routes.contract.spec.ts`
- [ ] T007 [P] [US1] Add integration coverage for identifier normalization and credential validation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/auth-foundation.spec.ts` or a new auth login integration spec

### Implementation for User Story 1

- [ ] T008 [US1] Implement username-or-email login lookup and password verification in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/identity.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/passwords.ts`, and related auth services
- [ ] T009 [US1] Update the login route behavior and response contract in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/auth.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/contracts.ts`
- [ ] T010 [US1] Ensure seeded auth users and test fixtures remain compatible with the login contract in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/auth-fixtures.ts`

**Checkpoint**: Login works for supported identifiers and returns consistent auth outcomes

---

## Phase 4: User Story 2 - Resolve The Authenticated Principal For The Web App (Priority: P2)

**Goal**: Expose a current-user endpoint that returns principal identity, role context, tenant context when applicable, and target-app guidance

**Independent Test**: A reviewer can call the current-user endpoint with valid tokens for `super_admin`, `tenant_admin`, and `tenant_user` and verify the response includes the correct principal and app-target context

### Tests for User Story 2

- [ ] T011 [P] [US2] Add contract coverage for `GET /api/v1/auth/me` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/auth-routes.contract.spec.ts`
- [ ] T012 [P] [US2] Add integration coverage for current-user principal and tenant-context resolution in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`

### Implementation for User Story 2

- [ ] T013 [US2] Implement current-user response assembly in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/auth.ts`
- [ ] T014 [US2] Extend tenant and role-resolution lookup as needed for current-user payload shaping in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/identity.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/role-resolution.ts`, and related modules
- [ ] T015 [US2] Align auth fixtures and helper claims with the current-user contract in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/auth-fixtures.ts`

**Checkpoint**: Current-user endpoint returns deterministic principal and target-app context for supported personas

---

## Phase 5: User Story 3 - Enforce Protected Access And Stateless Logout Behavior (Priority: P3)

**Goal**: Ensure protected routes resolve principal context consistently and logout remains explicit, stateless, and documented in runtime behavior

**Independent Test**: A reviewer can call protected platform and tenant routes with valid, invalid, and mismatched tokens and verify the shared unauthenticated and forbidden-role behavior, then call logout and verify the stateless success response

### Tests for User Story 3

- [ ] T016 [P] [US3] Extend protected-route contract coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-auth.contract.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/tenant-admin-auth.contract.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/tenant-user-auth.contract.spec.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-tenant-provision.contract.spec.ts`
- [ ] T017 [P] [US3] Extend middleware and RBAC integration coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/authenticate.middleware.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/platform-rbac.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-admin-rbac.spec.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-user-rbac.spec.ts`

### Implementation for User Story 3

- [ ] T018 [US3] Finalize stateless logout behavior and shared auth error responses in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/auth.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/contracts.ts`
- [ ] T019 [US3] Ensure middleware attaches the resolved authenticated principal for downstream handlers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/authorization.ts`
- [ ] T020 [US3] Align route-level forbidden-role handling with the contract expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/authorization.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`

**Checkpoint**: Protected-route auth and stateless logout behavior match the defined contract

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the full requested verification loop and finalize planning references

- [ ] T021 [P] Update any supporting docs or fixture notes that changed during implementation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-61-api-auth-foundation/quickstart.md` and related auth docs if touched
- [ ] T022 [P] Run focused API auth tests during implementation using `pnpm --filter @crown/api exec vitest run ...` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T023 Run the full API suite with `pnpm --filter @crown/api test` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`, fix any failures, and repeat until it passes
- [ ] T024 Create the stacked PR for `feat/CROWN-61-api-auth-foundation` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-61-api-auth-foundation/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-61-api-auth-foundation/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-61-api-auth-foundation/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and builds on the login and principal primitives from US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the shared auth contracts and principal context established by US1 and US2

### Within Each User Story

- Contract and integration assertions should be updated before finalizing the route behavior they validate
- Shared auth helpers before route wiring
- Route behavior before broader protected-route and full-suite validation

### Parallel Opportunities

- `T001` and `T002` can run in parallel
- `T004` and `T005` can run in parallel after `T003`
- `T006` and `T007` can run in parallel
- `T011` and `T012` can run in parallel
- `T016` and `T017` can run in parallel
- `T021` and `T022` can run in parallel while preparing final validation

---

## Parallel Example: User Story 1

```bash
# Validate the login contract from both angles in parallel:
Task: "Add login contract coverage for username, email, invalid credentials, and disabled-account behavior in apps/api/tests/contract/auth-routes.contract.spec.ts"
Task: "Add integration coverage for identifier normalization and credential validation in apps/api/tests/integration/auth-foundation.spec.ts or a new auth login integration spec"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate login with both supported identifier types before widening scope

### Incremental Delivery

1. Finish shared auth-response and principal-context setup
2. Deliver login
3. Deliver current-user
4. Deliver protected-route and logout consistency
5. Finish with full-suite verification and PR creation

### Stacked Branch Strategy

1. Keep `CROWN-61` scoped to API auth behavior that builds on `CROWN-60`
2. Use the `CROWN-60` branch as the likely PR base while `CROWN-60` remains unmerged on `main`
3. Preserve `CROWN-61`-only commits and artifacts so the branch can be retargeted later if needed

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `T023` is the explicit full-suite pass/fix loop requested by the user
- The branch should not introduce refresh-session persistence or server-side logout revocation
