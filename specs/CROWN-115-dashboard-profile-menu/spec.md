# Feature Specification: Dashboard Left-Menu Profile Actions

**Feature Branch**: `feat/CROWN-115-dashboard-profile-menu`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: Jira issue `CROWN-115` - "UI | Move authenticated profile actions into dashboard left menu"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Open Profile Actions From The Left Navigation (Priority: P1)

As an authenticated dashboard user, I want my profile entry anchored in the left navigation shell so that my account actions live in one familiar place instead of a disconnected top-level header block.

**Why this priority**: This is the core Jira goal. Without relocating the profile controls into the sidebar shell, the UI problem remains unresolved.

**Independent Test**: Sign in to the dashboard, confirm the old top-level authenticated-user block is gone, and verify a compact profile entry appears below the left navigation.

**Acceptance Scenarios**:

1. **Given** an authenticated user opens the dashboard shell, **When** the page renders, **Then** the old standalone `Authenticated as` section is no longer shown in its previous location.
2. **Given** an authenticated user views the dashboard shell, **When** the left navigation renders, **Then** a compact profile section appears below the left menu.
3. **Given** the profile section is visible, **When** it renders, **Then** it shows a circular avatar-style treatment with the authenticated user's initials.
4. **Given** the profile section is visible, **When** it renders beside the existing left navigation, **Then** it aligns visually with the shell instead of feeling like a separate toolbar element.

---

### User Story 2 - Review Identity Details In A Compact Menu (Priority: P2)

As an authenticated dashboard user, I want a small profile menu to open from the left-navigation profile entry so that I can confirm who I am signed in as before taking an account action.

**Why this priority**: The menu content is the functional replacement for the existing identity display and is explicitly required by the Jira acceptance criteria.

**Independent Test**: Activate the profile entry and verify a compact menu or popover opens with the user's full name and role.

**Acceptance Scenarios**:

1. **Given** an authenticated user can see the profile entry, **When** they click or otherwise activate it, **Then** a compact profile menu or popover opens.
2. **Given** the profile menu is open, **When** the user views its content, **Then** it shows the authenticated user's full display name.
3. **Given** the profile menu is open, **When** the user views its content, **Then** it shows the authenticated user's role.
4. **Given** the menu is closed, **When** the user activates the profile entry again, **Then** the compact profile menu can be closed without navigating away from the current dashboard section.

---

### User Story 3 - Log Out From The New Profile Menu (Priority: P3)

As an authenticated dashboard user, I want logout available from the same profile menu so that the cleaner shell still gives me an obvious way to leave the app.

**Why this priority**: Relocating the profile controls must not remove or obscure the logout path.

**Independent Test**: Open the profile menu, activate logout, and verify the current browser session returns to the login page.

**Acceptance Scenarios**:

1. **Given** the compact profile menu is open, **When** the user reviews the available actions, **Then** a logout action is present.
2. **Given** the user activates logout from the profile menu, **When** the logout flow completes, **Then** the browser session returns to the login page as it does today.
3. **Given** the story is delivered, **When** reviewers inspect the changed UI behavior, **Then** the scope remains limited to dashboard-shell profile placement and does not expand into unrelated auth or account-management workflows.

### Edge Cases

- Users with single-word display names still need a stable initials avatar treatment.
- Users with extra whitespace or multi-word display names still need predictable initials in the compact avatar.
- Long role labels must remain readable inside the compact menu without breaking the shell layout.
- The profile menu should not hide the logout path behind navigation to a different page.
- Existing logout behavior must remain consistent for both platform and tenant dashboard shells if they share the same shell component.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The dashboard shell MUST remove the existing standalone `Authenticated as` block from its current top-level location.
- **FR-002**: The dashboard shell MUST render a compact profile section below the left navigation menu.
- **FR-003**: The compact profile section MUST include a circular avatar-style treatment showing the authenticated user's initials.
- **FR-004**: The compact profile section MUST visually align with the existing left-navigation shell.
- **FR-005**: Activating the compact profile section MUST open a compact menu or popover anchored to that section.
- **FR-006**: The opened menu or popover MUST display the authenticated user's full display name.
- **FR-007**: The opened menu or popover MUST display the authenticated user's role.
- **FR-008**: The opened menu or popover MUST include the logout action.
- **FR-009**: The logout action delivered through the profile menu MUST preserve the existing browser-session sign-out outcome.
- **FR-010**: The implementation MUST stay limited to dashboard UI updates and MUST NOT widen into unrelated authentication, profile-editing, or account-management flows.

### Key Entities _(include if feature involves data)_

- **Shell Profile Entry**: The compact dashboard-shell control that combines the user's initials avatar and menu trigger inside the left navigation area.
- **Profile Menu State**: The open or closed UI state for the compact profile menu or popover.
- **Profile Identity Summary**: The display data surfaced in the profile menu, including the user's display name and role label.

### Assumptions

- The existing authenticated user information and logout behavior already exist in the shared dashboard shell and can be repositioned without changing the underlying auth contracts.
- `CROWN-92` remains the current shell baseline for the platform navigation layout that this story extends.
- The profile entry can use existing browser-native or lightweight in-app interaction patterns; a new global dropdown system is not required by scope.
- This story applies to the shared authenticated dashboard shell surface rather than introducing separate profile UX rules for different roles.

### Dependencies

- Existing `apps/web` authenticated shell components, especially the shared workspace shell that currently renders the standalone user block.
- Existing logout flow in the web auth provider and button wiring.
- Current platform and tenant protected-route flows from the earlier web authentication stories.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In review and browser validation, 100% of tested authenticated dashboard states no longer show the old standalone `Authenticated as` block.
- **SC-002**: In review and browser validation, 100% of tested authenticated dashboard states show a compact profile entry below the left navigation with initials visible in the avatar treatment.
- **SC-003**: In review and browser validation, 100% of tested profile-entry activations open a compact menu showing the authenticated user's display name and role.
- **SC-004**: In review and browser validation, 100% of tested logout actions taken from the new profile menu still return the user to the login page.
- **SC-005**: Reviewers can confirm the delivered changes are limited to dashboard-shell profile placement and presentation rather than broader auth workflow changes.
