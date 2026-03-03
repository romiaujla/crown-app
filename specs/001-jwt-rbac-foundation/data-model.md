# Data Model: Global Auth and RBAC Foundation

## Entity: AuthenticatedIdentity

- Description: Verified caller identity extracted from token claims.
- Fields:
  - `sub` (string, required): stable subject identifier.
  - `role` (enum, required): one of `super_admin`, `tenant_admin`, `tenant_user`.
  - `tenant_id` (string or null, required key): tenant scope identifier; nullable only for `super_admin`.
- Validation rules:
  - Reject if any claim key is missing.
  - Reject if `role` is outside enum.
  - Reject if `role` is `tenant_admin` or `tenant_user` and `tenant_id` is null/empty.

## Entity: ProtectedOperation

- Description: A categorized operation requiring authorization.
- Fields:
  - `operation_id` (string, required): unique operation key for test traceability.
  - `namespace` (enum, required): `auth`, `platform`, or `tenant`.
  - `scope_target_tenant_id` (string or null): tenant target for tenant-scoped operations.
- Validation rules:
  - Platform operations must not require tenant scope target.
  - Tenant operations must include a tenant scope target.

## Entity: RolePolicyRule

- Description: Rule mapping role + operation category to allow/deny behavior.
- Fields:
  - `role` (enum, required)
  - `namespace` (enum, required)
  - `tenant_match_required` (boolean, required)
  - `allow` (boolean, required)
- Validation rules:
  - `super_admin` may allow `platform`; tenant match not required.
  - Tenant roles cannot allow `platform`.
  - Tenant roles require tenant match for `tenant` namespace operations.

## Entity: AccessDecision

- Description: Output of auth/rbac evaluation before route business logic.
- Fields:
  - `decision` (enum, required): `allow` or `deny`.
  - `reason` (enum, required): `unauthenticated`, `forbidden_role`, `forbidden_tenant`, or `invalid_claims`.
  - `role` (enum, optional): populated when identity is valid.
  - `tenant_id` (string or null, optional): populated when identity is valid.
- Validation rules:
  - `allow` requires valid identity and matching policy rule.
  - `deny` reason must map to one of the defined reason categories.

## Relationships

- `AuthenticatedIdentity` is evaluated against `RolePolicyRule` for a `ProtectedOperation`.
- Evaluation returns one `AccessDecision`.
- `ProtectedOperation.namespace` drives which policy subset is used.

## State Transitions

- `Unauthenticated Request` -> `Deny (unauthenticated)` when token/claims are missing or invalid.
- `Authenticated Identity + Matching Policy` -> `Allow`.
- `Authenticated Identity + Role Mismatch` -> `Deny (forbidden_role)`.
- `Authenticated Identity + Tenant Mismatch` -> `Deny (forbidden_tenant)`.
