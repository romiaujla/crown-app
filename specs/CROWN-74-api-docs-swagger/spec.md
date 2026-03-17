# Feature Specification: Local API Docs Route With Swagger UI

**Feature Branch**: `feat/CROWN-74-api-docs-swagger`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: Jira issue `CROWN-74` - "Add local API docs route with Swagger UI for auth-bearing endpoints"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Open browser docs for auth-bearing endpoints (Priority: P1)

As a Crown developer, I want to open `/api/v1/docs` in a browser so I can review the current auth-bearing API surface without reconstructing requests manually from source files.

**Why this priority**: The primary value of this story is a browser-accessible docs page; without that route, none of the intended developer ergonomics exist.

**Independent Test**: A reviewer can start the API locally, open `/api/v1/docs`, and confirm a Swagger UI page renders the current auth-bearing endpoints.

**Acceptance Scenarios**:

1. **Given** the API is running locally, **When** a developer opens `/api/v1/docs`, **Then** Swagger UI loads successfully in the browser.
2. **Given** the docs page is loaded, **When** a developer inspects the listed operations, **Then** the current auth-bearing endpoints are present with readable request and response shapes.

---

### User Story 2 - Understand auth requirements from the docs page (Priority: P2)

As a Crown developer, I want auth-bearing endpoints to describe their payloads and authorization expectations so I can test them locally with fewer guesses.

**Why this priority**: Rendering Swagger UI is useful, but the page still needs meaningful auth-specific detail to reduce trial-and-error during local testing.

**Independent Test**: A reviewer can inspect the local docs page and verify login, current-user, logout, and protected routes describe request payloads and auth requirements clearly enough for local use.

**Acceptance Scenarios**:

1. **Given** an auth-bearing endpoint is documented, **When** a developer reads its definition in Swagger UI, **Then** the request payload, success response, and relevant authorization expectation are visible.
2. **Given** a protected endpoint requires a bearer token, **When** a developer reads the docs page, **Then** the endpoint indicates that authorization is required for local testing.

---

### User Story 3 - Keep the docs setup local/dev-friendly and narrowly scoped (Priority: P3)

As a maintainer, I want the first docs surface to stay local/dev-first so the implementation adds immediate developer value without widening into hosted docs publishing or a public spec distribution strategy.

**Why this priority**: Scope control matters here; the story is about a practical local docs page, not a broader documentation platform.

**Independent Test**: A reviewer can inspect the implementation and confirm the docs route works in the API service without introducing a separate public OpenAPI JSON endpoint or hosted-docs workflow.

**Acceptance Scenarios**:

1. **Given** the docs feature is implemented, **When** the route setup is reviewed, **Then** it is scoped to the in-app Swagger UI page and does not introduce a separate public raw spec endpoint for this story.
2. **Given** the docs page is used in local development, **When** maintainers review the implementation, **Then** it remains additive and does not depend on external docs hosting.

### Edge Cases

- The docs page loads but an endpoint definition is missing one of the current auth-bearing routes.
- The docs route works locally but accidentally exposes implementation detail or publishing behavior that belongs to a later hosted-docs story.
- An auth-bearing route changes shape and the docs fall out of sync with the current request or response contract.
- The docs page renders, but the authorization expectations for protected routes are too vague to support local testing.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST serve a browser-accessible Swagger UI page at `/api/v1/docs`.
- **FR-002**: The system MUST keep the first implementation scoped to local/dev usage within the API service.
- **FR-003**: The system MUST document the current auth-bearing endpoints available in the API.
- **FR-004**: The system MUST describe request payloads and success responses for documented auth-bearing endpoints clearly enough for local testing.
- **FR-005**: The system MUST indicate bearer-auth requirements for protected routes documented on the Swagger UI page.
- **FR-006**: The system MUST remain additive and MUST NOT require a separate public raw OpenAPI JSON endpoint in this story.
- **FR-007**: The system MUST avoid widening into hosted docs publishing, external documentation portals, or public documentation distribution workflows in this story.
- **FR-008**: The system MUST keep the docs definitions aligned with the implemented auth-bearing route contracts in the repository.

### Key Entities _(include if feature involves data)_

- **Docs Route**: The local browser-accessible endpoint that serves Swagger UI from the API service.
- **Documented Auth Endpoint**: An API operation with auth-relevant behavior that appears in the docs page, including payload and response information.
- **Authorization Requirement**: The bearer-token or protected-route expectation shown to developers for local testing.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can open `/api/v1/docs` locally and see a working Swagger UI page without additional hosting steps.
- **SC-002**: Reviewers can verify that 100% of the current auth-bearing endpoints in scope appear in the docs page.
- **SC-003**: Reviewers can verify from the docs page that protected endpoints clearly indicate bearer-auth expectations for local testing.
- **SC-004**: Reviewers can confirm the first implementation does not add a separate public raw spec endpoint or hosted-docs workflow.

## Assumptions

- `CROWN-74` is a local/dev-first developer-experience improvement under `CROWN-24`, not a public documentation initiative.
- The current auth-bearing routes in scope are the endpoints delivered by the current auth API foundation and protected-route surface.
- A later story can widen the documentation strategy if raw spec publication or hosted docs become necessary.
