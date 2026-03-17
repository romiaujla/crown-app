# Auth and RBAC

## Normalized role model

Roles are stored in the `roles` table with three key dimensions:

- `role_code`: the unique domain identifier (e.g. `super_admin`, `tenant_admin`, `dispatcher`, `accountant`)
- `scope`: `platform` or `tenant`
- `auth_class`: the JWT-level classification — one of `super_admin`, `tenant_admin`, or `tenant_user`

Role assignments flow through normalized join tables:

- `user_platform_role_assignments`: links a user to a platform-scoped role
- `tenant_membership_role_assignments`: links a tenant membership to a tenant-scoped role (with `is_primary` flag)

During authentication, the auth resolution layer queries these tables and maps the assigned role's `auth_class` value into the JWT `role` claim.

## Token model

- Access-token-only JWT foundation for the current phase.
- Default access-token lifetime is 2 hours unless overridden through API environment configuration.
- Claims:
  - `sub` (user ID)
  - `role` (derived from `roles.auth_class`: `super_admin`, `tenant_admin`, or `tenant_user`)
  - `tenant_id` (nullable — null for platform-scoped super-admin operations)
  - `exp` (Unix timestamp for access-token expiry)

## Credential foundation

- Control-plane identities persist:
  - unique `email`
  - unique `username`
  - hashed password material
  - account status (`active`, `disabled`, `inactive`)
- Refresh-session persistence is out of scope for the current phase.
- Web auth currently stores the access token in browser `sessionStorage`, so sessions are tab-scoped for this phase.

## RBAC matrix (by auth_class)

- `super_admin` (auth_class): tenant lifecycle, platform settings, global audit visibility, platform namespace access.
- `tenant_admin` (auth_class): tenant-scoped admin routes with matching `tenant_id`. Assigned to roles with `scope=tenant` and `auth_class=tenant_admin` (e.g. `tenant_admin` role code).
- `tenant_user` (auth_class): tenant user routes with matching `tenant_id`; denied on platform and tenant-admin routes. Assigned to roles with `scope=tenant` and `auth_class=tenant_user` (e.g. `dispatcher`, `accountant`, `driver`).

## Denial semantics

- `unauthenticated`: missing bearer token.
- `invalid_claims`: malformed token payload or invalid claims shape.
- `tenant_membership_required`: authenticated tenant-scoped user has no single active membership that can anchor routing.
- `tenant_selection_required`: authenticated tenant-scoped user has multiple active memberships and tenant selection is not yet supported.
- `forbidden_role`: authenticated user role does not match route policy.
- `forbidden_tenant`: authenticated tenant role targeting non-matching tenant scope.

## Post-login routing contract

- A user resolved to `auth_class=super_admin` routes to `target_app=platform` with routing status `allowed`.
- A user resolved to `auth_class=tenant_admin` routes to `target_app=tenant` with routing status `allowed` only when exactly one active tenant-admin membership exists.
- A user resolved to `auth_class=tenant_user` routes to `target_app=tenant` with routing status `allowed` only when exactly one active tenant-user membership exists.
- Authenticated non-super-admin users without a valid active tenant membership receive a structured `403` with `error_code=tenant_membership_required`.
- Authenticated non-super-admin users with multiple active tenant memberships receive a structured `403` with `error_code=tenant_selection_required` until tenant selection exists.

## Session-expiry UX

- The web app warns the user shortly before access-token expiry.
- When expiry is reached, the web app clears the local session state and returns the user to `/login`.
- The login experience surfaces a session-expired message so the logout reason is explicit.

## Implemented policy points

- Platform route contract: `GET /api/v1/platform/ping` requires `auth_class=super_admin`.
- Tenant admin contract: `POST /api/v1/auth/tenant/access` with `authClass=tenant_admin` requires a matching tenant-admin role assignment + tenant match.
- Tenant user contract: `POST /api/v1/auth/tenant/access` with `authClass=tenant_user` allows `tenant_user` and `tenant_admin` auth_class with tenant match.
