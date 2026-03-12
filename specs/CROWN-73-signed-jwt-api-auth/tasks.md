# Tasks: Signed JWT Issuance And Verification For API Auth

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-73-signed-jwt-api-auth/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused auth contract and integration tasks are included because this story changes the runtime login and protected-route authentication behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current placeholder token issuance, middleware decode path, and test fixture surfaces that `CROWN-73` will replace

- [ ] T001 Review the current placeholder token issuance and auth route behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/auth.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/default-auth-service.ts`
- [ ] T002 [P] Review the current decode-only middleware path in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/middleware/authenticate.ts`
- [ ] T003 [P] Review auth token helpers and coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/auth-fixtures.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/auth-routes.contract.spec.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared JWT sign/verify support used by login, middleware, and tests

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add a shared access-token sign/verify helper in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/`
- [ ] T005 [P] Add any required JWT library dependency in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json` and update the lockfile
- [ ] T006 [P] Align access-token environment/config helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/config/env.ts` and related auth support modules

**Checkpoint**: Shared signed JWT helpers and config are available for route and middleware integration

---

## Phase 3: User Story 1 - Issue Signed Access Tokens On Login (Priority: P1) 🎯 MVP

**Goal**: Successful login returns a signed JWT instead of the placeholder `alg: none` token

**Independent Test**: A reviewer can log in successfully and verify the returned token is a signed JWT while the existing `claims` and `current_user` contract remains intact

### Tests for User Story 1

- [ ] T007 [P] [US1] Update login contract coverage for signed-token issuance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/auth-routes.contract.spec.ts`
- [ ] T008 [P] [US1] Add or extend integration coverage for login token generation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`

### Implementation for User Story 1

- [ ] T009 [US1] Replace placeholder token creation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/auth.ts`
- [ ] T010 [US1] Keep the access-token response contract aligned in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/contracts.ts` and related auth modules if needed

**Checkpoint**: Login returns signed access tokens without changing the documented auth response surface beyond token integrity

---

## Phase 4: User Story 2 - Verify JWT Signatures On Protected Routes (Priority: P2)

**Goal**: Protected routes accept only valid signed tokens and reject malformed, tampered, and expired tokens consistently

**Independent Test**: A reviewer can call protected routes with valid, tampered, malformed, and expired tokens and verify only the valid signed token is accepted

### Tests for User Story 2

- [ ] T011 [P] [US2] Extend authenticated-route contract coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/auth-routes.contract.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/platform-auth.contract.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/tenant-admin-auth.contract.spec.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/tenant-user-auth.contract.spec.ts`
- [ ] T012 [P] [US2] Extend middleware integration coverage for malformed, expired, and tampered tokens in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/authenticate.middleware.spec.ts`

### Implementation for User Story 2

- [ ] T013 [US2] Replace decode-only auth handling with verified JWT parsing in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/middleware/authenticate.ts`
- [ ] T014 [US2] Keep verified claims aligned with `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/claims.ts` and the existing current-user resolution flow

**Checkpoint**: Middleware verifies signed JWTs before authenticated claims are trusted

---

## Phase 5: User Story 3 - Define The Signing Configuration Surface Clearly (Priority: P3)

**Goal**: The signed JWT implementation uses a clear repository-supported configuration surface and test helpers reflect that same path

**Independent Test**: A reviewer can inspect config and test helpers and verify the signed-token flow uses the defined secret-backed configuration without widening into refresh-session scope

### Tests for User Story 3

- [ ] T015 [P] [US3] Update auth test helpers to create valid signed tokens in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/auth-fixtures.ts`
- [ ] T016 [P] [US3] Add targeted assertions for invalid-signature or wrong-secret failures in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/authenticate.middleware.spec.ts` or adjacent auth integration specs

### Implementation for User Story 3

- [ ] T017 [US3] Align JWT secret usage and any needed auth comments or quickstart notes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/config/env.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-73-signed-jwt-api-auth/quickstart.md`
- [ ] T018 [US3] Ensure refresh-session persistence remains untouched while removing placeholder token assumptions from auth helpers and fixtures

**Checkpoint**: Configuration and tests both reflect the signed JWT path cleanly

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the full verification loop and prepare the branch for PR creation

- [ ] T019 [P] Run focused auth tests during implementation using `pnpm --filter @crown/api exec vitest run ...` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T020 Run the full API suite with `pnpm --filter @crown/api test` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`, fix any failures, and repeat until it passes
- [ ] T021 Run `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T022 Create the PR for `feat/CROWN-73-signed-jwt-api-auth` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-73-signed-jwt-api-auth/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-73-signed-jwt-api-auth/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-73-signed-jwt-api-auth/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and builds on the shared sign/verify helper from US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the shared config and test-helper direction established by US1 and US2

### Within Each User Story

- Update or add auth tests before finalizing the runtime changes they validate
- Shared JWT helper before route and middleware adoption
- Middleware verification before broader protected-route validation

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T005` and `T006` can run in parallel after `T004`
- `T007` and `T008` can run in parallel
- `T011` and `T012` can run in parallel
- `T015` and `T016` can run in parallel

---

## Parallel Example: User Story 2

```bash
# Validate protected-route signed-token behavior from both angles in parallel:
Task: "Extend authenticated-route contract coverage in apps/api/tests/contract/auth-routes.contract.spec.ts, apps/api/tests/contract/platform-auth.contract.spec.ts, apps/api/tests/contract/tenant-admin-auth.contract.spec.ts, and apps/api/tests/contract/tenant-user-auth.contract.spec.ts"
Task: "Extend middleware integration coverage for malformed, expired, and tampered tokens in apps/api/tests/integration/authenticate.middleware.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate signed login token issuance before widening into middleware changes

### Incremental Delivery

1. Introduce shared sign/verify support
2. Replace placeholder login token generation
3. Replace decode-only middleware trust with verified claims
4. Align config and test helpers
5. Finish with full API and workflow verification

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `T020` is the explicit full-suite verification loop
- The branch must not widen into refresh-token persistence, cookie transport, or broader auth-session redesign
