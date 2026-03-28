# Feature Specification: Initialize Storybook 8 In Apps/Web

**Feature Branch**: `feat/CROWN-179-initialize-storybook-8-apps-web`  
**Created**: 2026-03-28  
**Status**: Draft  
**Input**: Jira issue `CROWN-179` - "UI | Initialize Storybook 8 in apps/web"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Launch a Working Storybook Workspace (Priority: P1)

As a frontend engineer, I want `apps/web` to expose a working Storybook 8 workspace so that I can preview Crown UI components in isolation without booting the full Next.js application.

**Why this priority**: This is the foundational Jira deliverable. Without a runnable Storybook workspace, the repository cannot enforce the new component-development workflow that requires Storybook-first reusable UI work.

**Independent Test**: Run the Storybook dev script for `apps/web` and confirm the workspace loads successfully with Crown styles applied and no missing-framework or missing-style boot errors.

**Acceptance Scenarios**:

1. **Given** a contributor is in the repository root, **When** they run the Storybook script for `apps/web`, **Then** Storybook 8 starts using the Next.js framework without requiring manual configuration edits.
2. **Given** Storybook is rendering a story, **When** the preview loads, **Then** the shared `apps/web/app/globals.css` styles are applied so Tailwind classes and Crown tokens render consistently with the app.
3. **Given** the web package uses strict TypeScript path aliases, **When** Storybook resolves component imports, **Then** stories can import existing `@/components/*` and `@/lib/*` modules without path-resolution failures.

---

### User Story 2 - Reuse Crown Theme Context In Preview (Priority: P2)

As a frontend engineer, I want Storybook preview rendering to include Crown’s theme context so that reusable components can be reviewed in a representative light/dark platform environment rather than an unthemed sandbox.

**Why this priority**: Jira explicitly calls for a Crown theme decorator. If the decorator is missing or inaccurate, component screenshots and review feedback will drift away from the real product shell.

**Independent Test**: Open the starter button story in Storybook and verify it renders inside the shared Crown preview wrapper with the expected font, spacing tokens, and platform theme context available.

**Acceptance Scenarios**:

1. **Given** a component depends on the platform theme provider, **When** it renders in Storybook, **Then** it receives the same provider contract used by `apps/web/app/layout.tsx`.
2. **Given** Storybook loads a story canvas, **When** the preview wrapper mounts, **Then** the rendered surface uses Crown’s global font and token styles instead of Storybook defaults.
3. **Given** future stories need a predictable default theme, **When** they render without extra setup, **Then** the preview decorator initializes them in a stable light-theme baseline that matches the current app bootstrap behavior.

---

### User Story 3 - Use a Starter Story As the Team Reference (Priority: P3)

As a frontend engineer, I want an initial `Button` story checked into the repository so that future reusable components have a local example for file placement, metadata structure, and state-story expectations.

**Why this priority**: The starter story is the seed example that makes Storybook adoption practical. Without it, contributors still have to infer naming, import, and story-authoring conventions.

**Independent Test**: Open the `Button` story in Storybook and confirm it appears under the UI component hierarchy with at least the default component rendering and the expected control metadata.

**Acceptance Scenarios**:

1. **Given** a contributor inspects the repository after Storybook setup, **When** they open `apps/web/components/ui/button.stories.tsx`, **Then** they find a working example colocated with the reusable component it documents.
2. **Given** the starter story is loaded in Storybook, **When** a reviewer inspects the sidebar and canvas, **Then** the story is grouped under a sensible UI title and renders the existing `Button` component successfully.
3. **Given** the component-development workflow requires Storybook-first reusable components, **When** a contributor adds a new reusable UI component later, **Then** the starter story provides the repository-local pattern to follow.

### Edge Cases

