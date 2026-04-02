# Wireframe Spec: Web2 Card Variants

**Issue**: `CROWN-186`  
**Branch**: `feat/CROWN-186-card-variants`  
**Date**: 2026-04-02  
**Surface Type**: Reusable primitive components and Storybook/page previews in `apps/web2`

## 1. Purpose

Define the shared card pattern for web-v2 so dashboard and summary surfaces can reuse one consistent visual system for metric, informational, and interactive cards without rebuilding one-off page markup.

## 2. Layout Structure

### Approved Layout Pattern

- Pattern 1 — Standard Admin Page for the lightweight dashboard preview surface.
- Reusable card primitive rendered both in Storybook and in the `apps/web2/app/page.tsx` preview assembly.

### Structural Regions

1. **Card shell**
   - Rounded surface, subtle border, layered shadow, and semantic background token usage.
2. **Orientation content**
   - Optional eyebrow, title, supporting description, and optional icon/media accent.
3. **Primary data zone**
   - Large tabular number for metric cards or concise supporting content for informational cards.
4. **Action affordance**
   - Interactive cards show clear clickability, preserved text hierarchy, and a forward-action hint.

## 3. Action Hierarchy

- **Primary action**: Review key metrics or enter the next workflow from an interactive card.
- **Secondary actions**: Read contextual informational guidance in an info card.
- **Tertiary actions**: None inside the primitive itself.
- **Destructive actions**: Not in scope for these variants.

## 4. Required States

### Loading

- Metric cards must support a loading composition using `Skeleton` so dashboards can preserve layout before values resolve.

### Empty

- Info cards may communicate empty or no-data guidance through title/description copy without changing the card shell pattern.

### Filtered Empty

- Not required for the primitive itself.

### Error

- Info cards may be used to communicate an error or blocked state through iconography and copy while preserving the shared card shell.

### Success

- Metric cards may communicate healthy or positive posture through supporting text, not a separate visual pattern.

### Interactive States

- **Default**: Stable surface with visible title and supporting copy.
- **Hover**: Interactive cards elevate slightly and strengthen border/action emphasis.
- **Focus**: Interactive cards preserve a visible focus ring using shared ring tokens.
- **Active**: Interactive cards compress slightly to acknowledge press.
- **Disabled**: Interactive cards reduce opacity and suppress pointer interaction.

## 5. Accessibility Behavior

- Informational and metric cards remain semantic `div` containers.
- Interactive cards must support semantic `button` or `a` usage through composition.
- Interactive cards must preserve visible keyboard focus and an accessible name derived from their text content or explicit label.
- Decorative icons remain `aria-hidden`.
- Metric values should support `tabular-nums` for legible numeric scanning.

## 6. Responsive Behavior

- Cards stack as a single column on mobile, shift to two columns on tablet where appropriate, and support denser dashboard grids on desktop.
- Spacing and typography scale must remain within the approved web-v2 token range.
- Interactive cards must remain easy to tap on smaller viewports without reducing the hit area below the card shell.

## 7. Component Reuse

### Existing Components To Reuse

- `apps/web2/components/ui/button.tsx`
- `apps/web2/components/ui/skeleton.tsx`
- `apps/web2/app/globals.css`
- `apps/web2/lib/utils.ts`

### New Reusable Components

- `apps/web2/components/ui/card.tsx`
- `apps/web2/components/ui/card.stories.tsx`

## 8. Design Token Usage

- Use semantic surface and text tokens from `apps/web2/app/globals.css`: `background`, `card`, `foreground`, `muted`, `muted-foreground`, `border`, `primary`, and `ring`.
- Do not introduce raw color literals into the component styles.
- Keep the card family aligned to the web-v2 typography pairing: `Manrope` for titles and metrics, `Inter` for body copy and metadata.

## 9. File Expectations

- `specs/CROWN-186/wireframe.md`
- `apps/web2/components/ui/card.tsx`
- `apps/web2/components/ui/card.stories.tsx`
- `apps/web2/app/page.tsx`

## 10. Out Of Scope

- API integration or dashboard data fetching.
- A full feature-page rollout beyond the `apps/web2` preview surface.
- New dashboard-specific business logic components in `apps/web2/components/platform`.
