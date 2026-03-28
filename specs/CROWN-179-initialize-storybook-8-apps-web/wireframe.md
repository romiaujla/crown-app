# Wireframe Spec: Storybook 8 Foundation For Apps/Web

**Issue**: `CROWN-179`  
**Branch**: `feat/CROWN-179-initialize-storybook-8-apps-web`  
**Date**: 2026-03-28  
**Surface Type**: Developer tooling UI surface (`apps/web/.storybook` preview + manager experience)

## 1. Purpose

Define the expected Storybook surface for the `apps/web` component library foundation so implementation can wire configuration, preview styling, and the starter story without inventing new UI behavior later.

## 2. Layout Structure

### Approved Layout Pattern

- Storybook manager shell with left navigation tree, top toolbar, and center preview canvas.
- Story canvas should behave like a standard admin-surface preview rather than a custom full-screen microsite.

### Structural Regions

1. **Manager sidebar**
   - Shows the story hierarchy.
   - Initial expectation: a `UI/Button` entry for the starter story.
2. **Manager toolbar**
   - Uses Storybook defaults.
   - May expose addon controls supplied by the registered addon set.
3. **Preview canvas**
   - Renders stories inside a Crown-styled surface wrapper.
   - Applies `apps/web/app/globals.css` so typography, tokens, radius, and Tailwind classes match the app.
4. **Docs view**
   - Uses the same shared preview decorator and global styles as the canvas view.

## 3. Action Hierarchy

- **Primary action**: Select a story and review the rendered component state in the canvas.
- **Secondary actions**: Toggle addon panels, inspect controls, switch between Canvas and Docs.
- **Tertiary actions**: Use Storybook navigation and search to locate future stories.
- **Destructive actions**: None in scope for this foundation story.

## 4. Required States

### Loading

- Storybook boot/loading UI is provided by Storybook itself.
- Implementation responsibility: avoid extra blank-screen flashes caused by missing CSS or broken preview decorators.

### Empty

- Not applicable to the initial `Button` story because the sidebar should always contain at least one story once setup is complete.

### Filtered Empty

- Not applicable for the initial foundation surface.

### Error

- If preview setup fails, the expected failure mode is Storybook’s built-in error overlay rather than a custom Crown error screen.
- Configuration should minimize avoidable runtime errors caused by missing providers, missing CSS imports, or unresolved aliases.

### Success

- The `Button` story loads in Canvas view with Crown tokens, the shared font stack, and a stable light-theme preview baseline.

## 5. Accessibility Behavior

- Storybook navigation and toolbar accessibility are delegated to Storybook defaults.
- The preview decorator must not break keyboard focus visibility provided by the existing `Button` component styles.
- The starter story should preserve semantic button output and allow keyboard tab focus in the canvas.
- Any wrapper added by the preview decorator should remain semantically neutral and avoid unnecessary ARIA noise.

## 6. Responsive Behavior

- Default review target is desktop-width Storybook manager plus canvas.
- The starter story itself should remain visually coherent when the canvas viewport is resized to tablet and mobile widths through Storybook viewport tooling or browser resizing.
- The preview wrapper should avoid fixed widths that would distort component rendering at smaller viewports.

## 7. Component Reuse

### Existing Components To Reuse

- `apps/web/components/ui/button.tsx`
- `apps/web/components/platform/platform-theme-provider.tsx`
- `apps/web/app/globals.css`

### New Reusable Components

- None required for `CROWN-179`.
- This story creates configuration and a starter story, not a new product component.

## 8. Design Token Usage

- Use existing semantic tokens from `apps/web/app/globals.css`.
- The preview surface should inherit the current font stack and token definitions from the shared stylesheet.
- Do not introduce Storybook-only hardcoded colors to approximate Crown styling.

## 9. File Expectations

- `apps/web/.storybook/main.ts`
- `apps/web/.storybook/preview.ts`
- `apps/web/components/ui/button.stories.tsx`
- `apps/web/package.json`

## 10. Out Of Scope

- New reusable UI primitives beyond the starter `Button` story.
- Production route changes in `apps/web/app/*`.
- API work, OpenAPI changes, or backend contracts.
- Custom Storybook theming beyond the minimum Crown-aligned preview wrapper needed for accurate component rendering.
