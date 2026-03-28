# Research: Initialize Storybook 8 In Apps/Web

## Decision: Use the Vite-based Next.js Storybook framework

- **Why**: Current official Storybook docs recommend the Next.js-with-Vite framework for Next.js apps because it provides faster builds and better testing support than the Webpack-based framework.
- **Impact**: `apps/web/.storybook/main.ts` should register the Vite-based Next.js framework, and dependency choices should follow that framework path instead of Jira’s older Webpack-era wording.

## Decision: Treat Jira package names as intent, not immutable implementation detail

- **Why**: Jira asks for `@storybook/nextjs` and `@storybook/test`, but current official Storybook testing guidance for Next.js depends on a Vite-based framework and the current supported testing path for that framework.
- **Impact**: Implementation should preserve Jira’s product intent: Storybook foundation + testing-ready setup. It should not preserve outdated package names when they conflict with current upstream guidance.

## Decision: Keep Storybook scoped to `apps/web`

- **Why**: The current story is specifically about initializing Storybook in `apps/web`, and the web package already owns the relevant Tailwind, alias, and UI configuration.
- **Impact**: Use `apps/web/.storybook/` and update only `apps/web/package.json`, not the repo root or other packages.

## Decision: Reuse existing Crown preview inputs

- **Why**: `apps/web/app/globals.css` already defines the shared font stack, tokens, and Tailwind-backed variables, while `PlatformThemeProvider` already provides the product theme context used by the app shell.
- **Impact**: `preview.ts` should import `app/globals.css` and wrap stories in `PlatformThemeProvider` through a Crown decorator instead of introducing a Storybook-only theme system.

## Decision: Seed Storybook with the existing `Button` primitive

- **Why**: `apps/web/components/ui/button.tsx` is already a reusable primitive, it matches the component-development policy, and it provides a low-risk starter story that future components can imitate.
- **Impact**: The first colocated story should live at `apps/web/components/ui/button.stories.tsx` and establish the local metadata/layout pattern for later stories.
