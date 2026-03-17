# Feature Specification: API Tenant Slug Availability Lookup Endpoint

**Feature Branch**: `feat/CROWN-137-api-tenant-slug-availability-lookup-endpoint`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: Jira issue `CROWN-137` - "API | Tenant slug availability lookup endpoint"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Check Whether A Tenant Slug Is Available (Priority: P1)

As a super admin, I want a dedicated tenant-slug availability lookup so that I can learn whether a slug is already taken before submitting tenant creation.

**Why this priority**: This is the story's core Jira outcome. Without a dedicated lookup, the create flow cannot provide pre-submit feedback about slug conflicts.

**Independent Test**: Call the slug-availability endpoint with one slug that does not exist and one slug that already exists, then verify the API returns a clear available or unavailable result for each.

**Acceptance Scenarios**:

1. **Given** a tenant slug that is not currently stored in the control-plane tenant catalog, **When** a super admin checks slug availability, **Then** the API responds that the slug is available.
2. **Given** a tenant slug that already exists in the control-plane tenant catalog, **When** a super admin checks slug availability, **Then** the API responds that the slug is unavailable.
3. **Given** a tenant record remains in the platform catalog after lifecycle changes such as soft or hard deprovisioning, **When** its slug is checked, **Then** the API still reports that slug as unavailable so create-time uniqueness stays aligned with provisioning behavior.

---

### User Story 2 - Apply Provisioning-Consistent Slug Validation For Repeated Checks (Priority: P1)

As a maintainer, I want slug availability checks to follow the same slug rules as tenant provisioning and remain safe for repeated debounced requests so that the UI does not drift from the actual create-time behavior.

**Why this priority**: A fast lookup is only useful if it agrees with the provisioning path and can tolerate the repeated request pattern the future UI will use.

**Independent Test**: Send valid, invalid, and repeated slug lookup requests and verify the endpoint enforces the same slug rules as provisioning while continuing to handle repeated checks without using a mutation-oriented limit profile.

**Acceptance Scenarios**:

1. **Given** a slug input that violates the existing tenant provisioning slug rules, **When** the slug-availability endpoint validates the request, **Then** the API rejects the request using the existing protected-route validation error behavior rather than returning a misleading availability result.
2. **Given** a slug input that would be normalized by the provisioning path before persistence, **When** availability is checked, **Then** the lookup behavior stays consistent with the provisioning normalization and validation rules so the same logical slug is evaluated.
3. **Given** the create UI performs 500 ms debounced lookups while a super admin types, **When** repeated slug checks are made for the same or changing values, **Then** the endpoint remains read-only and uses a lookup-safe rate-limiting profile rather than the stricter tenant-mutation limits.

---

### User Story 3 - Keep The Contract Narrow, Reusable, And Documented (Priority: P2)

As a maintainer, I want the slug-availability route to expose a simple response contract and appear in the manual OpenAPI document so that future tenant-create UI work can consume one documented source of truth without widening this story into full create-form behavior.

**Why this priority**: The story delivers a narrow API contract for a later UI story, so the route should be easy to consume, easy to document, and explicitly limited to lookup behavior.

**Independent Test**: Review the shared route contract and OpenAPI docs, then confirm the route documents one slug lookup request and one simple availability response without including unrelated tenant-create fields or mutation behavior.

**Acceptance Scenarios**:

1. **Given** a successful slug-availability lookup, **When** the response is inspected, **Then** it contains only the small set of fields required for the UI to render available versus unavailable feedback clearly.
2. **Given** API and web packages will both rely on this contract, **When** reviewers inspect the implementation, **Then** the shared request and response schemas live in `@crown/types` rather than duplicated route-local definitions.
3. **Given** the route surface is added for slug availability lookup, **When** the manual docs are reviewed, **Then** `apps/api/src/docs/openapi.ts` documents the endpoint, its request payload, and its success and validation-error responses.
4. **Given** the feature is reviewed against Jira scope, **When** the delivered changes are inspected, **Then** the story remains limited to slug lookup behavior and does not implement tenant-create UI interactions, final provisioning submission, or broader tenant-create form workflows.

### Edge Cases

