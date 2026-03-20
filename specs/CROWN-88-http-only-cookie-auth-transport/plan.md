# Implementation Plan: HTTP-Only Cookie Auth Transport

**Branch**: `chore/CROWN-88-http-only-cookie-auth-transport` | **Date**: 2026-03-19 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/specs/CROWN-88-http-only-cookie-auth-transport/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/specs/CROWN-88-http-only-cookie-auth-transport/spec.md)
**Input**: Feature specification from `/specs/CROWN-88-http-only-cookie-auth-transport/spec.md`

## Summary

Replace the current browser-managed bearer-token transport with a cookie-backed web auth session. The implementation should let `apps/api` set and clear an `httpOnly` auth cookie, let `apps/web` authenticate through `credentials: 'include'` instead of `sessionStorage`, introduce an explicit CSRF protection model for authenticated state-changing requests, and define how login, logout, expiry, and cross-tab session recovery behave when the token is no longer readable in client JavaScript.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20  
**Primary Dependencies**: Express 4, Next.js 14 App Router, React 18, Zod 4, existing Crown auth routes/middleware, `cors`, `helmet`, Playwright, Vitest  
**Storage**: Browser cookies for web auth session transport; no new database persistence required for this migration phase  
**Testing**: `pnpm --filter @crown/api test`, `pnpm --filter @crown/web test`, focused Playwright auth-flow coverage, and `pnpm specify.audit`  
**Target Platform**: Monorepo web application and Express API in local development and CI  
**Project Type**: Monorepo with `apps/api` and `apps/web`  
**Performance Goals**: Protected-route bootstrap should stay deterministic on first load and on tab refresh without rendering the wrong shell first  
**Constraints**: Remove browser token storage for `apps/web`, keep auth scope limited to transport/session semantics, define a CSRF strategy, document local cross-origin credentials behavior, and preserve existing role-aware shell routing  
**Scale/Scope**: One tech-debt task spanning API auth transport, web auth bootstrap/request plumbing, OpenAPI/docs alignment, and test updates

## Current-State Findings

- `apps/web/lib/auth/storage.ts` stores the access token in `window.sessionStorage`.
- `apps/web/lib/auth/api.ts` builds authenticated requests with `Authorization: Bearer ${accessToken}`.
- `apps/web/components/auth/auth-provider.tsx` decodes JWT expiry from the stored token and uses it for warning/logout timers.
- `apps/api/src/routes/auth.ts` returns `accessToken` in the login response body and treats logout as stateless client cleanup.
- `apps/api/src/middleware/authenticate.ts` only accepts bearer tokens from the `authorization` header.
- `apps/api/src/app.ts` currently uses `cors()` defaults, which is insufficient for credentialed cookie requests.

## Decision Summary

### Decision 1: Use server-set `httpOnly` auth cookies for web login/logout

- The API login route should set an auth cookie instead of requiring the web app to persist a token.
- The logout route should actively clear that cookie.
- The browser-focused auth response may still return current-user/session metadata, but it should stop exposing a token that the web app is expected to store.

### Decision 2: Use credentialed requests plus an explicit origin allowlist

- `apps/web` should send requests with `credentials: 'include'`.
- `apps/api` should move from permissive default CORS to explicit configuration that allows the web origin and `credentials: true`.
- The local default of web on `localhost:3000` and API on `localhost:4000` should be treated as cross-origin but same-site development.

### Decision 3: Add CSRF protection for authenticated state-changing requests

- Because cookies are sent automatically, state-changing authenticated routes need a CSRF defense.
- The preferred implementation path is a double-submit CSRF token: API issues a readable CSRF cookie or bootstrap value, and `apps/web` sends a matching header for authenticated non-GET requests.
- GET/HEAD requests remain read-only and should not require the CSRF header.

### Decision 4: Replace client token parsing with session revalidation and explicit session metadata

- The current web timer decodes JWT expiry from browser storage; that cannot continue with `httpOnly` cookies.
- The migration should either expose non-sensitive expiry metadata from the API bootstrap contract or simplify the warning flow to rely on 401-driven recovery plus active-tab revalidation.
- For `CROWN-88`, the preferred path is to return non-sensitive session metadata needed by the web provider instead of keeping any token-readable shortcut in the browser.

### Decision 5: Define explicit cross-tab convergence behavior

- Cookies naturally support new-tab session restoration, but already-open tabs still hold in-memory auth state.
- The web client should revalidate auth on focus/visibility changes and may also use a `BroadcastChannel` event for logout/login synchronization without sharing sensitive credentials.

## CROWN-88 Implementation Outline

- Add API cookie/session helpers for setting, clearing, and validating the browser auth cookie.
- Update auth middleware to accept the cookie-backed token source for web requests while preserving auth verification logic.
- Add CSRF-token issuance and verification for authenticated state-changing web requests.
- Rework the web auth client so login, bootstrap, protected requests, and logout use credentialed fetch calls rather than token storage and bearer headers.
- Replace the web provider’s token-decoding expiry logic with server-compatible session-state handling.
- Update API OpenAPI docs, web/API tests, and local development guidance to reflect credentialed cookie auth.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Branch naming: PASS. `chore/CROWN-88-http-only-cookie-auth-transport` matches the constitution for a Task.
- Commit/PR convention: PASS. Work on this branch should use `chore: CROWN-88 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-88` is progressing through `specify`, `plan`, and `tasks` before implementation.
- API contract alignment: PASS with required updates. The auth route and session transport surface will change, so `apps/api/src/docs/openapi.ts` must be kept aligned.
- Testing discipline: PASS. The plan includes focused API, web, and browser validation for the changed auth transport.
- Scope control: PASS. The plan stays limited to auth transport, cookie/session behavior, CSRF/CORS, and documentation updates.

Post-design re-check: PASS. The design remains within existing API/web auth surfaces and does not widen into refresh-token persistence, account recovery, or profile management.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-88-http-only-cookie-auth-transport/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── src/
│   ├── app.ts
│   ├── auth/
│   ├── middleware/
│   └── routes/
└── tests/
    ├── contract/
    └── integration/

apps/web/
├── components/
│   └── auth/
├── lib/
│   └── auth/
└── tests/

docs/
└── process/
```

**Structure Decision**: `CROWN-88` spans both `apps/api` and `apps/web` because the transport boundary changes on both sides. The primary implementation hotspots are the API auth routes/middleware/CORS config, the web auth client/provider/storage helpers, the browser auth tests, and any docs that currently describe bearer-token storage for the web flow.

## Validation Strategy

- API contract/integration tests for login, current-user bootstrap, logout, cookie issuance/clearing, and CSRF enforcement.
- Web/browser validation for login, reload, new-tab bootstrap, protected requests, logout, and expired-session recovery.
- Documentation validation through `pnpm specify.audit` plus a manual OpenAPI/doc consistency check.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
