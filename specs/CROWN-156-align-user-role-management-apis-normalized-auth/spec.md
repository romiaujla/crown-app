# Feature Specification: API — Align User And Role Management APIs With Normalized Auth Model

**Feature Branch**: `feat/CROWN-156-align-user-role-management-apis-normalized-auth`
**Created**: 2026-03-17
**Status**: Draft
**Input**: Jira issue `CROWN-156` — "API | Align user and role management APIs with normalized auth model"

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Super Admin Searches Platform Users (Priority: P1)

As a super admin, I want to search and list all platform users with optional filters so I can view the user base and identify users by name, email, account status, or role assignment.

**Why this priority**: The platform has no user visibility surface. Super admins need to see who exists before they can manage memberships or role assignments. This is the prerequisite for every downstream management action.

**Independent Test**: A reviewer can call `POST /api/v1/platform/users/search` with a valid super admin token and confirm the response contains the expected user list with role summaries matching normalized database state.

**Acceptance Scenarios**:

1. **Given** a super admin with a valid token, **When** `POST /platform/users/search` is called with no filters, **Then** the response is `200` with a `data.userList` array containing all seeded users and a `meta.totalRecords` count.
2. **Given** a super admin with a valid token, **When** `POST /platform/users/search` is called with `{ "filters": { "search": "admin" } }`, **Then** the response contains only users whose email, username, or display name matches the search term.
3. **Given** a super admin with a valid token, **When** `POST /platform/users/search` is called with `{ "filters": { "accountStatus": "active" } }`, **Then** the response contains only users whose `accountStatus` is `active`.
4. **Given** a tenant admin token, **When** `POST /platform/users/search` is called, **Then** the response is `403` with `errorCode: "forbidden_role"`.

---

### User Story 2 — Super Admin Views User Detail With Memberships And Role Assignments (Priority: P1)

As a super admin, I want to view a user's full profile including all tenant memberships and role assignments so I can understand the user's authorization state across the platform.

**Why this priority**: Viewing a user's complete normalized auth state is the prerequisite for any corrective or management action on memberships and role assignments.

**Independent Test**: A reviewer can call `GET /api/v1/platform/users/:userId` with a valid super admin token and confirm the response contains the user's profile, platform role assignments, and tenant memberships with their role assignments.

**Acceptance Scenarios**:

1. **Given** a super admin with a valid token, **When** `GET /platform/users/:userId` is called with a valid user ID, **Then** the response is `200` with the user's profile, `platformRoleAssignments` array, and `tenantMemberships` array including nested `roleAssignments`.
2. **Given** a super admin with a valid token, **When** `GET /platform/users/:userId` is called with a non-existent user ID, **Then** the response is `404` with `errorCode: "not_found"`.
3. **Given** a tenant admin token, **When** `GET /platform/users/:userId` is called, **Then** the response is `403` with `errorCode: "forbidden_role"`.

---

### User Story 3 — Super Admin Creates A Tenant Membership With Role Assignment (Priority: P1)

As a super admin, I want to add a platform user to a tenant with an initial role assignment so users can gain tenant access through an explicit admin action rather than only through provisioning.

**Why this priority**: Currently, tenant membership is only created during provisioning. Super admins need the ability to add existing users to existing tenants with a role, which is the primary user-management workflow for the normalized model.

**Independent Test**: A reviewer can call `POST /api/v1/platform/tenant/membership` with a valid super admin token and verify that a new `TenantMembership` and `TenantMembershipRoleAssignment` are created in the database with the expected status and primary flag values.

**Acceptance Scenarios**:

1. **Given** a super admin and existing user and tenant, **When** `POST /platform/tenant/membership` is called with `{ "userId": "<userId>", "tenantId": "<tenantId>", "roleCode": "tenant_admin" }`, **Then** the response is `201` with the membership and assignment detail, and the database contains an active `TenantMembership` with an active `TenantMembershipRoleAssignment` where `isPrimary` is `true`.
2. **Given** a membership already exists for the user and tenant, **When** `POST /platform/tenant/membership` is called with the same `userId` and `tenantId`, **Then** the response is `409` with `errorCode: "conflict"`.
3. **Given** an invalid `roleCode` that is not a tenant-scoped role, **When** `POST /platform/tenant/membership` is called, **Then** the response is `400` with `errorCode: "validation_error"`.
4. **Given** a non-existent `userId` or `tenantId`, **When** `POST /platform/tenant/membership` is called, **Then** the response is `404` with `errorCode: "not_found"`.

---

