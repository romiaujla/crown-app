# Data Model: API Super Admin Dashboard Key Metric Cards Contract

## Overview

`CROWN-119` does not introduce new persistence models. It extends the response model of the existing super-admin dashboard overview route using existing control-plane records.

## Source Records

### Tenant

- **Purpose**: Canonical source for tenant lifecycle counts and creation-time windowing.
- **Relevant fields**:
  - `id`
  - `status`
  - `createdAt`

### PlatformUser

- **Purpose**: Canonical source for the existing `tenant_user_count` metric.
- **Relevant fields**:
  - `id`
  - `role`

## Response Entities

### DashboardMetricWindow

- **Purpose**: Shared metric window identity reused across new-tenant counts and growth-rate metrics.
- **Allowed values**:
  - `week`
  - `month`
  - `year`

### NewTenantCountMetric

- **Purpose**: Carries one current trailing-window tenant creation count.
- **Fields**:
  - `window`
  - `count`

### TenantGrowthRateMetric

- **Purpose**: Carries one percentage change between a current trailing window and the immediately preceding comparison window of equal length.
- **Fields**:
  - `window`
  - `growth_rate_percentage`

### TenantSummaryWidget

- **Purpose**: Existing dashboard summary contract extended for the first key metric cards.
- **Fields**:
  - `total_tenant_count`
  - `tenant_user_count`
  - `tenant_status_counts`
  - `new_tenant_counts`
  - `tenant_growth_rates`

## Metric Rules

- `new_tenant_counts` uses `Tenant.createdAt` inside the current trailing window ending at request time.
- `tenant_growth_rates` compares current-window `new_tenant_counts` against the immediately preceding window of equal length.
- Week = last 7 days.
- Month = last 30 days.
- Year = last 365 days.
- When previous = `0` and current > `0`, `growth_rate_percentage` = `100`.
- When previous = `0` and current = `0`, `growth_rate_percentage` = `0`.
- Otherwise, `growth_rate_percentage = ((current - previous) / previous) * 100`, rounded to two decimals.
