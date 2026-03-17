# Feature Specification: API Super-Admin Dashboard Overview Widgets Contract

**Feature Branch**: `feat/CROWN-116-super-admin-dashboard-overview-widgets-contract`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: Jira issue `CROWN-116` - "API | Super admin dashboard overview widgets contract"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Retrieve Tenant Summary Overview Data (Priority: P1)

As a super-admin dashboard client, I want one overview response that returns the tenant total, tenant user count, and tenant-status breakdown so the dashboard can render its initial overview widgets from a stable API contract.

**Why this priority**: This is the core Jira outcome. Without a contract for the first dashboard widget data, `CROWN-93` cannot move from static assumptions to live platform data.

**Independent Test**: Call the overview endpoint as a super admin and verify the response includes one stable overview-widgets payload containing the total tenant count, tenant user count, and counts for every current tenant status.

**Acceptance Scenarios**:

1. **Given** a valid `super_admin` request reaches the overview endpoint, **When** the API returns the overview payload, **Then** the response includes the total number of tenants in the platform model.
2. **Given** the platform has tenant-scoped end users in the current identity model, **When** the overview payload is returned, **Then** the response includes the total number of `tenant_user` identities.
3. **Given** the platform has tenants across different statuses, **When** the overview payload is returned, **Then** the response includes counts grouped by the statuses that currently exist in the platform data model.
4. **Given** the platform currently has no tenants for one or more statuses, **When** the overview payload is returned, **Then** the response still includes those statuses with deterministic zero counts instead of omitting them.

---

### User Story 2 - Keep The Overview Contract Restricted And Predictable (Priority: P2)

As a platform developer, I want the overview endpoint limited to super-admin access and a narrow dashboard-summary scope so the contract is safe to expose and does not drift into unrelated dashboard APIs.

**Why this priority**: The dashboard contract is only valid if the endpoint respects the existing platform RBAC boundary and stays scoped to the overview widgets described in Jira.

**Independent Test**: Call the overview endpoint with missing, tenant-admin, and tenant-user credentials and verify the API denies access using the existing protected-route behavior; then inspect the successful payload to confirm it excludes recent-activity data.

**Acceptance Scenarios**:

1. **Given** a request omits authentication, **When** the overview endpoint is called, **Then** the API returns the existing unauthenticated error contract.
2. **Given** a tenant-scoped authenticated user calls the overview endpoint, **When** authorization is evaluated, **Then** the API returns the existing forbidden-role response.
3. **Given** a successful super-admin response, **When** the payload is inspected, **Then** it stays limited to overview widget data and does not include recent tenant changes or activity-feed content.

---

### User Story 3 - Extend The Dashboard Response Without Breaking The First Widget (Priority: P3)

As a future dashboard maintainer, I want the overview response structured so new widgets can be added alongside the initial tenant-summary widget without breaking the current UI contract.

**Why this priority**: Jira explicitly requires the contract to evolve safely as additional dashboard widgets are introduced.

**Independent Test**: Review the response contract and API documentation to confirm the initial tenant-summary widget is isolated within an extensible overview envelope that can accept future sibling widgets.

**Acceptance Scenarios**:

1. **Given** the overview endpoint returns the initial dashboard data, **When** the payload shape is reviewed, **Then** the first tenant-summary widget is namespaced inside an extensible widgets envelope rather than a brittle flat response.
2. **Given** future dashboard widgets are added later, **When** they are introduced to the response, **Then** they can be added as new sibling entries without changing the initial tenant-summary widget fields.
3. **Given** API reviewers inspect the repository documentation, **When** they review the manual OpenAPI source and feature contract notes, **Then** they can identify the stable initial widget contract and the intended extension pattern.

### Edge Cases

- The platform has zero tenants and the response still needs a total count plus zero counts for every current tenant status.
- The database contains tenants in only one status and the missing statuses still need explicit zero-count entries.
- Future widgets may be added later, but the initial tenant-summary widget fields must remain stable for `CROWN-93`.
- Requests from non-super-admin roles must be denied before any platform summary data is exposed.
- Recent tenant changes, activity streams, or unrelated tenant-management data must not leak into this contract.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST expose one super-admin-only API endpoint for the dashboard overview widget contract.
- **FR-002**: The successful response MUST include the total number of tenants in the current platform model.
- **FR-003**: The successful response MUST include the total number of `tenant_user` identities in the current platform model.
- **FR-004**: The successful response MUST include counts for every tenant status currently defined by the platform model.
- **FR-005**: The successful response MUST represent statuses with no tenants as explicit zero-count entries.
- **FR-006**: The successful response MUST place the initial tenant-summary widget inside an extensible overview-widgets envelope so future widgets can be added without changing the initial widget fields.
- **FR-007**: The endpoint MUST remain limited to authenticated `super_admin` users.
- **FR-008**: The endpoint MUST reuse the repository’s existing unauthenticated and forbidden-role error contracts for rejected requests.
- **FR-009**: The endpoint MUST keep recent tenant changes and activity-feed data out of scope for this story.
- **FR-010**: The API contract MUST be documented in the repository’s manual OpenAPI source.
- **FR-011**: The implementation MUST stay scoped to the dashboard overview contract and supporting endpoint behavior rather than unrelated platform APIs.

### Key Entities _(include if feature involves data)_

- **Dashboard Overview Response**: The top-level API payload returned for the super-admin dashboard overview route.
- **Tenant Summary Widget**: The initial overview widget that contains total tenant count, tenant user count, and per-status tenant counts.
- **Tenant Status Count Entry**: One status/count pair representing a current `TenantStatus` value and the number of tenants in that status.
- **Widgets Envelope**: The response container that allows future overview widgets to be added as siblings without changing the first widget contract.

### Assumptions

- `CROWN-93` remains the consuming UI story for the super-admin dashboard overview widgets and will read this API contract rather than redefine the data model.
- The current platform tenant statuses are the existing `TenantStatus` values already defined in the repository data model.
- The first overview contract only needs platform-level tenant summary data and does not need activity, audit, or trend data.
- Existing platform authentication and authorization middleware already provide the required `super_admin` boundary for this endpoint.

### Dependencies

- `CROWN-93` for the UI consumer of the overview widget contract.
- Existing platform RBAC and authentication middleware protecting `/api/v1/platform/*`.
- Current `Tenant` persistence model and `TenantStatus` enum in `apps/api`.
- The manual OpenAPI document in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of successful overview responses include the total tenant count, tenant user count, and explicit counts for every current tenant status.
- **SC-002**: Reviewers can verify that 100% of tested empty-status cases return zero-count entries instead of omitting status buckets.
- **SC-003**: Reviewers can verify that 100% of tested unauthenticated or non-super-admin requests are rejected with the existing protected-route error behavior.
- **SC-004**: Reviewers can verify from the response contract and OpenAPI docs that new widgets can be added as siblings in the overview envelope without changing the initial tenant-summary widget fields.
- **SC-005**: Reviewers can verify that recent tenant changes and activity-feed data are absent from the delivered contract and implementation.
