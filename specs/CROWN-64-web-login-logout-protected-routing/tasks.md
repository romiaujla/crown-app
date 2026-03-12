# Tasks: Web Login, Logout, and Protected-Route Handling

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-64-web-login-logout-protected-routing/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused Playwright coverage and web typecheck tasks are included because this story adds user-visible auth routing behavior that must be verified end to end.

**Organization**: Tasks are grouped by user story to preserve independent implementation and testing of login, protected-route restoration, and logout/session-expiry handling.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Context)

**Purpose**: Confirm the current `apps/web` shell surface and the `CROWN-61` auth contract before restructuring routes

- [ ] T001 Review the current web entry shell in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/layout.tsx`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css`
- [ ] T002 [P] Review the consumed auth route and current-user contract in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/auth.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/contracts.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/service.ts`
- [ ] T003 [P] Review current browser-level coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/playwright.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared client auth and route-decision primitives used by all stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add shared auth client types and API helpers for login, logout, and current-user resolution in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/`
- [ ] T005 [P] Add browser session-storage helpers for access-token persistence, auth reset, and return-path capture in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/`
- [ ] T006 [P] Add shared route-classification and safe-destination helpers for platform, tenant, login, and unauthorized paths in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/routing/`
- [ ] T007 Add the shared auth bootstrap/provider or equivalent client-state wrapper in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/layout.tsx` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/`

**Checkpoint**: Shared client auth state, session persistence, and routing helpers are ready for story-specific pages

---

## Phase 3: User Story 1 - Sign in and land in the correct shell (Priority: P1) 🎯 MVP

**Goal**: Deliver the shared login page and initial post-login routing into the API-recommended shell

**Independent Test**: A reviewer can sign in from `/login` with valid and invalid credentials and verify the app stores the token in `sessionStorage`, shows auth errors on failure, and routes super-admin versus tenant personas into the correct shell

### Tests for User Story 1

- [ ] T008 [P] [US1] Add Playwright coverage for login-page validation, invalid credentials, and successful login routing in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`
- [ ] T009 [P] [US1] Update or replace the current smoke coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/smoke.spec.ts` so it reflects route-based authenticated entry instead of the old `?role=` demo

### Implementation for User Story 1

- [ ] T010 [US1] Implement the shared login page and form state in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/login/page.tsx` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/login-form.tsx`
- [ ] T011 [US1] Wire login submission to the API auth client and `sessionStorage` persistence in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/login-form.tsx`
- [ ] T012 [US1] Replace the current root entry behavior so `/` routes users into `/login`, `/platform`, or `/tenant` based on resolved auth state in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/page.tsx`
- [ ] T013 [US1] Split the existing shell presentation into route-specific platform and tenant entry pages in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/tenant/page.tsx`

**Checkpoint**: Users can authenticate from one login page and land in the correct platform or tenant shell

---

## Phase 4: User Story 2 - Restore or correct protected navigation (Priority: P2)

**Goal**: Ensure protected routes redirect unauthenticated users to login, restore only valid return paths, and correct wrong-shell navigation safely

**Independent Test**: A reviewer can request protected platform and tenant routes while signed out, then verify post-login restoration succeeds only for valid destinations and otherwise falls back to the safe recommended destination or unauthorized state

### Tests for User Story 2

- [ ] T014 [P] [US2] Extend Playwright coverage for protected-route redirect, return-path restoration, and wrong-shell correction in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`
- [ ] T015 [P] [US2] Add browser-level coverage for unsupported or blocked routing outcomes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 2

