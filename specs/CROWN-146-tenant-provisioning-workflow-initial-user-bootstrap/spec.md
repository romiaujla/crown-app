# Feature Specification: API Tenant Provisioning Workflow with Initial User Bootstrap

**Feature Branch**: `feat/CROWN-146-tenant-provisioning-workflow-initial-user-bootstrap`
**Created**: 2026-03-17
**Status**: Draft
**Input**: Jira issue `CROWN-146` – "API | Tenant provisioning workflow with initial user bootstrap"

## User Scenarios & Testing _(mandatory)_

### User Story 1 – Bootstrap Initial Users During Tenant Provisioning (Priority: P1)

As a super admin, I want the tenant provisioning workflow to create the initial users defined in the onboarding submission so that the new tenant is immediately staffed with at least a tenant admin and any other assigned users.

**Why this priority**: Without initial user creation in the provisioning workflow, the guided onboarding flow validates user entries but discards them, leaving the tenant without any operable user accounts.

**Independent Test**: Call `provisionTenant` with a valid onboarding payload containing multiple initial users and verify that `User`, `TenantMembership`, and `TenantMembershipRoleAssignment` records are created for each entry.

**Acceptance Scenarios**:

1. **Given** a valid onboarding submission with two initial users (one `tenant_admin`, one `dispatcher`), **When** provisioning completes successfully, **Then** a `User` record, `TenantMembership`, and `TenantMembershipRoleAssignment` exist for each user.
2. **Given** an initial user whose email already exists as a platform `User`, **When** provisioning runs, **Then** the existing `User` record is reused and a new `TenantMembership` + role assignment is created for the new tenant without duplicating the user.
3. **Given** provisioning succeeds, **When** the response is inspected, **Then** the response shape matches the existing `TenantCreateOnboardingSubmissionResponseSchema` (no new fields).

---

### User Story 2 – Enforce Tenant Admin Presence and One-Role-Per-User (Priority: P1)

As a super admin, I want the provisioning workflow to enforce that at least one initial user is a tenant admin and that each user has exactly one role, so the tenant starts with a valid access baseline.

**Why this priority**: Without runtime enforcement, contract validation alone cannot prevent data inconsistency when DB writes are involved.

**Independent Test**: Verify that the provisioning service rejects payloads where tenant-admin is missing from initial users and validates one role per user at the workflow level.

**Acceptance Scenarios**:

1. **Given** contract-level validation has already enforced `tenant_admin` presence and single-role-per-user, **When** the provisioning service receives the validated payload, **Then** the service relies on contract validation and does not re-validate these constraints (no redundant checks).
2. **Given** each initial user entry has exactly one `roleCode`, **When** the user bootstrap runs, **Then** exactly one `TenantMembershipRoleAssignment` is created per user with that role.
3. **Given** the initial user with `roleCode = tenant_admin`, **When** their role assignment is created, **Then** `isPrimary` is set to `true` on the first `tenant_admin` assignment.

---

### User Story 3 – Preserve Unstaffed Roles Without Placeholder Records (Priority: P2)

As a super admin, I want selected roles that have no assigned user to remain unstaffed without creating placeholder records, so the role catalog stays clean and those roles can be staffed in a later follow-up.

**Why this priority**: The acceptance criteria explicitly state that selected non-admin roles may remain unstaffed. Creating placeholder records would complicate future role management.

**Independent Test**: Provision a tenant with `selectedRoleCodes` including roles that have no corresponding entry in `initialUsers`, and verify no `TenantMembershipRoleAssignment` records exist for those unstaffed roles.

**Acceptance Scenarios**:

1. **Given** `selectedRoleCodes` includes `['tenant_admin', 'dispatcher', 'driver']` but `initialUsers` only assigns `tenant_admin` and `dispatcher`, **When** provisioning completes, **Then** no `TenantMembershipRoleAssignment` record exists for `driver`.
2. **Given** the tenant's management system type defines available roles, **When** a reviewer inspects the provisioned state, **Then** unstaffed roles are discoverable through the existing `ManagementSystemTypeRole` catalog rather than tenant-specific placeholder data.

