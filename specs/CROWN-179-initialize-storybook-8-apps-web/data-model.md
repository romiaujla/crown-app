# Data Model: Initialize Storybook 8 In Apps/Web

## StorybookWorkspaceConfig

- **Purpose**: Represents the package-scoped Storybook foundation for `apps/web`.
- **Fields**:
  - `frameworkName`: Vite-based Next.js Storybook framework identifier
  - `storiesGlobs`: Story file discovery patterns for `apps/web`
  - `addons`: approved addon package list
  - `typescriptAliasSupport`: whether `@/*` imports resolve from `apps/web/tsconfig.json`
  - `staticBuildScript`: package script for producing a static Storybook build
- **Relationships**:
  - Consumes `PreviewDecoratorConfig`
  - Discovers one or more `ComponentStoryDefinition` records

## PreviewDecoratorConfig

- **Purpose**: Defines the shared Storybook preview wrapper that makes stories render like Crown surfaces.
- **Fields**:
  - `globalsCssImport`: path to `apps/web/app/globals.css`
  - `themeProviderModule`: path to `apps/web/components/platform/platform-theme-provider.tsx`
  - `defaultTheme`: stable preview theme value
  - `surfaceWrapperClassName`: optional wrapper styling hook for the canvas
- **Relationships**:
  - Applied to every `ComponentStoryDefinition`

## ComponentStoryDefinition

- **Purpose**: Represents one colocated story file for a reusable component.
- **Fields**:
  - `componentPath`: target reusable component file
  - `storyPath`: colocated `.stories.tsx` file path
  - `title`: Storybook sidebar grouping label
  - `defaultStoryName`: required baseline story export
  - `argCoverage`: initial control/args coverage for the starter example
- **Relationships**:
  - Loaded by `StorybookWorkspaceConfig`
  - Rendered through `PreviewDecoratorConfig`

## Validation Modes

- **Storybook dev validation**: confirms Storybook boots successfully for local development.
- **Static build validation**: confirms Storybook can build in CI-friendly mode.
- **Typecheck validation**: confirms new story/config files satisfy the package’s strict TypeScript rules.