- [ ] T016 [US2] Add protected-route gating for `/platform` and `/tenant` using the shared auth bootstrap and route-decision helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/tenant/page.tsx`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/routing/`
- [ ] T017 [US2] Implement return-path capture, validation, and restoration in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/login/page.tsx`
- [ ] T018 [US2] Add explicit unauthorized or access-denied presentation for unrecoverable route states in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/unauthorized/page.tsx`
- [ ] T019 [US2] Update shared shell styling and navigation affordances for the new route structure in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/globals.css`

**Checkpoint**: Protected routes, return-path restoration, and wrong-shell correction behave deterministically

---

## Phase 5: User Story 3 - Exit cleanly and recover from lost sessions (Priority: P3)

**Goal**: Clear client auth state on logout and redirect invalid or expired sessions back to login with a clear recovery message

**Independent Test**: A reviewer can log out from either shell and simulate an invalid token during protected bootstrap to verify that the app clears `sessionStorage`, returns to `/login`, and shows the session-expired message when appropriate

### Tests for User Story 3

- [ ] T020 [P] [US3] Extend Playwright coverage for logout behavior and expired-session fallback in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 3

- [ ] T021 [US3] Add shared logout action and shell-level logout affordances in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/tenant/page.tsx`
- [ ] T022 [US3] Implement invalid-session detection during auth bootstrap and protected-route resolution in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/login/page.tsx`
- [ ] T023 [US3] Surface login-page session-expired messaging and final auth-reset behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/login/page.tsx` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/login-form.tsx`

**Checkpoint**: Logout and lost-session recovery return the browser to a clean login state

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the requested validation loop and finalize any supporting documentation touched during implementation

- [ ] T024 [P] Update any web setup or auth-flow notes changed by implementation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-64-web-login-logout-protected-routing/quickstart.md` and related web docs if touched
- [ ] T025 [P] Run `pnpm --filter @crown/web typecheck` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T026 Run focused Playwright coverage for `CROWN-64` using `pnpm --filter @crown/web exec playwright test tests/auth-flow.spec.ts --config=playwright.config.ts` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T027 Run the broader web smoke suite with `pnpm --filter @crown/web test` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`, fix failures, and repeat until it passes or an environment blocker is documented
- [ ] T028 Create the PR for `feat/CROWN-64-web-login-logout-protected-routing` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-64-web-login-logout-protected-routing/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-64-web-login-logout-protected-routing/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-64-web-login-logout-protected-routing/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; establishes the login route, token storage, and route-specific shell entry pages
- **User Story 2 (P2)**: Starts after Foundational and builds on the authenticated state and route surfaces from US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the shared auth state and route guards delivered in US1 and US2

### Within Each User Story

- Add or update browser assertions before finalizing the route behavior they verify
- Shared auth/routing helpers before page-level redirect wiring
- Route behavior before broader smoke validation

### Parallel Opportunities

- `T001`, `T002`, and `T003` can run in parallel
- `T005` and `T006` can run in parallel after `T004`
- `T008` and `T009` can run in parallel
- `T014` and `T015` can run in parallel
- `T024` and `T025` can run in parallel while preparing final validation

---

## Parallel Example: User Story 1

```bash
# Validate both login-path behaviors in parallel:
Task: "Add Playwright coverage for login-page validation, invalid credentials, and successful login routing in apps/web/tests/auth-flow.spec.ts"
Task: "Update or replace the current smoke coverage in apps/web/tests/smoke.spec.ts so it reflects route-based authenticated entry instead of the old ?role= demo"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate that a shared login page routes supported personas into the correct shell before widening scope

### Incremental Delivery

1. Establish the shared client auth/session primitives
2. Deliver the shared login page and route-specific shell entry
3. Deliver protected-route restoration and wrong-shell correction
4. Deliver logout and expired-session recovery
5. Finish with typecheck, Playwright validation, and PR preparation

### Stacked Branch Strategy

1. Keep `CROWN-64` scoped to `apps/web` auth UX on top of the existing `CROWN-61` API contract
2. If `CROWN-61` is not yet merged to `main`, keep any temporary dependency assumptions documented and preserve `CROWN-64` commits as web-only where possible
3. Retarget the eventual PR base only if the auth API dependency requires it

---

## Notes

- `[P]` tasks are split across isolated validation or code surfaces
- `T027` captures the broader web-suite pass/fix loop expected before final handoff
- The old query-param role demo in `apps/web/app/page.tsx` should not survive once route-based auth entry is in place
