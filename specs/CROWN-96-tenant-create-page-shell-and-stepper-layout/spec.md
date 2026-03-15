# Feature Specification: Tenant Create Page Shell And Stepper Layout

**Feature Branch**: `feat/CROWN-96-tenant-create-page-shell-and-stepper-layout`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: Jira issue `CROWN-96` - "UI | Tenant create page shell and stepper layout"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open Tenant Creation In A Dedicated Guided Shell (Priority: P1)

As a super admin, I want `Add new` to open a dedicated tenant-create page with a visible stepper so that tenant onboarding feels like a guided workflow instead of a lightweight placeholder route.

**Why this priority**: This is the core Jira outcome. Without the dedicated page shell and visible workflow framing, tenant creation still behaves like a placeholder entry point rather than an onboarding surface.

**Independent Test**: Sign in as a super admin, activate `Add new` from the tenant directory, and verify the browser lands on `/platform/tenants/new` where the page renders a tenant-create shell with a visible progress indicator and no drawer-based presentation.

**Acceptance Scenarios**:

1. **Given** a super admin is viewing the tenant directory, **When** they activate `Add new`, **Then** the app routes to `/platform/tenants/new`.
2. **Given** the tenant-create route loads successfully, **When** the page renders, **Then** the content is presented as a dedicated page shell inside the protected platform experience rather than a drawer or modal.
3. **Given** the tenant-create shell is visible, **When** the page loads, **Then** the workflow stepper shows the current step and the overall sequence at a glance.

---

### User Story 2 - Move Through Placeholder Tenant-Create Steps (Priority: P2)

As a super admin, I want the tenant-create shell to include next, back, and cancel affordances across placeholder steps so that later onboarding stories can plug into a stable guided layout without reworking the navigation model.

**Why this priority**: Jira explicitly scopes this story to the shell, stepper layout, and future-step wiring rather than the underlying business logic. The navigation skeleton is the reusable foundation for those later slices.

**Independent Test**: Open `/platform/tenants/new`, move between the available placeholder steps using next and back, and verify the shell updates the active-step presentation while keeping the page stable and the unfinished step content clearly non-final.

**Acceptance Scenarios**:

1. **Given** the tenant-create shell is visible, **When** the super admin advances to the next placeholder step, **Then** the shell updates the active step in the progress indicator and displays the matching placeholder content area.
2. **Given** the super admin is on a later placeholder step, **When** they choose `Back`, **Then** the shell returns to the previous step without leaving the tenant-create page.
3. **Given** the page is reviewed against scope, **When** the placeholder step content is inspected, **Then** it is clear that tenant-info, role-selection, user-assignment, and review business logic are not yet implemented in this story.
4. **Given** the shell is on the first step, **When** the page renders, **Then** the `Back` affordance is disabled or omitted in a way that prevents navigating before the first step.

---

### User Story 3 - Exit Safely Without Losing Orientation (Priority: P3)

As a super admin, I want cancel and exit flows to warn me before discarding entered tenant-create data so that I can leave the guided workflow intentionally instead of accidentally losing progress.

**Why this priority**: The shell is incomplete without a safe exit pattern. Jira explicitly requires warning before leaving when entered step data would be lost.

**Independent Test**: Enter data into an in-progress placeholder step, attempt to cancel or navigate away, and verify the UI warns before exit while continuing to enforce the existing super-admin access boundary.

**Acceptance Scenarios**:

1. **Given** no step data has been entered, **When** the super admin chooses `Cancel`, **Then** the app can return to the tenant directory without a discard warning.
2. **Given** step data has been entered, **When** the super admin chooses `Cancel` or otherwise attempts to leave the page, **Then** the UI warns that unsaved tenant-create progress will be lost before exit completes.
3. **Given** a non-`super_admin` user attempts to reach `/platform/tenants/new`, **When** the existing protected-shell logic runs, **Then** access remains blocked or redirected exactly as it is for other platform-only routes.

### Edge Cases

