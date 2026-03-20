# Tasks: HTTP-Only Cookie Auth Transport

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/specs/CROWN-88-http-only-cookie-auth-transport/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories)

**Tests**: Focused API contract/integration coverage, focused web/browser auth-flow coverage, and `pnpm specify.audit` are required because this task changes auth transport, session semantics, and API documentation.

**Organization**: Tasks are grouped by shared foundation plus user story so cookie auth transport, CSRF/CORS handling, and cross-tab session behavior can be implemented and validated incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Context)

**Purpose**: Confirm the current bearer-token transport seams that `CROWN-88` replaces in both the API and web workspaces.

- [ ] T001 Review the current web token-storage and bootstrap behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/lib/auth/storage.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/lib/auth/api.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/components/auth/auth-provider.tsx`
- [ ] T002 [P] Review the current API login, logout, and authenticated middleware behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/routes/auth.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/middleware/authenticate.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/app.ts`
- [ ] T003 [P] Review the current auth docs and browser coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/docs/openapi.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/tests/auth-flow.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared cookie, credential, and CSRF infrastructure before user-story-specific behavior is implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Add API auth-cookie configuration and helper utilities in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/auth/`
- [ ] T005 [P] Add CSRF-token generation and verification helpers for authenticated state-changing requests in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/auth/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/middleware/`
- [ ] T006 [P] Replace default permissive CORS usage with explicit credentialed-origin configuration in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/app.ts`
- [ ] T007 [P] Refactor the web auth request helper in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/lib/auth/api.ts` so browser requests can send `credentials: 'include'` and CSRF headers without depending on a stored bearer token

**Checkpoint**: The repo has the shared API/web transport primitives needed for cookie-backed browser auth.

---

## Phase 3: User Story 1 - Sign In Once And Restore Auth Across Tabs (Priority: P1) 🎯 MVP

**Goal**: Users can sign in with a cookie-backed browser session, reload or open a new tab, and restore the correct authenticated shell without `sessionStorage`.

**Independent Test**: Sign in from `/login`, open a second tab in the same browser session, and confirm the second tab resolves the authenticated shell without any stored browser token.

### Tests for User Story 1

- [ ] T008 [P] [US1] Update API auth-route tests for cookie-based login and current-user bootstrap in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/tests/contract/auth-routes.contract.spec.ts`
- [ ] T009 [P] [US1] Update browser auth-flow coverage for login, reload, and new-tab restoration without `sessionStorage` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 1

- [ ] T010 [US1] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/routes/auth.ts` so login sets the auth cookie and returns only the browser-safe auth/session payload required by the web client
- [ ] T011 [US1] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/middleware/authenticate.ts` so authenticated web requests can resolve auth from the cookie transport
- [ ] T012 [US1] Remove access-token persistence from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/lib/auth/storage.ts` and adjust dependent auth helpers accordingly
- [ ] T013 [US1] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/components/auth/auth-provider.tsx` so bootstrap and sign-in resolve authenticated state from the cookie-backed current-user flow

**Checkpoint**: New tabs and reloads can restore the same browser session without JavaScript-readable token storage.

---

## Phase 4: User Story 2 - Send Authenticated Requests Safely With Cookie Transport (Priority: P2)

**Goal**: Protected requests and logout work through cookie transport with enforced CSRF protection for state-changing requests.

**Independent Test**: Perform authenticated reads and writes from the web app, confirm protected calls succeed without bearer headers, and confirm logout clears the browser session.

### Tests for User Story 2

- [ ] T014 [P] [US2] Add API coverage for CSRF enforcement and cookie-clearing logout behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/tests/contract/auth-routes.contract.spec.ts` and related auth integration specs
- [ ] T015 [P] [US2] Update browser auth-flow coverage for cookie-backed protected requests and logout behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 2

