# Data Model: Tenant App UI Shell

## Overview

`CROWN-8` is a UI-shell feature, so its data model is centered on workspace view-state and interaction concepts rather than new persistence entities. It depends on existing tenant identity, tenant-domain concepts, and role boundaries already defined elsewhere in the system.

## Entity: TenantSession

- **Description**: The authenticated tenant-scoped user context used to determine whether the tenant workspace shell should render.
- **Fields**:
  - `userId`: stable tenant-user identifier
  - `role`: tenant-scoped role such as `tenant_admin` or `tenant_user`
  - `tenantId`: the active tenant context for the workspace
  - `displayName`: user-facing identity label when available
- **Validation rules**:
  - role must be tenant-scoped, not `super_admin`
  - `tenantId` must be present for tenant workspace access
- **Relationships**:
  - activates one `TenantShellState`

## Entity: TenantShellState

- **Description**: The top-level view state of the tenant workspace shell.
- **Fields**:
  - `workspaceTitle`: tenant-facing workspace title
  - `workspaceSubtitle`: supporting orientation text
  - `navigationItems`: collection of tenant workspace destinations
  - `overviewCards`: collection of tenant summary panels
  - `brandContext`: powered-by-Crown presentation details
  - `accessState`: one of `allowed`, `redirected`, `denied`
- **Validation rules**:
  - allowed states must include tenant-oriented navigation
  - branding must identify the workspace as powered by Crown rather than as a platform-control surface
  - shell copy must use management-system language
- **Relationships**:
  - belongs to one `TenantSession`
  - contains many `TenantWorkspaceNavigationItem`
  - contains many `TenantOverviewCard`

## Entity: TenantWorkspaceNavigationItem

- **Description**: A primary tenant-facing destination within the workspace shell.
- **Fields**:
  - `label`: workspace destination name
  - `purpose`: short explanation of the destination
  - `destinationKey`: stable identifier for navigation behavior
  - `availabilityState`: one of `available`, `coming_soon`, `disabled`
- **Validation rules**:
  - labels must be tenant-oriented and not platform-admin framed
  - destinations must remain meaningful even with placeholder workspace data
- **Relationships**:
  - rendered inside one `TenantShellState`

## Entity: TenantOverviewCard

- **Description**: A summary card shown on the tenant workspace landing state.
- **Fields**:
  - `title`: workspace summary heading
  - `valueState`: current summary value or placeholder
  - `supportingText`: explanatory detail for the user
  - `dataState`: one of `ready`, `empty`, `unavailable`
- **Validation rules**:
  - overview copy must reinforce management-system workspace framing
  - empty and unavailable states must remain informative to tenant users
- **Relationships**:
  - rendered inside one `TenantShellState`

## Entity: PoweredByCrownBrandContext

- **Description**: The tenant-facing brand treatment that connects the workspace to Crown without turning it into the platform control plane.
- **Fields**:
  - `label`: the visible powered-by-Crown phrasing
  - `tone`: tenant-facing brand tone
  - `placement`: where the brand context appears in the shell
- **Validation rules**:
  - must present the tenant workspace as powered by Crown
  - must not present the tenant workspace as the platform operator surface
- **Relationships**:
  - displayed within one `TenantShellState`

## State Transitions

- `TenantSession`: `unauthenticated` -> `authenticated_super_admin` or `authenticated_tenant_user`
- `TenantShellState.accessState`: `denied` -> `allowed` or `redirected`
- `TenantOverviewCard.dataState`: `unavailable` -> `empty` -> `ready`

## Notes

- No new persistent database tables are required by this feature plan.
- This feature can begin with static or placeholder tenant overview content as long as role separation, branding, and workspace shell structure are correct.