---

### User Story 4 – Replace Actor-Only Membership with Full User Bootstrap (Priority: P1)

As a maintainer, I want the provisioning workflow to replace the current actor-only `TenantMembership` creation with the full initial user bootstrap, so the workflow is driven exclusively by the onboarding submission payload.

**Why this priority**: The existing actor-membership creation (from CROWN-150) was a stopgap. CROWN-146 replaces it with payload-driven user provisioning.

**Independent Test**: Verify that `provisionTenant` no longer creates a membership for `actorSub` when that actor is not listed in `initialUsers`.

**Acceptance Scenarios**:

1. **Given** the provisioning actor (`actorSub`) is not in `initialUsers`, **When** provisioning completes, **Then** no `TenantMembership` exists for the actor's user ID.
2. **Given** the provisioning actor happens to share an email with an initial user entry, **When** provisioning runs, **Then** the initial user bootstrap creates the membership through the standard flow, not through the legacy actor path.

---

### User Story 5 – Update OpenAPI Documentation (Priority: P2)

As a maintainer, I want the manual OpenAPI documentation to reflect the behavioral change from contract-only to full provisioning workflow, so API consumers understand that user bootstrap now occurs on submission.

**Why this priority**: The engineering constitution requires OpenAPI alignment for route behavior changes.

**Independent Test**: Inspect `apps/api/src/docs/openapi.ts` and verify the `/api/v1/platform/tenant` endpoint description documents user bootstrap behavior.

**Acceptance Scenarios**:

1. **Given** the OpenAPI spec for `POST /api/v1/platform/tenant`, **When** a reviewer inspects the docs, **Then** the endpoint description mentions that initial users are created and assigned to the tenant during provisioning.
2. **Given** the response schema has not changed, **When** the docs revision is reviewed, **Then** the `TenantProvisionResponse` component schema remains unchanged.

---

### Edge Cases

- An initial user's email collides with an existing platform `User` record (reuse the existing user, create new membership).
- Two initial users in the same payload share the same email (blocked by contract validation before reaching the service).
- The same user is already a member of another tenant (allowed — multi-tenant membership is supported by the data model).
- User creation succeeds but membership creation fails mid-bootstrap (entire user bootstrap must be atomic via transaction).
- The `tenant_admin` role record does not exist in the `roles` table (service returns a conflict/error rather than silently skipping).
- A role code in `initialUsers` does not exist in the `roles` table (service fails the provisioning with a clear error).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The provisioning service MUST accept the full onboarding submission payload (`tenant`, `selectedRoleCodes`, `initialUsers`) from the route handler.
- **FR-002**: For each entry in `initialUsers`, the service MUST find an existing `User` by email or create a new `User` record with `displayName` derived from `firstName` and `lastName`, `email` as provided, `accountStatus` defaulting to `active`, and `passwordHash` as `null`.
- **FR-003**: For each initial user, the service MUST create a `TenantMembership` linking the user to the new tenant with `membershipStatus = 'active'`.
- **FR-004**: For each initial user, the service MUST create a `TenantMembershipRoleAssignment` with the user's specified `roleCode`, `assignmentStatus = 'active'`, and `isPrimary = true` for the first `tenant_admin` assignment.
- **FR-005**: The service MUST wrap the user bootstrap (user find-or-create, membership, and role assignment creation) in a Prisma `$transaction` to ensure atomicity.
- **FR-006**: The service MUST remove the existing actor-only `TenantMembership` and `TenantMembershipRoleAssignment` creation that was introduced in CROWN-150.
- **FR-007**: Selected role codes that have no corresponding initial user entry MUST NOT produce any placeholder records.
- **FR-008**: If a required role record (e.g., a `roleCode` from `initialUsers`) does not exist in the `roles` table, the service MUST return a conflict result with a descriptive error message.
- **FR-009**: The route handler MUST forward `selectedRoleCodes` and `initialUsers` from the validated request body to the provisioning service.
- **FR-010**: The provisioning response schema MUST remain unchanged (`TenantCreateOnboardingSubmissionResponseSchema`).
- **FR-011**: Manual OpenAPI documentation MUST be updated to describe the user bootstrap behavior on the `POST /api/v1/platform/tenant` endpoint.
- **FR-012**: This story MUST NOT implement multi-role assignment, role-switching, or role-permission management beyond the v1 single-role-per-user model.

