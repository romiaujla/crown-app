# Quickstart: CROWN-64 Web Login, Logout, and Protected-Route Handling

## Goal

Validate the end-to-end web auth experience for login, protected-route recovery, wrong-shell correction, logout, and expired-session handling.

## Prerequisites

- `CROWN-61` auth API routes are available on the branch or a reachable local API.
- Test personas exist for:
  - `super_admin`
  - `tenant_admin`
  - `tenant_user`
- `apps/web` dependencies are installed.
- The web app can reach the API base URL configured for local development.

## Validation Flow

1. Run `pnpm --filter @crown/web typecheck`.
2. Run focused Playwright coverage for the login and protected-route flows.
3. Load `/login` while signed out and verify form validation blocks invalid submissions.
4. Submit invalid credentials and verify the login page stays mounted with an authentication error.
5. Sign in as `super_admin` and verify:
   - the token is stored in `sessionStorage`
   - the app routes to the platform shell
   - the login page no longer remains visible
6. Sign in as `tenant_admin` or `tenant_user` and verify:
   - the token is stored in `sessionStorage`
   - the app routes to the tenant shell recommended by the API
7. Request a protected route while signed out, authenticate with a role allowed for that route, and verify the app restores the original path.
8. Repeat with a role not allowed for the requested path and verify the app ignores the stale return path and routes to the safe recommended destination or unauthorized state.
9. While authenticated, navigate into the wrong shell and verify the app corrects the route without rendering the wrong shell as valid.
10. Trigger logout from an authenticated shell and verify the token is cleared and the browser returns to `/login`.
11. Simulate an invalid or expired token during protected bootstrap and verify the app redirects to `/login` with the session-expired message.

## Out of Scope Checks

- Refresh-token issuance or renewal
- Cross-tab session synchronization
- Password reset or account recovery
- Long-lived persistence outside `sessionStorage`