- The checked slug belongs to a tenant that is `inactive`, `provisioning`, `provisioning_failed`, or `hard_deprovisioned`.
- The request contains leading or trailing whitespace or uppercase characters that the provisioning flow would normalize before evaluating the slug.
- The request contains partial or malformed values that do not satisfy the existing lowercase kebab-case slug rules.
- The same caller repeats lookups rapidly for the same slug during a debounced typing flow.
- Future tenant-create fields such as tenant name, management-system type selection, or role selection must remain out of scope for this lookup contract.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST expose a dedicated protected API contract for checking whether one tenant slug is currently available for tenant creation.
- **FR-002**: The slug-availability lookup MUST evaluate uniqueness against the persisted platform tenant catalog that provisioning uses for slug conflict detection.
- **FR-003**: A checked slug MUST be reported as unavailable when any existing tenant record already owns that slug, including tenants in non-active lifecycle states that still retain their slug.
- **FR-004**: The slug-availability lookup MUST apply slug normalization and validation rules that stay consistent with the existing tenant provisioning path.
- **FR-005**: Requests with invalid slug input MUST be rejected using the existing protected-route validation error behavior.
- **FR-006**: The lookup route MUST stay read-only and MUST NOT create tenants, reserve slugs, mutate tenant records, or trigger provisioning side effects.
- **FR-007**: The endpoint MUST be safe for repeated UI lookups driven by an approximately 500 ms debounced input flow, including use of a read-oriented rate-limit profile instead of the tenant-mutation limit.
- **FR-008**: The successful response contract MUST remain simple enough for the future tenant-create UI to render available and unavailable states without inferring extra business logic.
- **FR-009**: Shared request and response schemas, inferred types, and any route-specific enums used by both API and web packages for slug availability MUST be defined once in `@crown/types`.
- **FR-010**: The route MUST reject unauthenticated and non-super-admin callers using the existing protected-route authorization behavior.
- **FR-011**: The manual OpenAPI source MUST document the slug-availability endpoint and its request and response contract.
- **FR-012**: The story MUST remain limited to slug lookup behavior and MUST NOT widen into tenant-create UI implementation, full provisioning submission, or broader tenant-create validation workflows unrelated to slug availability.

### Key Entities _(include if feature involves data)_

- **Tenant Slug Availability Request**: The one-slug request payload used by the create flow to ask whether a candidate tenant slug is available.
- **Tenant Slug Availability Result**: The success payload that communicates the evaluated slug and whether it is currently available for tenant creation.
- **Tenant Catalog Record**: The persisted control-plane tenant record whose slug ownership determines whether the checked slug is available.

### Assumptions

- Slug availability should align with the current provisioning conflict behavior, which treats any existing retained slug as unavailable rather than reclaiming it automatically from inactive or deprovisioned tenants.
- The endpoint checks one candidate slug per request.
- The existing platform auth boundary remains the correct access model because tenant creation is a super-admin workflow.
- The future tenant-create UI will supply the debounce timing; this story only needs the API to support that repeated lookup pattern safely.
- The route will likely live alongside the existing platform tenant routes and reuse the current read-oriented rate-limit middleware pattern used for platform search/reference-data lookups.

### Dependencies

- Existing platform tenant router in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/routes/platform-tenants.ts`.
- Existing slug normalization and validation helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/tenant/slug.ts`.
- Existing provisioning request rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/tenant/contracts.ts`.
- Persisted tenant metadata in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/prisma/schema.prisma`.
- Shared contract package in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/packages/types/src/index.ts`.
- Manual OpenAPI documentation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/apps/api/src/docs/openapi.ts`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of tested available-slug requests return an explicit available result when no persisted tenant record owns the slug.
- **SC-002**: Reviewers can verify that 100% of tested taken-slug requests return an explicit unavailable result when a persisted tenant record already owns the slug.
- **SC-003**: Reviewers can verify that 100% of tested invalid slug requests are rejected using the existing validation-error behavior rather than returning a false availability result.
- **SC-004**: Reviewers can verify that repeated lookup requests use the read-oriented protection path and do not reuse the stricter tenant-mutation throttling intended for provisioning.
- **SC-005**: Reviewers can verify from shared schemas and manual OpenAPI documentation that the slug-availability contract is documented once and stays ready for future tenant-create UI consumption without widening the scope of this story.
