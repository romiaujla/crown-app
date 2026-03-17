# Research: API Tenant Slug Availability Lookup Endpoint

## Decision 1: Use a dedicated `POST /api/v1/platform/tenant/slug-availability` route

- **Decision**: Add a read-only `POST` route under the existing platform tenant router and accept one candidate slug in the request body.
- **Why**: The codebase already uses protected `POST` routes for platform tenant lookups, and a body-driven contract fits the existing request-validation and rate-limit patterns.
- **Alternatives considered**:
  - Extending `POST /api/v1/platform/tenant`: rejected because creation and pre-submit lookup are separate behaviors.
  - Reusing `POST /api/v1/platform/tenants/search`: rejected because tenant-directory search is a different contract and different user task.
  - Using `GET` with a query string: rejected because the surrounding platform router conventions already favor body-validated `POST` lookup contracts.

## Decision 2: Normalize first, then validate and check availability

- **Decision**: Apply the same trim and lowercase normalization behavior used by tenant provisioning before validating and checking the slug.
- **Why**: Provisioning currently normalizes input before conflict detection, so the lookup endpoint should evaluate the same logical slug the create path would use.
- **Alternatives considered**:
  - Validating the raw request body without normalization: rejected because it could disagree with provisioning outcomes for uppercase or whitespace-padded values.
  - Returning availability for malformed values: rejected because invalid slugs should not produce misleading availability results.

## Decision 3: Treat any persisted tenant record as making the slug unavailable

- **Decision**: Return `isAvailable = false` whenever the normalized slug already belongs to any persisted tenant record, regardless of tenant lifecycle status.
- **Why**: The provisioning path treats retained slugs as conflicts, including records that remain after lifecycle changes, so lookup behavior should match that uniqueness rule.
- **Alternatives considered**:
  - Ignoring inactive or hard-deprovisioned tenants: rejected because it would let the lookup promise availability that provisioning would not honor.

## Decision 4: Keep the success contract intentionally small

- **Decision**: Return a compact success payload centered on the evaluated slug and one availability boolean.
- **Why**: Jira asks for a contract that the UI can render clearly, and the future create flow does not need extra tenant details to show available versus unavailable feedback.
- **Alternatives considered**:
  - Returning the matching tenant record when unavailable: rejected because that widens the story into directory/disclosure behavior.
  - Adding multiple route-specific status enums: rejected because a boolean availability result is simpler and sufficient for the stated UI need.

## Decision 5: Define the shared contract once in `@crown/types`

- **Decision**: Add the slug-availability request and response schemas plus inferred types to `packages/types/src/index.ts` and parse the API response through that shared schema.
- **Why**: The constitution requires shared API/web contracts to live once in `@crown/types` when both packages are expected to consume them.
- **Alternatives considered**:
  - Defining route-local Zod schemas in `apps/api`: rejected because it would force the later web story to duplicate the same contract.
