# Feature Specification: API Super Admin Dashboard Key Metric Cards Contract

**Feature Branch**: `feat/CROWN-119-super-admin-dashboard-metric-cards-contract`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: Jira issue `CROWN-119` - "API | Super admin dashboard key metric cards contract"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Retrieve The Dashboard Metric Card Totals And New-Tenant Windows (Priority: P1)

As a super-admin dashboard client, I want one protected overview payload that includes total tenant count, total tenant-user count, and new-tenant counts for week, month, and year windows so that the dashboard can render the first key metric cards from one API response.

**Why this priority**: This is the minimum contract extension needed for `CROWN-98`. Without these totals and time-window counts, the metric-card story still lacks the primary data it was created to show.

**Independent Test**: Call `GET /api/v1/platform/dashboard/overview` as a `super_admin` and verify the response includes `widgets.tenant_summary.total_tenant_count`, `widgets.tenant_summary.tenant_user_count`, and deterministic `new_tenant_counts` entries for `week`, `month`, and `year`.

**Acceptance Scenarios**:

1. **Given** a `super_admin` calls `GET /api/v1/platform/dashboard/overview`, **When** the request succeeds, **Then** the response includes the total tenant count.
2. **Given** a `super_admin` calls `GET /api/v1/platform/dashboard/overview`, **When** the request succeeds, **Then** the response includes the total tenant-user count across tenants.
3. **Given** tenants were created inside the current trailing week, month, or year windows, **When** the overview payload is returned, **Then** the response includes matching `new_tenant_counts` values for each required window.
4. **Given** no tenants were created in one or more current windows, **When** the overview payload is returned, **Then** the response still includes explicit zero-value entries for those windows instead of omitting them.

---

### User Story 2 - Retrieve Growth-Rate Windows With Documented Metric Definitions (Priority: P2)

As a super-admin dashboard client, I want the overview contract to include tenant growth-rate metrics for the same week, month, and year windows with explicit calculation rules so that the dashboard can render trend cards without ambiguous math.

**Why this priority**: The trend cards are the second half of the Jira scope. Returning numbers without a clear definition would create contract drift between API, docs, and UI.

**Independent Test**: Call `GET /api/v1/platform/dashboard/overview` with seeded tenants spanning current and prior comparison windows, then verify the response contains deterministic `tenant_growth_rates` entries for `week`, `month`, and `year` that match the documented calculation.

**Acceptance Scenarios**:

1. **Given** tenants exist in both a current trailing window and the immediately preceding comparison window of the same length, **When** the overview payload is returned, **Then** the growth-rate entry for that window reflects percentage change from the previous window to the current one.
2. **Given** a current window has tenant growth but the immediately preceding comparison window had zero new tenants, **When** the overview payload is returned, **Then** the growth-rate entry uses the documented non-divide-by-zero rule.
3. **Given** both the current and preceding comparison windows have zero new tenants, **When** the overview payload is returned, **Then** the growth-rate entry returns `0`.
4. **Given** reviewers inspect the repo artifacts, **When** they read the feature contract and OpenAPI docs, **Then** the definitions for the trailing windows and growth-rate calculation are documented clearly enough to avoid ambiguity.

---

### User Story 3 - Preserve The Existing Protected Overview Boundary (Priority: P3)

As a platform API maintainer, I want the expanded overview contract to remain limited to super-admin access and documented route behavior so that `CROWN-119` does not widen into unrelated dashboard endpoints or auth changes.

**Why this priority**: The story is contract extension work, not a broader route redesign. Guardrails on auth and scope keep the change safe to merge.

**Independent Test**: Verify missing authentication still returns `401`, tenant-scoped roles still return `403`, and the manual OpenAPI source matches the implemented route and schemas after the contract extension.

**Acceptance Scenarios**:

1. **Given** a request is made without a bearer token, **When** `GET /api/v1/platform/dashboard/overview` is called, **Then** the route still returns the existing unauthenticated error contract.
2. **Given** a `tenant_admin` or `tenant_user` calls the route, **When** authorization runs, **Then** the route still returns the existing forbidden-role contract.
3. **Given** the route contract gains the new metric-card fields, **When** the manual OpenAPI source is reviewed, **Then** the documented schemas and route examples stay aligned with the implemented response.
4. **Given** the story is delivered, **When** the overview route is reviewed against scope, **Then** it remains limited to super-admin dashboard summary metrics and does not add unrelated activity feeds or mutation operations.

