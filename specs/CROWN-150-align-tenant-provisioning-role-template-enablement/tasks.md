# Task Breakdown: API — Align Tenant Provisioning And Role-Template Enablement With Normalized Role Model

**Feature Branch**: `feat/CROWN-150-align-tenant-provisioning-role-template-enablement`
**Created**: 2026-03-17
**Status**: Draft
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Tasks

### Task 1 — Expand Provision Request And Response Contracts

**Phase**: 1
**Files**: `apps/api/src/tenant/contracts.ts`
**Scope**:
- Add `management_system_type_code` (required, validated by `ManagementSystemTypeCodeSchema` from `@crown/types`) to `TenantProvisionRequestSchema`.
- Add `management_system_type_code` (required, validated by `ManagementSystemTypeCodeSchema`) to `TenantProvisionResponseSchema`.
- Update inferred types: `TenantProvisionRequest`, `TenantProvisionResponse`.

**Acceptance**: TypeScript compiles. Schema parse accepts/rejects the new field correctly.

---

### Task 2 — Expand Provision Input And Result Types

**Phase**: 1
**Files**: `apps/api/src/tenant/types.ts`
**Scope**:
- Add `managementSystemTypeCode: string` to `ProvisionTenantInput`.
- Add `managementSystemTypeCode: string` to `ProvisionTenantSuccessResult`.

**Acceptance**: TypeScript compiles. Downstream consumers of these types show expected type errors until updated.

---

### Task 3 — Update Provision Service To Validate Management System Type And Create Membership

**Phase**: 2
**Files**: `apps/api/src/tenant/provision-service.ts`
**Scope**:
- Import `prisma` models for `managementSystemType`, `role`, `tenantMembership`, `tenantMembershipRoleAssignment`.
- At the start of `provisionTenant`, look up `ManagementSystemType` by `typeCode` + version `1.0`. If not found, return `{ status: "conflict", message: "invalid management system type code" }`.
- After setting the tenant to `active` status, look up the `tenant_admin` role by `roleCode`.
- Create a `TenantMembership` linking `actorSub` (as `userId`) to the new `tenant.id`.
- Create a `TenantMembershipRoleAssignment` linking the membership to the `tenant_admin` role with `isPrimary: true`.
- Include `managementSystemTypeCode` in the returned success result.

**Acceptance**: TypeScript compiles. Unit test confirms membership and role assignment creation on success path and validation error on invalid type code.

---

### Task 4 — Update Route Handler Response Mapping

**Phase**: 3
**Files**: `apps/api/src/routes/platform-tenants.ts`
**Scope**:
- Pass `managementSystemTypeCode: parsed.data.management_system_type_code` into the provision function call alongside existing fields.
- Map `result.managementSystemTypeCode` as `management_system_type_code` into the `TenantProvisionResponseSchema.parse()` call.

**Acceptance**: TypeScript compiles. Contract test confirms `management_system_type_code` in 201 response body.

---

### Task 5 — Update OpenAPI Documentation

**Phase**: 4
**Files**: `apps/api/src/docs/openapi.ts`
**Scope**:
- Add `management_system_type_code` to the `TenantProvisionRequest` component schema (`required`, `type: "string"`, `enum` of management system type codes).
- Add `management_system_type_code` to the `TenantProvisionResponse` component schema.

**Acceptance**: OpenAPI schema is valid. Swagger UI renders the updated fields.

---

### Task 6 — Update Integration Tests For Provision Service

**Phase**: 5
**Files**: `apps/api/tests/integration/tenant-provisioning.spec.ts`
**Scope**:
- Add `managementSystemTypeCode: "transportation"` to all `provisionTenant()` call inputs.
- Add Prisma mocks for `managementSystemType.findUnique`, `role.findUnique`, `tenantMembership.create`, `tenantMembershipRoleAssignment.create`.
- Add assertions verifying `tenantMembership.create` and `tenantMembershipRoleAssignment.create` are called with correct arguments on success.
- Add a test case for invalid management system type code returning a conflict-like validation error.
- Verify `managementSystemTypeCode` is present in the success result.

**Acceptance**: All tests in the file pass.

---

### Task 7 — Update Contract Tests For Provision Endpoint

**Phase**: 5
**Files**: `apps/api/tests/contract/platform-tenant-provision.contract.spec.ts`
**Scope**:
- Add `management_system_type_code: "transportation"` to all `send()` payloads.
- Update `createProvisioned()` helper to include `managementSystemTypeCode` in the result.
- Add response assertion checking `management_system_type_code` is in the 201 body.
- Add a test case: request without `management_system_type_code` returns 400.

**Acceptance**: All tests in the file pass.

---

### Task 8 — Final Validation And Commit

**Phase**: 6
**Files**: (none — validation only)
**Scope**:
- Run `pnpm --filter api typecheck`.
- Run `pnpm --filter api test` (full suite).
- Verify no lint violations.
- Confirm existing provisioning, deprovision, reference-data, and directory contract/integration tests still pass.
- Commit and push all changes.

**Acceptance**: All checks green. Branch is pushed.

## Task Dependency Order

```
Task 1 (Request/Response Contracts)  ←─ parallel with Task 2
Task 2 (Input/Result Types)          ←─ parallel with Task 1
    ↓
Task 3 (Provision Service)
    ↓
Task 4 (Route Handler)
    ↓
Task 5 (OpenAPI Docs)                ←─ independent of Task 4
    ↓
Task 6 (Integration Tests)           ←─ parallel with Task 7
Task 7 (Contract Tests)              ←─ parallel with Task 6
    ↓
Task 8 (Final Validation)
```
