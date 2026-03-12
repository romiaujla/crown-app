# Feature Specification: Web Login, Logout, and Protected-Route Handling

**Feature Branch**: `feat/CROWN-64-web-login-logout-protected-routing`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: Jira issue `CROWN-64` - "Deliver web login and logout experience with protected-route handling"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign in and land in the correct shell (Priority: P1)

As a Crown user, I want a shared login page that signs me in and routes me into the correct shell so I can enter the platform without guessing where I belong.

**Why this priority**: Without a working login entry point and first redirect, the web app cannot use the existing API auth foundation and the role-aware shells are not reachable through a real user flow.

**Independent Test**: Can be fully tested by loading the login page, submitting valid and invalid credentials, and verifying that authenticated users land in the API-recommended platform or tenant shell with the access token stored for the active browser session.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user opens the shared login page, **When** they submit invalid credentials, **Then** the page stays on login and shows a clear authentication error state.
2. **Given** a valid `super_admin` signs in, **When** the login request succeeds, **Then** the web app stores the access token in `sessionStorage` and redirects the user into the platform shell.
3. **Given** a valid tenant-scoped user signs in, **When** the login request succeeds, **Then** the web app stores the access token in `sessionStorage` and redirects the user into the tenant shell recommended by the API current-user context.

---

### User Story 2 - Restore or correct protected navigation (Priority: P2)

As an authenticated Crown user, I want protected routes to restore the route I originally asked for when it is valid, or redirect me to the correct destination when it is not, so I do not get stranded in the wrong shell.

**Why this priority**: Correct post-login navigation and protected-route enforcement are the main UX risks once login exists. The frontend must respect the API routing contract instead of trusting stale or unsafe client-side assumptions.

**Independent Test**: Can be fully tested by requesting protected platform and tenant routes while unauthenticated, then signing in as different personas and verifying that valid routes restore correctly while invalid routes redirect to the recommended allowed destination or an unauthorized state.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user requests a protected route, **When** the app redirects them to login and they later authenticate into a role that is allowed for that route, **Then** the app restores the originally requested route.
2. **Given** an unauthenticated user requests a protected route, **When** they later authenticate into a role that is not allowed for that route, **Then** the app ignores the invalid return path and sends them to the API-recommended shell.
3. **Given** an authenticated user manually navigates into the wrong shell, **When** the app validates the route against the current-user context, **Then** the app redirects them to the correct allowed destination when it can determine one safely.

---

### User Story 3 - Exit cleanly and recover from lost sessions (Priority: P3)

As a Crown user, I want logout and expired-session handling to return me to a clear login state so I can recover from auth loss without confusing stale shell behavior.

**Why this priority**: Sign-out and session-expiry handling complete the baseline auth UX and prevent protected views from staying mounted after the client loses a valid token.

**Independent Test**: Can be fully tested by logging out from an authenticated shell and by simulating an invalid or expired session during protected navigation, then verifying that the app clears session storage and returns to login with the correct user-facing message.

**Acceptance Scenarios**:

1. **Given** an authenticated user activates logout, **When** the logout flow completes, **Then** the app clears the token from `sessionStorage` and returns the user to the shared login page.
2. **Given** a protected route checks an expired or invalid session, **When** the API reports that the session is no longer valid, **Then** the app redirects to login and shows a session-expired message.
3. **Given** an authenticated user reaches a path that is unsupported or unsafe for their access context, **When** the app cannot redirect to a safe allowed destination, **Then** it shows an explicit unauthorized or access-denied state instead of rendering the wrong shell.

### Edge Cases

