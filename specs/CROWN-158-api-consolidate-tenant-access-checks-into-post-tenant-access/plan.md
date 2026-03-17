# Implementation Plan: API - Consolidate Tenant Access Checks Into POST /api/v1/tenant/access

**Feature Branch**: `feat/CROWN-158-consolidate-tenant-access-check-endpoint`
**Created**: 2026-03-17
**Status**: Draft
**Spec**: [spec.md](spec.md)

## Plan Overview

Replace split tenant access-check routes (`GET /api/v1/tenant/admin/:tenantId` and `GET /api/v1/tenant/user/:tenantId`) with one unified route (`POST /api/v1/tenant/access`) that accepts `authClass` and `tenantId` in the request body, while preserving current auth middleware outcomes (`200`, `401`, `403`) and OpenAPI alignment.

## Phase 1 - Introduce Unified Tenant Access Route Contract

### Files Changed

| File | Change |
|------|--------|
| `apps/api/src/routes/authorization.ts` | Add `POST /tenant/access` route with Zod request-body validation; map `authClass` to existing `authorize` role checks and preserve tenant-scope behavior. |

### Design Details

- Add a route-local request schema:
  - `authClass`: enum of `tenant_admin` and `tenant_user`
  - `tenantId`: non-empty string
- Keep existing middleware sequence semantics:
  - `authenticate`
  - `authorize({ namespace: "tenant", allowedRoles: ... })`
- Implement a small route adapter that writes `tenantId` to `req.params.tenantId` before `authorize` so the existing `resolveTargetTenant` flow can be reused without middleware rewrites.
- Role mapping:
  - `tenant_admin` -> allowed roles `[RoleEnum.TENANT_ADMIN]`
  - `tenant_user` -> allowed roles `[RoleEnum.TENANT_ADMIN, RoleEnum.TENANT_USER]`
- Success response contract for both classes remains `200` with route namespace payload.

### Validation

- TypeScript passes for route compile and request schema usage.
- Route-level unit/integration behavior preserves prior allow/deny outcomes.

---

## Phase 2 - Remove Legacy Split Tenant Access Routes

### Files Changed

| File | Change |
|------|--------|
| `apps/api/src/routes/authorization.ts` | Remove `GET /tenant/admin/:tenantId` and `GET /tenant/user/:tenantId` handlers after unified route is in place. |

### Design Details

- Remove both legacy handlers in the same change set that introduces the new route to avoid duplicate contract surface.
- Keep `/platform/ping` untouched.
- Preserve existing auth error structure by continuing to use `authenticate` + `authorize`.

### Validation

- Integration tests no longer rely on removed legacy paths.
- No references to legacy route paths remain in API docs tests.

---

## Phase 3 - Update OpenAPI Source To Match Route Surface

### Files Changed

| File | Change |
|------|--------|
| `apps/api/src/docs/openapi.ts` | Remove old tenant admin/user GET path docs and add `POST /api/v1/tenant/access` with request body schema and response/security metadata. |
| `apps/api/tests/integration/api-docs.spec.ts` | Update expected documented paths/security assertions to new tenant access endpoint. |

### Design Details

- Add new path entry:
  - `POST /api/v1/tenant/access`
  - request schema fields: `authClass`, `tenantId`
  - protected by bearer auth
  - responses include `200`, `400`, `401`, `403`
- Remove old `/api/v1/tenant/admin/{tenantId}` and `/api/v1/tenant/user/{tenantId}` docs assertions.
- Ensure OpenAPI still reflects all existing unaffected auth routes.

### Validation

- `api-docs.spec.ts` passes and validates the new documented path/security contract.

---

## Phase 4 - Update Integration Tests For Consolidated Contract

### Files Changed

| File | Change |
|------|--------|
| `apps/api/tests/integration/tenant-admin-rbac.spec.ts` | Migrate tenant-admin denied scope test to `POST /api/v1/tenant/access`. |
| `apps/api/tests/integration/tenant-user-rbac.spec.ts` | Migrate tenant-user tests to `POST /api/v1/tenant/access`; add explicit tenant-user escalation denial case. |

### Design Details

- Tenant-admin scenario:
  - request body `{ authClass: "tenant_admin", tenantId: "tenant-other" }` returns `403 forbidden_tenant`
- Tenant-user scenarios:
  - request body `{ authClass: "tenant_user", tenantId: "tenant-acme" }` with malformed token returns `401 invalid_claims`
  - request body `{ authClass: "tenant_admin", tenantId: "tenant-acme" }` with tenant-user token returns `403 forbidden_role`
  - add allowed and denied scope checks for tenant-user route semantics as needed to satisfy acceptance criteria.

### Validation

- Tenant RBAC integration suite validates all requested allow/deny combinations under the new endpoint.

---

## Phase 5 - Final Validation And Compliance Checks

### Validation Checklist

- [ ] `pnpm --filter api test -- tenant-admin-rbac api-docs tenant-user-rbac`
- [ ] `pnpm --filter api typecheck`
- [ ] `pnpm specify.audit`
- [ ] OpenAPI route contract is aligned with implementation (`apps/api/src/docs/openapi.ts`).
- [ ] No lingering references to removed legacy tenant access endpoints.

## Dependency Map

```
Phase 1 (Add POST /tenant/access)
    ↓
Phase 2 (Remove legacy GET routes)
    ↓
Phase 3 (OpenAPI + docs tests)
    ↓
Phase 4 (RBAC integration test migration)
    ↓
Phase 5 (Validation + audit)
```

## Risk Notes

- `authorize` currently resolves tenant scope from `req.params.tenantId` or `x-tenant-id`; unified body contract requires an adapter to avoid changing shared middleware behavior.
- Removing legacy routes can break consumers that are not yet migrated; this is acceptable within Jira scope but should be called out in PR notes.
- OpenAPI drift risk is high if route and docs are not updated in the same commit; keep these changes coupled.
