# Contract: API Super Admin Dashboard Key Metric Cards

## Purpose

Extend the existing super-admin dashboard overview route so `CROWN-98` can fetch the first metric-card dataset from one protected endpoint.

## Route Surface

### `GET /api/v1/platform/dashboard/overview`

- Requires a valid `super_admin` bearer token.
- Returns the current super-admin dashboard overview payload.
- Reuses the existing unauthenticated and forbidden-role error contracts.

## Successful Response Contract

- Keeps the top-level `widgets` envelope.
- Keeps the `widgets.tenant_summary` object introduced by `CROWN-116`.
- Includes:
  - `widgets.tenant_summary.total_tenant_count`
  - `widgets.tenant_summary.tenant_user_count`
  - `widgets.tenant_summary.tenant_status_counts`
  - `widgets.tenant_summary.new_tenant_counts`
  - `widgets.tenant_summary.tenant_growth_rates`

## Metric Definitions

### New Tenant Counts

- `new_tenant_counts` is a deterministic ordered list with entries for `week`, `month`, and `year`.
- `week` = trailing 7-day window ending at request time.
- `month` = trailing 30-day window ending at request time.
- `year` = trailing 365-day window ending at request time.
- Each count uses `Tenant.createdAt` as the canonical tenant creation timestamp.

### Tenant Growth Rates

- `tenant_growth_rates` is a deterministic ordered list with entries for `week`, `month`, and `year`.
- Each growth-rate value compares the current trailing window against the immediately preceding trailing window of the same length.
- Formula: `((current - previous) / previous) * 100`
- If `previous = 0` and `current > 0`, return `100`.
- If `previous = 0` and `current = 0`, return `0`.
- Returned growth-rate values are rounded to two decimal places.

## Auth Contract Expectations

### Allowed Caller

- `super_admin`

### Denied Callers

- Missing token -> existing unauthenticated response
- `tenant_admin` -> existing forbidden-role response
- `tenant_user` -> existing forbidden-role response

## Out-of-Scope Contract Behavior

- No recent activity feed
- No tenant mutation operations
- No calendar-aligned reporting periods
- No separate route for metric cards

## Documentation Expectations

- `apps/api/src/docs/openapi.ts` must describe the expanded `tenant_summary` schema and the metric definitions.
- Shared consumer typings that mirror the overview route should stay aligned with the API response.