- A user is redirected to login from a deep protected route that is valid for one role but invalid for another role they later authenticate with.
- The browser session is refreshed while the token is still present in `sessionStorage` and the app must restore the authenticated context without showing the wrong shell first.
- The browser session is refreshed after the token becomes invalid and the app must fall back to login with a session-expired message.
- The API returns a structured routing `403` because the authenticated tenant user lacks a single active tenant membership.
- A tenant-scoped user manually navigates to a platform route or a mismatched tenant route after login.
- A user opens the login page while already authenticated and should be routed away from login into the correct shell.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The web app MUST provide a shared login page for all supported personas.
- **FR-002**: The login page MUST validate the credential form before submission and show clear inline or page-level errors for invalid input and authentication failures.
- **FR-003**: The web app MUST call the existing API login contract and current-user contract to establish authenticated client state.
- **FR-004**: The web app MUST store the access token in `sessionStorage` for this phase.
- **FR-005**: After successful login, the web app MUST route users based on the authenticated routing contract and recommended app target returned by the API.
- **FR-006**: When a user is redirected to login from a protected route, the web app MUST restore that route only when it is valid for the authenticated user; otherwise it MUST fall back to the recommended safe destination.
- **FR-007**: Protected routes MUST redirect unauthenticated users to the shared login page.
- **FR-008**: The web app MUST prevent authenticated users from remaining in the wrong shell when the current route conflicts with the resolved current-user context.
- **FR-009**: The web app MUST redirect authenticated users from the login page into the correct shell instead of leaving them on the sign-in form.
- **FR-010**: The web app MUST provide an explicit unauthorized or access-denied screen or state for unsupported or invalid access paths that cannot be corrected with a safe redirect.
- **FR-011**: The logout flow MUST clear client-held auth state and return the user to the shared login page.
- **FR-012**: When the session is expired or otherwise invalid during protected-route resolution, the web app MUST redirect to login and show a session-expired message.
- **FR-013**: The feature MUST preserve the role-aware separation between the platform shell and tenant shell already established by `CROWN-7` and `CROWN-8`.
- **FR-014**: The implementation MUST not introduce long-lived token persistence beyond `sessionStorage` for this phase.

### Key Entities *(include if feature involves data)*

- **Login Form State**: The client-side credential entry state, validation state, and submission/error status for the shared login experience.
- **Web Session Token**: The access token stored in `sessionStorage` and used to call authenticated API routes for the active browser session.
- **Return Path**: The protected route originally requested before the app redirected the user to login.
- **Resolved Current User Context**: The client-consumed auth payload from the API that includes principal details, role context, tenant context, routing status, and recommended app target.
- **Unauthorized State**: The explicit web state shown when the user requests an invalid or unsupported destination and the app cannot recover with a safe redirect.
- **Session Expired State**: The login-page message state shown after the client detects an invalid or expired session during protected-route handling.

### Assumptions

- `CROWN-61` provides the login, logout, current-user, and routing contracts needed by the web app.
- `CROWN-7` and `CROWN-8` provide the initial platform and tenant shell presentation that this story will place behind real auth-aware routing.
- The current phase can derive the correct post-login destination entirely from the API response without separate user preferences or workspace selection flows.
- Access tokens remain short-lived client session state only; refresh-token flows and pre-expiry warnings remain out of scope.
- The baseline web implementation can begin with route protection around the Next.js app router pages currently in scope and expand later as additional route surfaces are added.

### Dependencies

- `CROWN-61` API auth foundation for login, logout, current-user, and routing responses.
- `CROWN-7` platform shell to serve as the authenticated destination for `super_admin`.
- `CROWN-8` tenant shell to serve as the authenticated destination for tenant-scoped users.
- Existing role and routing enums/contracts in `apps/api/src/auth` that define safe client destinations and structured denial states.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of supported personas can sign in from one shared login page and reach the API-recommended shell without manual URL changes.
- **SC-002**: Reviewers can verify that 100% of tested protected-route login redirects restore the original route only when it is valid for the authenticated user.
- **SC-003**: Reviewers can verify that 100% of unauthenticated protected-route requests are redirected to login rather than rendering protected shell content.
- **SC-004**: Reviewers can verify that logout clears client-held session state and returns users to the shared login page in all in-scope shells.
- **SC-005**: Reviewers can verify that invalid or expired sessions consistently fall back to login with a session-expired or unauthorized state rather than leaving the user in a stale protected shell.