- [ ] T016 [US2] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/lib/auth/api.ts` so protected reads and writes use credentialed requests and include the CSRF header where required
- [ ] T017 [US2] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/routes/auth.ts` so logout actively clears the auth cookie and related CSRF state
- [ ] T018 [US2] Update authenticated route surfaces in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/routes/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/middleware/` so the chosen CSRF strategy is consistently applied to state-changing web requests

**Checkpoint**: The web app authenticates through cookies end-to-end and no longer relies on bearer headers assembled from client-side storage.

---

## Phase 5: User Story 3 - Preserve Clear Session Semantics And Local Development Guidance (Priority: P3)

**Goal**: Cross-tab convergence, expiry handling, OpenAPI docs, and local-development guidance all match the new cookie transport.

**Independent Test**: Verify session expiry/logout recovery in multiple tabs, then review the docs and OpenAPI output for the updated auth model.

### Tests for User Story 3

- [ ] T019 [P] [US3] Add browser coverage for cross-tab logout or revalidation convergence in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/tests/auth-flow.spec.ts`
- [ ] T020 [P] [US3] Add API/web coverage for the replacement session-expiry behavior in the relevant auth test suites under `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/tests/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/tests/`

### Implementation for User Story 3

- [ ] T021 [US3] Replace client-side JWT-expiry parsing in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/components/auth/auth-provider.tsx` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/lib/auth/` with the documented server-compatible session-state strategy
- [ ] T022 [US3] Add cross-tab auth revalidation or broadcast behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web/components/auth/`
- [ ] T023 [US3] Update `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src/docs/openapi.ts` so login, current-user, logout, and auth security guidance reflect cookie-based web auth transport
- [ ] T024 [US3] Update local development and auth-transport guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/README.md` and any affected process or setup docs

**Checkpoint**: Developers and reviewers can understand the new cookie/CORS/CSRF/session model directly from the repo, and open tabs converge safely after auth changes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run required validation, verify scope discipline, and prepare the branch for implementation handoff or PR creation.

- [ ] T025 [P] Run focused API tests for the auth transport changes from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api`
- [ ] T026 [P] Run focused web/browser validation for the auth transport changes from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web`
- [ ] T027 Run `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app`
- [ ] T028 Review the final behavior and docs against `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/specs/CROWN-88-http-only-cookie-auth-transport/spec.md`
- [ ] T029 Create the PR for `chore/CROWN-88-http-only-cookie-auth-transport` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/specs/CROWN-88-http-only-cookie-auth-transport/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/specs/CROWN-88-http-only-cookie-auth-transport/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/specs/CROWN-88-http-only-cookie-auth-transport/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after the cookie/CORS/CSRF foundation exists and is the MVP slice
- **User Story 2 (P2)**: Depends on the cookie-backed login/bootstrap from User Story 1
- **User Story 3 (P3)**: Depends on the runtime transport from User Story 2 so expiry, docs, and cross-tab semantics can be finalized accurately

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T005`, `T006`, and `T007` can run in parallel
- `T008` and `T009` can run in parallel
- `T014` and `T015` can run in parallel
- `T019` and `T020` can run in parallel
- `T025` and `T026` can run in parallel

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Stop storing the token in browser storage
2. Set the auth cookie on login
3. Bootstrap auth state from `/api/v1/auth/me` with credentials included
4. Confirm new-tab restoration works

### Incremental Delivery

1. Land the cookie/CORS/CSRF foundation
2. Move login/bootstrap to cookie auth
3. Convert protected requests and logout
4. Finalize expiry handling, cross-tab convergence, and docs

## Notes

- The main implementation hotspots are `/apps/api/src/routes/auth.ts`, `/apps/api/src/middleware/authenticate.ts`, `/apps/api/src/app.ts`, `/apps/web/lib/auth/api.ts`, `/apps/web/components/auth/auth-provider.tsx`, and `/apps/web/tests/auth-flow.spec.ts`
- If the work starts expanding into refresh tokens, account recovery, or profile management, that scope should move to follow-up Jira issues instead of widening `CROWN-88`
