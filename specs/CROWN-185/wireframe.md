# CROWN-185 Wireframe Spec

## Surface

- Target: `apps/web2/components/ui/chip.tsx`
- Primary user: platform users managing selectable filter presets or lightweight tokenized selections in dense CRM/table workflows
- Layout pattern: approved Pattern 1 "Standard Admin Page" support component used inside table/filter toolbars and other left-aligned admin surfaces
- Component role: reusable interactive chip primitive for selection and optional removal actions
- Relationship to existing UI: complements the existing display-only `Badge` pattern and must not replace non-interactive badge usage

## Layout Structure

- Base structure is a compact rounded token with inline content
- Primary action area contains the chip label and optional leading visual cue
- Optional remove affordance sits at the trailing edge as a distinct target inside the same visual pill
- The component must support stand-alone usage and grouped usage inside wrapping filter rows

## Action Hierarchy

- Primary action: toggle or activate the chip selection state
- Secondary action: remove the chip when the removable affordance is present
- No destructive styling is used for default filter removal because removal is a management action, not a dangerous action

## Required States

- Default: neutral surface, interactive hover/focus treatment, not selected
- Selected: stronger emphasis using approved accent tokens and clear pressed state semantics
- Disabled: reduced emphasis, no pointer interaction, focus suppressed
- Removable: includes a visible trailing remove affordance with its own accessible label
- Success state mapping: selected state communicates active/applied filter state
- Error/loading/empty states are not intrinsic to the chip primitive and should be handled by parent surfaces when needed

## Accessibility

- Primary chip interaction uses button semantics
- Selected state exposes `aria-pressed`
- Removable affordance is keyboard reachable and announces a clear remove label
- Visible focus treatment is required on both the main chip action and the remove affordance
- Decorative icons must be `aria-hidden`

## Responsive Behavior

- Chip height and padding remain touch-friendly while staying compact for dense toolbar layouts
- Long labels truncate or wrap only at the parent layout level; the chip itself should preserve a stable single-line affordance
- When chips are used in groups, parent containers should allow wrapping on tablet/mobile without breaking the internal chip layout

## Component Reuse

- Reuse existing `apps/web2/lib/utils.ts` `cn()` helper
- Reuse `class-variance-authority` styling pattern already established in `apps/web2/components/ui/button.tsx` and `avatar.tsx`
- Do not create page-local chip implementations for rich table filters or similar flows after this primitive exists

## Design Tokens

- Default surface: `border-border`, `bg-card`, `text-foreground`
- Selected emphasis: `border-primary`, `bg-primary/10`, `text-foreground`
- Secondary affordance: `bg-muted`, `text-muted-foreground`
- Focus ring: `ring-ring`, `ring-offset-background`
- Disabled treatment: token-driven opacity and muted foreground handling only