- The tenant-create page is opened directly in the browser and still needs to render inside the existing protected platform shell for authorized users.
- The stepper must remain understandable on narrower tablet/mobile layouts without collapsing into an unreadable breadcrumb row.
- Placeholder step content must feel intentionally staged rather than implying the full tenant-create workflow already exists.
- A super admin can attempt to use browser back/forward navigation while unsaved step data is present and should still receive a discard warning where the browser allows it.
- The shell needs to support future insertion of real step forms without changing the route or abandoning the guided page layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Activating `Add new` from the tenant directory MUST route the super admin to `/platform/tenants/new`.
- **FR-002**: `/platform/tenants/new` MUST render as a dedicated tenant-create page shell inside the existing protected platform shell and MUST NOT use a drawer or modal presentation.
- **FR-003**: The tenant-create page shell MUST include a visible progress indicator that communicates the current step and the overall tenant-create sequence.
- **FR-004**: The shell MUST provide placeholder step wiring for the future tenant-create flow, including stable shell support for tenant-info, role-selection, user-assignment, and review-oriented steps without implementing those step-specific business workflows in this story.
- **FR-005**: The shell MUST provide `Next`, `Back`, and `Cancel` navigation affordances that update the active placeholder step or exit the flow as appropriate.
- **FR-006**: The shell MUST prevent backward navigation before the first step by disabling or omitting the `Back` control in that state.
- **FR-007**: The shell MUST keep the active-step presentation and page layout stable while moving between placeholder steps.
- **FR-008**: The shell MUST warn before exit when entered step data would be lost, including at minimum the in-app cancel flow and route-exit attempts that can be intercepted by the web application.
- **FR-009**: The page MUST allow exit without a discard warning when no step data has been entered.
- **FR-010**: Access to `/platform/tenants/new` MUST remain limited to authenticated `super_admin` users through the existing protected-shell behavior.
- **FR-011**: The implementation MUST remain limited to the tenant-create page shell, stepper layout, placeholder step states, and exit-warning behavior, and MUST NOT implement tenant-info, role-selection, user-assignment, or review business workflows in this story.

### Key Entities *(include if feature involves data)*

- **Tenant Create Shell**: The dedicated page-level frame inside the platform shell that hosts the tenant-create stepper, step content, and navigation affordances.
- **Tenant Create Step**: A discrete step in the guided onboarding sequence with a stable title, ordering, active-state treatment, and placeholder-ready content region.
- **Tenant Create Draft State**: The client-side in-progress state used to determine whether the tenant-create shell contains entered data that would be lost on exit.
- **Discard Warning State**: The confirmation behavior that protects against unintended loss of in-progress tenant-create input when leaving the shell.

### Assumptions

- `CROWN-95` already provides the dedicated `/platform/tenants/new` route entry point from the tenant directory.
- This story establishes the guided workflow frame only; the real form fields, validation rules, and submission behavior for each tenant-create step will be delivered in follow-up stories.
- The placeholder step sequence can reference the planned workflow stages now as long as the UI makes it clear that the detailed step behavior is still forthcoming.
- Existing platform auth and RBAC behavior already protects `/platform` routes and can continue to govern the tenant-create page without introducing new authorization logic.

### Dependencies

- `CROWN-95` for the tenant-directory `Add new` route entry point and protected platform route hierarchy.
- Existing protected platform shell patterns in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/apps/web/app/platform/`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In browser validation, 100% of tested `Add new` activations route to `/platform/tenants/new`.
- **SC-002**: In browser validation, 100% of tested tenant-create page loads show a dedicated page shell with a visible stepper and no drawer-style presentation.
- **SC-003**: In browser validation, 100% of tested next/back interactions update the active placeholder step without breaking the surrounding page shell.
- **SC-004**: In browser validation, discard warnings appear for 100% of tested exit attempts made after entering tenant-create step data, while clean exit remains available when no data has been entered.
- **SC-005**: In review, the delivered changes are limited to the shell, stepper, placeholder step wiring, and exit-protection behavior rather than widening into tenant-create business logic.
