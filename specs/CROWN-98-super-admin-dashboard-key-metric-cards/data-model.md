# Data Model: UI Super Admin Dashboard Key Metric Cards

## Overview

`CROWN-98` does not introduce new persistence models. It consumes the existing dashboard overview response and maps it into a clearer card-oriented presentation on the super-admin dashboard.

## Source Contract

### DashboardOverviewResponse

- **Purpose**: Protected API payload consumed by the super-admin dashboard.
- **Relevant fields**:
  - `widgets.tenant_summary.total_tenant_count`
  - `widgets.tenant_summary.tenant_user_count`
  - `widgets.tenant_summary.tenant_status_counts`
  - `widgets.tenant_summary.new_tenant_counts`
  - `widgets.tenant_summary.tenant_growth_rates`

## View Entities

### DashboardMetricCard

- **Purpose**: A primary dashboard card showing one metric or metric family.
- **Fields**:
  - `title`
  - `value` or grouped `entries`
  - `supporting_copy`

### WindowMetricEntry

- **Purpose**: One labeled dashboard value for a metric window.
- **Fields**:
  - `window`
  - `display_label`
  - `display_value`

### TenantStatusSummaryPanel

- **Purpose**: Supporting context that retains the earlier `CROWN-93` status distribution below the new metric cards.
- **Fields**:
  - `status`
  - `count`

## Mapping Rules

- `total_tenant_count` maps directly to the headline tenant total card.
- `tenant_user_count` maps directly to the headline user total card.
- `new_tenant_counts` maps to a grouped "New tenants" card with `week`, `month`, and `year` entries.
- `tenant_growth_rates` maps to a grouped "Tenant growth rate" card with percentage-formatted `week`, `month`, and `year` entries.
- `tenant_status_counts` remains supporting context below the primary metric-card row.

## Presentation Rules

- Zero values remain visible and are never omitted.
- Growth-rate values retain the API meaning and are displayed with a `%` suffix.
- Window labels stay aligned to the trailing-window contract from `CROWN-119`.
