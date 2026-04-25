# CROWN-203 — Left navigation menu with collapsible submenu behavior

## 1. Title

Left navigation menu for the `apps/web2` app shell with grouped items, icon-only collapse behavior, and a right-side child submenu panel.

## 2. Scope

**In scope**

- Shell-level left navigation in `apps/web2/app/layout.tsx`
- Full-height left rail
- Branding header with company icon and company title
- Divider below branding
- Menu rendering from config, including divider-based grouping
- Icon on every parent and child item
- Maximum 2 levels only
- Parent-with-children behavior: open right submenu + auto-collapse parent rail to icon-only
- Independently collapsible submenu
- Direct navigation for parent items without children
- Desktop, tablet, and mobile behavior
- Loading, empty, error, and success handling for nav config/rendering
- Storybook coverage for new reusable shell components

**Out of scope**

- Defining final route map or permission model
- Top navigation redesign
- Content-page layouts beyond providing a shell content slot
- More than 2 navigation levels

## 3. Approved layout pattern

**Approved pattern:** `Pattern 1 — Standard Admin Page`, adapted into a persistent application shell for web2.

**Desktop shell layout**

- Column 1: primary left nav rail
- Column 2: contextual submenu panel (only when active parent has children and submenu is open)
- Column 3: main page content

**Recommended dimensions**

- Expanded primary rail: `240px`
- Collapsed primary rail: `72px`
- Expanded submenu panel: `224px`
- Collapsed submenu panel: hidden (`0px`, removed from tab order)
- Shell height: `min-h-screen`

**Layout behavior**

- Primary rail is always left-aligned and full height
- Branding stays at the top of the primary rail
- Divider sits directly below branding
- Navigation list fills remaining vertical space
- Main content always occupies remaining width

## 4. Structure

**Recommended component structure for `apps/web2`**

- `app/layout.tsx`
  - wraps `{children}` with new `AppShell`
- `components/shell/app-shell.tsx`
  - `LeftNavRail`
  - `NavSubmenuPanel` (conditional)
  - `main` content slot

**Primary rail structure**

1. **Branding header**
   - Company icon/avatar mark
   - Company title
   - Main rail collapse toggle
2. **Divider**
3. **Navigation body**
   - Parent items in a vertical list
   - Divider rows rendered wherever config specifies grouping
   - Every item includes icon
4. **Optional footer area**
   - Safe location for future settings/help/logout; not required for this story

**Nav item rules**

- Parent items without children: single row, icon + label, direct navigation
- Parent items with children: single row, icon + label + expand affordance when expanded
- Child items: rendered only inside submenu panel, also icon + label
- No third level, no flyout from children

**Spacing**

- Branding padding: `16px`
- Space between icon and label: `8px`
- Nav row height: `40px`
- Group divider margin: `16px 0`
- Submenu header padding: `16px`

## 5. Interaction model

### Primary rail

- Default user preference may be expanded or collapsed
- Clicking the main rail collapse toggle manually switches:
  - expanded `240px` ⇄ collapsed `72px`
- In collapsed mode, only icons are visible; labels are not rendered visually

### Parent item without children

- Activates direct navigation immediately
- Closes any open submenu
- Restores primary rail to the user’s manual preference state

### Parent item with children

- First activation:
  - marks parent active
  - opens submenu panel to the right
  - forces primary rail into collapsed icon-only mode
- Activating a different parent with children:
  - switches active parent
  - swaps submenu contents in place
  - keeps primary rail collapsed
- Activating the same active parent again:
  - toggles submenu open/closed

### Submenu panel

- Has its own header with active parent label and collapse toggle
- Collapse toggle hides the submenu panel entirely
- When submenu panel closes:
  - focus returns to the active parent icon in the primary rail
  - primary rail returns to the user’s manual preference state
- Child item click navigates directly and keeps the parent context active

### Grouping

- Divider-based groups are config-driven only
- Divider rows are non-interactive

### Persistence

- Persist manual primary rail collapse preference locally per user/browser
- Persist last open parent submenu for current route context only if already active on reload
- Do not add server persistence for this story

## 6. Required states (loading, empty, filtered-empty if relevant, error, success)

| State          | Treatment                                                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default        | Expanded or collapsed primary rail based on saved preference; no submenu unless active parent has children.                                                           |
| Hover          | Nav row uses `bg-accent` + `text-accent-foreground`; no layout shift.                                                                                                 |
| Focus          | Visible `ring-ring` focus treatment on item button/toggle; keep current widths unchanged.                                                                             |
| Active         | Current route item uses stronger emphasis than hover; active parent remains highlighted while its submenu is open.                                                    |
| Disabled       | Only if config explicitly marks an item unavailable; render non-interactive with reduced opacity and keep icon visible.                                               |
| Loading        | Render shell skeleton: branding block, divider, 6–8 skeleton nav rows, optional submenu skeleton if parent context is known. Use existing `.ui-skeleton`; no spinner. |
| Empty          | If no nav items are available after config resolves, replace nav body with compact empty state: icon, “No navigation items”, short description, `Reload` action.      |
| Filtered-empty | N/A — this navigation has no filter/search surface.                                                                                                                   |
| Error          | Replace nav body with inline error state: icon, “Navigation failed to load”, short description, `Retry` action. Keep page shell mounted.                              |
| Success        | No toast needed. Success is reflected by immediate active-state update, submenu open/close behavior, and persisted collapse preference.                               |

