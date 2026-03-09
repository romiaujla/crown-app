# Platform Role Entry Contract

## Purpose

Define the role-based entry behavior for the main-app shell during `CROWN-7`.

## Actors

- `super_admin`
- `tenant_admin`
- `tenant_user`
- unauthenticated visitor

## Entry Outcomes

### `super_admin`

- Must land in the platform control-plane shell.
- Must see platform-level identity, navigation, and overview content.

### `tenant_admin`

- Must not be treated as a platform operator.
- Must be redirected or denied in a way that preserves a clear boundary between platform and tenant experiences.
- Current shell behavior may use an explicit restricted-access state until full tenant routing is introduced.

### `tenant_user`

- Must not be treated as a platform operator.
- Must be redirected or denied in a way that preserves a clear boundary between platform and tenant experiences.
- Current shell behavior may use an explicit restricted-access state until full tenant routing is introduced.

### unauthenticated visitor

- Must not see protected platform shell content.
- Must be routed through the normal authentication entry path.

## Boundary Rules

- The presence of a valid session alone is insufficient; the role must be `super_admin`.
- A missing tenant context must not block `super_admin` access to the platform shell.
- A non-super-admin must never be shown platform-shell navigation as if it were valid for them.

## Acceptance Signals

- Role entry behavior is deterministic and testable.
- Platform shell visibility always matches the authenticated role.
- No role transition path causes a tenant user to appear in a platform shell by mistake.
