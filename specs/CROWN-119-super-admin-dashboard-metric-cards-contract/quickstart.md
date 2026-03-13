# Quickstart: CROWN-119 API Super Admin Dashboard Key Metric Cards Contract

## Goal

Validate that the existing dashboard overview route returns the additive key metric-card fields required by `CROWN-98`.

## Prerequisites

- API dependencies are installed.
- The branch includes the `CROWN-119` route-contract, service, test, and OpenAPI updates.
- The test environment can run the API contract and integration suites.

## Validation Flow

1. Run focused API tests for the dashboard overview route and service.
2. Verify a `super_admin` request to `GET /api/v1/platform/dashboard/overview` returns `200`.
3. Verify the response contains:
   - `widgets.tenant_summary.total_tenant_count`
   - `widgets.tenant_summary.tenant_user_count`
   - `widgets.tenant_summary.new_tenant_counts`
   - `widgets.tenant_summary.tenant_growth_rates`
4. Verify `new_tenant_counts` includes ordered `week`, `month`, and `year` entries even when one or more values are `0`.
5. Verify `tenant_growth_rates` includes ordered `week`, `month`, and `year` entries and matches the documented comparison-window math.
6. Verify missing authentication still returns the existing unauthenticated contract.
7. Verify tenant-scoped authenticated callers still receive the existing forbidden-role contract.
8. Review `apps/api/src/docs/openapi.ts` and confirm the route plus schemas match the implemented response.

## Suggested Commands

```bash
pnpm --filter @crown/api test -- platform-dashboard-overview
pnpm --filter @crown/api typecheck
pnpm specify.audit
```

## Out Of Scope Checks

- `apps/web` metric-card rendering changes for `CROWN-98`
- Additional dashboard routes
- Activity-feed or audit-log widgets
- Schema or migration changes
