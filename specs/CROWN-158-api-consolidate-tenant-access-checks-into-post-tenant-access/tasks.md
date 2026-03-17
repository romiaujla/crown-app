# Task Breakdown: API - Consolidate Tenant Access Checks Into POST /api/v1/tenant/access

**Feature Branch**: `feat/CROWN-158-consolidate-tenant-access-check-endpoint`
**Created**: 2026-03-17
**Status**: Draft
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Tasks

### Task 1 - Add Unified Tenant Access Route

**Phase**: 1
**Files**: `apps/api/src/routes/authorization.ts`
**Scope**:

- Add `POST /tenant/access` route.
- Add request validation for body fields:
  - `authClass` in `tenant_admin | tenant_user`
  - `tenantId` as required string.
- Map `authClass` to existing `authorize` allowed-role behavior.
- Adapt request tenant target so authorize middleware evaluates tenant scope against request body `tenantId`.
- Return `200` on allowed access using consistent JSON response shape.

**Acceptance**: Unified route compiles and preserves existing auth middleware outcomes (`401`/`403`) under equivalent request context.

---

### Task 2 - Remove Legacy Split Tenant Routes

**Phase**: 2
**Files**: `apps/api/src/routes/authorization.ts`
**Scope**:

- Remove `GET /tenant/admin/:tenantId` route.
- Remove `GET /tenant/user/:tenantId` route.
- Keep `/platform/ping` and unrelated routes unchanged.

**Acceptance**: No references to removed route handlers remain in runtime routing.

---

### Task 3 - Update OpenAPI Contract Surface

**Phase**: 3
**Files**: `apps/api/src/docs/openapi.ts`
**Scope**:

- Add `POST /api/v1/tenant/access` path documentation with request body schema.
- Include bearer auth security and `200`/`400`/`401`/`403` responses.
- Remove legacy path docs for `/api/v1/tenant/admin/{tenantId}` and `/api/v1/tenant/user/{tenantId}`.

**Acceptance**: OpenAPI source reflects implemented route surface exactly.

---

### Task 4 - Update API Docs Integration Assertions

**Phase**: 3
**Files**: `apps/api/tests/integration/api-docs.spec.ts`
**Scope**:

- Replace expectations for legacy tenant access paths with `POST /api/v1/tenant/access`.
- Update bearer auth assertions to match the new path and method.
- Keep unrelated docs assertions unchanged.

**Acceptance**: API docs integration test passes with updated contract expectations.

---

### Task 5 - Migrate Tenant Admin RBAC Integration Coverage

**Phase**: 4
**Files**: `apps/api/tests/integration/tenant-admin-rbac.spec.ts`
**Scope**:

- Replace legacy GET usage with `POST /api/v1/tenant/access` payload contract.
- Preserve denied-tenant-scope assertion (`403`, `forbidden_tenant`).
- Add allowed-scope assertion (`200`) if missing.

**Acceptance**: Tenant admin suite validates allow/deny tenant scope behavior under the unified endpoint.

---

### Task 6 - Migrate Tenant User RBAC Integration Coverage

**Phase**: 4
**Files**: `apps/api/tests/integration/tenant-user-rbac.spec.ts`
**Scope**:

- Replace legacy GET usage with `POST /api/v1/tenant/access` payload contract.
- Preserve malformed claims test for unified endpoint (`401`, `invalid_claims`).
- Add explicit tenant-user escalation denial scenario (`authClass: tenant_admin` -> `403`, `forbidden_role`).
- Add tenant-user allowed/denied tenant scope coverage if missing.

**Acceptance**: Tenant user suite validates required AC scenarios for tenant-user behavior and escalation denial.

---

### Task 7 - Run Validation Gates

**Phase**: 5
**Files**: none (validation only)
**Scope**:

- Run focused API integration tests for tenant-admin, tenant-user, and api-docs suites.
- Run API typecheck.
- Run `pnpm specify.audit`.

**Acceptance**: All checks pass and outputs are ready for PR validation notes.

## Task Dependency Order

```
Task 1 (Unified route)
    ↓
Task 2 (Remove legacy routes)
    ↓
Task 3 + Task 4 (OpenAPI + docs test alignment)
    ↓
Task 5 + Task 6 (RBAC test migration)
    ↓
Task 7 (validation)
```
