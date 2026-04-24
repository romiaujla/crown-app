# CROWN-197 — Sheet / Drawer component wireframe

## Target surface

Create a reusable primitive at `apps/web2/components/ui/sheet.tsx` for contextual workflows that should keep the current page visible behind a slide-out panel. Use it for detail/edit side panels, compact follow-up tasks, and mobile-friendly bottom sheets. Do not use it for binary confirmations that already fit the centered `Dialog` pattern.

## Layout structure

**Pattern:** overlay + anchored panel primitive

```text
Sheet
└─ SheetPortal
   ├─ SheetOverlay
   └─ SheetContent (right | left | bottom)
      ├─ SheetHeader
      │  ├─ SheetTitle
      │  ├─ SheetDescription
      │  └─ SheetClose
      ├─ SheetBody (consumer content)
      └─ SheetFooter (optional consumer actions)
```

### Direction variants

- `right` (default): primary CRM drawer layout for detail and edit flows.
- `left`: secondary contextual drawer when left-side placement is intentional.
- `bottom`: compact bottom sheet for filters, short forms, and mobile action bundles.

### Size model

- Desktop side sheets: fixed `w-[30rem]`.
- Tablet side sheets: full-width edge panel.
- Bottom sheet: full width with `max-h-[85vh]`.
- Mobile: all directions normalize to a full-screen overlay with fixed header and scrollable body.

## Action hierarchy

- **Primary actions:** consumer-provided footer CTA, typically on the right/bottom of the footer area.
- **Secondary actions:** consumer-provided cancel or supporting CTA, typically adjacent to the primary action.
- **Tertiary action:** icon-only close button in the header.
- **Destructive actions:** only through consumer-provided footer/header buttons using existing destructive button styles.

## Component reuse

Reuse the existing web2 patterns instead of introducing a new visual language:

- `apps/web2/components/ui/dialog.tsx` for Radix dialog composition, overlay treatment, focus handling, and close affordance patterns.
- `apps/web2/components/ui/button.tsx` for header/footer actions.
- `apps/web2/components/ui/skeleton.tsx` for loading states.
- `apps/web2/components/ui/empty-state.tsx` and `apps/web2/components/ui/empty.tsx` for empty and recovery states.
- `apps/web2/app/globals.css` and `apps/web2/tailwind.config.ts` for semantic tokens, typography, and spacing.

`sheet.tsx` is a **new primitive** for `apps/web2`; there is no existing reusable sheet component to extend directly.

## Required states

- **Default:** overlay visible, anchored panel open, header/body/footer layout intact.
- **Hover:** applies to the close button and consumer action controls only.
- **Focus:** visible focus ring on close button and interactive children.
- **Active:** action controls use existing pressed behavior.
- **Disabled:** applies to trigger and consumer actions when supplied.
- **Loading:** header remains visible; body uses `Skeleton` placeholders.
- **Empty:** body may render `EmptyState` when no data exists.
- **Filtered empty:** body may render an empty-result variant when filters remove all results.
- **Error:** body keeps the panel open and shows a recoverable inline error state.
- **Success:** preferred pattern is close the sheet and show success feedback outside; if the sheet remains open, keep success feedback non-blocking inside the body or footer.

## Accessibility behavior

- Built on `@radix-ui/react-dialog` semantics with modal focus trapping by default.
- `SheetTitle` maps to `aria-labelledby`; `SheetDescription` maps to `aria-describedby`.
- Close button must expose an accessible label (`Close panel` by default).
- `Escape` closes the sheet unless the consumer intentionally intercepts it for guarded flows.
- Overlay click closes the sheet by default unless the consumer intentionally blocks outside interaction.
- Focus moves into the sheet on open and returns to the trigger on close.
- Header/body/footer structure must stay keyboard navigable with no hidden focus targets.

## Responsive behavior

- Desktop: right and left sheets stay anchored to the viewport edge; bottom sheet stays attached to the bottom edge.
- Tablet: side sheets expand to full width for constrained layouts.
- Mobile: right, left, and bottom all become full-screen overlays to preserve usability.
- Motion should respect `prefers-reduced-motion`.

## Design tokens and styling rules

- Use semantic tokens only: `bg-card`, `text-card-foreground`, `border-border`, `text-muted-foreground`, `ring-ring`, `bg-background`, `bg-muted`, `bg-accent`, `bg-destructive`.
- Use existing web2 typography pairing:
  - title: `font-display`
  - body, metadata, form controls: `font-sans`
- Reuse existing radius and shadow conventions from `dialog.tsx`; do not introduce raw hex colors or a separate sheet-specific palette.

## Storybook requirements

Create `apps/web2/components/ui/sheet.stories.tsx` with at least these stories:

1. `DefaultRight`
2. `Left`
3. `Bottom`
4. `WithHeaderActions`
5. `FormLayout`
6. `Loading`
7. `Empty`
8. `Error`
9. `Success`
10. `LongScrollableContent`
11. `MobileFullscreen`
12. `DarkTheme`
