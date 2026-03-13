# Contract: API Super-Admin Dashboard Overview Widgets

## Purpose

Define the first super-admin dashboard overview API contract that supplies the initial widget data required by `CROWN-93`.

## Route Surface

### `GET /api/v1/platform/dashboard/overview`

- Requires a valid `super_admin` bearer token.
- Returns the current dashboard overview payload for the control-plane landing page.
- Reuses the existing unauthenticated and forbidden-role error contracts when access is denied.

## Successful Response Contract

- Returns a top-level `widgets` object.
- Includes `widgets.tenant_summary.total_tenant_count` as the platform-wide tenant total.
- Includes `widgets.tenant_summary.tenant_status_counts` as a deterministic list of status/count entries for every current `TenantStatus`.
- Uses explicit zero-count entries when a current status has no matching tenants.
- Leaves room for future widgets by allowing new sibling keys to be added under `widgets` without changing the `tenant_summary` fields.

## Auth Contract Expectations

### Allowed Caller

- `super_admin`

### Denied Callers

- Missing token -> existing unauthenticated response
- `tenant_admin` -> existing forbidden-role response
- `tenant_user` -> existing forbidden-role response

## Out-of-Scope Contract Behavior

- No recent tenant changes feed
- No activity timeline
- No trend or historical comparison metrics
- No tenant-management mutation operations

## Documentation Expectations

- The route and its schemas must be represented in `apps/api/src/docs/openapi.ts`.
- The manual OpenAPI entry should describe the widgets envelope as the contract-extension pattern for future dashboard widgets.
