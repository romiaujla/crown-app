# Research: API Tenant Create Reference-Data Contract For Management-System Types And Default Roles

## Decision 1: Use a dedicated `POST /api/v1/platform/tenant/reference-data` route with an optional filter body

- **Decision**: Add a read-only `POST` route under the existing platform tenant router and accept an optional `filter.managementSystemType` request body.
- **Why**: The story still needs a distinct reference-data route, and the optional body filter lets the caller request one management-system type without splitting the contract into separate endpoints or query-string handling.
- **Alternatives considered**:
  - Extending `POST /api/v1/platform/tenant`: rejected because it mixes creation and catalog discovery into one route surface.
  - Reusing `POST /api/v1/platform/tenants/search`: rejected because tenant directory data is unrelated to management-system type onboarding metadata.
  - Using `GET` with query parameters: rejected because the caller now needs a body-driven filter contract for consistency with the requested payload shape.

## Decision 2: Return only active management-system types

- **Decision**: Source tenant-create options from active `ManagementSystemType` records only.
- **Why**: Jira asks for the supported management-system types used by tenant creation, and the seeded data already carries an availability-status field intended to express supportability.
- **Alternatives considered**:
  - Returning all versions/statuses: rejected because later UI work should not have to filter unsupported onboarding options client-side.
  - Hard-coding the seeded types: rejected because the story explicitly calls for a stable API contract backed by persisted data.

## Decision 3: Derive `isRequired` from the shared `tenant_admin` role code

- **Decision**: Return each role option with `isDefault` from persistence and derive `isRequired` by checking whether `roleCode === "tenant_admin"`.
- **Why**: The persistence model already stores default membership through `is_default`, but required tenant-create semantics for the admin option are story-specific contract behavior rather than a persisted schema field.
- **Alternatives considered**:
  - Adding a new persisted `is_required` column: rejected because `CROWN-141` is scoped to API contract behavior, not schema changes.
  - Leaving required-role logic entirely to the UI: rejected because Jira explicitly asks for the admin role to appear as a mandatory role-selection option in the contract used by later UI work.

## Decision 4: Define the shared contract once in `@crown/types`

- **Decision**: Add the response schema and inferred types to `packages/types/src/index.ts` and parse the API response through that shared schema.
- **Why**: The constitution requires shared API/web contracts to live once in `@crown/types` when both packages will consume them.
- **Alternatives considered**:
  - Defining route-local Zod schemas in `apps/api`: rejected because it would force the future web tenant-create flow to duplicate the contract.

## Decision 5: Use deterministic ordering for types and roles

- **Decision**: Sort management-system types by `displayName` and role options by `displayName` before returning the response.
- **Why**: Reference-data endpoints should be stable for tests and UI rendering without requiring the client to reorder backend-provided data.
- **Alternatives considered**:
  - Leaving Prisma default ordering unspecified: rejected because nondeterministic ordering makes contract tests and onboarding UI behavior brittle.