- Storybook must coexist with Next.js 14 app-router code and should not require changing the production application bootstrap in `apps/web/app/layout.tsx`.
- Preview configuration must not break components that reference `window`, `document`, or the `PlatformThemeProvider` during client-side rendering.
- Tailwind and shared CSS-variable tokens from `apps/web/app/globals.css` must load in Storybook without introducing duplicate or conflicting styling sources.
- The starter story should use an existing reusable component and must not create a second button implementation just to satisfy the example requirement.
- No API contract or OpenAPI updates are required for this story because the scope is limited to frontend tooling and documentation support for component development.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The repository MUST add Storybook 8 dependencies needed for `apps/web` to run with the Next.js framework and the essentials, interactions, test, and accessibility addons called for by Jira.
- **FR-002**: The implementation MUST create a `.storybook/main.ts` configuration that targets `apps/web`, registers the Next.js Storybook framework, and includes the approved addon set.
- **FR-003**: The implementation MUST create a `.storybook/preview.ts` configuration that imports `apps/web/app/globals.css` for Storybook previews.
- **FR-004**: The Storybook preview configuration MUST provide a Crown preview decorator that wraps stories with the same platform theme context used by the web application.
- **FR-005**: The Storybook preview baseline MUST default to a stable light-theme rendering that matches the current `apps/web` bootstrap behavior unless a story explicitly opts into another theme.
- **FR-006**: `apps/web/package.json` MUST expose runnable Storybook development and static-build scripts for local use and CI validation.
- **FR-007**: The implementation MUST add a starter story at `apps/web/components/ui/button.stories.tsx` that documents the existing reusable `Button` component.
- **FR-008**: The starter story MUST establish the repository-local story placement and metadata pattern for future reusable UI components.
- **FR-009**: Storybook configuration MUST preserve the existing `@/*` path alias usage so stories can import current `apps/web` modules without relative-path rewrites.
- **FR-010**: The setup MUST stay scoped to frontend tooling and reusable-component documentation support for `apps/web`; it MUST NOT widen into unrelated page redesign or production route behavior changes.
- **FR-011**: The implementation MUST remain aligned with `docs/process/component-development.md` so future reusable components can be delivered with colocated stories before page integration.
- **FR-012**: The implementation MUST remain aligned with `docs/process/ui-guidlines.md` and reuse the existing Crown design tokens and UI primitives rather than introducing a separate Storybook-only visual system.

### Key Entities _(include if feature involves data)_

- **Storybook Workspace**: The local `apps/web` component-preview environment, including the `.storybook` configuration, scripts, framework settings, and addon registration.
- **Preview Decorator**: The shared Storybook wrapper responsible for importing Crown global styles and providing the platform theme context around each story.
- **Starter Button Story**: The initial colocated Storybook file that documents the existing reusable `Button` component and establishes file-placement and metadata conventions.

### Assumptions

- Storybook configuration will live inside `apps/web/.storybook/` so the workspace remains package-scoped instead of introducing a root-level Storybook for the whole monorepo.
- The existing `PlatformThemeProvider` is the correct reusable theme wrapper for Storybook previews because it is already the app-level source of truth for platform theming.
- The initial story can stay focused on the existing `Button` primitive and does not need to cover every visual state in this foundation story as long as it becomes the template for future story expansion.
- Because this story is tooling-focused, no API contract, Prisma, or OpenAPI artifacts are required beyond noting that no API changes are in scope.

### Dependencies

- `apps/web/package.json` for package-scoped scripts and dependencies.
- `apps/web/app/globals.css` for Crown token, font, and Tailwind baseline styling.
- `apps/web/components/ui/button.tsx` as the starter reusable component for Storybook documentation.
- `apps/web/components/platform/platform-theme-provider.tsx` for preview-level theme context reuse.
- `docs/process/component-development.md` and `docs/process/development-workflow.md` for Storybook-first reusable-component policy alignment.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Contributors can start Storybook for `apps/web` with a single package script and reach a working preview workspace without manual configuration edits.
- **SC-002**: The starter `Button` story renders with Crown global styles and theme context applied, with no missing-import or alias-resolution failures.
- **SC-003**: Reviewers can identify the repository-standard location and metadata pattern for future reusable component stories by opening `apps/web/components/ui/button.stories.tsx`.
- **SC-004**: The Storybook setup remains scoped to `apps/web` and does not require production route or API behavior changes to operate.
