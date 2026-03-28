# Quickstart: Initialize Storybook 8 In Apps/Web

## Goal

Validate that the `apps/web` Storybook foundation works locally after implementation.

## Preconditions

- Dependencies are installed from the repo root with `pnpm install`
- The active branch is `feat/CROWN-179-initialize-storybook-8-apps-web`

## Run Storybook

From the repository root:

```bash
pnpm --filter @crown/web run storybook
```

Expected result:

- Storybook starts successfully for `apps/web`
- The sidebar includes a `UI/Button` story entry
- The preview canvas uses Crown styling from `apps/web/app/globals.css`

## Build Storybook

From the repository root:

```bash
pnpm --filter @crown/web run storybook:build
```

Expected result:

- The static Storybook build completes without framework, alias, or CSS import failures

## Validate Type Safety

From the repository root:

```bash
pnpm --filter @crown/web run typecheck
```

Expected result:

- Storybook config and story files pass strict TypeScript checks for the web package
