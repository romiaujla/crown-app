# Feature Specification: API Tenant Create Reference-Data Contract For Management-System Types And Default Roles

**Feature Branch**: `feat/CROWN-141-api-tenant-create-reference-data-contract`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: Jira issue `CROWN-141` - "API | Tenant create reference-data contract for management-system types and default roles"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Load Supported Management-System Types For Tenant Create (Priority: P1)

As a super admin, I want a tenant-create reference-data API that returns the supported management-system types so that the guided onboarding flow can render valid product-type choices from persisted platform data.

**Why this priority**: The tenant-create experience cannot move past placeholder data without a stable API source for the supported management-system type catalog.

**Independent Test**: Call the tenant-create reference-data endpoint as a super admin and verify the response returns the supported management-system types from persisted control-plane records.

**Acceptance Scenarios**:

1. **Given** supported management-system types exist in the control-plane catalog, **When** a super admin requests tenant-create reference data, **Then** the API returns those types from persisted data rather than hard-coded UI values.
2. **Given** multiple management-system types exist, **When** the response is inspected, **Then** each returned type includes the agreed identifying and display fields needed by the tenant-create flow.
3. **Given** a management-system type is no longer supported for onboarding, **When** tenant-create reference data is requested, **Then** unsupported records are excluded from the returned selection list.

---

### User Story 2 - Load Default Role Options Per Management-System Type (Priority: P1)

As a super admin, I want each management-system type in the tenant-create reference-data response to include its role options and default selections so that the setup flow can present the correct onboarding roles for the selected type.

**Why this priority**: The primary value of this story is the contract that ties each supported management-system type to the role options the future UI must present.

**Independent Test**: Call the endpoint and verify each returned management-system type includes its role options, default-role flags, and the required admin role option.

**Acceptance Scenarios**:

1. **Given** a supported management-system type has associated role records, **When** tenant-create reference data is requested, **Then** the API returns those role options nested under that management-system type.
2. **Given** a role is part of the default/bootstrap set for a management-system type, **When** the response is inspected, **Then** the role is clearly marked as a default selection option.
3. **Given** the tenant-create flow needs the admin role to stay mandatory, **When** any management-system type is returned, **Then** the response includes the admin role option and marks it as required for later UI enforcement.

---

### User Story 3 - Keep The Contract Shared, Protected, And Documented (Priority: P2)

As a maintainer, I want the tenant-create reference-data route to use shared API/web schemas, preserve platform RBAC behavior, and appear in the manual OpenAPI document so that future tenant-create UI work can build against one documented source of truth.

**Why this priority**: This story defines an API contract that both API and web work will reuse, so consistency and documentation matter as much as the route itself.

**Independent Test**: Review the shared contract package, call the endpoint as unauthenticated and non-super-admin users, and verify the route is present in the docs surface with the agreed response contract.

**Acceptance Scenarios**:

1. **Given** an unauthenticated request, **When** the tenant-create reference-data endpoint is called, **Then** the API rejects the request using the existing protected-route error behavior.
2. **Given** an authenticated user without the `super_admin` role, **When** the endpoint is called, **Then** the API rejects the request using the existing protected-route error behavior.
3. **Given** API and web packages both consume this contract, **When** reviewers inspect the implementation, **Then** the shared schemas, enums, and inferred types live in `@crown/types` rather than duplicated local modules.
4. **Given** the route surface is added for tenant-create reference data, **When** the manual docs are reviewed, **Then** `apps/api/src/docs/openapi.ts` documents the endpoint and response contract.

### Edge Cases

- No supported management-system types are currently active for onboarding.
- A management-system type exists but has no role mappings because seed or persistence data drifted.
- A non-admin role is available for a type but is not part of the default/bootstrap baseline.
- The admin role exists as shared code `tenant_admin` while the UI-facing label remains `Admin`.
- Later tenant provisioning submission fields remain out of scope and must not leak into this read-only reference-data contract.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST expose a dedicated super-admin-only API contract for tenant-create reference data.
- **FR-002**: The tenant-create reference-data API MUST return the supported management-system types used by tenant creation from persisted control-plane data.
- **FR-003**: Each returned management-system type MUST include the identifying and display fields needed by the tenant-create flow to render a selection list.
- **FR-004**: Each returned management-system type MUST include the role options associated with that type from the persisted shared role catalog and type-to-role junction.
- **FR-005**: Each returned role option MUST identify whether it belongs to the default/bootstrap role set for that management-system type.
- **FR-006**: The admin role option MUST be present for every returned management-system type and MUST be marked as required for later UI selection enforcement.
- **FR-007**: The reference-data route MUST stay read-only and MUST NOT implement tenant provisioning submission, tenant creation side effects, or role-assignment persistence.
- **FR-008**: The route MUST reject unauthenticated and non-super-admin callers using the existing protected-route error behavior.
- **FR-009**: Shared contract shapes, schemas, enums, and inferred types used by both API and web packages for this route MUST be defined once in `@crown/types`.
- **FR-010**: The route MUST return only management-system-type reference data and role-option metadata needed for tenant creation, without widening into unrelated tenant details or final provisioning payloads.
- **FR-011**: The API MUST source role display labels from persisted role records so the contract reflects the shared role catalog rather than duplicated route-local constants.
- **FR-012**: The manual OpenAPI source MUST document the tenant-create reference-data route and response contract.

### Key Entities _(include if feature involves data)_

- **Tenant Create Reference-Data Response**: The top-level API payload that delivers supported management-system types and their role options for tenant creation.
- **Tenant Create Management-System Type**: A supported management-system type returned to the tenant-create flow, including identity, display metadata, and onboarding role options.
- **Tenant Create Role Option**: A shared role record attached to a management-system type, including its display metadata plus `isDefault` and `isRequired` semantics for onboarding.

### Assumptions

- Supported tenant-create options come from active control-plane `ManagementSystemType` records and their seeded type-to-role mappings.
- The admin role requirement maps to the shared role code `tenant_admin`, whose display label remains `Admin`.
- The route can return the full supported catalog without pagination for this story.
- The route may live alongside the existing platform tenant routes because the caller is still a platform `super_admin`.

### Dependencies

- Existing control-plane catalog persistence in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`.
- Seeded management-system type and role baselines in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/constants.ts`.
- Existing platform auth and RBAC middleware in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/middleware/`.
- Shared contract package in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/packages/types/src/index.ts`.
- The manual OpenAPI document in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of tested successful requests return the supported management-system type catalog from persisted platform data.
- **SC-002**: Reviewers can verify that 100% of returned management-system types include their associated role options and correctly indicate which options are defaults.
- **SC-003**: Reviewers can verify that 100% of returned management-system types include the admin role option marked as required.
- **SC-004**: Reviewers can verify that 100% of tested unauthenticated or non-super-admin requests are rejected with the existing protected-route error behavior.
- **SC-005**: Reviewers can verify from shared schemas and OpenAPI documentation that the tenant-create reference-data contract is documented once and is ready for future web consumption without duplicating contract definitions.
