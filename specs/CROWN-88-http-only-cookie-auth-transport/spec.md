# Feature Specification: HTTP-Only Cookie Auth Transport

**Feature Branch**: `chore/CROWN-88-http-only-cookie-auth-transport`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: Jira issue `CROWN-88` - "Define and deliver a migration path from browser token storage to httpOnly cookie-based auth"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Sign In Once And Restore Auth Across Tabs (Priority: P1)

As a Crown user, I want authentication to be established with an `httpOnly` cookie so that a new tab in the same browser can restore my signed-in session without copying a token through `sessionStorage`.

**Why this priority**: Shared browser-session behavior is the primary product reason for this tech-debt task. If new tabs still depend on JavaScript-readable token storage, the migration does not meet the Jira goal.

**Independent Test**: Sign in from `apps/web`, open a second tab in the same browser profile, and verify the second tab can bootstrap the current user and reach the correct protected shell without any browser token being stored in `sessionStorage`.

**Acceptance Scenarios**:

1. **Given** valid credentials are submitted on the shared login page, **When** the API login request succeeds, **Then** the API sets the authenticated browser session through an `httpOnly` cookie rather than returning a JavaScript-managed access token for the web app to store.
2. **Given** a user is already authenticated in one browser tab, **When** they open a new tab to a protected Crown route in the same browser session, **Then** the app restores the authenticated user context from the cookie-backed session and routes them into the correct shell.
3. **Given** the current web auth bootstrap runs after a reload or fresh tab open, **When** the app resolves the current user, **Then** no access token is read from `sessionStorage` or other JavaScript-readable browser storage.

---

### User Story 2 - Send Authenticated Requests Safely With Cookie Transport (Priority: P2)

As a Crown developer, I want authenticated API requests and logout behavior to work through cookie transport with an explicit CSRF strategy so that web auth no longer depends on bearer headers assembled in client code.

**Why this priority**: The migration is incomplete if login sets a cookie but the rest of the web app still depends on manually attaching bearer tokens or leaves CSRF implications undefined.

**Independent Test**: Verify that protected API calls from `apps/web` succeed with `credentials: 'include'`, that state-changing requests enforce the documented CSRF protection strategy, and that logout clears the browser session cookie and denies subsequent protected requests.

**Acceptance Scenarios**:

1. **Given** a signed-in browser session exists, **When** the web app calls protected API routes, **Then** requests succeed through cookie transport without constructing an `Authorization: Bearer ...` header in client code.
2. **Given** the app makes a state-changing authenticated request, **When** the request is processed by the API, **Then** the request must satisfy the chosen CSRF protection strategy for the cookie model.
3. **Given** the app calls logout from an authenticated tab, **When** the request succeeds, **Then** the API clears the auth cookie and the web app transitions back to a signed-out state.
4. **Given** the browser session has been cleared by logout or expiry, **When** the app makes another protected request, **Then** the request is rejected as unauthenticated and the UI falls back to the login recovery flow.

---

### User Story 3 - Preserve Clear Session Semantics And Local Development Guidance (Priority: P3)

As a Crown maintainer, I want the cookie-based auth model to define cross-origin transport, cross-tab behavior, expiry handling, and local-development setup clearly so that the new auth transport is secure and repeatable rather than implicit.

**Why this priority**: Cookie auth changes runtime and developer expectations. Without explicit decisions for CORS, same-site behavior, CSRF, and session expiry semantics, the implementation will be fragile and hard to operate.

**Independent Test**: Review the implementation and docs, run the local web+api flow, and verify the repository explains the chosen cookie/CORS/CSRF behavior plus the expected sign-in, sign-out, and expiry semantics across browser tabs.

**Acceptance Scenarios**:

1. **Given** the web app and API run on different local origins during development, **When** the browser makes authenticated requests, **Then** the chosen cookie transport and CORS configuration are documented and work in local development.
2. **Given** the current web auth provider can no longer decode a JWT from browser storage, **When** session expiry or logout state must be reflected in the UI, **Then** the implementation uses a documented replacement strategy that does not require JavaScript access to the auth cookie.
3. **Given** one tab signs out or loses its authenticated session, **When** another tab becomes active or revalidates auth state, **Then** the app converges to the same signed-out result without requiring manual storage cleanup of a token.
4. **Given** the story is reviewed for scope, **When** the changed docs and code are inspected, **Then** the work remains limited to auth transport, session semantics, CSRF/CORS handling, and related development guidance rather than widening into account recovery or profile management.

### Edge Cases

