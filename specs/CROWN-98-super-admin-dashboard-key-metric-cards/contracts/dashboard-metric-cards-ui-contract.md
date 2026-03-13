# Contract: UI Super Admin Dashboard Key Metric Cards

## Purpose

Describe the user-visible behavior for rendering the first super-admin dashboard metric cards from the protected overview payload.

## Consumed API Shape

The dashboard reads these fields from `GET /api/v1/platform/dashboard/overview`:

- `widgets.tenant_summary.total_tenant_count`
- `widgets.tenant_summary.tenant_user_count`
- `widgets.tenant_summary.tenant_status_counts`
- `widgets.tenant_summary.new_tenant_counts`
- `widgets.tenant_summary.tenant_growth_rates`

## Required UI Outcomes

- The dashboard foregrounds metric cards for total tenants and total users.
- The dashboard shows week, month, and year entries for new-tenant counts.
- The dashboard shows week, month, and year entries for tenant growth rates.
- The dashboard keeps the tenant-status breakdown as supporting context rather than the primary emphasis.
- Zero values remain visible.
- Growth-rate values display as percentages.

## Copy And Meaning

- Window labels must remain consistent with the trailing-window definitions documented by `CROWN-119`.
- The UI must not relabel the metrics in a way that implies calendar-aligned reporting periods.
- The growth-rate presentation must not redefine the underlying formula; it only formats the numeric API value for display.

## Protected Behavior Expectations

- The metric-card section is only reachable through the existing protected `/platform` shell.
- Missing or invalid overview data must surface through the existing loading/error handling pattern instead of crashing the page.

## Out-of-Scope UI Behavior

- New API fetch paths
- New dashboard sections or routes
- Editable dashboard preferences
- Charts, sparklines, or activity feeds
