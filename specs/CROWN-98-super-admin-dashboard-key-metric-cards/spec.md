# Feature Specification: UI Super Admin Dashboard Key Metric Cards

**Feature Branch**: `feat/CROWN-98-super-admin-dashboard-key-metric-cards`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: Jira issue `CROWN-98` - "UI | Super admin dashboard key metric cards"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review Core Platform Counts At A Glance (Priority: P1)

As a super admin, I want the dashboard to show total tenants and total users across tenants as prominent metric cards so that I can understand the current platform footprint immediately after signing in.

**Why this priority**: These headline totals are the fastest path to satisfying the core Jira outcome. Without them, the dashboard still fails to provide the requested at-a-glance platform scale.

**Independent Test**: Sign in as a `super_admin`, open `/platform`, and verify the dashboard renders visible metric cards for total tenants and total users from the protected overview response.

**Acceptance Scenarios**:

1. **Given** a signed-in `super_admin` lands on `/platform`, **When** the dashboard overview loads successfully, **Then** the page shows a metric card for total tenants.
2. **Given** a signed-in `super_admin` lands on `/platform`, **When** the dashboard overview loads successfully, **Then** the page shows a metric card for total users across tenants.
3. **Given** the overview response returns `0` for one or both totals, **When** the metric cards render, **Then** the cards still display deterministic zero values instead of placeholder text or omissions.

---

### User Story 2 - Review Tenant Growth Windows And Rates (Priority: P2)

As a super admin, I want the dashboard to show new-tenant and tenant-growth-rate metrics for week, month, and year windows so that I can understand recent momentum without leaving the control-plane home.

**Why this priority**: Jira explicitly includes both new-tenant counts and growth-rate windows. These cards complete the trend half of the story after the core totals are visible.

**Independent Test**: Load `/platform` with overview data that includes `new_tenant_counts` and `tenant_growth_rates`, then verify the dashboard renders the week, month, and year values with labels that match the documented metric definitions.

**Acceptance Scenarios**:

1. **Given** the overview response includes `new_tenant_counts` entries for `week`, `month`, and `year`, **When** the dashboard renders the metric-card area, **Then** each required time window appears with its count.
2. **Given** the overview response includes `tenant_growth_rates` entries for `week`, `month`, and `year`, **When** the dashboard renders the metric-card area, **Then** each required time window appears with its percentage value.
3. **Given** one or more time windows have zero counts or zero growth, **When** the cards render, **Then** the dashboard still shows those windows explicitly instead of omitting them.
4. **Given** reviewers inspect the dashboard labels and repo artifacts, **When** they compare them to the documented contract, **Then** the window semantics and growth-rate meanings are not ambiguous.

---

### User Story 3 - Preserve Dashboard Clarity And Protected Access (Priority: P3)

As a platform maintainer, I want the new metric cards to fit the existing protected super-admin dashboard cleanly so that the story improves the home screen without widening into unrelated widgets or auth changes.

**Why this priority**: The story is a focused dashboard enhancement, not a shell redesign. The implementation should preserve the current auth boundary, loading/error behavior, and room for future widgets.

**Independent Test**: Review the dashboard on desktop and mobile widths, verify the metric-card area remains readable, and confirm tenant-scoped users still cannot access `/platform` through the existing protected-shell behavior.

**Acceptance Scenarios**:

1. **Given** the overview request is loading, **When** the dashboard first renders, **Then** the metric-card area shows an intentional loading state within the existing platform shell.
2. **Given** the overview request fails, **When** the dashboard renders the failure state, **Then** the page explains that the overview is unavailable without breaking the surrounding shell.
3. **Given** the dashboard is viewed on desktop and mobile widths, **When** the metric cards reflow, **Then** the content remains readable and visually grouped as one overview section.
4. **Given** a non-`super_admin` user navigates to `/platform`, **When** the existing protected-shell logic runs, **Then** access remains restricted exactly as before this story.

### Edge Cases

- The overview response can contain zero values for totals, new-tenant windows, or growth-rate windows and the dashboard must still render explicit values.
- The overview response can return a complete status breakdown plus metric windows, but this story must keep the primary emphasis on the requested metric cards.
- The API can return growth rates with decimal precision and the UI must present them consistently without redefining the underlying math.
- The overview request can fail after the protected shell has already resolved and the page must remain usable.
- The metric-card area must remain understandable without adding separate activity-feed, billing, or system-health widgets.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The super-admin dashboard in `apps/web/app/platform/page.tsx` MUST render a metric-card section sourced from `GET /api/v1/platform/dashboard/overview`.
- **FR-002**: The metric-card section MUST include a visible card for `total_tenant_count`.
- **FR-003**: The metric-card section MUST include a visible card for `tenant_user_count`.
- **FR-004**: The metric-card section MUST include visible week, month, and year values derived from `new_tenant_counts`.
- **FR-005**: The metric-card section MUST include visible week, month, and year values derived from `tenant_growth_rates`.
- **FR-006**: The UI copy for the windowed metrics MUST remain consistent with the trailing-window and growth-rate definitions documented by `CROWN-119`.
- **FR-007**: The dashboard MUST continue to render an intentional loading state while the overview request is in flight.
- **FR-008**: The dashboard MUST continue to render a non-empty error state when the overview request fails without breaking the protected platform shell.
- **FR-009**: The metric-card layout MUST remain readable on desktop and mobile widths supported by the current platform shell.
- **FR-010**: The story MUST preserve the existing super-admin-only access boundary enforced by the current protected-shell flow.
- **FR-011**: The implementation MUST remain limited to the existing platform dashboard page, directly supporting UI helpers, aligned tests, and the `CROWN-98` feature artifacts.

### Key Entities *(include if feature involves data)*

- **Dashboard Metric Card**: A single visual summary card showing one current platform metric or one family of related windowed metrics.
- **Metric Card Group**: The dashboard overview area that presents the first-generation super-admin metric cards together.
- **Overview Request State**: The loading, success, or error state for retrieving dashboard overview data in the web client.

### Assumptions

- `CROWN-119` provides the required overview contract additions under `widgets.tenant_summary`.
- The existing protected `/platform` route and `useProtectedShell` behavior remain the only access-control mechanism needed for this story.
- The current tenant-status breakdown can remain on the page as supporting context, but the new metric cards should become the primary emphasis of the dashboard overview.
- The dashboard labels should describe the metrics clearly without exposing raw implementation jargon such as `new_tenant_counts` or `tenant_growth_rates`.

### Dependencies

- `CROWN-92` for the existing control-plane shell and dashboard section structure.
- `CROWN-93` for the baseline dashboard overview widget pattern already present in the web client.
- `CROWN-119` for the API contract that supplies total users, new-tenant windows, and growth-rate windows.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In UI validation, 100% of tested successful super-admin dashboard loads show visible cards for total tenants and total users.
- **SC-002**: In UI validation, 100% of tested successful super-admin dashboard loads show visible week, month, and year values for both new-tenant counts and tenant growth rates.
- **SC-003**: In review and UI validation, the delivered dashboard labels match the documented metric meanings closely enough that reviewers identify no ambiguous card definitions.
- **SC-004**: In UI validation, loading and failure states remain usable without breaking the surrounding protected shell.
- **SC-005**: In desktop and mobile validation, the metric-card section remains readable and clearly grouped as one dashboard overview area.
