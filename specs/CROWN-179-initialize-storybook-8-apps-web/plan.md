# Implementation Plan: Initialize Storybook 8 In Apps/Web

**Branch**: `feat/CROWN-179-initialize-storybook-8-apps-web` | **Date**: 2026-03-28 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-179-initialize-storybook-8-apps-web/spec.md)
**Input**: Feature specification from `/specs/CROWN-179-initialize-storybook-8-apps-web/spec.md`

## Summary

Initialize a package-scoped Storybook 8 workspace inside `apps/web` using the current recommended Next.js-with-Vite framework so Crown’s reusable components can be previewed, documented, and tested in isolation. The plan adds Storybook config, package scripts and dependencies, a Crown preview decorator that reuses global styles and the existing `PlatformThemeProvider`, and a starter `Button` story colocated with the current UI primitive. Testing support will follow the current Vite-compatible Storybook path instead of the older Jira package wording.

## Technical Context

**Language/Version**: TypeScript 5.x in a Next.js 14 / React 18 monorepo  
**Primary Dependencies**: Storybook 8, Vite-based Next.js Storybook framework, Storybook essentials/interactions/a11y addons, current Storybook-supported test integration, existing `PlatformThemeProvider` and shadcn-style UI primitives  
**Storage**: N/A  
**Testing**: `pnpm --filter @crown/web typecheck`, Storybook startup validation, Storybook static build validation, repository hooks, and follow-up story testing support via the Vite-compatible Storybook test path  
**Target Platform**: `apps/web` developer tooling workspace for local development and CI  
**Project Type**: Monorepo web application tooling and component-doc setup  
**Performance Goals**: Storybook should start and build successfully in `apps/web` without requiring full-app bootstrapping, and future component stories should inherit fast Vite-based feedback loops  
**Constraints**: Stay package-scoped to `apps/web`, preserve Next.js alias resolution, reuse Crown styling and theme context, avoid production route changes, align with current Storybook docs rather than outdated package guidance when they conflict  
**Scale/Scope**: One web package Storybook foundation, one starter story, and supporting Spec Kit artifacts for `CROWN-179`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Jira traceability and branch policy: PASS. `CROWN-179` is a Story and the active branch follows `feat/CROWN-<id>-<slug>`.
- Planning gate: PASS. `spec.md` and `wireframe.md` exist before implementation planning continues.
- Scope discipline: PASS. Work is limited to `apps/web` Storybook setup plus `CROWN-179` planning artifacts.
- Testing discipline: PASS. The plan includes startup/build validation and preserves a valid path for story-based testing support.
- UI workflow alignment: PASS. The plan references the required wireframe and explicitly identifies reused versus new components/config artifacts.
- Policy precedence: PASS. No API, branch, or release metadata rules are being bypassed, and no alternate workflow rules are introduced.

Post-design re-check: PASS. The chosen Vite-based framework resolves the earlier framework/test-support conflict while staying within Jira’s intent and repository policy.

## Research Notes

- Storybook’s current official guidance recommends the Next.js-with-Vite framework for developing and testing UI components in isolation, citing faster builds and better testing support.
- Storybook’s in-UI test addon support depends on a Vite-based framework; this makes the Vite path the only plan that cleanly satisfies the “testing support is valid” clarification.
- `apps/web` already has the baseline inputs Storybook needs: strict TypeScript, path aliases in `tsconfig.json`, Tailwind config, shared CSS variables in `app/globals.css`, and a reusable `Button` primitive.
- `apps/web/components/platform/platform-theme-provider.tsx` is the correct preview-level provider to reuse because it already owns the platform light/dark theme contract used by the app shell.
- No new reusable product component is needed for this story; the only new reusable artifact is a Storybook story file colocated with the existing `Button` component.

## Component Reuse Inventory

### Reused Existing Components / Modules

- `apps/web/components/ui/button.tsx`
- `apps/web/components/platform/platform-theme-provider.tsx`
- `apps/web/app/globals.css`
- `apps/web/lib/utils.ts`
- `apps/web/tailwind.config.ts`
- `apps/web/tsconfig.json`

### New Artifacts

- `apps/web/.storybook/main.ts`
- `apps/web/.storybook/preview.ts`
- `apps/web/components/ui/button.stories.tsx`
- `apps/web/package.json` Storybook scripts/dependencies updates

### New Reusable Components

- None. This story introduces Storybook infrastructure and one starter story only.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-179-initialize-storybook-8-apps-web/
├── spec.md
├── wireframe.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── storybook-foundation-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
└── web/
    ├── .storybook/
    │   ├── main.ts
    │   └── preview.ts
    ├── app/
    │   ├── globals.css
    │   └── layout.tsx
    ├── components/
    │   ├── platform/
    │   │   └── platform-theme-provider.tsx
    │   └── ui/
    │       ├── button.tsx
    │       └── button.stories.tsx
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json
```

**Structure Decision**: Keep all implementation package-scoped within `apps/web`. Storybook config lives under `apps/web/.storybook`, the starter story is colocated with the reusable `Button` primitive, and no root-level Storybook workspace is introduced.

## Complexity Tracking

No constitution violations are expected for `CROWN-179`.
