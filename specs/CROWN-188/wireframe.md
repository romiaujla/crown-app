# Wireframe Spec: General-Purpose Dialog Primitive

**Issue**: `CROWN-188`  
**Branch**: `feat/CROWN-188-dialog-general-purpose-component`  
**Date**: 2026-04-03  
**Surface Type**: Reusable primitive component and Storybook validation in `apps/web2`

## 1. Purpose

Define a shared dialog primitive for `apps/web2` so confirmation, alert, and general modal workflows use one consistent Radix/shadcn-based structure instead of recreating modal behavior per feature.

## 2. Layout Structure

### Approved Layout Pattern

- Primitive component preview rendered in Storybook.
- Dialog content follows one centered modal shell pattern with composable header, body, and footer slots.

### Structural Regions

1. **Overlay**
   - Full-screen dim layer that clearly separates modal work from background content.
2. **Dialog shell**
   - Rounded elevated surface with semantic border, shadow, and centered layout.
3. **Header**
   - Title and description establish orientation immediately.
   - Alert compositions may use a centered icon-first header with no additional nested panel when the decision can be explained with a title, subtitle, and buttons alone.
4. **Body**
   - Flexible content area for supporting copy, forms, loading state, or warning content.
   - Optional for alert compositions; do not default to a second nested card when the dialog can stay concise.
5. **Footer**
   - Action row with one dominant primary decision and secondary dismissal action.

## 3. Action Hierarchy

- **Primary action**: Complete the modal task or confirm the next step.
- **Secondary action**: Dismiss or cancel the dialog without losing orientation.
- **Tertiary action**: Optional close affordance in the top-right for non-destructive flows.
- **Destructive actions**: Only used when the dialog communicates high-consequence alert or confirmation behavior.

## 4. Required States

### Loading

- The primitive must support loading content and disabled footer actions without changing the dialog shell structure.

### Empty

- Not required for the primitive itself; consumers may present empty-state copy inside the body.

### Filtered Empty

- Not applicable.

### Error

- The primitive must support error/warning compositions through the `alert` variant and message content inside the body.

### Success

- Not a separate visual shell variant. Success feedback belongs to the consuming workflow after the dialog action completes.

### Interactive States

- **Default**: Neutral modal surface for general-purpose tasks.
- **Confirmation**: Action-oriented surface emphasizing the decision footer.
- **Alert**: Higher-risk surface using semantic destructive emphasis without relying on color alone.
  - Preferred Storybook reference: centered icon, title, description, and action row, with supporting body content added only when the decision requires more context.
- **Focus**: Keyboard focus must land on the first intended action or consumer-defined target.
- **Hover**: Footer actions rely on their underlying shared button states.
- **Disabled**: Footer actions may disable during async work while keeping the dialog readable.

## 5. Accessibility Behavior

- The primitive must be based on `@radix-ui/react-dialog`.
- Focus must be trapped while the dialog is open and returned to the trigger when it closes.
- `DialogTitle` and `DialogDescription` provide the accessible name and supporting description.
- Escape key and overlay dismissal remain available for standard dialogs unless the consumer intentionally constrains closing behavior.
- Confirmation and alert compositions must keep consequences understandable in text, not color alone.
- Close controls need accessible labels.

## 6. Responsive Behavior

- Dialog content uses a centered layout on desktop and preserves comfortable side margins on smaller screens.
- Footer actions stack vertically on mobile and align horizontally on larger screens.
- Content width remains constrained for readability and avoids full-screen takeover for standard modal use cases.

## 7. Component Reuse

### Existing Components To Reuse

- `apps/web2/components/ui/button.tsx`
- `apps/web2/app/globals.css`
- `apps/web2/lib/utils.ts`

### New Reusable Components

- `apps/web2/components/ui/dialog.tsx`
- `apps/web2/components/ui/dialog.stories.tsx`

## 8. Design Token Usage

- Use semantic tokens from `apps/web2/app/globals.css`: `background`, `card`, `foreground`, `muted`, `muted-foreground`, `border`, `primary`, `ring`, and `destructive`.
- Do not introduce raw hex values.
- Keep typography aligned to the web-v2 pairing: `Manrope` for titles and `Inter` for body copy and actions.

## 9. File Expectations

- `specs/CROWN-188/wireframe.md`
- `apps/web2/components/ui/dialog.tsx`
- `apps/web2/components/ui/dialog.stories.tsx`

## 10. Out Of Scope

- Reworking deprecated `apps/web` routes or components.
- New page-specific business logic or API integration.
- A separate alert-dialog primitive outside the shared `dialog.tsx` foundation.
