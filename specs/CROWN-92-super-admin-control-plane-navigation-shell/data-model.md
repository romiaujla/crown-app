# Data Model: Super-Admin Control-Plane Navigation Shell

## Entity: ControlPlaneNavigationItem

- **Description**: A top-level destination in the super-admin shell.
- **Fields**:
  - `key`: stable route/selection identifier
  - `title`: user-facing destination label
  - `icon`: visual identifier for the sidebar
  - `eyebrow`: short contextual descriptor for the content panel
  - `description`: section summary or placeholder copy
  - `implemented`: whether the section has bespoke content beyond the shared placeholder state
- **Relationships**:
  - Belongs to exactly one `ResponsiveNavigationModel`
  - Drives one `SectionContentState` when active
- **Validation rules**:
  - Titles must remain unique
  - All Jira-required sections must be present in the shell configuration

## Entity: SectionContentState

- **Description**: The main content shown for the currently active navigation destination.
- **Fields**:
  - `navigationKey`: current destination key
  - `title`: section heading rendered in the content pane
  - `status`: `implemented` or `coming_soon`
  - `body`: explanatory copy shown in the right-side panel
- **Validation rules**:
  - Placeholder sections must follow the `<Menu title> Coming Soon` title pattern
  - The rendered state must always correspond to one valid navigation item

## Entity: ResponsiveNavigationModel

- **Description**: The viewport-sensitive presentation mode for the control-plane shell.
- **Fields**:
  - `mode`: `expanded` or `collapsed`
  - `showLabels`: whether text labels are visible in the nav
  - `showTooltips`: whether icon labels need tooltip support
- **Validation rules**:
  - `expanded` mode shows icons and labels
  - `collapsed` mode hides labels and enables tooltip labeling
