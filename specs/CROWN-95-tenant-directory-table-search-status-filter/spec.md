# Feature Specification: Tenant Directory Table With Search And Status Filter

**Feature Branch**: `feat/CROWN-95-tenant-directory-table-search-status-filter`  
**Created**: 2026-03-14  
**Status**: Draft  
**Input**: Jira issue `CROWN-95` - "UI | Tenant directory table with search and status filter"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Open The Tenant Directory On A Dedicated Route (Priority: P1)

As a super admin, I want the `Tenants` navigation item to open a dedicated tenant-directory route so that tenant management no longer lives behind a placeholder section in the control plane.

**Why this priority**: The directory cannot exist as a usable operator surface until the shell routes to a dedicated tenant-management page instead of the current placeholder state.

**Independent Test**: Sign in as a super admin, activate `Tenants` from the control-plane navigation, and verify the browser lands on a dedicated tenant-directory route that renders a table view backed by persisted tenant data.

**Acceptance Scenarios**:

1. **Given** a super admin is using the control plane, **When** they activate `Tenants` in the left navigation, **Then** the app routes to the dedicated tenant-directory view instead of rendering the existing coming-soon placeholder.
2. **Given** the tenant-directory view renders successfully, **When** the table is shown, **Then** the first column displays the tenant name.
3. **Given** persisted tenant records are available from the platform API, **When** the directory loads, **Then** the table renders those tenants using the agreed directory response contract.
4. **Given** no tenants match the current query, **When** the directory renders, **Then** the page shows a stable empty state instead of a blank or broken table area.

---

### User Story 2 - Narrow The Directory By Name And Status (Priority: P2)

As a super admin, I want search and status filters in the tenant directory so that I can narrow the visible tenant list before choosing a tenant action.

**Why this priority**: Search and status filtering are explicit Jira acceptance criteria and are central to making the directory usable as more tenants accumulate.

**Independent Test**: Load the tenant directory, enter a tenant-name search term, switch the status filter between persisted `TenantStatusEnum` values, and verify the visible rows update to match the chosen filters.

**Acceptance Scenarios**:

1. **Given** multiple tenants exist with different names, **When** the super admin applies a name search, **Then** the directory shows only tenants matching that search behavior.
2. **Given** tenants exist in different lifecycle states, **When** the super admin opens the status filter, **Then** the available options come directly from the persisted `TenantStatusEnum` values used by the shared API/web contract.
3. **Given** the super admin selects a specific tenant status, **When** the filter is applied, **Then** the directory shows only tenants with that exact persisted status value rather than collapsing distinct statuses into an `other` bucket.
4. **Given** both name and status filters are set, **When** the directory refreshes, **Then** the resulting table reflects both filters together.

---

### User Story 3 - Use Tenant Actions As Navigation Entry Points (Priority: P3)

As a super admin, I want tenant names and tenant actions to lead into dedicated follow-up routes so that I can move from the directory into future detail, creation, or edit flows without this story having to implement those workflows.

**Why this priority**: The Jira scope requires clear action entry points, but your clarification keeps the actual detail, add, and edit implementations in separate follow-up stories.

**Independent Test**: Open the tenant directory, activate a tenant name, the top-right `Add new` action, and a row-level edit action, and verify each action routes to its dedicated destination without requiring the underlying business workflow to be implemented in this story.

**Acceptance Scenarios**:

1. **Given** a tenant row is visible in the directory, **When** the super admin activates the tenant name, **Then** the app routes to a dedicated tenant-details destination for that tenant.
2. **Given** the tenant directory header is visible, **When** the super admin activates `Add new`, **Then** the app routes to a dedicated tenant-creation destination.
3. **Given** a tenant row is visible in the directory, **When** the super admin activates the row-level edit action, **Then** the app routes to a dedicated tenant-edit destination for that tenant.
4. **Given** the destination workflows are follow-up scope, **When** the routed pages render, **Then** each destination still presents a stable in-app entry-point state rather than a broken route.

### Edge Cases

