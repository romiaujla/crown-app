# Implementation Plan: API — Align Tenant Provisioning And Role-Template Enablement With Normalized Role Model

**Feature Branch**: `feat/CROWN-150-align-tenant-provisioning-role-template-enablement`
**Created**: 2026-03-17
**Status**: Draft
**Spec**: [spec.md](spec.md)

## Plan Overview

Expand the tenant provisioning flow to accept a `management_system_type_code`, look up the role template from the normalized schema, create a `TenantMembership` for the provisioning actor, and assign them the `tenant_admin` role. The change touches the contract layer (Zod schemas, types), the provision service, the route handler response mapping, OpenAPI documentation, and tests.

## Phase 1 — Expand Contracts And Types

### Files Changed

| File | Change |
|------|--------|
| `packages/types/src/index.ts` | No changes — `ManagementSystemTypeCodeSchema` already exists and will be used by the API contract. |
| `apps/api/src/tenant/contracts.ts` | Add `management_system_type_code` field (validated via `ManagementSystemTypeCodeSchema`) to `TenantProvisionRequestSchema`. Add `management_system_type_code` field to `TenantProvisionResponseSchema`. |
| `apps/api/src/tenant/types.ts` | Add `managementSystemTypeCode` to `ProvisionTenantInput`. Add `managementSystemTypeCode` to `ProvisionTenantSuccessResult`. |

### Design Details

The request schema gains a required `management_system_type_code` field using the existing `ManagementSystemTypeCodeSchema` from `@crown/types`. The response schema gains the same field echoed back. The internal types mirror this with camelCase `managementSystemTypeCode`.

### Validation

- `pnpm --filter api typecheck` passes after updating types.

---

## Phase 2 — Update Provision Service

### Files Changed

| File | Change |
|------|--------|
| `apps/api/src/tenant/provision-service.ts` | After tenant record + schema + migration creation, look up the `ManagementSystemType` by `typeCode` (version `1.0`), resolve the `tenant_admin` role by `roleCode`, create `TenantMembership` and `TenantMembershipRoleAssignment` records. Return `managementSystemTypeCode` in the success result. Return a validation error if the management system type is not found. |

### Design Details

1. **Management system type lookup**: Before creating the tenant record, query `prisma.managementSystemType.findUnique({ where: { typeCode_version: { typeCode, version: "1.0" } } })`. If not found, return `{ status: "conflict", message: "invalid management system type code" }`.

2. **Membership and role assignment**: After the tenant is set to `active` status, look up the `tenant_admin` role from the `roles` table by `roleCode`. Then create:
   - `prisma.tenantMembership.create({ data: { userId: input.actorSub, tenantId: tenant.id, membershipStatus: "active" } })`
   - `prisma.tenantMembershipRoleAssignment.create({ data: { tenantMembershipId: membership.id, roleId: tenantAdminRole.id, assignmentStatus: "active", isPrimary: true } })`

3. **Transaction safety**: The membership and role assignment creation use the existing Prisma client (not the raw `pg` client). Since the tenant record is already committed to the database at this point, a failure in membership creation after the tenant is active is an acceptable partial state — the tenant exists and the membership can be retried. This matches the current pattern where tenant status is set to `active` before the function returns.

4. **Return value**: The success result includes `managementSystemTypeCode` so the route handler can include it in the response.

### Validation

- Unit test for `provisionTenant` updated to verify membership and role assignment creation.
- `pnpm --filter api typecheck` passes.

---

## Phase 3 — Update Route Handler And Response Mapping

### Files Changed

| File | Change |
|------|--------|
| `apps/api/src/routes/platform-tenants.ts` | Pass `managementSystemTypeCode` from the parsed request body (as `management_system_type_code`) into the provision function call. Map `result.managementSystemTypeCode` into the response object for `TenantProvisionResponseSchema.parse()`. |

### Design Details

The route handler maps the snake_case request field to camelCase for the service input and maps the camelCase result field back to snake_case for the response:

```typescript
const result = await provision({
  ...parsed.data,
  managementSystemTypeCode: parsed.data.management_system_type_code,
  actorSub: req.auth?.sub ?? "unknown-actor"
});
```

The response mapping adds:
```typescript
management_system_type_code: result.managementSystemTypeCode
```

### Validation

- Contract tests pass with updated payloads.

---

## Phase 4 — Update OpenAPI Documentation

### Files Changed

| File | Change |
|------|--------|
| `apps/api/src/docs/openapi.ts` | Add `management_system_type_code` to the `TenantProvisionRequest` schema (required, enum of management system type codes). Add `management_system_type_code` to the `TenantProvisionResponse` schema. |

### Validation

- Manual review of Swagger UI confirms updated schema.

---

## Phase 5 — Update Tests

### Files Changed

| File | Change |
|------|--------|
| `apps/api/tests/integration/tenant-provisioning.spec.ts` | Add `managementSystemTypeCode` to all `provisionTenant()` call inputs. Add Prisma mocks for `managementSystemType.findUnique`, `role.findUnique`, `tenantMembership.create`, `tenantMembershipRoleAssignment.create`. Verify membership and role assignment creation in success path. Add test case for invalid management system type code. |
| `apps/api/tests/contract/platform-tenant-provision.contract.spec.ts` | Add `management_system_type_code` to all request payloads. Update response assertions to include `management_system_type_code`. Add test for missing `management_system_type_code` returning 400. |

### Validation

- `pnpm --filter api test` passes (full test suite).

---

## Phase 6 — Final Validation

### Scope

- Run `pnpm --filter api typecheck`
- Run `pnpm --filter api test`
- Verify no lint violations
- Commit and push all changes

---

## Dependency Map

```
Phase 1 (Contracts & Types)
    ↓
Phase 2 (Provision Service)
    ↓
Phase 3 (Route Handler)
    ↓
Phase 4 (OpenAPI Docs)      ← independent of Phase 3
    ↓
Phase 5 (Tests)
    ↓
Phase 6 (Final Validation)
```

## Risk Notes

- **Actor sub as user ID**: The current `actorSub` comes from the JWT `sub` claim. This must match a `User.id` in the database for the `TenantMembership` foreign key. The seeded super admin user's ID is used as `sub` in the JWT, so this holds for the current auth model.
- **Prisma client vs. raw pg client**: Membership and role assignment creation use the Prisma client, which runs against the control-plane schema. The raw `pg` client is only used for tenant schema DDL. These are separate connection contexts.
- **Partial provisioning state**: If membership creation fails after the tenant is set to `active`, the tenant exists without a membership. This is acceptable for the current scope — the super admin can retry or the membership can be created separately. Adding a Prisma transaction wrapper around the final status update + membership creation could be a follow-up enhancement.
