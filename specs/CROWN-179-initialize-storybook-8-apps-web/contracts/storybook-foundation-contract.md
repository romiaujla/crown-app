# Storybook Foundation Contract

## Scope

This contract defines the minimum implementation surface required for `CROWN-179`.

## Required Files

- `apps/web/.storybook/main.ts`
- `apps/web/.storybook/preview.ts`
- `apps/web/components/ui/button.stories.tsx`

## Required Package-Level Behavior

- `apps/web/package.json` exposes a `storybook` script for local development.
- `apps/web/package.json` exposes a `storybook:build` script for static output validation.
- The selected Storybook framework is compatible with current official Storybook guidance for Next.js testing support.

## Preview Contract

- `preview.ts` imports `apps/web/app/globals.css`.
- The preview decorator wraps stories with the existing Crown `PlatformThemeProvider`.
- The default preview theme is stable and deterministic.
- Stories render with Crown tokens and font styling instead of unstyled Storybook defaults.

## Story Contract

- The starter story documents the existing `Button` primitive in `apps/web/components/ui/button.tsx`.
- The story is colocated with the component as `button.stories.tsx`.
- The story exposes a sane baseline example that future reusable component stories can follow.

## Non-Goals

- No production route changes in `apps/web/app/*`
- No API or OpenAPI changes
- No new reusable UI component beyond the starter story
