# Contract: Auth Credential Foundation And Role Mapping

## Purpose

Define the first-phase persistence and resolution contract that later `CROWN-24` auth API and web-shell stories will depend on.

## Preconditions

- Control-plane identity records are stored in `PlatformUser`.
- Tenant relationships are stored in `PlatformUserTenant`.
- The first auth phase uses access-token-only authentication.

## Credential Foundation Contract

- Crown persists one person-level auth identity per `PlatformUser`.
- That identity stores:
  - a unique email
  - a unique username for supported login lookup
  - hashed password material only
  - account-status information used to reject inactive or disabled identities
- The contract does not include persistent refresh-session records.

## Role Resolution Contract

### `super_admin`

- Resolved from the platform user identity.
- Does not require tenant-scoped login context.
- Must not be denied solely because no tenant membership is present.

### `tenant_admin`

- Resolved only when the user has valid tenant membership with tenant-admin role context.
- Requires tenant-scoped context for later routing and authorization.

### `tenant_user`

- Resolved only when the user has valid tenant membership with tenant-user role context.
- Requires tenant-scoped context for later routing and authorization.

## Invalid-State Outcomes

- Disabled or inactive accounts are denied.
- Tenant-scoped personas without valid tenant membership are denied.
- Role resolution must end in one supported role context or one clear denial outcome.

## Explicit Non-Goals

- Refresh-token persistence
- Persistent session management
- Password recovery flows
- Email verification
- Account-profile management
