# Feature Specification: Super-Admin Control-Plane Navigation Shell

**Feature Branch**: `feat/CROWN-92-super-admin-control-plane-navigation-shell`  
**Created**: 2026-03-12  
**Status**: Draft  
**Input**: Jira issue `CROWN-92` - "UI | Super admin control-plane navigation shell"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Navigate Core Super-Admin Areas (Priority: P1)

As a super admin, I want a persistent left navigation shell so that I can move across the major control-plane areas from one consistent frame.

**Why this priority**: The control plane is not usable as a shell until the main navigation model is visible and stable.

**Independent Test**: Open the control plane as a super admin and confirm the left navigation lists all in-scope areas, highlights the active destination, and switches the right-side content when another item is selected.

**Acceptance Scenarios**:

1. **Given** a super admin is in the control plane, **When** the shell loads, **Then** the left navigation shows `Dashboard`, `Tenants`, `Users`, `Activity`, `Settings`, `System Health`, `Security`, `Billing`, and `Audit Log`.
2. **Given** a super admin selects a navigation item, **When** the destination changes, **Then** the content area on the right updates to the selected section.
3. **Given** a super admin is viewing one section, **When** the shell renders the navigation, **Then** the active menu item is visually identifiable.

---

### User Story 2 - Understand Unbuilt Areas Without Leaving The Shell (Priority: P2)

As a super admin, I want unfinished control-plane areas to show consistent placeholder states so that I can understand the planned information architecture without encountering broken routes or blank pages.

**Why this priority**: The Jira scope explicitly calls for the shell to establish the full navigation model before every destination is implemented.

**Independent Test**: Select each in-scope destination that does not yet have feature-specific content and confirm the right-side content shows `<Menu title> Coming Soon`.

**Acceptance Scenarios**:

1. **Given** a super admin opens a not-yet-implemented section, **When** the section content renders, **Then** the main content area shows `<Menu title> Coming Soon`.
2. **Given** multiple sections are still placeholders, **When** the super admin switches between them, **Then** the shell frame remains stable and only the section title/content changes.

---

### User Story 3 - Use The Shell On Desktop And iPad Layouts (Priority: P3)

As a super admin, I want the navigation shell to adapt across desktop and iPad-sized layouts so that the control plane remains understandable without giving up orientation.

**Why this priority**: The feature is specifically responsible for the responsive shell behavior, not just the desktop information architecture.

**Independent Test**: Verify the shell on desktop and iPad-sized viewports, confirming labels stay visible on desktop, the navigation collapses to icons on iPad-sized layouts and below, and collapsed items expose tooltips.

**Acceptance Scenarios**:

1. **Given** the shell is viewed on desktop, **When** the navigation renders, **Then** each menu item shows both an icon and text label.
2. **Given** the shell is viewed on an iPad-sized layout or smaller, **When** the navigation renders, **Then** the left navigation collapses to icons only.
3. **Given** the shell is collapsed to icons only, **When** a super admin focuses or hovers a menu item, **Then** a tooltip reveals the item meaning.

### Edge Cases

- A super admin lands directly on a non-default control-plane section and the correct menu item still needs to render as active.
- Several destinations remain placeholders for now, but the shell should still feel intentional rather than broken.
- The collapsed navigation must remain understandable for keyboard and pointer users.
- Access control must continue to prevent tenant-scoped users from entering the super-admin shell.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The control plane MUST provide a persistent left-side navigation shell for super-admin routes.
- **FR-002**: The navigation MUST include `Dashboard`, `Tenants`, `Users`, `Activity`, `Settings`, `System Health`, `Security`, `Billing`, and `Audit Log`.
- **FR-003**: Selecting any in-scope navigation item MUST update the right-side content area to that section.
- **FR-004**: Any section that is not yet implemented MUST render `<Menu title> Coming Soon` in the main content area.
- **FR-005**: On desktop layouts, the navigation MUST show both icons and text labels.
- **FR-006**: On iPad-sized layouts and below, the navigation MUST collapse to icons only.
- **FR-007**: When the navigation is collapsed, each icon-only item MUST expose a tooltip that communicates the destination name.
- **FR-008**: The shell MUST visually identify the active route or selected menu item.
- **FR-009**: The shell MUST support adding future super-admin sections without structural rework.
- **FR-010**: Access to the shell MUST remain limited to super-admin users.

### Key Entities _(include if feature involves data)_

- **Control-Plane Navigation Item**: A super-admin destination with a stable title, icon treatment, route key, and active-state behavior.
- **Control-Plane Section State**: The content payload for the currently selected destination, which may be implemented or placeholder-only.
- **Responsive Navigation Mode**: The layout state that determines whether the shell shows full labels or icon-only navigation.

### Assumptions

- The existing super-admin platform shell from earlier stories remains the foundation for this work.
- This story defines the control-plane navigation frame and placeholder content states, not the full business workflows for every listed section.
- The route structure may stay within the current web app as long as the shell supports direct navigation and active-state identification.
- Existing auth and RBAC behavior already distinguishes `super_admin` from tenant-scoped users.

### Dependencies

- `CROWN-7` provides the initial super-admin shell and access boundary this story extends.
- Existing `apps/web` auth-routing behavior continues to direct `super_admin` users into the platform experience.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In acceptance testing, 100% of the nine required navigation items appear in the left navigation for an allowed super-admin session.
- **SC-002**: In acceptance testing, 100% of placeholder destinations display `<Menu title> Coming Soon` instead of blank or broken content.
- **SC-003**: In desktop and iPad-sized viewport checks, the shell matches the required label, collapse, and tooltip behavior for the tested navigation states.
- **SC-004**: In validation, the active destination is visually identifiable for every in-scope route that can be selected directly.
- **SC-005**: 100% of tested non-super-admin sessions continue to be denied or redirected away from the control-plane shell.