### User Story 4 — Tenant Admin Lists Members Of Their Tenant (Priority: P1)

As a tenant admin, I want to list the members of my tenant with their role assignments so I can see who has access and what roles they hold.

**Why this priority**: Tenant admins need visibility into their own tenant's membership before they can manage role assignments. This is the tenant-scoped counterpart to the super admin user search.

**Independent Test**: A reviewer can call `POST /api/v1/tenant/members/search` with a valid tenant admin token and `x-tenant-id` header and confirm the response contains only members of the specified tenant with their role assignments.

**Acceptance Scenarios**:

1. **Given** a tenant admin with a valid token and `x-tenant-id` header, **When** `POST /tenant/members/search` is called with no filters, **Then** the response is `200` with `data.memberList` containing the members of the tenant and a `meta.totalRecords` count.
2. **Given** a tenant admin with a valid token, **When** `POST /tenant/members/search` is called with `{ "filters": { "search": "john" } }`, **Then** the response contains only members whose user email, username, or display name matches the search term.
3. **Given** a tenant admin with a valid token, **When** `POST /tenant/members/search` is called with `{ "filters": { "roleCode": "dispatcher" } }`, **Then** the response contains only members who have an active assignment for the specified role code.
4. **Given** a super admin token (no tenant membership), **When** `POST /tenant/members/search` is called, **Then** the response is `403` because the caller has no tenant scope.
5. **Given** a tenant user token, **When** `POST /tenant/members/search` is called, **Then** the response is `403` because only `tenant_admin` is authorized.

---

### User Story 5 — Tenant Admin Assigns A Role To A Tenant Member (Priority: P1)

As a tenant admin, I want to assign an available role to a member of my tenant so the member's access expands to match their responsibilities.

**Why this priority**: Without role assignment, the only way a user gets a tenant role is during membership creation. Tenant admins must be able to add roles post-membership to support real-world workflows.

**Independent Test**: A reviewer can call `POST /api/v1/tenant/members/roles` with a valid tenant admin token and verify that a new `TenantMembershipRoleAssignment` is created with the expected `roleCode` and `assignmentStatus: "active"`.

**Acceptance Scenarios**:

1. **Given** a tenant admin and an existing member in their tenant, **When** `POST /tenant/members/roles` is called with `{ "membershipId": "<id>", "roleCode": "dispatcher" }`, **Then** the response is `201` with the new assignment detail including `assignmentStatus: "active"` and `isPrimary: false`.
2. **Given** the member already has an active assignment for the specified role, **When** `POST /tenant/members/roles` is called, **Then** the response is `409` with `errorCode: "conflict"`.
3. **Given** the `membershipId` does not belong to the tenant admin's tenant, **When** `POST /tenant/members/roles` is called, **Then** the response is `403` with `errorCode: "forbidden_tenant"`.
4. **Given** the `roleCode` is not a tenant-scoped role (e.g., `super_admin`), **When** `POST /tenant/members/roles` is called, **Then** the response is `400` with `errorCode: "validation_error"`.

---

### User Story 6 — Tenant Admin Revokes A Role From A Tenant Member (Priority: P1)

As a tenant admin, I want to revoke a role from a member of my tenant so I can remove access that is no longer appropriate.

**Why this priority**: Role revocation completes the role lifecycle. Without it, roles can only be accumulated, never reduced.

**Independent Test**: A reviewer can call `POST /api/v1/tenant/members/roles/revoke` with a valid tenant admin token and verify the `TenantMembershipRoleAssignment` transitions to `assignmentStatus: "inactive"` with an `endedAt` timestamp.

**Acceptance Scenarios**:

1. **Given** a tenant admin and a member with an active role assignment, **When** `POST /tenant/members/roles/revoke` is called with `{ "membershipId": "<id>", "roleCode": "dispatcher" }`, **Then** the response is `200` with the revoked assignment showing `assignmentStatus: "inactive"`.
2. **Given** the assignment is already inactive, **When** `POST /tenant/members/roles/revoke` is called, **Then** the response is `404` with `errorCode: "not_found"`.
3. **Given** the `membershipId` does not belong to the tenant admin's tenant, **When** `POST /tenant/members/roles/revoke` is called, **Then** the response is `403` with `errorCode: "forbidden_tenant"`.
4. **Given** the member has only one active role and the admin tries to revoke it, **When** `POST /tenant/members/roles/revoke` is called, **Then** the response is `400` with `errorCode: "validation_error"` and a message indicating the last active role cannot be revoked (the member must retain at least one active role while the membership is active).

---

