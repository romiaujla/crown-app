# Feature Specification: Super-Admin Dashboard Overview Widgets

**Feature Branch**: `feat/CROWN-93-ui-super-admin-dashboard-overview-widgets`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: Jira issue `CROWN-93` - "UI | Super admin dashboard overview widgets"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review Platform Tenant Counts At A Glance (Priority: P1)

As a super admin, I want the dashboard to show the total number of tenants and current tenant-status counts so that I can understand the present platform footprint immediately after sign-in.

**Why this priority**: This is the core Jira outcome. Without live overview widgets on the dashboard, the control-plane home still behaves like a static placeholder instead of an operational starting point.

**Independent Test**: Sign in as a super admin, open `/platform`, and verify the dashboard renders a tenant overview widget populated from the platform overview API with the total tenant count and the current status breakdown.

**Acceptance Scenarios**:

1. **Given** a signed-in `super_admin` lands on `/platform`, **When** the dashboard overview loads successfully, **Then** the dashboard shows the total number of tenants.
2. **Given** the overview payload includes counts grouped by current tenant statuses, **When** the widget renders, **Then** each returned status is visible with its count.
3. **Given** one or more statuses currently have zero tenants, **When** the widget renders, **Then** those statuses still appear with explicit zero values instead of being omitted.

---

### User Story 2 - Understand Platform Status Distribution Without Noise (Priority: P2)

As a super admin, I want the first dashboard widget area focused on current tenant-state visibility so that I can assess platform readiness without unrelated activity or trend content competing for attention.

**Why this priority**: Jira explicitly limits this story to total tenants and tenant-status visibility. The widget layout needs to communicate those facts clearly without widening into recent activity, tenant changes, or unrelated dashboard cards.

**Independent Test**: Open the dashboard as a super admin and confirm the overview area shows tenant-summary information only, while recent activity and tenant-change feeds are absent.

**Acceptance Scenarios**:

1. **Given** the dashboard overview widgets render successfully, **When** the super admin reviews the content, **Then** the visible summary remains limited to total tenants and tenant-status visibility.
2. **Given** the dashboard home is reviewed against Jira scope, **When** the overview content is inspected, **Then** recent tenant changes and activity-feed widgets are not present.
3. **Given** the overview widget presents multiple status buckets, **When** the values are scanned, **Then** the layout remains readable without burying the total tenant count.

---

### User Story 3 - Preserve Room For Future Platform Widgets (Priority: P3)

As a future dashboard maintainer, I want the overview area structured to accommodate additional platform widgets later so that the dashboard can evolve without redesigning the initial summary section.

**Why this priority**: Jira requires the initial layout to leave room for future platform widgets. The first implementation should feel intentional now while preserving a stable area for later expansion.

**Independent Test**: Review the dashboard layout on desktop and mobile widths and confirm the tenant-summary widget area remains visually stable with adjacent or subsequent space available for future widgets.

**Acceptance Scenarios**:

1. **Given** the dashboard overview is rendered on desktop, **When** the initial widget area is displayed, **Then** the layout clearly supports adding future platform widgets without replacing the tenant-summary widget.
2. **Given** the dashboard overview is rendered on a narrower viewport, **When** the widget area reflows, **Then** the tenant-summary widget remains readable and the layout still supports additional cards later.
3. **Given** future dashboard stories add more widgets, **When** those widgets are introduced, **Then** the initial tenant-summary presentation can remain intact as one stable section of the overview area.

### Edge Cases

- The platform has zero tenants and the dashboard still needs to show a valid total plus zero-count status buckets.
- The API returns only a subset of statuses with non-zero values, but the dashboard still needs to surface explicit zero-count states returned by the contract.
- The overview request is still loading and the dashboard should show an intentional in-progress state instead of blank cards.
- The overview request fails and the dashboard should keep the shell usable while explaining that the overview data could not be loaded.
- Non-super-admin users remain blocked from the platform shell by the existing protected-route behavior and are out of scope for this story.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The super-admin dashboard MUST replace the current static dashboard overview placeholder cards with live overview widget content sourced from the platform dashboard overview API contract.
- **FR-002**: The dashboard MUST show the total tenant count from the overview response.
- **FR-003**: The dashboard MUST show tenant-status visibility using the statuses and counts returned by the current platform overview response.
- **FR-004**: The dashboard MUST render zero-count status entries when they are present in the overview response.
- **FR-005**: The dashboard overview area MUST remain limited to tenant-summary information for this story and MUST NOT introduce recent tenant changes or activity-feed widgets.
- **FR-006**: The tenant-summary presentation MUST remain readable on desktop and mobile widths supported by the current platform shell.
- **FR-007**: The dashboard MUST provide a non-empty loading state while the overview request is in flight.
- **FR-008**: The dashboard MUST provide a non-empty error state when the overview request cannot be completed, without breaking the surrounding platform shell.
- **FR-009**: The overview widget layout MUST preserve space for future platform widgets without requiring a redesign of the initial tenant-summary section.
- **FR-010**: Access to the dashboard overview widgets MUST remain limited to authenticated `super_admin` users through the existing protected-shell behavior.

### Key Entities *(include if feature involves data)*

- **Dashboard Overview Widget Area**: The platform dashboard region that hosts the first tenant-summary widget and reserves room for future platform widgets.
- **Tenant Summary Widget**: The visible UI summary of total tenant count and per-status tenant counts returned by the existing overview API.
- **Overview Request State**: The loading, success, or error state for retrieving dashboard overview data in the web client.

### Assumptions

- `CROWN-116` provides the API contract consumed by this story at `GET /api/v1/platform/dashboard/overview`.
- The current platform shell from `CROWN-92` remains the dashboard frame and navigation context this work extends.
- The initial overview widget only needs the tenant-summary data already supplied by the current API contract; tenant-user counts may remain unused until a follow-up widget requires them.
- Existing platform auth flows already route `super_admin` users into `/platform` and keep tenant-scoped roles out of this shell.

### Dependencies

- `CROWN-92` for the existing super-admin control-plane shell and dashboard section structure.
- `CROWN-116` for the platform dashboard overview API contract consumed by this UI.
- Existing authenticated web session handling in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In browser validation, 100% of tested successful dashboard loads show the total tenant count from the overview API.
- **SC-002**: In browser validation, 100% of statuses returned by the overview API are visibly represented in the tenant-summary widget, including zero-count statuses.
- **SC-003**: In review and browser validation, the delivered dashboard overview remains limited to tenant-summary information and excludes recent-activity or tenant-change widgets.
- **SC-004**: In browser validation, both desktop and mobile-sized checks confirm the tenant-summary widget remains readable and the overview area still supports future expansion.
- **SC-005**: In browser validation, failed overview requests show a usable error state while the protected platform shell remains intact.
