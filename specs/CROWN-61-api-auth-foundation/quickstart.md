# Quickstart: CROWN-61 API Auth Foundation

## Goal

Validate the API auth surface for login, logout, current-user resolution, and protected-route principal resolution.

## Prerequisites

- Control-plane auth foundation from `CROWN-60` is present on the branch.
- Local seed data has been applied so canonical auth users exist.
- API workspace dependencies are installed.

## Validation Flow

1. Run focused auth contract and integration tests for login, logout, current-user, and middleware principal resolution.
2. Verify a user can authenticate with username and password.
3. Verify the same user can authenticate with email and password.
4. Verify invalid credentials return the defined auth error contract.
5. Verify disabled or inactive accounts return the defined auth error contract.
6. Verify the current-user endpoint returns:
   - principal identity
   - resolved role context
   - tenant context for tenant-scoped users
   - recommended app target
7. Verify logout returns the stateless success response.
8. Verify protected platform and tenant routes return structured `403` responses for role mismatch.

## Expected Personas

- `super_admin`
- `tenant_admin`
- `tenant_user`

## Out of Scope Checks

- Refresh-token issuance
- Refresh-token storage
- Server-side logout revocation
- Password recovery or reset flows
