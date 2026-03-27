# Tasks: CROWN-174 - Tenant Details Collapsible Users Section

**Branch**: `feat/CROWN-174-tenant-details-collapsible-users-section`
**Spec**: `specs/CROWN-174-tenant-details-collapsible-users-section/spec.md`
**Plan**: `specs/CROWN-174-tenant-details-collapsible-users-section/plan.md`

## Task List

### Phase 1 - Collapsible Section Primitive

- [x] **T-001**: Create `apps/web/components/ui/collapsible-section.tsx` with support for `title`, optional `count`, `defaultOpen`, and arbitrary children.
  - Acceptance: The full header row toggles the content, exposes `aria-expanded` and `aria-controls`, and remains keyboard accessible.

- [x] **T-002**: Implement open/close animation and independent section behavior in `apps/web/components/ui/collapsible-section.tsx`.
  - Acceptance: Height and opacity animate in the required range and multiple sections can stay open simultaneously.

### Phase 2 - Tenant Details Section Composition

- [x] **T-003**: Create `apps/web/components/platform/tenant-details-users-table.tsx` to render success, loading, and empty states with the shared table primitives.
  - Acceptance: The component renders Name, Email, Role, Status, Last Active, and Actions columns plus an `Add first user` empty-state action.

- [x] **T-004**: Create `apps/web/components/platform/tenant-details-sections.tsx` to compose the section group and route-scoped users view model.
  - Acceptance: `Users` is the first section, defaults to collapsed, and the structure can host future sections without accordion-only behavior.

### Phase 3 - Route Adoption

- [x] **T-005**: Replace the placeholder administration card in `apps/web/components/platform/tenant-details-page.tsx` with the new section-group composition.
  - Acceptance: The details route preserves the existing metadata summary and action hierarchy while removing the static placeholder card.

### Phase 4 - Validation

- [x] **T-006**: Update `apps/web/tests/auth-flow.spec.ts` to verify the `Users` section is collapsed by default and expands into the required table structure.
  - Acceptance: Focused browser coverage exercises the new tenant-details administration UI.

- [x] **T-007**: Run `pnpm --filter @crown/web typecheck`.
  - Acceptance: Zero type errors in `apps/web`.

- [x] **T-008**: Run `pnpm --filter @crown/web test -- tests/auth-flow.spec.ts`.
  - Acceptance: The focused auth-flow coverage passes with the updated tenant-details assertions.

- [x] **T-009**: Mark completed tasks, commit, push, and prepare the PR with links to the Spec Kit artifacts.
  - Acceptance: Branch history reflects the scoped delivery and is ready for PR creation after implementation.
