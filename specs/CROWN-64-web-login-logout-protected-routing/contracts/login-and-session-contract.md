# Contract: Login and Session Handling

## Purpose

Define the user-visible and client-side contract for sign-in, session bootstrap, logout, and login-page behavior during `CROWN-64`.

## Login Route

### `/login`

- Serves as the shared sign-in page for all supported personas.
- Accepts one identifier field and one password field.
- Validates required inputs before calling the API.
- Shows a clear authentication error on invalid credentials without leaving the page.
- Redirects authenticated users away from `/login` into the correct shell instead of leaving the sign-in form mounted.

## Login Request/Response Contract

- The client calls `POST /api/v1/auth/login` with:
  - `identifier`
  - `password`
- On success, the client must:
  - persist `access_token` in `sessionStorage`
  - retain the returned `current_user` payload as the immediate routing source
  - route to either the validated return path or the API-recommended shell destination
- On invalid credentials, the client must:
  - keep the user on `/login`
  - show a clear error state
  - avoid writing an access token to storage

## Session Bootstrap Contract

- On browser refresh or protected-route entry, the client reads the token from `sessionStorage`.
- If a token exists, the client calls `GET /api/v1/auth/me` before rendering protected shell content.
- If the token is valid, the client resolves the correct shell and route based on `current_user`.
- If the token is invalid or expired, the client clears auth state and returns to `/login` with the session-expired message.

## Logout Contract

- Logout is initiated from an authenticated shell.
- The client may call `POST /api/v1/auth/logout` for parity with the API contract.
- Regardless of the stateless API response, the client must:
  - clear the token from `sessionStorage`
  - clear any cached current-user state
  - return the browser to `/login`

## Message-State Contract

- Invalid credentials and client-side validation failures remain on the login page.
- Session-expired messages are shown after the app clears an invalid token during protected bootstrap.
- Authenticated users who arrive on `/login` are redirected away rather than shown the form as a stable state.
