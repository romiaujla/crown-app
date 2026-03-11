# Auth and RBAC

## Token model
- Access-token-only JWT foundation for the current phase.
- Claims:
  - `sub`
  - `role` (`super_admin`, `tenant_admin`, `tenant_user`)
  - `tenant_id` (nullable for super-admin global ops)

## Credential foundation
- Control-plane identities persist:
  - unique `email`
  - unique `username`
  - hashed password material
  - account status (`active`, `disabled`, `inactive`)
- Refresh-session persistence is out of scope for the current phase.

## RBAC matrix
- `super_admin`: tenant lifecycle, platform settings, global audit visibility, platform namespace access.
- `tenant_admin`: tenant-scoped admin routes with matching `tenant_id`.
- `tenant_user`: tenant user routes with matching `tenant_id`; denied on platform and tenant-admin routes.

## Denial semantics
- `unauthenticated`: missing bearer token.
- `invalid_claims`: malformed token payload or invalid claims shape.
- `forbidden_role`: authenticated user role does not match route policy.
- `forbidden_tenant`: authenticated tenant role targeting non-matching tenant scope.

## Implemented policy points
- Platform route contract: `GET /api/v1/platform/ping` requires `super_admin`.
- Tenant admin contract: `GET /api/v1/tenant/admin/:tenantId` requires `tenant_admin` + tenant match.
- Tenant user contract: `GET /api/v1/tenant/user/:tenantId` allows `tenant_user` and `tenant_admin` with tenant match.
