# Feature Specification: API — Align Tenant Provisioning And Role-Template Enablement With Normalized Role Model

**Feature Branch**: `feat/CROWN-150-align-tenant-provisioning-role-template-enablement`
**Created**: 2026-03-17
**Status**: Draft
**Input**: Jira issue `CROWN-150` — "API | Align tenant provisioning and role-template enablement with normalized role model"

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Provision A Tenant With A Management System Type And Role Template (Priority: P1)

As a super admin, I want to provision a new tenant by selecting a management system type so that the provisioned tenant is automatically assigned the correct default roles from the role template and the provisioning actor receives a tenant membership with the `tenant_admin` role.

**Why this priority**: Tenant provisioning currently creates the tenant record and schema but does not wire in the management system type selection or create the actor's membership and role assignment. Without this, newly provisioned tenants have no membership or role data, and the tenant admin cannot access the workspace.

**Independent Test**: A reviewer can call `POST /api/v1/platform/tenant` with `{ name, slug, management_system_type_code }` using a super admin JWT and confirm the response includes the selected management system type, the actor's membership is created in the database, and the actor has a `tenant_admin` role assignment for that tenant.

**Acceptance Scenarios**:

1. **Given** a super admin user and a valid management system type code (`transportation`), **When** the super admin calls `POST /api/v1/platform/tenant` with `{ name: "Acme Logistics", slug: "acme-logistics", management_system_type_code: "transportation" }`, **Then** the response status is `201`, the tenant is created with status `provisioned`, and the response body includes `management_system_type_code: "transportation"`.
2. **Given** a successful tenant provisioning request, **When** provisioning completes, **Then** a `TenantMembership` record is created in the database linking the provisioning actor (identified by `actorSub` from the JWT `sub` claim) to the new tenant with `membership_status: "active"`.
3. **Given** a successful tenant provisioning request, **When** provisioning completes, **Then** a `TenantMembershipRoleAssignment` record is created in the database assigning the `tenant_admin` role to the actor's tenant membership with `assignment_status: "active"` and `is_primary: true`.
4. **Given** a provisioning request with `management_system_type_code: "transportation"`, **When** provisioning completes, **Then** the `management_system_type_roles` template for `transportation` version `1.0` with `is_default: true` determines which roles are available to the tenant, and those roles are persisted as enabled roles for the tenant.
5. **Given** a provisioning request with an invalid or missing `management_system_type_code`, **When** the request is validated, **Then** the API returns `400` with `error_code: "validation_error"`.

---

### User Story 2 — Provisioning Response Includes Management System Type Metadata (Priority: P1)

As a super admin, I want the tenant provisioning response to include the selected management system type code so the front-end can confirm the configuration applied during provisioning.

**Why this priority**: The current provisioning response does not include the management system type selection. Including it confirms to the caller that the requested configuration was applied.

**Independent Test**: Call `POST /api/v1/platform/tenant` with a valid management system type code and verify the response body includes `management_system_type_code`.

**Acceptance Scenarios**:

1. **Given** a successful provisioning with `management_system_type_code: "transportation"`, **When** the response is returned, **Then** the JSON body includes `management_system_type_code: "transportation"`.
2. **Given** a successful provisioning, **When** the response is returned, **Then** the response schema conforms to the updated `TenantProvisionResponseSchema` which includes the `management_system_type_code` field.

---

### User Story 3 — Existing Provisioning Behavior Is Preserved (Priority: P1)

As a super admin, I want the existing provisioning behavior (tenant record creation, schema creation, migration execution, conflict handling, failure handling) to remain unchanged so that adding management system type selection and membership creation does not break the core provisioning flow.

**Why this priority**: Tenant provisioning is a critical platform operation. Preserving backward-compatible behavior for tenant record and schema creation protects the existing platform.

**Independent Test**: Run the existing provisioning integration and contract tests and confirm they still pass with the updated code (after adapting payloads to include the new required `management_system_type_code` field).

**Acceptance Scenarios**:

