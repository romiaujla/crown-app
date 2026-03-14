# Feature Specification: API Tenant Directory List Endpoint For Super Admins

**Feature Branch**: `feat/CROWN-126-tenant-directory-list-endpoint`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: Jira issue `CROWN-126` - "API | Tenant directory list endpoint for super admins"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - List Tenants For The Control Plane (Priority: P1)

As a super admin, I want a tenant directory API so that I can load the tenant list for the control plane from persisted platform data.

**Why this priority**: The tenant management experience cannot move past a placeholder state without a collection endpoint that returns tenant records.

**Independent Test**: Call the tenant directory endpoint as a super admin and verify it returns persisted tenants in the agreed `data` + `meta` response envelope.

**Acceptance Scenarios**:

1. **Given** one or more tenants exist in the control-plane model, **When** a super admin requests the tenant directory, **Then** the API returns those tenants in `data.tenantList`.
2. **Given** no tenants match the current query, **When** a super admin requests the tenant directory, **Then** the API returns an empty `data.tenantList` and `meta.totalRecords` of `0`.
3. **Given** a tenant record is returned, **When** the response is inspected, **Then** each record includes the agreed camelCase fields `tenantId`, `name`, `slug`, `schemaName`, `status`, `createdAt`, and `updatedAt`.

---

### User Story 2 - Filter The Tenant Directory By Search And Status (Priority: P2)

As a super admin, I want the tenant directory endpoint to support search and status filtering so that I can narrow the collection before the UI renders it.

**Why this priority**: Search and status filtering are explicit Jira acceptance criteria and are central to the directory workflow.

**Independent Test**: Call the tenant directory endpoint with a request body containing `filters.name` and `filters.status` and verify the API returns only matching records while echoing applied filters in `meta.filters`.

**Acceptance Scenarios**:

1. **Given** multiple tenants exist with different names, **When** the super admin supplies `filters.name`, **Then** the API returns only tenants whose persisted names match the search behavior defined for this story.
2. **Given** tenants exist in different lifecycle states, **When** the super admin supplies `filters.status`, **Then** the API returns only tenants with that persisted status.
3. **Given** both `filters.name` and `filters.status` are supplied, **When** the request is processed, **Then** the API applies both filters and echoes the effective values in `meta.filters`.

---

### User Story 3 - Keep The Contract Standardized And Auth-Protected (Priority: P3)

As a maintainer, I want the tenant directory endpoint to follow the agreed response conventions and existing platform RBAC behavior so that future control-plane APIs stay consistent.

**Why this priority**: This story defines a pattern that other control-plane list endpoints are likely to follow, so response shape and access behavior need to be explicit.

**Independent Test**: Review the route contract and call the endpoint as unauthenticated and non-super-admin users to confirm the API preserves the existing protected-route behavior and the agreed response envelope.

**Acceptance Scenarios**:

1. **Given** an unauthenticated request, **When** the tenant directory endpoint is called, **Then** the API rejects the request using the existing protected-route error behavior.
2. **Given** an authenticated user without the `super_admin` role, **When** the tenant directory endpoint is called, **Then** the API rejects the request using the existing protected-route error behavior.
3. **Given** the tenant directory response is reviewed, **When** the payload is inspected, **Then** the top-level response shape is `{ data, meta }` with `data.tenantList` and camelCase body properties.
4. **Given** a reviewer inspects the scope of this story, **When** the response contract is checked, **Then** related collections such as `userList` are not included in this initial endpoint and remain follow-up scope.

### Edge Cases

- The caller passes an unsupported tenant status filter value.
- The caller passes an empty or whitespace-only `name` value.
- No tenants match the provided filters.
- Matching tenants include a mix of `active`, `inactive`, `provisioning`, and `provisioningFailed` statuses.
- The directory must return persisted platform statuses rather than duplicating web-only constants.
- The initial directory contract must not widen into nested related collections such as tenant users.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST expose a super-admin-only tenant directory list API for the control plane.
- **FR-002**: The tenant directory API MUST return its collection inside `data.tenantList`.
- **FR-003**: The tenant directory API MUST return top-level `meta` containing `totalRecords` and `filters`.
- **FR-004**: Tenant records in the response MUST use camelCase body properties.
- **FR-005**: Each returned tenant record MUST include `tenantId`, `name`, `slug`, `schemaName`, `status`, `createdAt`, and `updatedAt`.
- **FR-006**: The tenant directory API MUST accept a request body with `filters.name` for name-based filtering.
- **FR-007**: The tenant directory API MUST accept a request body with single-select `filters.status` using the persisted tenant status model as the source of truth.
- **FR-008**: The API MUST echo the applied `name` and `status` values in `meta.filters`.
- **FR-009**: The API MUST return `meta.totalRecords` for the filtered result set.
- **FR-010**: The tenant directory API MUST remain limited to tenant collection data for this story and MUST NOT include nested related collections such as `userList`.
- **FR-011**: The tenant directory API MUST reject unauthenticated and non-super-admin callers using the existing protected-route error behavior.
- **FR-012**: Shared contract shapes, schemas, enums, and inferred types used by both API and web packages for this endpoint MUST be defined once in `@crown/types`.
- **FR-013**: The manual OpenAPI source MUST document the tenant directory route, request body contract, and response contract.

### Key Entities *(include if feature involves data)*

- **Tenant Directory Item**: A control-plane tenant record returned in the list response, including identity, lifecycle status, and timestamps.
- **Tenant Directory Filters**: The request-body filter inputs and echoed metadata for `name` and `status`.
- **Tenant Directory Response Envelope**: The standardized `{ data, meta }` response shape containing `tenantList` and collection metadata.

### Assumptions

- The tenant list response for `CROWN-126` is intentionally limited to tenant collection data and does not yet include nested tenant-user relationships.
- Persisted control-plane `Tenant` records remain the source of truth for directory data.
- The existing platform RBAC middleware remains the enforcement boundary for `super_admin` access.
- The initial endpoint can return the full filtered result set without introducing pagination in this story.

### Dependencies

- Existing control-plane tenant persistence in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`.
- Existing platform auth and RBAC middleware in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/middleware/`.
- Shared contract package in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/packages/types/src/index.ts`.
- The manual OpenAPI document in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of tested successful requests return the tenant directory in the agreed `{ data, meta }` envelope with `data.tenantList`.
- **SC-002**: Reviewers can verify that 100% of tested `filters.name` and `filters.status` requests return only matching tenant records and echo the applied filters in `meta.filters`.
- **SC-003**: Reviewers can verify that 100% of tested unauthenticated or non-super-admin requests are rejected with the existing protected-route error behavior.
- **SC-004**: Reviewers can verify from the contract and OpenAPI documentation that tenant directory response properties use camelCase and that nested related collections are out of scope for this story.
- **SC-005**: Reviewers can verify that the endpoint returns persisted platform tenant statuses rather than duplicated frontend-only status definitions.
