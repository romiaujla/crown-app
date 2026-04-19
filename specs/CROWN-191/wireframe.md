# CROWN-191 Wireframe Spec - Rich List Base Component

## Summary

Create the reusable `RichList` foundation for dense record-list and Rich Table surfaces in `apps/web2`. This base owns table/list structure, column rendering, row selection, loading states, empty states, and extension slots. Pagination, filter bars, smart filter chips, and toolbar-right controls are intentionally out of scope for this issue and attach through later Rich Table stories.

## Layout Structure

- Approved pattern: Standard Admin Page / dense management table surface.
- The component renders as a full-width data region inside whatever page or section owns the surrounding header, filters, and actions.
- Structure:
  - Optional caption for screen-reader and visible table context.
  - Header row with configurable columns and optional selection column.
  - Body rows with stable cell alignment and optional selected state.
  - Footer slot for downstream summary, result metadata, or later pagination integration.
  - State region for loading, empty, filtered-empty, and error states.
  - Consistent left and right table-edge padding across header, body, loading, footer, and state rows.

## Action Hierarchy

- Primary actions are outside the base component and belong to `CROWN-192`.
- Row selection is the only interactive behavior owned by this base.
- Sort affordances are supported as metadata and callback hooks, but sorting controls only emit intent; this base does not own data fetching or sort state.
- Pagination controls are out of scope and attach through `CROWN-189`.
- Filter controls are out of scope and attach through `CROWN-190` and `CROWN-193`.

## Required States

- Default: records render with configured columns and optional row selection.
- Compact density: records render with the current dense row spacing for operational scan speed.
- Breathable density: records render with additional vertical cell padding for review contexts where rows need more air.
- Loading: skeleton rows preserve column rhythm and row height while data loads.
- Empty: `EmptyState` communicates that no records exist yet.
- Filtered empty: `EmptyState` communicates that current filters returned no matches.
- Error: `EmptyState` communicates recovery guidance and accepts retry action copy through props.
- Selected: rows expose selected visual state and accessible checkbox state.
- Disabled selection: individual rows can disable selection when business rules prevent changes.

## Accessibility Behavior

- Render semantic table structure using shadcn Table primitives.
- Checkbox controls must have row-specific labels.
- Multi-select header checkbox must communicate all, none, and mixed selection states.
- Sortable headers use button controls and `aria-sort` on the header cell.
- Empty, loading, and error regions must keep user orientation with clear titles and recovery copy.
- Keyboard users must be able to tab through row selection and sortable headers.

## Responsive Behavior

- Desktop: table fills the available content width with column widths honored where provided.
- Tablet: horizontal overflow is allowed inside the table wrapper so data columns remain readable.
- Mobile: horizontal overflow remains available; row height and selection controls stay stable.
- Text in cells truncates only where the consuming column renderer chooses truncation.
- Compact and breathable density variants must preserve the same column widths and interaction model.
- Left and right table-edge padding must remain present at desktop, tablet, and mobile widths.

## Component Reuse

- New reusable component:
  - `apps/web2/components/ui/rich-list.tsx`
  - `apps/web2/components/ui/rich-list.stories.tsx`
- Existing components/primitives:
  - shadcn `Table` primitives in `apps/web2/components/ui/table.tsx`
  - shadcn `Checkbox` primitive in `apps/web2/components/ui/checkbox.tsx`
  - existing `Skeleton`
  - existing `EmptyState`
  - existing `Button` for sortable header controls
- Downstream attachments:
  - `CROWN-189` pagination
  - `CROWN-190` filter bar
  - `CROWN-192` toolbar-right config
  - `CROWN-193` smart filter chips

## Design Token Usage

- Use semantic Tailwind tokens: `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border`, `ring-ring`, `primary`.
- Do not introduce raw color values.
- Maintain table typography at `text-sm` with `tabular-nums` available to cell renderers for numeric columns.
- Keep row and cell dimensions stable across default, hover, selected, loading, and empty states.
- Use compact density by default; use breathable density when a consuming surface prioritizes row readability over maximum vertical density.