- The local web app (`localhost:3000`) and API (`localhost:4000`) are cross-origin but still part of the same local development flow.
- A user logs in on one tab while another tab is already open on `/login` and should revalidate into the correct shell.
- A user logs out on one tab while another tab still holds authenticated in-memory UI state and needs to converge safely.
- Session expiry can no longer be derived by parsing a browser-stored JWT, but the app still needs a clear expired-session recovery path.
- Swagger/OpenAPI examples and tests currently describe bearer-token auth and need to stay aligned with the migrated web auth surface.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The web auth flow MUST stop storing the access token in `sessionStorage` or any other JavaScript-readable browser storage.
- **FR-002**: `POST /api/v1/auth/login` MUST establish the web session with an `httpOnly` auth cookie for browser clients.
- **FR-003**: The browser-oriented login flow MUST NOT expose the access token to `apps/web` JavaScript through a response body that the web app is expected to store.
- **FR-004**: The web app MUST bootstrap authenticated state by calling the current-user endpoint with cookie credentials rather than by reading a stored bearer token.
- **FR-005**: Protected API requests issued by `apps/web` MUST authenticate through cookie transport and MUST stop assembling bearer headers from client-side token storage.
- **FR-006**: The implementation MUST define and enforce the chosen cookie transport model for local and hosted environments, including whether the web and API operate as same-origin or cross-origin participants and what CORS/credential settings are required.
- **FR-007**: The implementation MUST define and enforce a CSRF protection strategy that is compatible with the chosen cookie model for authenticated state-changing requests.
- **FR-008**: `POST /api/v1/auth/logout` MUST clear the auth cookie and the web app MUST transition to a signed-out state without relying on token deletion from browser storage.
- **FR-009**: Opening a new tab in the same browser session MUST allow the app to restore the authenticated session through the cookie-backed bootstrap flow.
- **FR-010**: The migration MUST define the expected cross-tab logout and session-expiry semantics, including how an already-open tab revalidates stale in-memory auth state.
- **FR-011**: The web auth provider MUST replace the current client-side JWT-decoding behavior used for expiry handling with a server-compatible session-state strategy that does not require reading the auth cookie.
- **FR-012**: API and web tests covering login, protected requests, logout, and auth bootstrap MUST be updated to validate the cookie-based transport model.
- **FR-013**: API documentation and repository development guidance MUST be updated to describe the cookie-based auth transport, credentialed requests, and local setup expectations.
- **FR-014**: The implementation MUST remain limited to auth transport, session semantics, CSRF/CORS handling, and related documentation updates.

### Key Entities _(include if feature involves data)_

- **Browser Auth Session**: The authenticated session represented by an `httpOnly` cookie and resolved by the API for web requests.
- **Current User Bootstrap**: The web flow that resolves authenticated user context from the cookie-backed session without reading a token from browser storage.
- **CSRF Session Token**: The non-sensitive request-validation value or mechanism paired with cookie auth to protect state-changing requests.
- **Cross-Tab Auth State**: The in-memory web auth state held by multiple open tabs that must converge after login, logout, or session expiry.
- **Credentialed API Request**: A web request sent with cookie credentials included instead of an explicit bearer token header.

### Assumptions

- `CROWN-64` intentionally introduced `sessionStorage` as a first-pass transport and is the primary behavior this story replaces.
- `CROWN-73` established signed JWT issuance and verification, and this story changes the browser transport of that auth state rather than redesigning principal claims or role routing.
- The current repo does not expose a local `CROWN-66` spec artifact, so this story will rely on the existing auth code, `CROWN-64`, and `CROWN-73` as the nearest in-repo references.
- Crown’s web and API applications may remain separate origins in local development, so the migration must handle credentialed cross-origin requests safely instead of assuming a single origin immediately.
- Refresh-token persistence, account recovery, and profile-management workflows remain out of scope.

### Dependencies

- `CROWN-64` for the current web login, logout, protected-route, and `sessionStorage` behavior being replaced.
- `CROWN-73` for the current signed JWT auth foundation used by the API.
- Existing auth routes, middleware, and OpenAPI docs in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/api/src`.
- Existing web auth provider, auth API client, and browser tests in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/b7bc/crown-app/apps/web`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In browser validation, 100% of tested successful web logins establish an authenticated session without storing an access token in `sessionStorage`.
- **SC-002**: In browser validation, a second tab opened in the same browser session can restore the authenticated user context and reach the correct shell without requiring a copied token.
- **SC-003**: In review and automated validation, `apps/web` no longer builds authenticated API calls from a client-held bearer token for the migrated web auth surface.
- **SC-004**: In review and automated validation, the chosen CORS and CSRF protections are implemented and documented for the cookie-based model.
- **SC-005**: In browser validation, logout clears the cookie-backed session and already-open tabs converge to a signed-out or session-expired state through documented revalidation behavior.