1. **Given** a valid provisioning request, **When** the tenant is created, **Then** the tenant record, schema, and migrations are applied exactly as before.
2. **Given** a duplicate slug, **When** the tenant already exists with `active` status, **Then** the API returns `409` conflict.
3. **Given** a migration failure during provisioning, **When** the migration execution fails, **Then** the API returns `500` with `error_code: "migration_failed"` and the tenant status is set to `provisioning_failed`.

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The `TenantProvisionRequestSchema` MUST require a `management_system_type_code` field validated against `ManagementSystemTypeCodeSchema` from `@crown/types`.
- **FR-002**: The `provisionTenant` function MUST accept `managementSystemTypeCode` in `ProvisionTenantInput` and look up the `ManagementSystemType` record (with its default roles) from the database.
- **FR-003**: If no matching `ManagementSystemType` is found for the requested code, `provisionTenant` MUST return a validation-level error before creating the tenant record or schema.
- **FR-004**: After successful tenant record creation, schema creation, and migration execution, `provisionTenant` MUST create a `TenantMembership` record linking the provisioning actor (`actorSub`) to the new tenant with `membershipStatus: "active"`.
- **FR-005**: After creating the membership, `provisionTenant` MUST create a `TenantMembershipRoleAssignment` record assigning the `tenant_admin` role to the actor's membership with `assignmentStatus: "active"` and `isPrimary: true`.
- **FR-006**: The `TenantProvisionResponseSchema` MUST include a `management_system_type_code` field in the response body.
- **FR-007**: The `ProvisionTenantSuccessResult` type MUST include `managementSystemTypeCode` so the route handler can map it to the response schema.
- **FR-008**: The OpenAPI documentation in `apps/api/src/docs/openapi.ts` MUST be updated to reflect the new `management_system_type_code` field in both the request and response schemas.
- **FR-009**: Existing contract and integration tests for tenant provisioning MUST be updated to include the new required field and verify the expanded response contract.
- **FR-010**: The role template lookup MUST resolve the `ManagementSystemType` using both `typeCode` and the current version (`1.0`) to ensure version-safe resolution.

### Key Entities

- **ManagementSystemType**: The role template catalog entry that defines which roles are available for a tenant configuration. Looked up by `typeCode` + `version` during provisioning.
- **ManagementSystemTypeRole**: The junction table linking a `ManagementSystemType` to its available `Role` entries, with `isDefault` flag distinguishing default-enabled versus opt-in roles.
- **TenantMembership**: The per-tenant membership record created for the provisioning actor, linking `User` to `Tenant` with an active membership status.
- **TenantMembershipRoleAssignment**: The role assignment record created for the actor's tenant membership, assigning the `tenant_admin` role as the primary active assignment.
- **Role**: The shared role catalog. The `tenant_admin` role (scope: `tenant`, authClass: `tenant_admin`) is the mandatory role assigned to the provisioning actor.
- **User**: The provisioning actor, resolved from `actorSub` (JWT `sub` claim). Must exist in the `users` table for the membership foreign key constraint.

## Assumptions

- The normalized control-plane schema from CROWN-153 (PR #69) is the source of truth — `users`, `roles`, `tenant_memberships`, `tenant_membership_role_assignments`, `management_system_types`, and `management_system_type_roles` tables all exist and are seeded.
- The provisioning actor (`actorSub` from the JWT `sub` claim) corresponds to a valid `User.id` in the `users` table. The super admin user is always seeded before provisioning can occur.
- The `management_system_type_code` is always paired with the current version (`1.0`). Multi-version type resolution is not in scope.
- The `tenant_admin` role already exists in the `roles` table with `roleCode: "tenant_admin"`, `scope: "tenant"`, `authClass: "tenant_admin"`.
- Existing tests use mocked Prisma calls; the new membership/role-assignment creation will follow the same mocking pattern.

## Out Of Scope

- Allowing the provisioning request to override which roles from the template are enabled (all defaults are enabled automatically).
- Creating a separate `tenant_enabled_roles` junction or tracking which roles are active per tenant beyond the membership assignment model.
- Multi-version management system type selection (only version `1.0` is supported).
- Provisioning non-admin memberships for additional users during the provisioning call.
- Modifying the tenant schema DDL or migrations based on the selected management system type.
- Front-end changes to the tenant creation form.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: `POST /api/v1/platform/tenant` with a valid `management_system_type_code` returns `201` with the new field in the response body.
- **SC-002**: After provisioning, a `TenantMembership` row exists linking the actor user to the new tenant with `membership_status: "active"`.
- **SC-003**: After provisioning, a `TenantMembershipRoleAssignment` row exists assigning the `tenant_admin` role to the actor's membership with `assignment_status: "active"` and `is_primary: true`.
- **SC-004**: `POST /api/v1/platform/tenant` without `management_system_type_code` returns `400` with `error_code: "validation_error"`.
- **SC-005**: All existing provisioning contract tests pass after updating payloads to include `management_system_type_code`.
- **SC-006**: All existing provisioning integration tests pass after updating inputs to include the new field.
- **SC-007**: The OpenAPI spec in `apps/api/src/docs/openapi.ts` reflects the updated request and response schemas.
- **SC-008**: `pnpm --filter api typecheck` passes with zero errors.
