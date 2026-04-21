# CROWN-183 Wireframe Spec

## Surface

Reusable segmented single-select toggle for `apps/web2/components/ui/toggle-group.tsx`.

## Primary User

Platform operators switching between mutually exclusive dashboard or filter views such as `Week`, `Month`, and `Year`.

## Layout Pattern

- Component-level control intended for Pattern 1 — Standard Admin Page surfaces.
- Render as a compact segmented control that can sit inside a card header, metric toolbar, or table/filter action row.
- Horizontal layout on desktop, tablet, and mobile unless a future consumer explicitly opts into vertical orientation.

## Structure

- Outer segmented container:
  - rounded full-width capsule
  - subtle border
  - muted background
  - small internal padding to frame active state
- Child segments:
  - evenly spaced tap targets
  - concise labels
  - clear selected state with stronger surface and elevation

## Action Hierarchy

- Primary action: choose one active segment.
- Secondary action: keyboard navigation between segments.
- No tertiary or destructive action inside this component.

## Required States

- Default: one option selected.
- Hover: non-selected segments show higher emphasis.
- Focus: visible ring on the focused segment.
- Active/Selected: selected segment uses elevated surface treatment.
- Disabled item: unavailable segment is visibly muted and non-interactive.
- Disabled group: full control is non-interactive with reduced contrast.

## Accessibility

- Use Radix Toggle Group keyboard behavior for roving focus and arrow-key navigation.
- Provide an accessible group label via `aria-label` or external labeling.
- Preserve visible focus indicators on items.
- For single-select usage, prevent clearing the active value once one option is selected.

## Responsive Behavior

- Maintain compact horizontal segmented layout from desktop through mobile.
- Labels should stay short enough to avoid wrapping in standard usage.
- For narrow containers, items should remain readable with compact spacing rather than introducing a new visual pattern.

## Component Reuse

- Reuse existing `cn()` utility and semantic tokens from `apps/web2/app/globals.css`.
- Follow the established Radix component patterns already used by `button.tsx`, `switch.tsx`, and `dialog.tsx`.
- No new page-only segmented markup should be introduced when this component can be reused.

## Design Tokens

- Backgrounds: `bg-muted`, `bg-background`, `bg-card`
- Text: `text-foreground`, `text-muted-foreground`
- Borders: `border-border`
- Focus: `ring-ring`, `ring-offset-background`
- Elevation: existing semantic shadow treatments only
