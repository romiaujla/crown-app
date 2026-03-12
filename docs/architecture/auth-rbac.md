# Auth and RBAC

## Token model
- Access-token-only JWT foundation for the current phase.
- Claims:
  - `sub`
  - `role` (`super_admin`, `tenant_admin`, `tenant_user`)
  - `tenant_id` (nullable for super-admin global ops)
  - `exp` (Unix timestamp for access-token expiry)

## Credential foundation
- Control-plane identities persist:
  - unique `email`
  - unique `username`
  - hashed password material
  - account status (`active`, `disabled`, `inactive`)
- Refresh-session persistence is out of scope for the current phase.
- Web auth currently stores the access token in browser `sessionStorage`, so sessions are tab-scoped for this phase.

## RBAC matrix
- `super_admin`: tenant lifecycle, platform settings, global audit visibility, platform namespace access.
- `tenant_admin`: tenant-scoped admin routes with matching `tenant_id`.
- `tenant_user`: tenant user routes with matching `tenant_id`; denied on platform and tenant-admin routes.

## Denial semantics
- `unauthenticated`: missing bearer token.
- `invalid_claims`: malformed token payload or invalid claims shape.
- `tenant_membership_required`: authenticated tenant-scoped user has no single active membership that can anchor routing.
- `tenant_selection_required`: authenticated tenant-scoped user has multiple active memberships and tenant selection is not yet supported.
- `forbidden_role`: authenticated user role does not match route policy.
- `forbidden_tenant`: authenticated tenant role targeting non-matching tenant scope.

## Post-login routing contract
- `super_admin` resolves to `target_app=platform` with routing status `allowed`.
- `tenant_admin` resolves to `target_app=tenant` with routing status `allowed` only when exactly one active tenant-admin membership exists.
- `tenant_user` resolves to `target_app=tenant` with routing status `allowed` only when exactly one active tenant-user membership exists.
- Authenticated non-super-admin users without a valid active tenant membership receive a structured `403` with `error_code=tenant_membership_required`.
- Authenticated non-super-admin users with multiple active tenant memberships receive a structured `403` with `error_code=tenant_selection_required` until tenant selection exists.

## Session-expiry UX
- The web app warns the user shortly before access-token expiry.
- When expiry is reached, the web app clears the local session state and returns the user to `/login`.
- The login experience surfaces a session-expired message so the logout reason is explicit.

## Implemented policy points
- Platform route contract: `GET /api/v1/platform/ping` requires `super_admin`.
- Tenant admin contract: `GET /api/v1/tenant/admin/:tenantId` requires `tenant_admin` + tenant match.
- Tenant user contract: `GET /api/v1/tenant/user/:tenantId` allows `tenant_user` and `tenant_admin` with tenant match.
