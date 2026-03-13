# Quickstart: CROWN-98 UI Super Admin Dashboard Key Metric Cards

## Goal

Validate that the protected `/platform` dashboard renders the requested metric cards from the existing overview API contract.

## Prerequisites

- Web dependencies are installed.
- The branch includes the `CROWN-98` dashboard page and browser-test updates.
- The API contract from `CROWN-119` is available to the web client or stubbed by the browser tests.

## Validation Flow

1. Sign in as a `super_admin` and open `/platform`.
2. Verify the dashboard shows visible cards for:
   - total tenants
   - total users
   - new tenants across week, month, and year
   - tenant growth rate across week, month, and year
3. Verify zero-value windows still render explicit values.
4. Verify the metric-card copy remains consistent with trailing week/month/year windows.
5. Verify the tenant-status breakdown still renders as supporting context.
6. Verify the loading state still appears while the overview request is in flight.
7. Verify the error state still appears when the overview request fails.
8. Verify tenant-scoped users remain redirected away from the platform shell by the existing protected-shell flow.

## Suggested Commands

```bash
pnpm --filter @crown/web test -- auth-flow
pnpm --filter @crown/web typecheck
pnpm specify.audit
```

## Out Of Scope Checks

- API route, service, or OpenAPI changes already covered by `CROWN-119`
- New dashboard sections outside the existing `/platform` overview area
- Activity feeds, audit-log widgets, or billing/system-health detail views
- Auth-routing or token-storage redesign
