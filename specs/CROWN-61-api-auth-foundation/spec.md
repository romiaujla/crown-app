# Feature Specification: API Auth Foundation For Login And Current User Context

**Feature Branch**: `feat/CROWN-61-api-auth-foundation`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: Jira issue `CROWN-61` - "Define API auth foundation for login, logout, and current-user context"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Sign in with username or email (Priority: P1)

As a Crown user, I need to sign in with either my username or email plus password so the web shells can establish an authenticated session entry point without requiring separate login flows.

**Why this priority**: Without a working credential login contract, the web clients cannot begin any authenticated user journey.

**Independent Test**: A reviewer can submit valid and invalid login identifiers and verify the API authenticates supported users with either username or email while rejecting bad credentials consistently.

**Acceptance Scenarios**:

1. **Given** a supported user exists with a valid password, **When** the user submits a username and password, **Then** the API authenticates the user and returns the documented authenticated response payload.
2. **Given** a supported user exists with a valid password, **When** the user submits an email and password, **Then** the API authenticates the user and returns the same authenticated response contract.
3. **Given** the identifier or password is invalid, **When** the login request is processed, **Then** the API rejects the request with the defined auth error response and does not leak whether the identifier exists.

---

### User Story 2 - Resolve the authenticated principal for the web app (Priority: P2)

As a Crown web shell, I need a current-user API response that describes the authenticated principal, role context, tenant context, and recommended app target so the UI can route users into the correct workspace after sign-in or refresh.

**Why this priority**: Login alone is not enough; the web app needs a consistent way to resolve where the authenticated user belongs and which role context is active.

**Independent Test**: A reviewer can call the authenticated current-user endpoint with valid access tokens for each supported persona and verify the payload includes the role and tenant-routing information needed by the client.

**Acceptance Scenarios**:

1. **Given** a valid `super_admin` access token, **When** the current-user endpoint is called, **Then** the response identifies the principal, indicates platform context, and recommends the control-plane app target.
2. **Given** a valid tenant-scoped access token, **When** the current-user endpoint is called, **Then** the response identifies the principal, includes the active tenant membership context, and recommends the tenant app target.
3. **Given** an invalid or missing access token, **When** the current-user endpoint is called, **Then** the API responds with the defined unauthenticated error contract.

---

### User Story 3 - Enforce protected access and stateless logout behavior (Priority: P3)

As a Crown developer, I need protected-route auth middleware and a stateless logout contract so downstream handlers can trust authenticated context and clients have a clear sign-out behavior without refresh-session persistence.

**Why this priority**: The API auth surface is incomplete unless protected routes can validate tokens consistently and logout semantics are explicit.

**Independent Test**: A reviewer can call protected routes with valid, invalid, and role-mismatched access tokens and verify the middleware resolves principal context correctly while logout returns the documented stateless response.

**Acceptance Scenarios**:

1. **Given** a protected route receives a valid access token, **When** middleware processes the request, **Then** downstream handlers receive the resolved authenticated principal and role context.
2. **Given** a protected route receives a valid token for a disallowed role, **When** authorization is evaluated, **Then** the API returns the defined structured `403` role-mismatch response.
3. **Given** an authenticated client calls logout, **When** the request is processed, **Then** the API returns the documented stateless sign-out response without creating or revoking persistent refresh sessions.

### Edge Cases

- A login identifier matches no user, but the API must still return the same invalid-credentials response shape as a bad password.
- A disabled or inactive account presents valid credentials and must be rejected with the defined auth error behavior.
- A tenant-scoped user authenticates successfully but lacks the tenant membership needed to resolve an active app target.
- A valid access token is presented to a route that requires a different role or tenant context.
- A token is syntactically valid but carries claims that do not satisfy the current auth contract version.
- Logout is called without server-side session state and must remain idempotent from the client's perspective.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST support login with either username or email plus password using one API contract.
- **FR-002**: The system MUST return the same successful login response contract regardless of whether the identifier was a username or email.
- **FR-003**: The system MUST issue access tokens for authenticated requests.
- **FR-004**: The system MUST validate access tokens on protected routes and resolve the current principal for downstream handlers.
- **FR-005**: The system MUST expose a current-user endpoint that returns the authenticated principal, resolved role context, tenant membership context when applicable, and recommended app target.
- **FR-006**: The system MUST expose a logout endpoint with stateless client-discard semantics and clearly documented non-revocation behavior for this phase.
- **FR-007**: The system MUST return a consistent auth error contract for invalid credentials.
- **FR-008**: The system MUST return a consistent auth error contract for disabled or inactive accounts.
- **FR-009**: The system MUST return a structured `403` response for role mismatch cases on protected routes.
- **FR-010**: The system MUST allow protected-route handlers to access the resolved authenticated principal without re-validating the token manually.
- **FR-011**: The system MUST keep persistent refresh sessions and server-side refresh-token revocation out of scope for this issue.
- **FR-012**: The system MUST support routing decisions between the control-plane app and tenant app from the current-user response contract.

### Key Entities _(include if feature involves data)_

- **Login Identifier**: The user-supplied credential identifier that may be either a username or an email.
- **Authenticated Principal**: The resolved user identity returned by login and current-user flows, including role and account status context.
- **Current User Context**: The authenticated response shape containing principal details, tenant membership details when relevant, and the recommended application target.
- **Auth Error Contract**: The consistent response structure used for unauthenticated, invalid-credential, disabled-account, and role-mismatch outcomes.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of supported personas can authenticate with either username or email through a single login contract.
- **SC-002**: Reviewers can verify that 100% of authenticated current-user responses include the role and app-target context required for client routing decisions.
- **SC-003**: Reviewers can verify that protected routes return one consistent unauthenticated or forbidden response contract for the defined auth failure cases.
- **SC-004**: Reviewers can verify from the API artifacts and tests that logout remains stateless and that persistent refresh-session behavior is excluded from this phase.

## Assumptions

- `CROWN-61` builds on the persisted credential and role foundation delivered in `CROWN-60`.
- The first authenticated current-user response only needs one active role context per request rather than simultaneous multi-context resolution.
- The recommended app target can be derived from the resolved role and tenant context without additional user preferences in this phase.
- Clients will discard tokens on logout; server-side token revocation and refresh-session persistence remain future work.
