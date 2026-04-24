# CROWN-196 FormField Wireframe

## Overview

`FormField` is a reusable `apps/web2` wrapper for single-control form rows. It standardizes the label row, required indicator, optional character count, helper text, and error text around a caller-provided `input`, `select`, `textarea`, or future web2 form control.

This component has no primary or secondary actions. Submit, cancel, step navigation, and form-level validation summaries stay with the parent surface.

## Layout Structure

- Pattern: Form page field row inside the existing Crown single-column form stack
- Root wrapper: full-width vertical stack with `space-y-2`
- Label row:
  - left: field label
  - inline required indicator when needed
  - right: optional character count
- Control row:
  - caller-provided control slot
  - control-specific adornments remain inside the child control markup
- Message row:
  - error text first when present
  - helper/supporting text below error when present

## Action Hierarchy

- Primary action: none inside the component
- Secondary action: none inside the component
- Tertiary/destructive action: none inside the component
- The component exists only to support the parent form's action hierarchy with consistent field presentation

## Required States

### Default

- Label uses `text-sm font-medium text-foreground`
- Character count and helper text use `text-xs text-muted-foreground`
- Child control remains the main interactive surface

### Disabled

- Label, helper text, and character count shift to muted styling
- Child control owns disabled behavior

### Loading

- Render a skeleton stack matching label, control, and support text rhythm
- Preserve layout height to avoid shift during async loading

### Error

- Error text renders directly below the control in `text-xs text-destructive`
- Helper text remains visible below the error when both are present
- Parent control should reflect the invalid state visually

### Success

- No wrapper-specific success chrome
- Parent may pass success-oriented supporting text through the helper slot

### Hover / Focus / Active

- Wrapper does not add independent interaction states
- Child control owns hover, focus-visible ring, and active behavior

### Empty / Filtered Empty

- Not applicable for a single field wrapper

## Accessibility Behavior

- The label must be programmatically associated to the control using a shared control id
- Required fields show a visible asterisk and screen-reader-friendly required context
- Helper and error text need stable ids so the child control can reference them with `aria-describedby`
- Error state should set `aria-invalid` on the child control
- The wrapper must not capture focus; keyboard interaction remains on the control
- Character count is informational text and should not create noisy live announcements

## Responsive Behavior

- Desktop/tablet: keep label and character count on one row
- Mobile: allow the label row to wrap so the character count can fall below without truncating the label
- The component stays inline with the form layout and does not introduce cards, drawers, or multi-column behavior

## Component Reuse

- Use for text, slug, select, and textarea-style fields that need consistent metadata treatment
- Do not use for checkbox rows, switch rows, multi-control groups, or form-level summaries
- The deprecated inline pattern in `apps/web/components/platform/tenant-create-step-tenant-info.tsx` is the visual reference to replace conceptually
- `apps/web` is deprecated; new work lands only in `apps/web2`

## Design Token Usage

- Label/body copy uses the existing body typography stack (`Inter`) from `apps/web2/app/globals.css`
- Use semantic tokens only:
  - label: `text-foreground`
  - helper/count: `text-muted-foreground`
  - error: `text-destructive`
  - control styling stays with the child control using existing border/input/ring tokens
- Do not introduce raw color literals

## Storybook Coverage

- Default
- Required
- With helper text
- With error
- With character count
- Disabled
- Loading
- With select control
- With stacked supporting text

## Scope Note

There is no `apps/web2` tenant-create step on `main` yet. This story should deliver the reusable primitive and Storybook coverage now, while using the deprecated tenant-create step only as the reference pattern for future `apps/web2` integration.