### User Story 7 — Tenant Admin Lists Available Roles For Their Tenant (Priority: P2)

As a tenant admin, I want to see which roles are available for assignment in my tenant so I know what options exist when managing member roles.

**Why this priority**: While lower priority than the assignment endpoints themselves, a role catalog endpoint prevents the UI from hardcoding role lists and allows the role availability to evolve per management system type.

**Independent Test**: A reviewer can call `GET /api/v1/tenant/roles` with a valid tenant admin token and confirm the response contains the set of tenant-scoped roles from the shared `roles` catalog.

**Acceptance Scenarios**:

1. **Given** a tenant admin with a valid token and `x-tenant-id` header, **When** `GET /tenant/roles` is called, **Then** the response is `200` with `data.roles` containing all tenant-scoped roles (those with `scope: "tenant"`) and their display metadata.
2. **Given** a tenant user token, **When** `GET /tenant/roles` is called, **Then** the response is `403` because only `tenant_admin` is authorized.

### Edge Cases

- A super admin creates a membership for a user who is currently `disabled`. The membership is created but the user's `accountStatus` prevents login until re-enabled. The endpoint does not block membership creation for disabled users.
- A role assignment uses `isPrimary: false` by default. The `isPrimary: true` flag is set only during membership creation (the initial role) or if the member has no other primary role.
- A revoked role assignment soft-transitions to `assignment_status: "inactive"` with an `ended_at` timestamp. The database row is preserved for audit trail.
- Revoking the last active role on an active membership is rejected to prevent orphaned memberships with no authorization grant.
- The `POST /platform/tenant/membership` endpoint validates that the `roleCode` corresponds to a role with `scope: "tenant"` — platform roles cannot be assigned through this endpoint.
- User search supports case-insensitive partial matching on `email`, `username`, and `displayName`.
- Tenant member search is scoped exclusively to the tenant identified by the `x-tenant-id` header; a tenant admin cannot search members of other tenants.
- The `TenantMembership(userId, tenantId)` unique constraint prevents duplicate memberships; the endpoint returns `409 Conflict` rather than creating a duplicate.
- The `TenantMembershipRoleAssignment(tenantMembershipId, roleId)` unique constraint prevents duplicate role assignments; the endpoint returns `409 Conflict` rather than creating a duplicate.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: `POST /api/v1/platform/users/search` MUST return a paginated list of platform users with optional filters for `search` (email/username/displayName), `accountStatus`, and `role`, accessible only to `super_admin`.
- **FR-002**: `GET /api/v1/platform/users/:userId` MUST return a user's full profile including `platformRoleAssignments` and `tenantMemberships` with nested `roleAssignments`, accessible only to `super_admin`.
- **FR-003**: `POST /api/v1/platform/tenant/membership` MUST create a `TenantMembership` and an initial `TenantMembershipRoleAssignment` with `isPrimary: true` for the specified user, tenant, and tenant-scoped role code, accessible only to `super_admin`.
- **FR-004**: `POST /api/v1/tenant/members/search` MUST return a list of members for the requesting tenant admin's tenant with optional filters for `search` and `roleCode`, accessible only to `tenant_admin`.
- **FR-005**: `POST /api/v1/tenant/members/roles` MUST create a `TenantMembershipRoleAssignment` for the specified membership and tenant-scoped role code, accessible only to `tenant_admin`, scoped to the admin's own tenant.
- **FR-006**: `POST /api/v1/tenant/members/roles/revoke` MUST soft-deactivate a `TenantMembershipRoleAssignment` by setting `assignmentStatus` to `inactive` and recording `endedAt`, accessible only to `tenant_admin`, scoped to the admin's own tenant.
- **FR-007**: `GET /api/v1/tenant/roles` MUST return all tenant-scoped roles from the shared `roles` catalog with `roleCode`, `displayName`, `description`, and `authClass`, accessible only to `tenant_admin`.
- **FR-008**: All new endpoints MUST use the existing `authenticate` → `authorize` → `rateLimitMiddleware` middleware chain.
- **FR-009**: All request bodies MUST be validated with Zod schemas before business logic executes.
- **FR-010**: All response bodies MUST use `camelCase` property names per the engineering constitution.
- **FR-011**: The `POST /platform/tenant/membership` endpoint MUST validate that the `roleCode` corresponds to a role with `scope: "tenant"` and reject platform-scoped role codes with `400`.
- **FR-012**: The `POST /tenant/members/roles` and `POST /tenant/members/roles/revoke` endpoints MUST verify the target `membershipId` belongs to the tenant admin's own tenant before proceeding.
- **FR-013**: The `POST /tenant/members/roles/revoke` endpoint MUST reject revocation of the last active role assignment on an active membership with `400`.
- **FR-014**: `POST /platform/users/search` and `POST /tenant/members/search` MUST support pagination via `page` and `pageSize` parameters with sensible defaults.
- **FR-015**: The OpenAPI documentation in `apps/api/src/docs/openapi.ts` MUST be updated with all new endpoint paths, request schemas, response schemas, and error codes.
- **FR-016**: Shared contract types (request/response schemas, enums) used by both API and potential web consumers MUST be defined in `@crown/types`.