## 7. Accessibility

- Use semantic landmarks:
  - `<aside>` for shell navigation
  - `<nav aria-label="Primary navigation">`
  - submenu panel as a nested `<nav aria-label="[Active parent] submenu">`
- Parent items with children must expose:
  - `aria-expanded`
  - `aria-controls`
- Active destination item uses `aria-current="page"`
- Divider rows use `role="separator"`
- Collapsed icon-only buttons must still expose the full label via `aria-label`
- If no existing tooltip primitive is available in `apps/web2`, add a thin reusable tooltip wrapper so collapsed icon-only items have visible hover/focus labels
- Keyboard behavior:
  - `Tab` moves between branding controls, parent items, submenu controls, then page content
  - `Enter` / `Space` activates focused item
  - `ArrowDown` / `ArrowUp` moves between sibling items
  - `ArrowRight` opens submenu for focused parent with children
  - `ArrowLeft` collapses submenu and returns focus to triggering parent item
  - `Escape` collapses submenu on desktop, closes nav drawer on tablet/mobile
  - `Home` / `End` jump to first/last item in the current nav list
- On submenu open, move focus to submenu header/title or first child item
- On submenu close, return focus to the parent item that opened it
- Do not trap focus on desktop persistent nav

## 8. Responsive behavior

**Desktop (`≥1024px`)**

- Persistent full-height left rail
- Separate right-side submenu panel
- Acceptance-criteria behavior applies exactly here

**Tablet (`768–1023px`)**

- Navigation becomes a left `Drawer`
- Do not use a separate right-side submenu panel
- Child items expand inline beneath the active parent inside the same drawer
- Icons remain visible for all items
- Drawer closes after navigation

**Mobile (`<768px`)**

- Full-screen left navigation drawer
- Branding remains at top with close button
- Parent-with-children expands inline accordion-style
- No dual-panel layout on mobile
- Items stack full width with icon + label always visible

## 9. Component reuse and new components

### Reuse from `apps/web2/components/ui`

- `Button` — base for nav item buttons and collapse toggles
- `Drawer` — tablet/mobile nav container
- `Skeleton` — loading state
- `EmptyState` — empty and error fallback bodies
- Existing `globals.css` typography, radius, and token utilities

### New reusable components recommended

- `components/shell/app-shell.tsx`
  - Shell composition only; owns nav open/collapse state and content slot
- `components/shell/left-nav-rail.tsx`
  - Branding, dividers, parent list, manual collapse toggle
- `components/shell/nav-submenu-panel.tsx`
  - Active parent header, collapse control, child list
- `components/shell/nav-item-button.tsx`
  - Shared presentational row for parent/child item rendering
- `components/ui/tooltip.tsx` _(only if missing and needed for collapsed icon labels)_

### Storybook needs

Create stories for each new reusable component before page integration:

- Default expanded rail
- Collapsed rail
- Active parent with submenu open
- Parent without children
- Divider-grouped menu
- Loading
- Empty
- Error
- Tablet/mobile drawer variant
- Keyboard-focus example

## 10. Design token usage

Use only tokens already defined in `apps/web2/app/globals.css`.

| Surface / element            | Token usage                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| App shell background         | `bg-background text-foreground`                              |
| Primary rail + submenu panel | `bg-card text-card-foreground`                               |
| Borders + dividers           | `border-border`                                              |
| Default nav text             | `text-muted-foreground`                                      |
| Hover row                    | `bg-accent text-accent-foreground`                           |
| Active row                   | `bg-secondary text-secondary-foreground`                     |
| Branding icon surface        | `bg-primary text-primary-foreground`                         |
| Focus ring                   | `ring-ring`                                                  |
| Error messaging              | `text-destructive` with existing border/background utilities |
| Skeletons                    | existing `.ui-skeleton`                                      |
| Radius                       | shared `--radius` via existing rounded utility classes       |

**Typography**

- Company title: `text-base`, `font-semibold`
- Nav labels: `text-sm`
- Helper/error copy: `text-xs`
- Keep to existing Inter/Manrope usage already established in web2

## 11. Acceptance mapping

| Acceptance criterion                                                                                      | Spec mapping                                                                                                             |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Left navigation full height on left side.                                                                 | Desktop shell uses persistent left rail with `min-h-screen` in `AppShell`; always left-aligned.                          |
| Top includes company icon and company title.                                                              | Branding header is first rail section and contains icon + company title.                                                 |
| Divider below branding/header.                                                                            | Primary rail includes a dedicated divider immediately below branding.                                                    |
| Menu items below header; support divider-based grouping wherever config requires.                         | Nav body sits below divider and renders parent items plus non-interactive config-driven separators.                      |
| All menu items have icons.                                                                                | Every parent and child item renders an icon; collapsed rail still shows icons.                                           |
| Max 2 levels: parent menu and child submenu.                                                              | Structure explicitly limits nav to parent items and one child submenu panel only; no third level.                        |
| When a parent with children is activated, open submenu to the right and collapse parent nav to icon-only. | Desktop interaction model auto-collapses primary rail to `72px` and opens right-side submenu panel on parent activation. |
| Submenu should also be collapsible.                                                                       | Submenu panel has its own collapse control; closing it returns focus to the active parent item.                          |
| Parent items without children navigate directly.                                                          | Direct-navigation parent items immediately navigate and do not open submenu.                                             |