### Key Entities _(include if feature involves data)_

- **User**: Global platform identity. Created or reused during tenant provisioning for each initial user entry. Fields: `email` (unique), `displayName`, `accountStatus`, `passwordHash` (null for bootstrapped accounts).
- **TenantMembership**: Links a `User` to a `Tenant`. One record per user per tenant. Fields: `userId`, `tenantId`, `membershipStatus`.
- **TenantMembershipRoleAssignment**: Links a `TenantMembership` to a `Role`. One record per membership per role (v1: exactly one). Fields: `tenantMembershipId`, `roleId`, `assignmentStatus`, `isPrimary`.
- **Role**: Reference data for tenant-scoped roles (`tenant_admin`, `dispatcher`, etc.). Looked up by `roleCode` during bootstrap.

### Assumptions

- Contract-level validation (from CROWN-145) has already enforced `tenant_admin` presence, single-role-per-user, no duplicate emails, and role-in-selected-list constraints before the service is called.
- The `User` model's `username` field is nullable and not required during admin-bootstrapped user creation.
- Bootstrapped user accounts have `passwordHash = null` and `accountStatus = 'active'`; credential setup is deferred to a future authentication story.
- The provisioning actor (`actorSub`) is a platform super-admin who may or may not appear in the `initialUsers` list.
- `isPrimary = true` is set on the first `tenant_admin` role assignment encountered during bootstrap iteration.

### Dependencies

- `packages/types/src/index.ts` – shared onboarding submission schemas (CROWN-145, already implemented).
- `apps/api/src/tenant/provision-service.ts` – existing provisioning workflow to extend.
- `apps/api/src/tenant/types.ts` – `ProvisionTenantInput` type to expand.
- `apps/api/src/tenant/contracts.ts` – API contract re-exports (unchanged).
- `apps/api/src/routes/platform-tenants.ts` – route handler field mapping to update.
- `apps/api/src/docs/openapi.ts` – manual OpenAPI docs to update.
- `apps/api/prisma/schema.prisma` – `User`, `TenantMembership`, `TenantMembershipRoleAssignment`, `Role` models (no schema changes needed).
- `apps/api/tests/integration/tenant-provisioning.spec.ts` – existing tests to update.
- `apps/api/tests/contract/platform-tenant-provision.contract.spec.ts` – existing contract tests to update.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Provisioning with a valid onboarding payload creates one `User` record (or reuses existing), one `TenantMembership`, and one `TenantMembershipRoleAssignment` per initial user entry.
- **SC-002**: The first `tenant_admin` role assignment has `isPrimary = true`.
- **SC-003**: No `TenantMembership` or `TenantMembershipRoleAssignment` is created for the `actorSub` unless that actor is listed in `initialUsers`.
- **SC-004**: Selected roles with no initial user produce zero database records.
- **SC-005**: Missing role records cause provisioning to fail with a descriptive conflict rather than silently skipping.
- **SC-006**: All existing contract and integration tests pass after update, and new tests cover the bootstrap behavior.
- **SC-007**: OpenAPI docs for `POST /api/v1/platform/tenant` describe user bootstrap behavior.
- **SC-008**: `pnpm --filter @crown/api typecheck` passes with zero errors.
- **SC-009**: `pnpm specify.audit` passes with zero findings.
