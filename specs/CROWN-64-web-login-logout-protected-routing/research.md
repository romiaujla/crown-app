# Research: CROWN-64 Web Login, Logout, and Protected-Route Handling

## Decision: Use the API current-user contract as the single routing authority

- **Why**: `CROWN-61` already returns `target_app` and `routing` data that distinguish safe destinations from denied or selection-required states. The web app should consume that contract directly instead of re-deriving destination rules from raw JWT claims or local role assumptions.
- **Alternatives considered**:
  - Route purely from decoded JWT claims: rejected because it ignores server-side tenant-membership validation and routing denial reasons.
  - Maintain a duplicate frontend role-to-route matrix: rejected because it would drift from the API contract and create a second source of truth.

## Decision: Persist the access token in `sessionStorage` only and bootstrap from it on client mount

- **Why**: The Jira scope explicitly requires `sessionStorage` and excludes longer-lived persistence. Bootstrapping current-user state from `sessionStorage` on load supports refresh recovery without broadening into cookie or refresh-token work.
- **Alternatives considered**:
  - `localStorage`: rejected because it exceeds the requested persistence lifetime and would leave sessions around across browser restarts.
  - HTTP-only cookies: rejected because that changes the auth transport model beyond the existing API contract for this story.

## Decision: Split the web app into explicit login, platform, tenant, and unauthorized route surfaces

- **Why**: The current one-page `?role=` demo cannot enforce protected routes or preserve shell boundaries. Route-level separation in the App Router makes it easier to redirect unauthenticated users, restore valid return paths, and keep the `CROWN-7` and `CROWN-8` shells distinct.
- **Alternatives considered**:
  - Keep a single page and conditionally swap sections: rejected because protected-route handling and wrong-shell correction become harder to reason about and test.
  - Introduce route groups without visible route paths only: rejected for the first pass because the acceptance criteria are easier to validate with explicit `/login`, `/platform`, `/tenant`, and `/unauthorized` destinations.

## Decision: Preserve return-path restoration only after validating it against the resolved current-user context

- **Why**: The story requires restoring the originally requested path only when it is still valid for the authenticated user. A server-validated current-user payload plus route classification lets the client reject stale or unsafe return paths and fall back to a safe destination.
- **Alternatives considered**:
  - Always restore the last attempted URL after login: rejected because it can strand users in the wrong shell.
  - Always ignore the return path and route to the default shell: rejected because it fails the route-restoration acceptance criteria.

## Decision: Surface session-expired and unauthorized states as explicit UI states instead of silent redirects

- **Why**: Reviewers need a deterministic way to verify whether the app cleared auth state because the token expired versus because a route is unsupported. Explicit user-facing states reduce ambiguity and align with the acceptance criteria.
- **Alternatives considered**:
  - Redirect to login without any reason message: rejected because it hides why the user lost access.
  - Show generic shell-level loading or blank states: rejected because stale protected content could remain visible and the user would not know how to recover.
