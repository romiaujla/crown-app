# Feature Specification: API - Consolidate Tenant Access Checks Into POST /api/v1/tenant/access

**Feature Branch**: `feat/CROWN-158-consolidate-tenant-access-check-endpoint`
**Created**: 2026-03-17
**Status**: Draft
**Input**: Jira issue `CROWN-158` - "API | Consolidate tenant access checks into POST /api/v1/tenant/access"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Tenant Admin Access Check Uses The Unified Endpoint (Priority: P1)

As a product engineer, I want tenant-admin authorization checks to use a single endpoint with an explicit auth class so clients do not need endpoint-path branching.

**Why this priority**: Tenant-admin checks are one half of the current split route contract and must continue to enforce tenant scope correctly after migration.

**Independent Test**: A reviewer can call `POST /api/v1/tenant/access` with `authClass: "tenant_admin"` and verify allowed and denied tenant scope outcomes match existing behavior.

**Acceptance Scenarios**:

1. **Given** a valid tenant-admin token scoped to `tenant-acme`, **When** `POST /api/v1/tenant/access` is called with `{ "authClass": "tenant_admin", "tenantId": "tenant-acme" }`, **Then** the response is `200`.
2. **Given** a valid tenant-admin token scoped to `tenant-acme`, **When** `POST /api/v1/tenant/access` is called with `{ "authClass": "tenant_admin", "tenantId": "tenant-other" }`, **Then** the response is `403` with existing structured authorization error fields.

---

### User Story 2 - Tenant User Access Check Uses The Unified Endpoint (Priority: P1)

As a product engineer, I want tenant-user authorization checks to use the same endpoint and body contract so client flows are consistent across tenant auth classes.

**Why this priority**: Tenant-user checks are the other half of the existing split route contract and must preserve current authorization rules.

**Independent Test**: A reviewer can call `POST /api/v1/tenant/access` with `authClass: "tenant_user"` and verify allowed and denied tenant scope outcomes match existing behavior.

**Acceptance Scenarios**:

1. **Given** a valid tenant-user token scoped to `tenant-acme`, **When** `POST /api/v1/tenant/access` is called with `{ "authClass": "tenant_user", "tenantId": "tenant-acme" }`, **Then** the response is `200`.
2. **Given** a valid tenant-user token scoped to `tenant-acme`, **When** `POST /api/v1/tenant/access` is called with `{ "authClass": "tenant_user", "tenantId": "tenant-other" }`, **Then** the response is `403` with existing structured authorization error fields.

---

### User Story 3 - Tenant User Cannot Escalate To Tenant Admin Auth Class (Priority: P1)

As a product engineer, I want tenant users denied when requesting tenant-admin authorization checks so role escalation is blocked.

**Why this priority**: Preserving role isolation is a core security requirement and explicitly called out in Jira acceptance criteria.

**Independent Test**: A reviewer can call `POST /api/v1/tenant/access` as a tenant user with `authClass: "tenant_admin"` and confirm access is denied.

**Acceptance Scenarios**:

1. **Given** a valid tenant-user token scoped to `tenant-acme`, **When** `POST /api/v1/tenant/access` is called with `{ "authClass": "tenant_admin", "tenantId": "tenant-acme" }`, **Then** the response is `403` with existing structured authorization error fields.

---

### User Story 4 - API Contract Surface Is Consolidated And Documented (Priority: P2)

As a maintainer, I want the legacy split endpoints removed and the OpenAPI document updated so the API contract matches the implemented route surface.

**Why this priority**: Contract drift between implementation and documentation causes integration and release risk.

**Independent Test**: A reviewer can inspect the running OpenAPI output and integration tests to confirm legacy paths are absent and the new path is present.

**Acceptance Scenarios**:

1. **Given** the API docs endpoint, **When** the OpenAPI document is inspected, **Then** `/api/v1/tenant/access` exists as a `POST` operation with the documented request body and response/security metadata.
2. **Given** the API docs endpoint, **When** the OpenAPI document is inspected, **Then** `/api/v1/tenant/admin/{tenantId}` and `/api/v1/tenant/user/{tenantId}` are removed (or explicitly deprecated per policy decision).

### Edge Cases

- Request payload omits `authClass` or `tenantId`; the endpoint returns `400` validation errors using existing request-validation error format.
- Request payload includes an unsupported `authClass` value; the endpoint returns `400` validation errors.
- Calls without a bearer token continue returning `401` using existing structured auth error behavior.
- Super-admin tokens are out of scope for this endpoint contract and continue following existing tenant namespace authorization behavior.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The API MUST expose `POST /api/v1/tenant/access` as the unified tenant access check endpoint.
- **FR-002**: The request body MUST require `authClass` and `tenantId` fields.
- **FR-003**: `authClass` MUST accept only `tenant_user` or `tenant_admin`.
- **FR-004**: `tenantId` MUST be validated as a non-empty string.
- **FR-005**: For allowed checks, the endpoint MUST return `200` and preserve existing authorization behavior for tenant-admin and tenant-user role classes.
- **FR-006**: For denied checks, the endpoint MUST return existing structured auth errors (`401` and `403`) consistent with current middleware behavior.
- **FR-007**: Tenant users requesting `authClass: "tenant_admin"` MUST be denied with `403`.
- **FR-008**: Legacy endpoints `GET /api/v1/tenant/admin/{tenantId}` and `GET /api/v1/tenant/user/{tenantId}` MUST be removed or marked deprecated per team policy, and the implementation and tests MUST align with that choice.
- **FR-009**: OpenAPI source `apps/api/src/docs/openapi.ts` MUST be updated to reflect the new endpoint contract and legacy endpoint status.
- **FR-010**: Integration and contract tests MUST validate tenant-admin allowed/denied tenant scope, tenant-user allowed/denied tenant scope, and tenant-user denial for tenant-admin auth class.

### Key Entities

- **TenantAccessCheckRequest**: Request payload with `authClass` and `tenantId` used to select role constraints and tenant scope.
- **RoleEnum**: Existing enum containing `TENANT_ADMIN` and `TENANT_USER`, used to map `authClass` to authorize middleware role checks.
- **Authenticated Request Context**: Existing auth middleware context that provides JWT claims and tenant scope used by authorize middleware.

## Assumptions

- Existing `authorize` middleware behavior remains source-of-truth for tenant scope checks and structured auth errors.
- Existing integration test token fixtures for tenant-admin and tenant-user remain valid for this migration.
- Team policy for legacy endpoint handling in this story is route removal rather than long-lived deprecation stubs unless reviewer feedback says otherwise.
- No frontend contract update is required in this branch beyond API/OpenAPI and tests.

## Out Of Scope

- Changing JWT claims schema or auth resolution logic.
- Adding new auth classes beyond `tenant_admin` and `tenant_user`.
- Adding tenant-selection flows or UI changes.
- Changing platform-only authorization routes.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: `POST /api/v1/tenant/access` passes integration tests for tenant-admin and tenant-user allowed/denied tenant scope scenarios.
- **SC-002**: Integration tests verify tenant-user requests with `authClass: "tenant_admin"` are denied with `403`.
- **SC-003**: Legacy split endpoints are no longer used by integration tests and are removed or documented as deprecated in API docs according to team policy.
- **SC-004**: OpenAPI generated output includes only the intended tenant access contract state and matches implemented route behavior.
