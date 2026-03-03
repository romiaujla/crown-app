# Middleware RBAC Contract

## Purpose

Define request evaluation rules for protected routes before business handlers execute.

## Inputs

- Token-derived claims: `sub`, `role`, `tenant_id`
- Route namespace classification:
  - `/api/v1/platform/*`
  - `/api/v1/tenant/*`
  - `/api/v1/auth/*` (public token lifecycle routes; not role-protected)
- Target tenant identifier for tenant-scoped operations

## Core Invariants

- Claims must be validated before any role check.
- `super_admin` is the only role allowed for platform namespace operations.
- Tenant roles (`tenant_admin`, `tenant_user`) require tenant match for tenant namespace operations.
- Deny responses must not leak internal policy details.

## Decision Matrix

| Claims Valid | Role         | Namespace | Tenant Match Required | Tenant Match | Decision | Reason Category     |
|--------------|--------------|-----------|------------------------|--------------|----------|---------------------|
| No           | Any/Unknown  | Any       | N/A                    | N/A          | Deny     | invalid_claims      |
| Yes          | super_admin  | platform  | No                     | N/A          | Allow    | N/A                 |
| Yes          | tenant_admin | platform  | No                     | N/A          | Deny     | forbidden_role      |
| Yes          | tenant_user  | platform  | No                     | N/A          | Deny     | forbidden_role      |
| Yes          | tenant_admin | tenant    | Yes                    | Yes          | Allow    | N/A                 |
| Yes          | tenant_admin | tenant    | Yes                    | No           | Deny     | forbidden_tenant    |
| Yes          | tenant_user  | tenant    | Yes                    | Yes          | Allow    | N/A                 |
| Yes          | tenant_user  | tenant    | Yes                    | No           | Deny     | forbidden_tenant    |
| Yes          | super_admin  | tenant    | No                     | N/A          | Allow    | N/A                 |

## Response Contract

- Unauthenticated/invalid identity: return denial with `error_code` of `unauthenticated` or `invalid_claims`.
- Authenticated but unauthorized: return denial with `error_code` of `forbidden_role` or `forbidden_tenant`.
- Successful authorization: continue to downstream handler with normalized identity context.

## Test Expectations

- Every protected operation category has explicit allow and deny coverage for all three roles.
- Cross-tenant deny paths are covered for both tenant roles.
- Missing-claim and malformed-claim paths are covered independently.
