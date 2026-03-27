# Implementation Plan: Tenant Details Collapsible Users Section

**Branch**: `feat/CROWN-174-tenant-details-collapsible-users-section` | **Date**: 2026-03-26 | **Spec**: `specs/CROWN-174-tenant-details-collapsible-users-section/spec.md`
**Input**: Feature specification from `specs/CROWN-174-tenant-details-collapsible-users-section/spec.md`

## Summary

Replace the static administration placeholder on the platform Tenant Details page with a reusable collapsible section pattern and a first `Users` section that renders a tenant-directory-style table. Keep the story scoped to `apps/web` by driving the Users section from a route-local view model keyed off the existing tenant detail response instead of introducing a new platform tenant-members API surface.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20
**Primary Dependencies**: Next.js 14 App Router, React 18, Tailwind CSS, `lucide-react`, existing shadcn `Button`, `Badge`, `Table`, and `Card` primitives
**Storage**: No persistence changes
**Testing**: `pnpm --filter @crown/web typecheck`, `pnpm --filter @crown/web test -- tests/auth-flow.spec.ts`
**Target Platform**: Web frontend in `apps/web`
**Project Type**: Route enhancement plus reusable UI components
**Performance Goals**: Lightweight client-side expand/collapse with no additional network dependency on the details route
**Constraints**: No backend or OpenAPI changes; preserve tenant-details visual language; keep collapsible sections independently toggleable; reuse existing table patterns where practical
**Scale/Scope**: One route update, one or two new UI helpers, focused browser test updates, Spec Kit artifacts

## Constitution Check

- Jira traceability and branch policy: **PASS**. `CROWN-174` is a Story and the branch follows `feat/CROWN-<id>-<slug>`.
- Planning gate: **PASS**. `/specify` artifact exists and is committed before `/plan`.
- Scope discipline: **PASS**. Planned work is limited to `apps/web` plus Spec Kit artifacts.
- API/OpenAPI discipline: **PASS**. No API route, request contract, or OpenAPI changes are planned.
- Testing discipline: **PASS**. Plan includes focused web typecheck and auth-flow coverage updates.
- Governance consistency: **PASS**. Implementation reuses existing UI primitives and tenant-directory table styling.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-174-tenant-details-collapsible-users-section/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── components/
│   ├── platform/
│   │   ├── tenant-details-page.tsx                ← UPDATE: replace placeholder admin card
│   │   ├── tenant-details-sections.tsx            ← NEW: section group composition
│   │   └── tenant-details-users-table.tsx         ← NEW: users table and state rendering
│   └── ui/
│       └── collapsible-section.tsx                ← NEW: reusable independent collapsible section
└── tests/
    └── auth-flow.spec.ts                          ← UPDATE: verify collapsible users section behavior
```

## Implementation Phases

### Phase 1 - Reusable Collapsible Section Primitive

Create a reusable section primitive for tenant-details administration content.

1. Add a shared `CollapsibleSection` component under `apps/web/components/ui`.
2. Support `title`, optional `count`, `defaultOpen`, and arbitrary children.
3. Make the entire header row a semantic button that exposes `aria-expanded` and `aria-controls`.
4. Animate content open/close with height and opacity in the required timing range.

**Validation checkpoint**: The primitive toggles via mouse and keyboard, and multiple instances can remain open independently.

### Phase 2 - Users Section Composition And View Model

Build the tenant-details administration section group and the first `Users` section.

1. Add a route-level section composition component for the Tenant Details page.
2. Create a route-scoped users view model derived from the existing tenant detail response so the story stays in `apps/web`.
3. Represent success, loading, and empty states without adding a new platform-side API client.
4. Keep the structure extensible for future sections such as Roles and Permissions, API Keys, Billing, and Audit Logs.

**Validation checkpoint**: The administration area is one grouped section container, and `Users` is collapsed on initial render.

### Phase 3 - Tenant Directory Style Users Table

Implement the `Users` section content using the shared table primitives and tenant-directory styling cues.

1. Reuse `Table`, `TableHeader`, `TableRow`, and related styling patterns from the tenant directory.
2. Render the required columns: Name, Email, Role, Status, Last Active, and Actions.
3. Add loading and empty-state UI, including an `Add first user` action.
4. Keep styling minimal, with soft dividers and no standalone per-section cards.

**Validation checkpoint**: Expanded state renders a table-like experience that feels consistent with the existing control-plane directory UI.

### Phase 4 - Tenant Details Route Adoption

Replace the current placeholder administration card in `tenant-details-page.tsx`.

1. Preserve the existing metadata summary and action hierarchy.
2. Swap the placeholder administration card for the new section-group component.
3. Keep the existing return-to-directory affordance intact.

**Validation checkpoint**: The details page shows core tenant metadata plus the new collapsible administration surface without changing route framing.

### Phase 5 - Focused Validation

1. Update `apps/web/tests/auth-flow.spec.ts` to assert the `Users` section is collapsed by default and expands into the required table structure.
2. Add focused coverage for at least one non-success state if practical within the existing route harness.
3. Run `pnpm --filter @crown/web typecheck`.
4. Run `pnpm --filter @crown/web test -- tests/auth-flow.spec.ts`.

## Implementation Notes

- The repository already exposes tenant-member search contracts in `@crown/types`, but the current platform tenant-details page does not have a corresponding platform-side client route. This story should not widen scope by adding that API surface.
- The Users section can use a narrow route-local display model that is compatible with the existing contract shape where useful, while still including the Jira-required `Last Active` column.
- Prefer additive composition over altering shared table primitives.
- Keep the collapsible primitive generic enough to support future tenant-details sections without coupling it to user-table semantics.

## Complexity Tracking

No constitution violations are expected. The main implementation tradeoff is data sourcing: to stay inside Jira scope, the plan avoids backend expansion and instead uses a route-scoped users view model until a follow-up platform tenant-members contract is introduced.
