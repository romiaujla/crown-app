# CROWN-195 Wireframe Spec - Tabs Primitive

## Summary

Create a reusable `Tabs` primitive in `apps/web2/components/ui/tabs.tsx` for sectioned content navigation. The component should follow the Radix Tabs and shadcn composition model while applying Crown web-v2 spacing, typography, and token usage so future control-plane pages can adopt one consistent tab treatment.

## Layout Structure

- Approved pattern: reusable primitive intended for Standard Admin Page and card-contained detail surfaces.
- Structure:
  - `Tabs` root manages selection state and keyboard navigation.
  - `TabsList` renders a single-row tab rail with compact segmented styling.
  - `TabsTrigger` renders one label per section within the rail.
  - `TabsContent` renders the active panel content beneath the rail with predictable top spacing.
- The primitive must support horizontal overflow on smaller widths so dense section sets remain usable on tablet and mobile.

## Action Hierarchy

- Primary action: switch between related content sections.
- Secondary actions remain inside each active tab panel and are owned by consuming surfaces.
- The primitive should not introduce page-level CTAs or business logic.

## Required States

- Default: one active tab with two or more sibling triggers.
- Hover: inactive triggers show affordance without overpowering the active state.
- Focus: keyboard users receive a visible ring on the focused trigger.
- Active: selected trigger is visually elevated and clearly distinct from inactive triggers.
- Disabled: individual triggers can be disabled and visibly non-interactive.
- Responsive overflow: the tab rail remains usable in narrower containers.
- Dark theme: active, inactive, border, and focus states remain legible against the dark control-plane palette.

## Accessibility Behavior

- Use Radix Tabs semantics for `tablist`, `tab`, and `tabpanel`.
- Support arrow-key navigation between triggers.
- Focus indicators must remain visible on keyboard navigation.
- Trigger text should stay readable at the approved `text-sm` product scale.
- Consumers are responsible for concise, descriptive tab labels.

## Responsive Behavior

- Desktop: `TabsList` sizes to content and keeps the trigger row compact.
- Tablet: tab rail may wrap in roomy surfaces, but horizontal overflow support must preserve usability in dense containers.
- Mobile: allow horizontal scrolling rather than collapsing labels into cramped multi-line buttons.
- `TabsContent` spacing remains stable across breakpoints.

## Component Reuse

- New reusable primitive:
  - `apps/web2/components/ui/tabs.tsx`
  - `apps/web2/components/ui/tabs.stories.tsx`
- Existing supporting primitives:
  - `Card` for embedded usage stories
  - shared `cn()` utility
- No tabbed-navigation markup should be built directly inside page files when this primitive fits the need.

## Design Token Usage

- Use semantic tokens only: `bg-muted`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `ring-ring`, `shadow-*`, and related opacity utilities.
- Keep labels in the approved `Inter` body family and reserve stronger emphasis for the active state only.
- Avoid raw color literals and avoid introducing a new visual pattern that diverges from existing segmented controls without justification.
