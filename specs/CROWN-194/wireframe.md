# CROWN-194 Wireframe Spec

## Surface

- Reusable UI primitive: `apps/web/components/ui/avatar.tsx`
- Initial consumer: authenticated sidebar profile entry in `apps/web/components/auth/workspace-shell.tsx`
- Primary user: platform and tenant operators who need a compact identity marker in dense shell and table/card contexts

## Layout Pattern

- Primitive component, designed to slot into the existing Standard Admin Page shell without changing surrounding page structure
- Circular visual treatment only
- Content hierarchy inside the circle:
  - Preferred: image fill when `imageSrc` is provided
  - Fallback: derived initials from the provided `name`

## Action Hierarchy

- The avatar itself is presentational in this story and does not introduce standalone actions
- Parent surfaces remain responsible for primary and secondary actions
- When embedded in an interactive parent, the parent must own the accessible button/link label

## Required States

- Default: renders derived initials in a circular treatment
- Image: renders supplied image inside the same circular frame
- Empty name fallback: renders stable fallback initials when `name` is blank or missing
- Size variants: `sm`, `md`, `lg`
- Decorative usage: supports `aria-hidden` when the parent already exposes the accessible label

## Accessibility

- Non-decorative fallback avatars expose `role="img"` with an `aria-label`
- Decorative usage must be supported through `aria-hidden`
- Initials text should be marked `aria-hidden` when an accessible label is present on the wrapper
- Images should use meaningful alt text unless the avatar is decorative

## Responsive Behavior

- Avatar remains square and circular at all breakpoints
- `sm`, `md`, and `lg` sizes must maintain legibility in compact navigation, rows, and summary cards
- The existing workspace shell keeps control of breakpoint-specific sizing overrides where required

## Component Reuse

- New reusable primitive: `Avatar`
- Existing consumer to refactor: `WorkspaceShell` sidebar profile trigger
- No reusable avatar markup should remain inline in page or shell files after extraction

## Design Tokens

- Use semantic tokens and approved utility classes instead of raw one-off colors in the primitive
- Allow consuming surfaces to layer stronger shell-specific styling through `className`