### Key Entities

- **User**: The global identity record returned by platform user search and user detail endpoints.
- **Role**: The shared catalog entry queried for tenant-scoped roles in role listing, assignment, and validation.
- **TenantMembership**: The user-to-tenant association record created by the membership endpoint and filtered in tenant member search.
- **TenantMembershipRoleAssignment**: The tenant authorization grant record created, listed, and deactivated by the role management endpoints.
- **UserPlatformRoleAssignment**: The platform role grant record included in user detail responses for super admin visibility.
- **Tenant**: The tenant record referenced in membership creation and used for scoping tenant admin queries.

## Assumptions

- The normalized Prisma schema from `CROWN-153` is the source of truth and requires no schema changes for this story.
- The Prisma-wired auth service from `CROWN-155` is live on `main` and the `authenticate` middleware already resolves current-user context from the normalized tables.
- The `authorize` middleware correctly enforces `super_admin` for `platform` namespace routes and `tenant_admin` / `tenant_user` for `tenant` namespace routes.
- The `x-tenant-id` header is already used by the `authorize` middleware to resolve tenant context for tenant-scoped routes.
- The shared `roles` table is pre-seeded with all tenant-scoped roles (`tenant_admin`, `dispatcher`, `driver`, `accountant`, `human_resources`) and does not require new seed data for this story.
- Rate limiting defaults (100 req/min for reads, 10 req/min for mutations) are acceptable for the new endpoints.
- The existing `sendAuthError` utility and `AuthErrorCodeEnum` are sufficient for error responses; no new error codes are required beyond existing ones.
- Integration tests will run against the ephemeral test container environment from `CROWN-157`.

## Out Of Scope

- User creation or registration endpoints (user creation is a separate story).
- User account status management (enable/disable user) from the admin API.
- Deactivating or removing a tenant membership entirely (membership lifecycle is separate from role assignment lifecycle).
- Multi-tenant user selection or switching (the `TENANT_SELECTION_REQUIRED` error remains for login).
- Changing the JWT claim schema or adding granular permissions to tokens.
- Modifying the web app to consume these new endpoints (web integration is a separate story).
- Bulk operations (bulk role assignment, bulk membership creation).
- Audit log entries for management actions (audit logging is a cross-cutting concern for a separate story).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: `POST /api/v1/platform/users/search` returns a filtered paginated user list for super admin callers and rejects non-super-admin callers with `403`.
- **SC-002**: `GET /api/v1/platform/users/:userId` returns a complete user profile with memberships and role assignments for super admin callers and `404` for non-existent users.
- **SC-003**: `POST /api/v1/platform/tenant/membership` creates a `TenantMembership` and `TenantMembershipRoleAssignment` (isPrimary: true) and returns `201`, or `409` for duplicate memberships.
- **SC-004**: `POST /api/v1/tenant/members/search` returns tenant-scoped member list for tenant admin callers and rejects non-tenant-admin callers with `403`.
- **SC-005**: `POST /api/v1/tenant/members/roles` creates a `TenantMembershipRoleAssignment` and returns `201`, or `409` for duplicate assignments, or `403` for cross-tenant membership IDs.
- **SC-006**: `POST /api/v1/tenant/members/roles/revoke` deactivates a `TenantMembershipRoleAssignment` and returns `200`, or `400` when trying to revoke the last active role.
- **SC-007**: `GET /api/v1/tenant/roles` returns all tenant-scoped roles from the catalog for tenant admin callers.
- **SC-008**: All new endpoints use the `authenticate → authorize → rateLimitMiddleware` chain and validate request bodies with Zod.
- **SC-009**: OpenAPI documentation in `apps/api/src/docs/openapi.ts` is updated with all seven new endpoint paths, schemas, and error codes.
- **SC-010**: Integration tests cover happy-path and error-path scenarios for all seven endpoints against the ephemeral test container.
- **SC-011**: `pnpm typecheck` and `pnpm lint` pass with no regressions.
