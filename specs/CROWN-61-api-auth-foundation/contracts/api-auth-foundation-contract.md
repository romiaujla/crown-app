# Contract: API Auth Foundation

## Purpose

Define the first-pass API contract for login, logout, current-user resolution, and protected-route authenticated context.

## Route Surface

### `POST /api/v1/auth/login`

- Accepts one identifier field that may contain either username or email plus password.
- Returns authenticated response data and access-token material for a valid active user.
- Returns a consistent invalid-credentials error contract when the identifier or password is wrong.
- Returns the defined disabled-account error contract when the user is not allowed to authenticate.

### `POST /api/v1/auth/logout`

- Returns the stateless success response used by clients to discard tokens.
- Does not revoke tokens server-side in this phase.
- Must be safe to call repeatedly from the client perspective.

### `GET /api/v1/auth/me`

- Requires a valid access token.
- Returns the authenticated principal, resolved role context, tenant membership context when applicable, and recommended app target.
- Uses the same principal-resolution rules as protected-route middleware.

## Authenticated Response Contract

- Includes principal identity fields needed by the web shell.
- Includes role-context data that distinguishes `super_admin`, `tenant_admin`, and `tenant_user`.
- Includes tenant context for tenant-scoped users only.
- Includes a deterministic `targetApp` value so the client can route to the correct shell.

## Protected Route Middleware Contract

- Validates the presented access token.
- Resolves the current principal once and makes it available to downstream handlers.
- Rejects missing or invalid tokens with the shared unauthenticated error contract.
- Rejects role mismatch with the shared forbidden-role error contract.

## Error Contract Expectations

### Unauthenticated

- Used for missing token, malformed token, invalid token, and unauthenticated current-user requests.
- Must include a stable machine-readable `error_code`.

### Invalid Credentials

- Used for failed login due to unknown identifier or wrong password.
- Must not reveal whether the identifier exists.

### Disabled Account

- Used for login attempts by inactive or disabled identities.
- Must remain distinct from generic invalid-credential handling only if the story’s implementation and tests define it explicitly.

### Forbidden Role

- Used when an authenticated request reaches a protected route that disallows the resolved role or tenant context.
- Must return structured `403` semantics for client handling.
