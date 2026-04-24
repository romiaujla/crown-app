# CROWN-197 — Right-side drawer wireframe

## Target surface

Create a reusable primitive at `apps/web2/components/ui/drawer.tsx` that behaves as a right-side drawer. It should open when a trigger button is clicked, stay pinned to the right edge of the viewport, fill the full viewport height, and keep inner content scrollable. This is for contextual detail/edit workflows that should not navigate away from the current page.

## Layout structure

**Pattern:** trigger + overlay + right-side drawer

```text
Drawer
└─ DrawerTrigger
└─ DrawerPortal
   ├─ DrawerOverlay
   └─ DrawerContent
      ├─ DrawerHeader
      │  ├─ DrawerHeaderIcon (optional)
      │  ├─ DrawerTitle
      │  ├─ DrawerDescription
      │  └─ DrawerClose
      ├─ DrawerBody (scrollable)
      └─ DrawerFooter (optional consumer actions)
```

## Drawer behavior

- The drawer opens from the **right** side only.
- The drawer should **slide in from the right viewport edge** when the trigger button is clicked.
- The drawer fills the full viewport height (`h-screen`).
- The drawer width is **adjustable** via a public prop.
- Initial/default width is **`35vw`**.
- The outer drawer container stays fixed; only the body content scrolls.

## Action hierarchy

- **Primary actions:** consumer-provided footer CTA.
- **Secondary actions:** cancel/supporting CTA in the footer.
- **Tertiary action:** icon-only close button in the header.
- **Optional context affordance:** icon + heading composition in the header for settings, alerts, or contextual detail drawers.
- **Destructive actions:** only through consumer-provided buttons using existing destructive button styles.

## Component reuse

Reuse the existing web2 patterns instead of introducing a new visual language:

- `apps/web2/components/ui/dialog.tsx` for Radix dialog composition, overlay treatment, focus handling, and close affordance patterns.
- `apps/web2/components/ui/button.tsx` for trigger, header, and footer actions.
- `apps/web2/components/ui/skeleton.tsx` for loading states.
- `apps/web2/components/ui/empty-state.tsx` and `apps/web2/components/ui/empty.tsx` for empty and recovery states.
- `apps/web2/app/globals.css` and `apps/web2/tailwind.config.ts` for semantic tokens, typography, and spacing.

## Required states

- **Default:** closed until the trigger button opens the drawer.
- **Open:** right-side drawer visible with fixed chrome and scrollable body.
- **Hover:** applies to the close button and consumer action controls only.
- **Focus:** visible focus ring on the close button and interactive children.
- **Disabled:** applies to trigger and consumer actions when supplied.
- **Loading:** header remains visible; body uses `Skeleton` placeholders.
- **Empty:** body may render `EmptyState` when no data exists.
- **Error:** body keeps the drawer open and shows a recoverable inline error state.
- **Success:** drawer may stay open with non-blocking success feedback or close after save.

## Accessibility behavior

- Built on `@radix-ui/react-dialog` semantics with modal focus trapping by default.
- `DrawerTitle` maps to `aria-labelledby`; `DrawerDescription` maps to `aria-describedby`.
- Optional header icons are decorative by default and should be `aria-hidden` unless they communicate meaningful status text elsewhere.
- Close button must expose an accessible label (`Close panel` by default).
- `Escape` closes the drawer unless the consumer intentionally intercepts it.
- Overlay click closes the drawer by default unless the consumer intentionally blocks outside interaction.
- Focus moves into the drawer on open and returns to the trigger on close.

## Design tokens and styling rules

- Use semantic tokens only: `bg-card`, `text-card-foreground`, `border-border`, `text-muted-foreground`, `ring-ring`, `bg-background`, `bg-muted`, `bg-accent`, `bg-destructive`.
- Use existing web2 typography pairing:
  - title: `font-display`
  - body, metadata, form controls: `font-sans`
- Reuse existing shadow and focus conventions from `dialog.tsx`.

## Storybook requirements

Create `apps/web2/components/ui/drawer.stories.tsx` with stories that cover:

1. Trigger-driven right drawer open behavior
2. Right-edge slide-in motion
3. Adjustable width
4. Header icon composition
5. Header actions
6. Form layout
7. Loading
8. Empty
9. Error
10. Success
11. Long scrollable content
12. Dark theme
