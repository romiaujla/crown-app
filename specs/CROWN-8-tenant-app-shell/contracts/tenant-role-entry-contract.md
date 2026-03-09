# Tenant Role Entry Contract

## Purpose

Define the role-based entry behavior for the tenant app shell during `CROWN-8`.

## Actors

- `tenant_admin`
- `tenant_user`
- `super_admin`
- unauthenticated visitor

## Entry Outcomes

### `tenant_admin`

- Must land in the tenant workspace shell.
- Must see tenant-facing identity, navigation, and overview content.

### `tenant_user`

- Must land in the tenant workspace shell.
- Must see tenant-facing identity, navigation, and overview content appropriate for tenant work.

### `super_admin`

- Must not be treated as a tenant-scoped user.
- Must be redirected or denied in a way that preserves the boundary between the platform control plane and tenant workspaces.
- Current shell behavior may keep `super_admin` users in the platform control plane rather than showing tenant-shell content.

### unauthenticated visitor

- Must not see protected tenant shell content.
- Must be routed through the normal authentication entry path.

## Boundary Rules

- The shell requires a tenant-scoped role and tenant context.
- A valid session alone is insufficient if the user is operating as `super_admin`.
- The powered-by-Crown workspace must remain visually separate from the platform control plane.

## Acceptance Signals

- Role entry behavior is deterministic and testable.
- Tenant shell visibility always matches tenant-scoped access expectations.
- No route path causes a platform operator to appear in the tenant shell by mistake.
