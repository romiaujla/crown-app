# Data Model: Dashboard Left-Menu Profile Actions

## Entity: ShellProfileEntry

- **Description**: The compact identity control rendered beneath the authenticated dashboard navigation.
- **Fields**:
  - `displayName`: full authenticated user display name
  - `initials`: derived initials shown in the circular avatar treatment
  - `roleLabel`: authenticated user role displayed in the compact menu
  - `menuOpen`: whether the compact profile menu is currently visible
- **Relationships**:
  - Lives within one `SidebarShellLayout`
  - Controls one `ProfileMenuPanel`
- **Validation rules**:
  - `initials` must resolve to a stable non-empty label even for trimmed or single-word names
  - The profile entry must remain visually compact relative to the sidebar shell

## Entity: ProfileMenuPanel

- **Description**: The compact popover-style panel opened from the shell profile entry.
- **Fields**:
  - `anchor`: the profile entry that triggered the panel
  - `displayName`: full authenticated user display name
  - `roleLabel`: authenticated user role label
  - `actions`: available menu actions, including logout
  - `isVisible`: whether the panel is currently rendered
- **Validation rules**:
  - The panel must display the user display name and role whenever it is visible
  - The panel must include the logout action without requiring navigation to another page

## Entity: SidebarShellLayout

- **Description**: The authenticated shell layout that contains navigation items, section content, and the new compact profile affordance.
- **Fields**:
  - `navigationItems`: left-rail destinations already supported by the shell
  - `profilePlacement`: profile entry position beneath the navigation list
  - `contentPanel`: active route content shown beside the sidebar
- **Validation rules**:
  - The old standalone top-level authenticated-user card must not render once the profile entry exists in the sidebar
  - The profile entry placement must preserve the existing left-navigation orientation and content layout
