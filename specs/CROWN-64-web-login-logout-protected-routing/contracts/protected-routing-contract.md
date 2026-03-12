# Contract: Protected Routing and Shell Correction

## Purpose

Define how protected routes, return paths, wrong-shell correction, and unauthorized states behave during `CROWN-64`.

## Protected Route Surface

### Platform Shell Routes

- Represent the `CROWN-7` super-admin control-plane experience.
- Require an authenticated `super_admin` current-user context.
- Must redirect unauthenticated users to `/login` and preserve the requested path as a candidate return path.

### Tenant Shell Routes

- Represent the `CROWN-8` tenant workspace experience.
- Require an authenticated tenant-scoped current-user context with a valid tenant membership.
- Must redirect unauthenticated users to `/login` and preserve the requested path as a candidate return path.

### Unauthorized Route or State

- Used when the requested destination cannot be safely corrected.
- Must not render platform or tenant shell content as if access were valid.

## Return-Path Rules

- The app captures the originally requested protected path before redirecting to `/login`.
- After login, the app restores that path only when it matches the resolved current-user context and shell boundary.
- If the path is invalid for the authenticated user, the app discards it and falls back to the API-recommended destination.

## Wrong-Shell Correction Rules

- A `super_admin` who reaches a tenant route must be redirected back to the platform shell.
- A tenant-scoped user who reaches a platform route must be redirected back to the tenant shell when a safe tenant destination exists.
- If the API routing contract reports a blocked or unresolved tenant context, the app must show the unauthorized/access-denied state instead of guessing a shell destination.

## API Routing Contract Usage

- `current_user.target_app` is the primary shell recommendation.
- `current_user.routing.status` and `current_user.routing.reason_code` determine whether the app may enter a shell or must show a denied/recovery state.
- The client must not override an API-reported blocked routing outcome with a locally guessed destination.

## Acceptance Signals

- Signed-out users never see protected shell content.
- Valid protected deep links restore correctly after login.
- Invalid deep links fall back safely without leaving the user stranded in the wrong shell.
- Wrong-shell manual navigation is corrected consistently for both platform and tenant personas.
