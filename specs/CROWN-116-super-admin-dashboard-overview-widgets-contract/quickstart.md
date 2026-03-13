# Quickstart: CROWN-116 API Super-Admin Dashboard Overview Widgets Contract

## Goal

Validate the super-admin dashboard overview endpoint and confirm it returns the initial widget contract needed by `CROWN-93`.

## Prerequisites

- API workspace dependencies are installed.
- The branch includes the `CROWN-116` route, response contract, and OpenAPI updates.
- Test environment can execute the API contract and integration suites.

## Validation Flow

1. Run focused API tests covering the dashboard overview route and aggregation behavior.
2. Verify a `super_admin` request to `GET /api/v1/platform/dashboard/overview` returns `200`.
3. Verify the response contains:
   - `widgets`
   - `widgets.tenant_summary.total_tenant_count`
   - `widgets.tenant_summary.tenant_status_counts`
4. Verify `tenant_status_counts` includes every current `TenantStatus` value, even when some counts are `0`.
5. Verify missing authentication returns the existing unauthenticated error contract.
6. Verify tenant-scoped authenticated callers receive the existing forbidden-role response.
7. Verify the response excludes recent-activity or recent-tenant-change fields.
8. Review `apps/api/src/docs/openapi.ts` and confirm the route plus schema entries match the implemented contract.

## Suggested Commands

```bash
pnpm --filter @crown/api test
pnpm --filter @crown/api typecheck
pnpm specify.audit
```

## Out of Scope Checks

- Platform dashboard UI rendering in `apps/web`
- Recent tenant changes or activity-feed widgets
- Historical trend reporting
- Unrelated platform routes or tenant-management APIs
