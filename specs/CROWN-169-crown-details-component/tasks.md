# Tasks: CROWN-169 - CrownDetailsComponent Generic Details Primitive

**Branch**: `feat/CROWN-169-crown-details-component`
**Spec**: `specs/CROWN-169-crown-details-component/spec.md`
**Plan**: `specs/CROWN-169-crown-details-component/plan.md`

## Task List

### Phase 1 - Shared Component Foundation

- [x] **T-001**: Create `apps/web/components/ui/crown-details-component.tsx` with the exported `CrownDetailsComponent` and typed field/action props.
  - Acceptance: The component accepts title, optional subheading, field config, action config, and layout options without domain-specific assumptions.

- [x] **T-002**: Implement default layout behavior for header visibility, action visibility, and breakpoint column defaults.
  - Acceptance: The component defaults to `desktopCol = 3`, `tabletCol = 3`, and `mobileCol = 3`, with safe fallbacks when optional props are omitted.

### Phase 2 - Field Rendering And States

- [x] **T-003**: Implement the standard details grid with ordered field rendering, muted labels, and exact value display in `apps/web/components/ui/crown-details-component.tsx`.
  - Acceptance: Fields render in config order, empty values are omitted, and incomplete final rows remain left-aligned.

- [x] **T-004**: Implement dense mode and the empty-data state in `apps/web/components/ui/crown-details-component.tsx`.
  - Acceptance: Dense mode renders compact `label: value` rows and empty datasets show `No data available` without empty field shells.

### Phase 3 - Header Actions

- [x] **T-005**: Add primary-action promotion logic and destructive-action safeguards in `apps/web/components/ui/crown-details-component.tsx`.
  - Acceptance: At most one visible primary action renders and destructive actions are never primary by default.

- [x] **T-006**: Add the kebab-trigger overflow menu using existing shared primitives in `apps/web/components/ui/crown-details-component.tsx`.
  - Acceptance: Secondary actions appear in order, the menu closes on outside click or selection, and no overflow trigger renders when not needed.

### Phase 4 - Route Adoption

- [x] **T-007**: Replace the placeholder card in `apps/web/app/platform/tenants/[slug]/page.tsx` with a tenant-details entry view powered by `CrownDetailsComponent`.
  - Acceptance: The route shows a realistic details layout with placeholder route-derived values and shared actions while preserving the current “future workflow” framing.

### Phase 5 - Validation

- [x] **T-008**: Update focused Playwright coverage with tenant-details assertions in `apps/web/tests/auth-flow.spec.ts`.
  - Acceptance: Browser coverage confirms the shared component renders on the tenant-details entry route and exposes the overflow actions.

- [x] **T-009**: Run `pnpm --filter @crown/web typecheck`.
  - Acceptance: Zero type errors.

- [x] **T-010**: Run `pnpm --filter @crown/web test -- tests/auth-flow.spec.ts -g "tenant directory action links route to stable detail, add, and edit entry points"`.
  - Acceptance: The focused tenant-details Playwright assertion passes.

- [ ] **T-011**: Mark completed tasks, commit, push, and prepare the PR with links to the Spec Kit artifacts.
  - Acceptance: Branch history reflects the scoped feature and the future PR can reference `spec.md`, `plan.md`, and `tasks.md`.
