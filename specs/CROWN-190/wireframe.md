# CROWN-190 Wireframe Spec - Rich Table Filter Bar

## Surface

Reusable `RichTableFilterBar` for `apps/web2` Rich Table list views. The first consumer is the tenant directory filter surface currently rendered inline in `tenant-directory-page.tsx`.

## Layout Structure

- Approved pattern: Rich Table / Filter Bar.
- Place the filter bar directly above the table or list surface.
- Wide containers: controls distribute across an auto-fit grid and keep readable minimum widths.
- Narrow containers: controls collapse to a single-column stack based on the filter bar container width, not only the viewport breakpoint.
- Active filters render below the controls as removable chips.

## Action Hierarchy

- Primary task: type text search and select dropdown filters.
- Secondary action: remove one active filter chip.
- Tertiary action: clear all filters.
- No destructive action is present.

## Required States

- Default: visible search input, one or more dropdown filter selects, optional clear-all button.
- Active filters: show removable chips for every applied text or select filter.
- Disabled/loading: controls remain visible but non-interactive.
- Empty/filtered-empty: owned by the adjacent `RichList`/table state, with clear filters wired to the same reset handler.
- Error: owned by the adjacent data surface; the filter bar stays stable unless the parent disables it.
- Success: applied filters update controlled parent state and data reloads from that state.

## Accessibility

- Search input and every select has a visible label and explicit `aria-label` support.
- Active filter chips are buttons with specific remove labels.
- Clear-all is a real button and is disabled when no filter is active.
- The active filter region uses polite live text so screen readers can detect filter state changes.
- Keyboard order is search, selects, clear-all, then active chips.

## Responsive Behavior

- Desktop/wide containers: controls wrap across readable grid columns.
- Tablet/narrow containers: preserve label-control grouping and avoid horizontal overflow.
- Mobile/constrained containers: controls stack and every target remains at least 40px tall.

## Component Reuse

- New reusable component: `apps/web2/components/ui/rich-table-filter-bar.tsx`.
- Storybook coverage: `apps/web2/components/ui/rich-table-filter-bar.stories.tsx`.
- Existing components/patterns referenced: Rich Table, Smart Filter Chips, Button-like clear action, native select pattern already used by the web2 paginator.
- No new reusable component is added under deprecated `apps/web`.

## Design Tokens

- Use Tailwind semantic token classes backed by `apps/web2/app/globals.css`: `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `border-input`, `focus-visible:ring-ring`, `bg-secondary`, and `bg-accent`.
- Do not introduce raw color literals.
