# CROWN-204 Wireframe Spec: RichList Header Visual Hierarchy

## Layout Structure

- Approved pattern: Standard Admin Page / Rich Table container.
- Surface: `RichList` remains a rounded, bordered card when standalone.
- Unified container: `RichTableFilterBar` can sit directly above `RichList` inside one bordered card; the list must visually separate filter controls, column labels, and records without adding another nested border.
- Header row: column labels sit on a subtle muted surface with a stronger bottom divider before the first data row.
- Body rows: remain dense and scannable, preserving existing compact and breathable density options.

## Action Hierarchy

- Primary actions stay outside `RichList`.
- Secondary filter actions remain owned by `RichTableFilterBar`.
- Tertiary row selection and sortable column controls remain visible but subordinate to table content.
- Destructive actions are not introduced by this change.

## Required States

- Default: header treatment clearly distinguishes column labels from records.
- Loading: skeleton rows continue below the same header treatment.
- Empty: empty state remains inside the table body below the header.
- Filtered empty: filtered empty state remains available when the list is composed with filter controls.
- Error: error state remains available below the header.
- Success: not applicable; `RichList` does not own mutation success feedback.

## Accessibility Behavior

- Keep semantic table structure with `thead`, `th`, and `aria-sort`.
- Sortable headers remain keyboard-focusable through existing button controls.
- Selection header checkbox keeps its `Select all rows` accessible label.
- Header visual distinction must not rely on color alone; use both surface contrast and divider weight.
- Focus rings must remain visible against the header surface in light and dark themes.

## Responsive Behavior

- Preserve existing intended horizontal overflow through the table wrapper.
- Do not reduce the `min-w-[760px]` table model.
- Header treatment must not introduce horizontal overflow beyond the existing table width.
- Mobile and narrow containers continue to scroll the same way as before.

## Component Reuse

- Reuse existing `Table`, `TableHeader`, `TableRow`, `TableHead`, `Button`, and `Checkbox`.
- Reuse existing `RichTableFilterBar` for integration demonstrations.
- No new reusable component is required.
- No reusable UI should be built directly into a page file for this issue.

## Design Token Usage

- Use semantic Tailwind tokens backed by web-v2 CSS variables: `bg-muted`, `bg-secondary`, `border-border`, `text-foreground`, `text-muted-foreground`, `focus-visible:ring-ring`.
- Do not introduce raw hex, RGB, or HSL color literals.
- Header body contrast must work in both light and dark themes.
