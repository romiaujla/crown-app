## Decision: Expose the tenant directory as `GET /api/v1/platform/tenants`

- **Why**: The story is a collection read endpoint, and a plural collection path keeps the route semantics clear for directory behavior even though the existing create action uses the singular `/api/v1/platform/tenant` path.
- **Alternatives considered**:
  - `GET /api/v1/platform/tenant`: rejected because a singular resource path is less clear for a collection response.
  - `POST /api/v1/platform/tenant/search`: rejected because the current requirements are satisfied by simple query parameters on a read route.

## Decision: Standardize the response as `{ data, meta }` with `data.tenantList`

- **Why**: The agreed Crown API direction for this story is a top-level `data` payload container plus `meta`, with a resource-explicit `tenantList` collection and camelCase body properties.
- **Alternatives considered**:
  - Top-level `tenantList` without `data`: rejected because the `data` wrapper scales better for future contract expansion.
  - Generic `items` naming: rejected because the chosen convention prefers resource-specific `List` naming.
  - JSON:API-style `data`/`attributes`: rejected because it adds unnecessary complexity for this internal API surface.

## Decision: Keep nested related collections out of the initial directory response

- **Why**: The story is scoped to tenant collection data, search, and status filtering. Adding nested relations such as `userList` would widen the endpoint contract and service work beyond the Jira scope.
- **Alternatives considered**:
  - Include nested `userList`: rejected because it increases query complexity and should be handled by a follow-up detail or expanded-list story.
  - Return aggregate counts for related users: rejected because this story does not require them and they may imply additional dashboard-like semantics.

## Decision: Reuse the persisted tenant status enum as the query and response source of truth

- **Why**: Jira explicitly requires the UI to receive status values from the persisted platform model rather than duplicated frontend-only constants.
- **Alternatives considered**:
  - Inline a list of allowed status strings in the API route: rejected because the repository constitution prefers shared named enums.
  - Define a separate API-only tenant status enum: rejected because the status values already exist and are shared through `@crown/types`.

## Decision: Return full filtered results without pagination in this story

- **Why**: The user agreed to a minimal default contract with `totalRecords` and echoed filters. Pagination can be added later without changing the core `{ data, meta }` shape.
- **Alternatives considered**:
  - Add cursor pagination now: rejected because it is not required for the current UI scope and would widen the contract.
  - Add page-number pagination now: rejected for the same scope reason and because the dataset size is not yet established as a problem.
