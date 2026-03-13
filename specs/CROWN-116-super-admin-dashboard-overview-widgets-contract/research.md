# Research: CROWN-116 API Super-Admin Dashboard Overview Widgets Contract

## Decision: Expose one protected `GET /api/v1/platform/dashboard/overview` endpoint

- **Why**: The story is about a stable overview contract for the super-admin dashboard, and the existing platform namespace already groups super-admin routes under `/api/v1/platform/*`.
- **Alternatives considered**:
  - Add the contract under `/api/v1/platform/tenants`: rejected because the endpoint serves dashboard aggregation, not tenant provisioning behavior.
  - Return dashboard overview data from `/api/v1/auth/me`: rejected because it mixes identity resolution with dashboard content and would make future widget growth awkward.

## Decision: Use a top-level `widgets` envelope with `tenant_summary` as the first widget

- **Why**: Jira explicitly requires safe future widget expansion. A `widgets` object keeps the initial widget contract isolated while leaving room for later sibling widgets without changing the tenant-summary fields.
- **Alternatives considered**:
  - Flat response fields such as `total_tenant_count` at the top level: rejected because future widgets would force a breaking reorganization or an inconsistent payload.
  - Array-based widget responses: rejected because current UI needs a deterministic named widget contract rather than positional interpretation.

## Decision: Return deterministic zero-count status buckets for every current `TenantStatus`

- **Why**: The dashboard UI should not need to infer missing statuses. Returning every current enum value keeps the contract predictable for empty states and aligns with the Jira requirement to use the statuses that currently exist in the platform model.
- **Alternatives considered**:
  - Return only observed statuses from the database: rejected because missing buckets would force client-side normalization and create UI ambiguity.
  - Hard-code a smaller subset of statuses: rejected because it would drift from the current platform model.

## Decision: Keep the initial widget limited to current-state counts, not recent activity or trends

- **Why**: Both `CROWN-93` and `CROWN-116` explicitly exclude recent tenant changes and activity-feed data. Limiting the first widget to current-state counts keeps the endpoint narrow and avoids premature dashboard aggregation scope.
- **Alternatives considered**:
  - Add recent tenant changes now: rejected because the Jira acceptance criteria explicitly mark that data out of scope.
  - Add trend metrics or historical comparisons: rejected because they require broader reporting decisions and potentially additional persistence/query logic.

## Decision: Implement the aggregation in a small service module that reuses Prisma and shared status enums

- **Why**: A dedicated service keeps route handlers thin, makes response shaping testable without HTTP wiring, and centralizes the zero-fill logic against the shared `TenantStatus` enum.
- **Alternatives considered**:
  - Build the response inline in the route handler: rejected because it couples transport logic and aggregation details.
  - Create a broader platform-dashboard repository layer: rejected because the story only needs one focused aggregation at this point.
