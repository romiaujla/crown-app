# Quickstart: Global Auth and RBAC Foundation

## Goal

Validate the auth route and RBAC middleware contracts for CROWN-4 before implementation tasks are broken down.

## Prerequisites

- Branch checked out: `001-jwt-rbac-foundation`
- Dependencies installed: `pnpm install`
- Local environment available for API package (`apps/api`)

## 1. Review artifacts

- Feature spec: `specs/001-jwt-rbac-foundation/spec.md`
- Research decisions: `specs/001-jwt-rbac-foundation/research.md`
- Data model: `specs/001-jwt-rbac-foundation/data-model.md`
- Contracts:
  - `specs/001-jwt-rbac-foundation/contracts/auth-routes.openapi.yaml`
  - `specs/001-jwt-rbac-foundation/contracts/middleware-rbac-contract.md`

## 2. Validate role/tenant rule coverage

- Confirm every protected namespace has explicit allow/deny policy for:
  - `super_admin`
  - `tenant_admin`
  - `tenant_user`
- Confirm tenant mismatch cases are explicitly denied for tenant roles.
- Confirm claim validation failures are denied before role evaluation.

## 3. Prepare test planning baseline

- Define contract tests for auth route responses:
  - successful login/refresh
  - invalid credentials/refresh token
  - logout acceptance
- Define middleware decision tests:
  - role mismatch on platform routes
  - tenant mismatch on tenant routes
  - malformed or missing claims

## 4. Ready state for `/speckit.tasks`

Proceed to `/speckit.tasks` when:

- Contracts are accepted by stakeholders.
- No unresolved policy ambiguities remain in role matrix or denial semantics.
- Test coverage targets from `spec.md` Success Criteria can be mapped to tasks.

## 5. Implementation execution notes (2026-03-03)

- `pnpm --filter @crown/api typecheck`: passed.
- `pnpm --filter @crown/api test`: passed with 8 files and 18 tests.
- Note: the first sandboxed test attempt hit `listen EPERM`; re-running outside sandbox permission completed successfully.
