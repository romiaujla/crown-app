# CROWN-189 Wireframe Spec - Rich Table Pagination

## Summary

Create a reusable `Paginator` footer component for dense data tables in `apps/web2`. The component sits below a `RichList` surface, standardizes result-count messaging, page-size selection, and page navigation, and emits offset/limit pagination intent for page-level or server-driven data fetching. It does not own data fetching, filters, or empty/error messaging for the surrounding table.

## Layout Structure

- Approved pattern: Standard Admin Page / dense management table surface.
- Placement: inside the `RichList` footer slot, below the table body and separated with the existing footer border.
- Structure:
  - Range summary text on the left at desktop sizes.
  - Page-size selector grouped with its label.
  - Navigation cluster containing previous, page number buttons, ellipsis when needed, and next.
  - Mobile layout stacks summary, page-size control, and navigation into separate rows while keeping all controls visible.

## Action Hierarchy

- Primary actions remain outside the paginator and belong to the surrounding page or toolbar.
- Inside the paginator:
  - Primary interaction: move between pages.
  - Secondary interaction: change page size.
  - Tertiary information: current visible range and total record count.
- The component does not add direct "jump to page" input in this story.

## Required States

- Default: summary, page-size selector, and navigation controls are visible and enabled according to current page bounds.
- First page: previous is disabled; next remains available when additional pages exist.
- Middle page: previous and next are both available; page numbers render around the current page.
- Last page: next is disabled; previous remains available.
- Single page: summary and page-size selector remain visible, numeric navigation collapses to the current page only.
- Loading: footer height remains stable while summary and controls render skeleton placeholders or disabled controls.
- Disabled: all controls are non-interactive when the surrounding surface is locked.
- Empty / filtered empty: paginator is hidden so the parent `RichList` state surface owns the empty treatment.

## Accessibility Behavior

- Render the root as a `nav` region with an `aria-label`.
- Keep the result summary in an `aria-live="polite"` region so page changes are announced without moving focus.
- Use native `button` elements for navigation controls and native `select` for page-size selection.
- Mark the current page button with `aria-current="page"`.
- Use native `disabled` state for unavailable previous/next and disabled component states.
- Preserve focus on the triggering control after interaction where possible; if numeric buttons rerender, move focus to the current page button.
- Keyboard interaction must support tabbing through select, previous, page buttons, and next without hijacking arrow keys from the surrounding table.

## Responsive Behavior

- Desktop (`>= 1024px`): single horizontal row with summary left and controls right.
- Tablet (`768px - 1023px`): summary wraps to the first row; page-size selector and navigation share the second row.
- Mobile (`< 768px`): summary, page-size selector, and navigation stack vertically with numeric buttons remaining reachable without hidden-only access paths.
- Large page counts may collapse into a windowed set of page buttons with ellipsis while always keeping the current page visible.

## Component Reuse

- Existing reusable components/primitives:
  - `apps/web2/components/ui/rich-list.tsx` footer slot for table integration
  - `apps/web2/components/ui/button.tsx`
  - `apps/web2/components/ui/skeleton.tsx`
  - `apps/web2/components/ui/form-field.tsx` styling pattern for native inputs/selects
  - Lucide chevron icons already available in `apps/web2`
- New reusable component:
  - `apps/web2/components/ui/paginator.tsx`
  - `apps/web2/components/ui/paginator.stories.tsx`
- The paginator must stay presentational and emit pagination intent via props rather than embedding API calls.

## Component Contract

- Inputs:
  - `offset`
  - `limit`
  - `totalCount`
  - optional `pageSizeOptions` defaulting to `10`, `25`, `50`, and `100`
  - optional `loading`, `disabled`, `maxPageButtons`, `ariaLabel`, and `className`
- Output callback:
  - `onPaginationChange({ page, offset, limit })`
- Derived display:
  - range summary text such as `Showing 1-10 of 42`
  - current page and total pages derived from `offset`, `limit`, and `totalCount`

## Design Token Usage

- Use semantic tokens only: `bg-card`, `text-card-foreground`, `text-muted-foreground`, `border-border`, `bg-accent`, `text-accent-foreground`, `bg-secondary`, `text-secondary-foreground`, `ring-ring`.
- Follow existing `apps/web2` control styling for radius, focus rings, disabled opacity, and text scale.
- Keep typography at `text-sm` and use `tabular-nums` for numeric summary and page values.
- Do not introduce raw color values or custom CSS when Tailwind tokens and existing primitives cover the state.

## Storybook Coverage

- `Default`
- `FirstPage`
- `MiddlePage`
- `LastPage`
- `SinglePage`
- `Loading`
- `Disabled`
- `ManyPagesCondensed`
- `PageSize25`
- `PageSize50`
- `PageSize100`
- `DarkTheme`
- `RichListIntegration`
- `ResponsiveMobile`