### Edge Cases

- A window can have zero new tenants and still must be present in the response.
- Growth-rate math must avoid division-by-zero when the previous comparison window has zero tenants.
- The route must behave deterministically when tenants exist in only some windows and not others.
- The same tenant must only count once in the window that contains its `createdAt` timestamp.
- The route contract should stay forward-compatible for future widgets without breaking the existing `widgets.tenant_summary` envelope.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: `GET /api/v1/platform/dashboard/overview` MUST continue to return a top-level `widgets.tenant_summary` object for super-admin dashboard data.
- **FR-002**: The `tenant_summary` contract MUST include `total_tenant_count`.
- **FR-003**: The `tenant_summary` contract MUST include `tenant_user_count` representing the current total number of `tenant_user` identities.
- **FR-004**: The `tenant_summary` contract MUST include `new_tenant_counts` entries for exactly three windows: `week`, `month`, and `year`.
- **FR-005**: Each `new_tenant_counts` value MUST represent the count of tenants whose `createdAt` falls within the current trailing window ending at request time.
- **FR-006**: The current trailing windows MUST be defined as the last 7 days for `week`, 30 days for `month`, and 365 days for `year`.
- **FR-007**: The `tenant_summary` contract MUST include `tenant_growth_rates` entries for exactly the same `week`, `month`, and `year` windows.
- **FR-008**: Each `tenant_growth_rates` value MUST compare the current trailing window against the immediately preceding trailing window of equal length using `((current - previous) / previous) * 100`.
- **FR-009**: When the previous comparison window count is `0` and the current window count is greater than `0`, the growth-rate value MUST return `100`.
- **FR-010**: When both the previous comparison window count and the current window count are `0`, the growth-rate value MUST return `0`.
- **FR-011**: Growth-rate values MUST be rounded to two decimal places before being returned.
- **FR-012**: The response MUST continue to include deterministic zero-value entries instead of omitting required time windows.
- **FR-013**: Access to the route MUST remain limited to authenticated `super_admin` users.
- **FR-014**: The manual OpenAPI source in `apps/api/src/docs/openapi.ts` MUST be updated to match the expanded route contract.
- **FR-015**: The implementation MUST remain limited to the existing dashboard overview route, contract, service aggregation logic, and directly aligned consumer typings/tests.

### Key Entities _(include if feature involves data)_

- **Dashboard Metric Window**: A named trailing time window for the overview metric cards with one of three allowed values: `week`, `month`, or `year`.
- **New Tenant Count Metric**: A windowed count of tenants created during the current trailing window.
- **Tenant Growth Rate Metric**: A windowed percentage change comparing the current trailing new-tenant count to the immediately preceding trailing window of the same length.
- **Tenant Summary Widget Contract**: The `widgets.tenant_summary` response object that groups total counts, status counts, new-tenant counts, and growth-rate metrics for the super-admin dashboard.

### Assumptions

- The control-plane `Tenant.createdAt` timestamp is the canonical source for when a tenant first became part of the platform.
- Trailing windows should be computed relative to request time rather than calendar-aligned week/month/year boundaries because Jira asks for dashboard card metrics, not accounting-period reporting.
- Returning `100` when the previous comparison window is zero and the current window is positive is an acceptable sentinel for “new growth from zero” and is clearer for the UI than `null` or an omitted value.
- `tenant_user_count` should keep its existing meaning and remain part of the same summary contract even though the new cards primarily extend the windowed metrics.

### Dependencies

- `CROWN-116` for the existing `GET /api/v1/platform/dashboard/overview` contract and route baseline.
- `CROWN-98` as the dashboard UI consumer that depends on the expanded contract.
- Existing `Tenant.createdAt` persistence in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Focused route and integration validation show `GET /api/v1/platform/dashboard/overview` returns the new windowed metric fields for 100% of tested `super_admin` requests.
- **SC-002**: Focused integration validation shows week, month, and year `new_tenant_counts` values match seeded tenant creation timestamps in 100% of tested scenarios.
- **SC-003**: Focused integration validation shows week, month, and year `tenant_growth_rates` values match the documented calculation and zero-handling rules in 100% of tested scenarios.
- **SC-004**: Access-control validation continues to return the existing `401` and `403` contracts for unauthorized callers in 100% of tested scenarios.
- **SC-005**: Reviewers can read the feature contract and OpenAPI docs and find one unambiguous definition for trailing windows and growth-rate calculations.
