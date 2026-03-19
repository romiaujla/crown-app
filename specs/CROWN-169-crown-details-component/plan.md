# Implementation Plan: CrownDetailsComponent Generic Details Primitive

**Branch**: `feat/CROWN-169-crown-details-component` | **Date**: 2026-03-19 | **Spec**: `specs/CROWN-169-crown-details-component/spec.md`
**Input**: Feature specification from `specs/CROWN-169-crown-details-component/spec.md`

## Summary

Implement a shared `CrownDetailsComponent` in `apps/web` that renders config-driven detail fields with a consistent header, responsive grid, dense mode, empty state handling, and a primary-plus-overflow action system. Adopt the component on the existing platform tenant-details entry route so the story ships with a concrete in-app usage instead of an unused primitive.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20
**Primary Dependencies**: Next.js 14 App Router, React 18, Tailwind CSS, `lucide-react`, Radix Popover, existing `Button`, `Card`, `Popover`, and `cn` helper
**Storage**: No new persistence
**Testing**: `pnpm --filter @crown/web typecheck`, `pnpm --filter @crown/web test -- tests/smoke.spec.ts`
**Target Platform**: Web frontend (`apps/web`) across desktop, tablet, and mobile widths
**Project Type**: Shared UI primitive plus one route-level consumer
**Performance Goals**: Purely presentational field rendering with minimal client interactivity limited to the overflow menu
**Constraints**: Remain inside Jira scope; no API/backend work; keep UI aligned with the repository guidelines; maintain accessible action controls
**Scale/Scope**: One new shared component, one route adoption, one focused browser test update

## Constitution Check

- Jira traceability and branch policy: **PASS**. `CROWN-169` is a Story; branch follows `feat/CROWN-<id>-<slug>`.
- Planning gate: **PASS**. `/specify` artifact (`spec.md`) completed before `/plan`.
- Scope discipline: **PASS**. Work is limited to `apps/web` shared UI, one in-scope platform route, Playwright coverage, and Spec Kit artifacts.
- API/OpenAPI discipline: **PASS**. No API route or contract changes are planned.
- Testing discipline: **PASS**. Plan includes web typecheck and focused Playwright coverage for the adopted route.
- Governance consistency: **PASS**. Implementation will reuse existing shared primitives and preserve Crown UI hierarchy rules.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-169-crown-details-component/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── components/
│   └── ui/
│       └── crown-details-component.tsx    ← NEW: shared details primitive
├── app/
│   └── platform/
│       └── tenants/
│           └── [slug]/
│               └── page.tsx               ← UPDATE: adopt shared details component
└── tests/
    └── smoke.spec.ts                      ← UPDATE: add tenant-details route assertion
```

## Implementation Phases

### Phase 1 - Shared Component API And Layout Shell

Create `apps/web/components/ui/crown-details-component.tsx` with the typed public API and structural rendering:

1. Define shared prop and config types for fields, actions, density, and column configuration.
2. Normalize defaults for `desktopCol`, `tabletCol`, `mobileCol`, header visibility, and action visibility.
3. Render the outer container using existing Crown card/surface styling consistent with detail-page width guidance.
4. Render the header with required title, optional subheading, and right-aligned action slot.
5. Filter out undisplayable fields before empty-state evaluation.

**Validation checkpoint**: TypeScript compiles and a no-actions/no-fields render path is supported.

### Phase 2 - Field Grid, Dense Mode, And Empty State

Implement the details body behavior:

1. Render standard mode as stacked label-over-value field cells.
2. Render dense mode as inline `label: value` rows with reduced vertical spacing.
3. Apply CSS grid styles driven by `desktopCol`, `tabletCol`, and `mobileCol`.
4. Keep rows left-aligned and allow horizontal overflow when content or configuration requires it.
5. Render `No data available` when no displayable fields remain.

**Validation checkpoint**: Populated, dense, and empty configurations all render correctly.

### Phase 3 - Header Action Promotion And Overflow Menu

Add the interactive action behavior:

1. Determine the visible primary action by scanning for the first non-destructive action.
2. Keep destructive actions in the overflow menu by default.
3. Render an icon-only overflow trigger when secondary actions remain after primary promotion.
4. Use the existing Radix-backed `Popover` primitive for the overflow menu and close it on outside click or action selection.
5. Preserve keyboard access and focus styling for both the primary action and the overflow list.

**Validation checkpoint**: Single-action, multi-action, and all-destructive action sets behave per spec.

### Phase 4 - Adopt On Platform Tenant-Details Entry Route

Replace the placeholder tenant-details card in `apps/web/app/platform/tenants/[slug]/page.tsx` with the shared component:

1. Map the route slug into a small placeholder details dataset that stays within story scope.
2. Add a simple title/subheading aligned with the existing platform shell framing.
3. Include at least one visible action and one overflow-only action to exercise the shared behavior in-app.
4. Keep the route explicitly framed as an entry-point placeholder until backend-backed tenant details exist.

**Validation checkpoint**: The route demonstrates the component without implying backend functionality that does not yet exist.

### Phase 5 - Focused Validation

1. Update `apps/web/tests/smoke.spec.ts` with a tenant-details route assertion or equivalent focused browser check.
2. Run `pnpm --filter @crown/web typecheck`.
3. Run `pnpm --filter @crown/web test -- tests/smoke.spec.ts`.

## Implementation Notes

- Keep reusable finite value sets as named enums when they become shared exported contracts.
- Prefer a small, presentation-oriented API; consumers should pass already-derived display values or use a local formatter.
- Avoid creating a new dropdown-menu abstraction for this story; the existing `Popover` primitive is enough for the scoped overflow interaction.
- Preserve the route’s current “future workflow” messaging so this adoption does not overstate backend completeness.

## Complexity Tracking

No constitution violations are expected. The only meaningful risk is designing an API that is too domain-specific; the plan keeps the component generic and validates that by adopting it on a route that currently has only placeholder data.
