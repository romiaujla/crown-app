# Research: CROWN-74 API Docs Swagger

## Decision: Serve Swagger UI from the API process at `/api/v1/docs`

- **Why**: The Jira story asks for a browser-friendly local docs page, not a separate docs application. Mounting Swagger UI directly in the existing Express app keeps the implementation additive and easy for local developers to use.
- **Alternatives considered**:
  - Stand up a separate docs app: rejected because it widens scope and adds unnecessary runtime complexity.
  - Render a custom HTML page without Swagger UI: rejected because it recreates standard API-doc tooling and loses built-in request exploration UX.

## Decision: Keep the OpenAPI document internal to the docs route implementation

- **Why**: The story explicitly excludes a separate public raw OpenAPI JSON endpoint. The API can still build the OpenAPI document in memory and hand it to Swagger UI without publishing a standalone document route.
- **Alternatives considered**:
  - Expose `/api/v1/openapi.json`: rejected because it is out of scope for this story.
  - Skip formal OpenAPI structure and handwrite prose docs: rejected because Swagger UI expects a structured document and the route should remain maintainable.

## Decision: Document only the current auth-bearing route surface

- **Why**: The current API surface already includes login, logout, current-user, protected authorization probes, and platform tenant provisioning. Restricting the docs to auth-bearing routes aligns with Jira scope and avoids turning this story into full API documentation coverage.
- **Alternatives considered**:
  - Document every route under `/api/v1`: rejected because it widens scope beyond the story.
  - Document only `/api/v1/auth/*`: rejected because protected routes also need bearer-auth guidance in this story.

## Decision: Prefer explicit OpenAPI definitions for existing request and response contracts

- **Why**: The current codebase already has Zod request/response schemas for auth contracts, but not every auth-bearing route is modeled in a reusable OpenAPI-ready form. A focused docs module can assemble stable examples and schemas without refactoring the entire route layer first.
- **Alternatives considered**:
  - Fully generate the document from route code: rejected because the current Express routes are not structured for automatic extraction.
  - Keep the docs entirely example-based with no schemas: rejected because Swagger UI is more useful when request and response models are explicit.

## Decision: Keep the docs route local/dev-friendly with no production-specific publication strategy

- **Why**: Jira scope is intentionally narrow. The route should work when developers run the API locally, and any later production/docs-hosting decisions should stay in a follow-up story.
- **Alternatives considered**:
  - Add environment-dependent public docs exposure now: rejected because it introduces policy and deployment questions not needed for the current story.
  - Block docs entirely outside development mode: rejected because local-friendly does not require forbidding all other environments in code.
