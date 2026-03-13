# Data Model: CROWN-116 API Super-Admin Dashboard Overview Widgets Contract

## Existing Entities Reused

### Tenant

- **Role in `CROWN-116`**: Source of the platform-wide tenant total and status-based counts.
- **Relevant fields**:
  - `id`
  - `status`
- **Rules**:
  - Every persisted tenant contributes to `total_tenant_count`.
  - Status aggregation must use the canonical `TenantStatus` enum values from the platform model.

### TenantStatus

- **Role in `CROWN-116`**: Canonical set of statuses that define the allowed status buckets in the dashboard response.
- **Current values**:
  - `active`
  - `inactive`
  - `provisioning`
  - `provisioning_failed`
- **Rules**:
  - Response ordering should remain deterministic by iterating the current enum value order.
  - Each current status must appear exactly once in `tenant_status_counts`, even when its count is `0`.

## Derived Response Models

### TenantStatusCountEntry

- **Fields**:
  - `status`
  - `count`
- **Rules**:
  - `status` must be a current `TenantStatus` value.
  - `count` must be a non-negative integer.

### TenantSummaryWidget

- **Fields**:
  - `total_tenant_count`
  - `tenant_status_counts`
- **Rules**:
  - `total_tenant_count` is the total number of tenants across all statuses.
  - `tenant_status_counts` must include one `TenantStatusCountEntry` for every current status.

### DashboardOverviewWidgets

- **Fields**:
  - `tenant_summary`
- **Rules**:
  - The object acts as an extension point for future widgets.
  - Additional widgets may be added later as sibling keys without changing `tenant_summary`.

### DashboardOverviewResponse

- **Fields**:
  - `widgets`
- **Rules**:
  - Successful responses return a `widgets` object and no activity-feed or recent-change data in this story.
  - Rejected responses reuse the repository’s existing auth error contracts rather than introducing a new error shape.
