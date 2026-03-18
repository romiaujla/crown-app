# Feature Specification: API Tenant Create Onboarding Contract

**Feature Branch**: `feat/CROWN-145-api-tenant-create-onboarding-contract`  
**Created**: 2026-03-17  
**Status**: Draft  
**Input**: Jira issue `CROWN-145` - "API | Tenant create onboarding contract"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Submit Guided Tenant Create Payload Through One Contract (Priority: P1)

As a super admin, I want the guided tenant-create flow to submit a single onboarding request contract so tenant details, selected roles, and initial user assignments are validated together.

**Why this priority**: The onboarding flow cannot reliably move from UI steps to API submission without one canonical payload contract.

**Independent Test**: Validate the request schema for `/api/v1/platform/tenant` accepts the full onboarding shape and rejects malformed role/user combinations.

**Acceptance Scenarios**:

1. **Given** tenant onboarding data from the guided flow, **When** the payload is submitted, **Then** one dedicated request contract validates tenant info, selected roles, and initial user assignments.
2. **Given** payload fields outside the onboarding contract, **When** validation runs, **Then** unknown fields are rejected.
3. **Given** role or user fields violate the contract shape, **When** validation runs, **Then** the API returns a validation error without provisioning side effects.

---

### User Story 2 - Enforce V1 Onboarding Constraints In Contract (Priority: P1)

As a super admin, I want v1 onboarding constraints enforced at contract level so each initial user is a new user entry with exactly one selected role.

**Why this priority**: Constraint checks are required to keep guided-flow data deterministic before provisioning behavior is expanded.

**Independent Test**: Validate payloads where users have one role each, and verify contract failures when tenant-admin bootstrap or role-selection constraints are violated.

**Acceptance Scenarios**:

1. **Given** a valid onboarding payload, **When** contract validation runs, **Then** each initial user includes exactly one `roleCode` value.
2. **Given** selected roles and initial users, **When** contract validation runs, **Then** every user role exists in the selected-role list.
3. **Given** tenant bootstrap requirements, **When** contract validation runs, **Then** `tenant_admin` is present in selected roles and assigned to at least one initial user.

---

### User Story 3 - Keep Contract Documented And Scope-Limited (Priority: P2)

As a maintainer, I want the onboarding contract represented in shared types and OpenAPI so API and web work can consume one documented source without implementing new provisioning behavior.

**Why this priority**: This story is contract-first; documentation and scope guardrails prevent accidental workflow implementation drift.

**Independent Test**: Inspect shared types/OpenAPI definitions and confirm route behavior still delegates only existing provisioning fields.

**Acceptance Scenarios**:

1. **Given** shared package and API route usage, **When** reviewers inspect implementation, **Then** onboarding contract schemas/types live in `@crown/types` and are reused by API validation.
2. **Given** API docs generation, **When** `/api/v1/docs` is reviewed, **Then** `/api/v1/platform/tenant` request schema documents the onboarding payload shape.
3. **Given** this story scope, **When** route/service files are reviewed, **Then** no new provisioning workflow behaviors (user creation, role assignment persistence) are implemented.

### Edge Cases

- Duplicate role entries in selected-role list.
- Duplicate initial-user email entries.
- Initial-user role not present in selected-role list.
- `tenant_admin` omitted from selected roles.
- No initial user assigned `tenant_admin`.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST define a dedicated onboarding request contract for `POST /api/v1/platform/tenant` that includes tenant info, selected roles, and initial user assignments.
- **FR-002**: The onboarding contract MUST include tenant high-level info fields: `name`, `slug`, and `managementSystemTypeCode`.
- **FR-003**: The onboarding contract MUST include `selectedRoleCodes` as a non-empty list of role codes.
- **FR-004**: The onboarding contract MUST include `initialUsers` as a non-empty list of new-user entries with required fields for v1 (`firstName`, `lastName`, `email`, `roleCode`).
- **FR-005**: The onboarding contract MUST enforce exactly one role per user by modeling one `roleCode` field per initial-user entry.
- **FR-006**: The onboarding contract MUST enforce that each initial user `roleCode` exists in `selectedRoleCodes`.
- **FR-007**: The onboarding contract MUST enforce tenant-admin bootstrap: `tenant_admin` appears in `selectedRoleCodes` and at least one initial user has `roleCode = tenant_admin`.
- **FR-008**: The API MUST continue returning validation errors for invalid onboarding payloads without adding provisioning workflow side effects.
- **FR-009**: The onboarding request/response contract schemas and inferred types shared by API and web MUST be defined in `@crown/types`.
- **FR-010**: Manual OpenAPI documentation in `apps/api/src/docs/openapi.ts` MUST reflect the onboarding request schema for `/api/v1/platform/tenant`.
- **FR-011**: This story MUST remain limited to contract definition and documentation alignment; no new user-provisioning workflow behavior is allowed.

### Key Entities _(include if feature involves data)_

- **TenantCreateOnboardingSubmissionRequest**: The full guided-flow payload containing tenant info, selected roles, and initial user assignments.
- **TenantCreateOnboardingTenantInfo**: High-level tenant identity and management-system selection.
- **TenantCreateOnboardingInitialUser**: A v1 new-user assignment with required identity fields and one role.
- **TenantCreateOnboardingSubmissionResponse**: Existing provisioning response envelope reused for the onboarding submission contract.

### Assumptions

- V1 user creation fields are confirmed as `firstName`, `lastName`, `email`, and `roleCode`.
- Existing runtime provisioning remains the source of truth for tenant creation side effects.
- Guided-flow UI and API will consume shared schemas from `@crown/types`.

### Dependencies

- `packages/types/src/index.ts` for shared onboarding schemas.
- `apps/api/src/tenant/contracts.ts` and `apps/api/src/routes/platform-tenants.ts` for API validation wiring.
- `apps/api/src/docs/openapi.ts` for manual contract documentation.
- Existing platform tenant route contract tests under `apps/api/tests/contract/`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of reviewed guided-flow fields (tenant info, selected roles, initial users) are represented in one onboarding request contract.
- **SC-002**: 100% of contract tests for invalid v1 constraints (missing tenant-admin bootstrap, user role not selected, malformed user entry) return validation errors.
- **SC-003**: `/api/v1/docs` documents the onboarding request schema for `/api/v1/platform/tenant` with all required fields.
- **SC-004**: Implementation diff contains no new provisioning workflow behavior beyond contract validation and request mapping.
