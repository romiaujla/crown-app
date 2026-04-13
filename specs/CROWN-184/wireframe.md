# CROWN-184 Wireframe Spec: Breadcrumbs / Eyebrow Component

## Surface

Reusable `apps/web2` UI primitive for deep-route positional navigation in dashboard and admin pages.

## Layout Structure

- Desktop and larger tablet: inline breadcrumb trail above the page title or inside the approved page header context.
- Mobile: optional single-line parent navigation fallback before the page title, rendered as `Back to parent` when a parent route exists.
- Current page: final segment is rendered as non-interactive text with `aria-current="page"`.

Approved pattern: Standard Admin Page header orientation from `docs/process/ui-guidlines.md`.

## Action Hierarchy

- Primary: none; this component provides orientation only.
- Secondary: parent navigation link on mobile.
- Tertiary: ancestor breadcrumb links on desktop.
- Destructive: not applicable.

## Required States

- Default: desktop breadcrumb trail with ancestor links and non-interactive current page.
- Hover: ancestor links receive semantic hover color.
- Focus: ancestor links use visible focus ring.
- Disabled: current page is non-interactive through `aria-disabled` and `aria-current`.
- Loading: not applicable; callers should render skeletons around the page header if route context is loading.
- Empty: no breadcrumb is rendered when no segments or pathname are available.
- Error: not applicable; route parsing has no remote failure mode.
- Success: not applicable.

## Accessibility Behavior

- Wrap the trail in `nav` with `aria-label="Breadcrumb"`.
- Use an ordered list for desktop breadcrumbs.
- Mark separators as presentation only.
- Ensure mobile parent link has an explicit label and keyboard focus state.
- Do not rely on color alone to communicate the current page; use `aria-current`.

## Responsive Behavior

- `sm` and above: show full breadcrumb trail.
- Below `sm`: collapse to the nearest parent link when available.
- If no parent link exists, show the current page label on mobile as non-interactive context.

## Component Reuse

- Reuse the shadcn Breadcrumb primitive surface in `apps/web2/components/ui/breadcrumb.tsx`.
- Add a reusable `CrownBreadcrumb` wrapper in the same file to accept explicit route segments or derive segments from a pathname string.
- Do not add component work to deprecated `apps/web`.

## Design Tokens

- Use semantic shadcn/Tailwind tokens: `text-muted-foreground`, `text-foreground`, `hover:text-foreground`, `focus-visible:ring-ring`, and `focus-visible:ring-offset-background`.
- Do not introduce raw color values.
