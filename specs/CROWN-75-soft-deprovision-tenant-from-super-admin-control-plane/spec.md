# Feature Specification: API Soft Deprovision Tenant From The Super-Admin Control Plane

**Feature Branch**: `feat/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: Jira issue `CROWN-75` - "API | Soft deprovision tenant from the super-admin control plane"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Soft Deprovision A Tenant Without Deleting Its Data (Priority: P1)

As a super admin, I want an API capability that marks a tenant inactive so I can remove it from active use without destroying its schema data or control-plane records.

**Why this priority**: This is the core Jira outcome. Without a non-destructive deprovision capability, tenant lifecycle management is limited to active provisioning only.

**Independent Test**: Call the soft deprovision API as a super admin and verify the tenant transitions to an inactive status while its schema and control-plane records remain present.

**Acceptance Scenarios**:

1. **Given** an active tenant exists, **When** a super admin triggers soft deprovision, **Then** the API marks that tenant inactive instead of deleting it.
2. **Given** a tenant is soft deprovisioned, **When** platform data is reviewed after the call, **Then** the tenant control-plane record and tenant schema still exist.
3. **Given** a request targets a tenant that does not exist, **When** soft deprovision is requested, **Then** the API returns a deterministic not-found-style error rather than mutating unrelated records.

---

### User Story 2 - Block Tenant Access After Soft Deprovision (Priority: P2)

As a platform operator, I want inactive tenants blocked from normal tenant access flows so deprovisioned tenants cannot continue using the tenant application as if they were still active.

**Why this priority**: Marking a tenant inactive has limited value if existing tenant-scoped login and request flows still treat that tenant as active.

**Independent Test**: Soft deprovision a tenant with tenant-scoped users, then verify tenant-auth resolution and protected tenant access flows deny that tenant context while unrelated platform access rules remain unchanged.

**Acceptance Scenarios**:

1. **Given** a tenant has been soft deprovisioned, **When** a tenant-scoped user tied to that tenant tries to authenticate or resolve their current-user context, **Then** the request is denied because the tenant is inactive.
2. **Given** a tenant has been soft deprovisioned, **When** tenant-scoped protected flows are evaluated for that tenant context, **Then** the inactive tenant is not treated as an active membership.
3. **Given** a super admin accesses platform-only APIs after a tenant is soft deprovisioned, **When** authorization is evaluated, **Then** the existing super-admin platform access behavior still works.

---

### User Story 3 - Keep The Contract Explicitly Non-Destructive And Narrowly Scoped (Priority: P3)

As a maintainer, I want the API contract to make soft deprovision clearly different from hard deletion so this story stays additive and does not imply destructive tenant removal behavior.

**Why this priority**: Jira explicitly requires the contract to distinguish soft deprovision from destructive deletion and keep the work limited to tenant-management backend behavior.

**Independent Test**: Review the successful response, error behavior, and repository documentation to confirm the API describes an inactive-state transition, not hard deletion or schema teardown.

**Acceptance Scenarios**:

1. **Given** a reviewer inspects the API contract, **When** they compare the soft deprovision capability to destructive deletion semantics, **Then** they can clearly see this story only inactivates the tenant.
2. **Given** a tenant is already inactive, **When** soft deprovision is requested again, **Then** the API responds predictably without deleting data or widening into a destructive path.
3. **Given** repository API documentation is reviewed, **When** the soft deprovision capability is inspected, **Then** the OpenAPI source and contract notes describe preserved data and inactive-status behavior.

### Edge Cases

- The tenant identifier does not match any platform tenant record.
- The target tenant is already `inactive`.
- The target tenant is still `provisioning` or `provisioning_failed`, and the system needs deterministic scope for whether soft deprovision is allowed.
- Tenant-scoped users still hold valid-looking JWT claims for a tenant that has since become inactive.
- Soft deprovision must not drop the tenant schema, tenant migration history, or control-plane records.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST expose a super-admin-only API capability to soft deprovision a tenant from the platform control plane.
- **FR-002**: Soft deprovision MUST mark the target tenant inactive without deleting its tenant schema or control-plane record.
- **FR-003**: The system MUST preserve existing tenant schema migration history and related control-plane metadata when a tenant is soft deprovisioned.
- **FR-004**: After soft deprovision, tenant-scoped authentication or current-user resolution for the inactive tenant MUST be denied as an inactive tenant context rather than treated as an active membership.
- **FR-005**: After soft deprovision, protected tenant access flows MUST block normal active-use behavior for the inactive tenant.
- **FR-006**: The soft deprovision capability MUST remain limited to authenticated `super_admin` users.
- **FR-007**: The API contract MUST distinguish soft deprovision from hard destructive deletion.
- **FR-008**: The API MUST provide deterministic behavior when the target tenant does not exist or is already inactive.
- **FR-009**: The implementation MUST remain additive and limited to tenant-management backend behavior for this story.
- **FR-010**: The manual OpenAPI source MUST document the soft deprovision route surface and its non-destructive behavior.

### Key Entities *(include if feature involves data)*

- **Tenant Lifecycle Status**: The platform-level tenant state used to determine whether a tenant is active or inactive.
- **Soft Deprovision Operation**: The super-admin action that transitions a tenant out of active use without deleting data.
- **Tenant Access Context**: The tenant-scoped auth resolution and protected-route behavior that must no longer treat an inactive tenant as available for normal use.

### Assumptions

- The existing `Tenant.status` model remains the source of truth for active versus inactive tenant availability.
- Soft deprovision for this story is a reversible status transition concept, not a schema teardown or destructive archival workflow.
- Existing platform RBAC middleware remains the enforcement boundary for super-admin-only control-plane actions.
- A follow-up story can add richer lifecycle metadata, recovery workflows, or destructive deletion if needed.

### Dependencies

- Existing tenant provisioning and control-plane tenant routing in `apps/api`.
- Existing tenant-auth resolution and protected-route middleware in `apps/api/src/auth` and `apps/api/src/middleware`.
- The manual OpenAPI document in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/docs/openapi.ts`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of tested successful soft deprovision calls transition the targeted tenant to `inactive` without deleting its schema or control-plane record.
- **SC-002**: Reviewers can verify that 100% of tested tenant-auth flows for a soft-deprovisioned tenant are denied as inactive or unavailable for normal tenant use.
- **SC-003**: Reviewers can verify that 100% of tested unauthenticated or non-super-admin requests are rejected with the existing protected-route error behavior.
- **SC-004**: Reviewers can verify from the API contract and OpenAPI documentation that soft deprovision is explicitly non-destructive and distinct from hard deletion.
- **SC-005**: Reviewers can verify the implementation remains limited to additive tenant-management backend behavior and does not introduce tenant data deletion.
