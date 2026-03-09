# Data Model: Super-Admin Control Plane UI Shell

## Overview

`CROWN-7` is primarily a UI-shell feature, so its data model focuses on view-state and interaction concepts rather than new persistence entities. It depends on existing authenticated identity and platform concepts already defined elsewhere in the system.

## Entity: SuperAdminSession

- **Description**: The authenticated platform-operator context used to determine whether the control-plane shell should render.
- **Fields**:
  - `userId`: stable operator identifier
  - `role`: must be `super_admin`
  - `displayName`: operator-facing identity label when available
  - `tenantId`: nullable and expected to be absent for global platform operation
- **Validation rules**:
  - `role` must equal `super_admin` to enter the shell
  - tenant-scoped roles are invalid for this shell
- **Relationships**:
  - activates one `PlatformShellState`

## Entity: PlatformShellState

- **Description**: The top-level view state of the control-plane shell.
- **Fields**:
  - `shellTitle`: platform-facing title for the current shell
  - `shellSubtitle`: supporting orientation text
  - `navigationItems`: collection of primary platform destinations
  - `overviewCards`: collection of current platform summary panels
  - `emptyStateMessage`: fallback guidance when no platform data is available
  - `accessState`: one of `allowed`, `redirected`, `denied`
- **Validation rules**:
  - navigation items must always be present for allowed access
  - empty-state guidance must exist when overview content is unavailable
  - shell copy must use management-system platform language
- **Relationships**:
  - belongs to one `SuperAdminSession`
  - contains many `PlatformNavigationItem`
  - contains many `PlatformOverviewCard`

## Entity: PlatformNavigationItem

- **Description**: A top-level destination in the super-admin control plane.
- **Fields**:
  - `label`: user-facing name of the destination
  - `purpose`: short explanation of what the section controls
  - `destinationKey`: stable internal identifier for the destination
  - `availabilityState`: one of `available`, `coming_soon`, `disabled`
- **Validation rules**:
  - labels must be platform-oriented, not tenant-user or CRM framed
  - destinations must remain meaningful even when no tenant is currently selected
- **Relationships**:
  - rendered inside one `PlatformShellState`

## Entity: PlatformOverviewCard

- **Description**: A summary card or status block shown on the platform shell landing state.
- **Fields**:
  - `title`: summary heading
  - `valueState`: current summary value or placeholder
  - `supportingText`: short explanatory copy
  - `dataState`: one of `ready`, `empty`, `unavailable`
- **Validation rules**:
  - titles and supporting text must reinforce the management-system platform framing
  - `empty` and `unavailable` states must remain informative
- **Relationships**:
  - rendered inside one `PlatformShellState`

## Entity: TenantManagementEntryPoint

- **Description**: A platform-level route or action that leads into tenant management work.
- **Fields**:
  - `label`: user-facing destination name
  - `summary`: description of the action or destination
  - `entryState`: one of `direct`, `selection_required`, `empty`
- **Validation rules**:
  - entry points must be reachable from the control-plane shell
  - entry points must not require the operator to start from a tenant-user experience
- **Relationships**:
  - referenced by one or more `PlatformNavigationItem`

## State Transitions

- `SuperAdminSession`: `unauthenticated` -> `authenticated_non_super_admin` -> `authenticated_super_admin`
- `PlatformShellState.accessState`: `denied` -> `allowed` or `redirected`
- `PlatformOverviewCard.dataState`: `unavailable` -> `empty` -> `ready`

## Notes

- No new persistent database tables are required by this feature plan.
- This feature depends on existing auth/RBAC and future platform data sources but can begin with static or placeholder overview content as long as access boundaries and shell structure are correct.
