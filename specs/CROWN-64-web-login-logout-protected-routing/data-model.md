# Data Model: CROWN-64 Web Login, Logout, and Protected-Route Handling

## Client-Side State Models

### LoginFormState

- **Fields**:
  - `identifier`
  - `password`
  - `fieldErrors`
  - `formError`
  - `isSubmitting`
- **Rules**:
  - Client validation must reject empty or obviously invalid submissions before calling the API.
  - Authentication failures remain form-level errors tied to the shared login surface.

### WebSessionToken

- **Fields**:
  - `accessToken`
  - `storageKey`
- **Rules**:
  - Persisted only in browser `sessionStorage`.
  - Cleared on logout, invalid-session detection, and explicit auth reset.
  - Never stored in URL params or long-lived browser storage during this story.

### AuthBootstrapState

- **Fields**:
  - `status`
  - `currentUser`
  - `message`
- **Rules**:
  - `status` distinguishes loading, authenticated, unauthenticated, session-expired, and unauthorized flows.
  - The state must settle before protected pages render shell content.

### ReturnPath

- **Fields**:
  - `pathname`
  - `search`
  - `source`
- **Rules**:
  - Captured when an unauthenticated user requests a protected route.
  - Reused only after post-login validation confirms that the path matches the resolved user context.
  - Cleared after successful restoration or when the path is rejected as unsafe.

## API-Derived Models

### CurrentUserContext

- **Fields**:
  - `principal`
  - `role_context`
  - `tenant`
  - `target_app`
  - `routing`
- **Rules**:
  - Comes from `POST /api/v1/auth/login` and `GET /api/v1/auth/me`.
  - Drives shell routing, wrong-shell correction, and unauthorized fallback decisions.

### RoutingDecision

- **Fields**:
  - `requestedPath`
  - `recommendedPath`
  - `isAllowed`
  - `fallbackReason`
- **Rules**:
  - Derived from the requested browser path plus the API-provided current-user/routing contract.
  - Must prefer a safe recommended destination over an unsafe restoration target.

## UI State Models

### UnauthorizedState

- **Fields**:
  - `title`
  - `message`
  - `nextActionHref`
- **Rules**:
  - Used when the requested destination cannot be safely corrected or when the API reports a blocked routing outcome.
  - Must not render protected platform or tenant shell content underneath.

### SessionExpiredState

- **Fields**:
  - `messageCode`
  - `displayMessage`
- **Rules**:
  - Activated when `GET /api/v1/auth/me` or other protected resolution reports that the token is invalid or expired.
  - Must redirect the browser to the login route and explain why a new sign-in is required.
