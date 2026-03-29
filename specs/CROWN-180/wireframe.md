# Wireframe Spec: Button Toggle Variant

**Issue**: `CROWN-180`  
**Branch**: `feat/CROWN-180-button-toggle-variant`  
**Date**: 2026-03-29  
**Surface Type**: Reusable primitive component (`apps/web/components/ui/button.tsx`)

## 1. Purpose

Define the required interaction and visual behavior for a shared toggle button variant so implementation extends the existing `Button` primitive without inventing a new component pattern.

## 2. Layout Structure

### Approved Layout Pattern

- Primitive component preview rendered in Storybook canvas.
- The toggle variant uses the existing `Button` shape, spacing, typography, and focus treatment.

### Structural Regions

1. **Control shell**
   - Reuses the existing button frame, border radius, size variants, and inline-flex alignment.
2. **Label content**
   - Supports standard button text content and existing icon usage patterns.
3. **State treatment**
   - Off state reads like an outline button.
   - On state reads like a filled primary button.

## 3. Action Hierarchy

- **Primary action**: Press the control to toggle a binary option on or off.
- **Secondary actions**: None within the primitive itself.
- **Tertiary actions**: None within the primitive itself.
- **Destructive actions**: Not applicable for this variant.

## 4. Required States

### Loading

- Not required for the base toggle variant unless a downstream surface composes a loading treatment around the button.

### Empty

- Not applicable. The primitive is an action control, not a data surface.

### Filtered Empty

- Not applicable.

### Error

- No component-specific error visual is required for the primitive. Validation or submission errors belong to the consuming surface.

### Success

- Success is represented by the pressed/on state, which uses a filled treatment to confirm selection.

### Interactive States

- **Default/off**: outlined surface with standard text color.
- **Pressed/on**: filled primary surface with primary-foreground text.
- **Hover**: off state darkens toward the accent surface; on state darkens within the primary scale.
- **Focus**: existing keyboard focus ring remains visible.
- **Active**: pressed feedback slightly deepens the current background.
- **Disabled**: uses the existing disabled opacity and pointer-event lockout.

## 5. Accessibility Behavior

- The control must remain a semantic `button`.
- Consumers must be able to pass `aria-pressed={true | false}` to express the current toggle state.
- The visual treatment must stay aligned with the `aria-pressed` state.
- Keyboard focus must remain visible through the existing `focus-visible` ring treatment.
- The control must support text labels or an explicit accessible name when rendered icon-only.

## 6. Responsive Behavior

- The variant inherits the current `Button` size system and must remain usable across the existing `default`, `sm`, `lg`, and `icon` sizes.
- No breakpoint-specific layout changes are required because the component is intrinsically responsive.

## 7. Component Reuse

### Existing Components To Reuse

- `apps/web/components/ui/button.tsx`
- `apps/web/components/ui/button.stories.tsx`

### New Reusable Components

- None. This work extends the existing primitive and does not create a new component file.

## 8. Design Token Usage

- Reuse the existing semantic button tokens: `primary`, `primary-foreground`, `background`, `foreground`, `border`, `input`, and `accent`.
- Do not introduce raw hex values or a new button pattern.

## 9. File Expectations

- `apps/web/components/ui/button.tsx`
- `apps/web/components/ui/button.stories.tsx`
- `specs/CROWN-180/wireframe.md`

## 10. Out Of Scope

- Page-level toggle business logic or API integration.
- A separate toggle-group component.
- New page assemblies in `apps/web/app/*`.
- Changes to `apps/web2/*`.
