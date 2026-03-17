# Feature Specification: API Hard Deprovision Tenant From The Super-Admin Control Plane

**Feature Branch**: `feat/CROWN-76-hard-deprovision-tenant`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: Jira issue `CROWN-76` - "API | Hard deprovision tenant from the super-admin control plane"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Hard Deprovision A Tenant Through The Existing Deprovision Endpoint (Priority: P1)

As a super admin, I want to request hard deprovision on the existing tenant deprovision endpoint so I can permanently remove tenant-scoped schema data without introducing a second deprovision route.

**Why this priority**: The core Jira outcome is a destructive tenant-lifecycle path. Without the hard option on the existing endpoint, the control plane still lacks a supported teardown operation.

**Independent Test**: Call `POST /api/v1/platform/tenant/deprovision` as a super admin with `deprovisionType: "hard"` and verify the tenant schema is removed while the control-plane tenant record remains.

**Acceptance Scenarios**:

1. **Given** an active tenant exists with a provisioned tenant schema, **When** a super admin requests deprovision with `deprovisionType: "hard"`, **Then** the system deletes the tenant schema, retains the tenant record in an `inactive` state, and returns a deterministic hard-deprovision success response.
2. **Given** a hard deprovision request omits `deprovisionType`, **When** the request is processed, **Then** the endpoint defaults to soft deprovision instead of performing destructive behavior.
3. **Given** a request targets a tenant that does not exist, **When** hard deprovision is requested, **Then** the API returns a deterministic not-found-style error and does not mutate unrelated records.

---

### User Story 2 - Retain Control-Plane Identity Records While Removing Tenant-Scoped Access (Priority: P2)

As a maintainer, I want hard deprovision to remove tenant-scoped memberships without deleting global user identities so shared accounts, auditability, and cross-tenant access are preserved.

**Why this priority**: `PlatformUser` records are control-plane identities, not tenant-owned rows. Deleting them by default would create cross-tenant side effects that are wider than tenant teardown.

**Independent Test**: Hard deprovision a tenant that has tenant memberships and verify tenant membership rows for that tenant are removed while the related `PlatformUser` records still exist.

**Acceptance Scenarios**:

1. **Given** a tenant has `PlatformUserTenant` memberships, **When** hard deprovision is executed, **Then** the memberships tied to that tenant are removed.
2. **Given** a platform user belongs to multiple tenants or holds global identity data, **When** one tenant is hard deprovisioned, **Then** the `PlatformUser` record is retained.
3. **Given** a reviewer inspects the hard-deprovision contract, **When** they evaluate identity side effects, **Then** they can see that global user deletion is out of scope for this story.

---

### User Story 3 - Keep Soft And Hard Deprovision In One Explicit Contract (Priority: P3)

As a maintainer, I want the shared deprovision contract to make soft and hard behavior explicit so the route remains additive while destructive behavior requires an intentional request value.

**Why this priority**: The repository already has a soft deprovision path on this endpoint. The story needs a narrow contract extension, not a parallel route surface with duplicated lifecycle logic.

**Independent Test**: Review the request schema, route behavior, and OpenAPI definition to confirm the endpoint accepts `deprovisionType`, defaults to `soft`, and documents the difference between soft and hard outcomes.

**Acceptance Scenarios**:

1. **Given** the deprovision request contract is reviewed, **When** the allowed values are inspected, **Then** `deprovisionType` is limited to `soft` and `hard` through a shared named enum.
2. **Given** a super admin triggers soft deprovision using the same endpoint, **When** the route executes without a hard type, **Then** the existing inactive-status behavior is preserved.
3. **Given** the manual OpenAPI source is reviewed, **When** the deprovision endpoint is inspected, **Then** the documentation shows the optional `deprovisionType`, the soft default, and the destructive semantics of `hard`.

### Edge Cases

- The target tenant record does not exist.
- The tenant schema has already been dropped when a hard deprovision request is retried.
- The tenant is already inactive when hard deprovision is requested.
- The tenant has user memberships that must be removed without deleting shared `PlatformUser` rows.
- The tenant record is retained after hard deprovision and must remain in a deterministic `inactive` state for follow-up reads or repeated requests.
- A caller omits `deprovisionType`, and the system must not accidentally perform a hard delete.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST continue to expose deprovisioning at `POST /api/v1/platform/tenant/deprovision`.
- **FR-002**: The request body MUST accept an optional `deprovisionType` property with values `soft` or `hard`, and omitted `deprovisionType` MUST default to `soft`.
- **FR-003**: The shared contract surface MUST define a reusable `DeprovisionTypeEnum` with members `HARD = "hard"` and `SOFT = "soft"`.
- **FR-004**: Soft deprovision through the shared endpoint MUST preserve the existing inactive-status transition semantics.
- **FR-005**: Hard deprovision MUST delete the tenant schema for the targeted tenant.
- **FR-006**: Hard deprovision MUST retain the control-plane tenant record instead of deleting it.
- **FR-007**: Hard deprovision MUST leave the retained tenant record in an `inactive` state after schema deletion.
- **FR-008**: Hard deprovision MUST remove tenant-scoped membership data for the targeted tenant.
- **FR-009**: Hard deprovision MUST NOT delete global `PlatformUser` records by default.
- **FR-010**: The deprovision capability MUST remain limited to authenticated `super_admin` users.
- **FR-011**: The API MUST provide deterministic behavior when the target tenant does not exist, when the schema is already missing, and when repeated deprovision requests occur.
- **FR-012**: The implementation MUST remain additive and limited to tenant-management backend behavior for this story.
- **FR-013**: The manual OpenAPI source MUST document the shared deprovision route, optional `deprovisionType`, default soft behavior, and hard-deprovision semantics.

### Key Entities _(include if feature involves data)_

- **Deprovision Type**: The explicit lifecycle mode that selects either soft or hard tenant deprovision behavior.
- **Tenant Record**: The retained control-plane tenant metadata row that continues to exist after hard deprovision.
- **Tenant Membership**: The `PlatformUserTenant` relationship that grants tenant-scoped access and must be removed for the targeted tenant during hard deprovision.
- **Tenant Schema**: The tenant-specific PostgreSQL schema that must be dropped during hard deprovision.

### Assumptions

- The existing soft deprovision endpoint remains the only deprovision route surface for this story.
- Retaining the tenant record is required for operational traceability even after destructive schema teardown.
- Global identity lifecycle management for `PlatformUser` records remains separate from tenant teardown.
- A future story can widen scope if the product later requires permanent user deletion or deeper audit lifecycle behavior.

### Dependencies

- Existing platform tenant routing and soft deprovision behavior in `apps/api`.
- Control-plane persistence via Prisma for `Tenant`, `PlatformUser`, and `PlatformUserTenant`.
- Tenant schema management utilities used by provisioning and tenant-migration workflows.
- The manual OpenAPI document in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of tested hard deprovision calls with `deprovisionType: "hard"` delete the targeted tenant schema while leaving the control-plane tenant record present.
- **SC-002**: Reviewers can verify that 100% of tested deprovision calls without `deprovisionType` continue to execute soft deprovision rather than hard deprovision.
- **SC-003**: Reviewers can verify that 100% of tested hard deprovision calls remove tenant membership rows for the targeted tenant without deleting the related global `PlatformUser` rows.
- **SC-004**: Reviewers can verify from the API contract and OpenAPI definition that soft and hard deprovision are documented on the same route with explicit, distinct semantics.
- **SC-005**: Reviewers can verify the implementation remains limited to additive tenant-management backend behavior and does not widen into separate user-deletion workflows.
