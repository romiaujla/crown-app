# Research: API Super Admin Dashboard Key Metric Cards Contract

## Decision 1: Keep the existing `widgets.tenant_summary` envelope

- **Decision**: Add the new metric-card fields under the existing `widgets.tenant_summary` object instead of creating a second route or a sibling widget for the same card set.
- **Why**: `CROWN-119` is an additive contract-extension story for the same super-admin overview surface created in `CROWN-116`. Keeping the existing envelope avoids unnecessary UI fetch churn and keeps the route future-friendly.
- **Alternatives considered**:
  - Create `GET /api/v1/platform/dashboard/metrics`: rejected because it fragments the same overview surface across two endpoints without a Jira requirement.
  - Add a new `widgets.metric_cards` sibling: rejected because the existing `tenant_summary` already owns the total and status fields this story extends.

## Decision 2: Define windows as trailing 7, 30, and 365 day ranges anchored to request time

- **Decision**: Use trailing windows ending at request time for `week`, `month`, and `year`, defined as the last 7, 30, and 365 days respectively.
- **Why**: Jira asks for dashboard trend cards, not accounting-period or reporting-calendar summaries. Trailing windows behave predictably for an at-a-glance dashboard and can be computed directly from `Tenant.createdAt`.
- **Alternatives considered**:
  - Calendar-aligned ISO week/month/year boundaries: rejected because they introduce timezone and period-boundary semantics Jira did not request.
  - Rolling hourly windows or configurable ranges: rejected because they widen the contract beyond the current card set.

## Decision 3: Represent windows as deterministic ordered entries keyed by a shared enum

- **Decision**: Return `new_tenant_counts` and `tenant_growth_rates` as ordered arrays of `{ window, value }`-style entries keyed by a shared `DashboardMetricWindowEnum`.
- **Why**: The window set is small, closed, and reused across multiple fields. A shared enum plus deterministic ordering keeps the contract explicit and reviewable.
- **Alternatives considered**:
  - Repeated object properties such as `week_new_tenant_count`: rejected because it duplicates the window vocabulary across fields and scales poorly.
  - Free-form strings: rejected by the constitution preference for named reusable enums.

## Decision 4: Normalize divide-by-zero growth-rate behavior in the contract

- **Decision**: Use `100` when the previous comparison window count is `0` and the current count is positive, and use `0` when both windows are `0`.
- **Why**: The UI needs a usable number for trend-card rendering, and these rules eliminate `null`, `Infinity`, and implementation-specific fallbacks.
- **Alternatives considered**:
  - Return `null` when previous is `0`: rejected because the Jira story asks for growth-rate values, not optional growth-rate placeholders.
  - Return unbounded `Infinity`: rejected because it is not review-friendly or UI-friendly.

## Decision 5: Round growth rates to two decimal places

- **Decision**: Round `tenant_growth_rates` values to two decimal places before returning them.
- **Why**: This keeps API snapshots stable and avoids leaking noisy floating-point precision into the contract.
- **Alternatives considered**:
  - Return raw floating-point results: rejected because it creates unnecessarily unstable response values.
  - Round to integers: rejected because smaller window counts can produce materially different values that benefit from two-decimal precision.