- The directory route is opened directly in the browser and still needs to render inside the existing protected platform shell.
- A user without the `super_admin` role attempts to reach the directory or one of its follow-up routes.
- The API returns zero tenants for the current filter combination.
- Persisted tenant statuses include values beyond `active` and `inactive`, and each value still needs an explicit filter option.
- A tenant row includes a status whose display label needs formatting for readability while preserving the exact enum value underneath.
- Follow-up detail, add, and edit destinations remain placeholder-level entry points in this story and must not suggest the workflows are complete.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The control-plane `Tenants` navigation item MUST route to a dedicated tenant-directory page rather than the existing placeholder section.
- **FR-002**: The tenant-directory page MUST render inside the existing protected super-admin platform shell.
- **FR-003**: The tenant-directory page MUST load tenant collection data from the shared platform tenant-directory API contract delivered for this control-plane surface.
- **FR-004**: The first table column MUST display the tenant name.
- **FR-005**: Tenant-name values in the table MUST be interactive and MUST route to a dedicated tenant-details destination for the selected tenant.
- **FR-006**: The directory page MUST provide tenant-name search.
- **FR-007**: The directory page MUST provide a single-select status filter whose option values come directly from `TenantStatusEnum`.
- **FR-008**: The directory page MUST treat persisted tenant statuses as distinct filter options and MUST NOT collapse non-`active`/`inactive` values into a generic `other` option.
- **FR-009**: The directory page MUST provide an `Add new` action in the top-right area as a navigation entry point to a dedicated tenant-creation destination.
- **FR-010**: Each tenant row MUST provide an edit action as a navigation entry point to a dedicated tenant-edit destination.
- **FR-011**: The dedicated tenant-details, tenant-creation, and tenant-edit destinations delivered by this story MUST remain limited to stable navigable entry points and MUST NOT widen into the full follow-up workflows.
- **FR-012**: The directory experience MUST provide stable loading, empty, and failure states instead of exposing blank or broken content while data is resolving.
- **FR-013**: Access to the tenant-directory page and its follow-up entry-point routes MUST remain limited to super-admin users.
- **FR-014**: The implementation MUST preserve the existing control-plane shell patterns while introducing dedicated tenant-management routes.

### Key Entities _(include if feature involves data)_

- **Tenant Directory View**: The dedicated control-plane page that presents persisted tenant records in a filterable table for super-admin operators.
- **Tenant Directory Filter State**: The UI state for the name search value and single selected `TenantStatusEnum` value used to narrow the directory.
- **Tenant Action Entry Point**: A routeable UI action from the directory that leads to tenant details, tenant creation, or tenant editing without implementing the full workflow in this story.

### Assumptions

- `CROWN-126` provides the shared tenant-directory API contract and persisted `TenantStatusEnum` values this web story consumes.
- The dedicated tenant routes can live under the existing `/platform` area as part of the protected super-admin shell.
- Detail, add, and edit pages delivered in this story may use stable placeholder-style entry-point content until their follow-up implementation stories are complete.
- Existing platform auth and RBAC behavior already protects super-admin-only routes and can be extended to the new tenant-management route hierarchy.

### Dependencies

- `CROWN-92` for the current control-plane navigation shell and active super-admin layout patterns.
- `CROWN-126` for the tenant-directory API contract consumed by the web UI.
- Existing shared contract definitions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/packages/types/src/index.ts`.
- Existing protected platform web shell in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In browser validation, 100% of tested `Tenants` navigation activations route to the dedicated tenant-directory page instead of the placeholder section.
- **SC-002**: In browser validation, 100% of tested tenant-directory loads show the tenant name as the first table column and render persisted tenant records when data exists.
- **SC-003**: In browser validation, 100% of tested name-search and status-filter interactions narrow the directory using explicit `TenantStatusEnum` values.
- **SC-004**: In browser validation, 100% of tested tenant-name, `Add new`, and row-edit interactions route to dedicated follow-up destinations without broken navigation.
- **SC-005**: Reviewers can confirm the story remains limited to the tenant-directory UI, route entry points, and control-plane integration rather than widening into the full tenant detail, create, or edit workflows.
