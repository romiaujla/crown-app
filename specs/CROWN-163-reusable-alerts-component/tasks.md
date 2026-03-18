# Tasks: CROWN-163 — Reusable Alerts Component

**Branch**: `feat/CROWN-163-reusable-alerts-component`
**Spec**: `specs/CROWN-163-reusable-alerts-component/spec.md`
**Plan**: `specs/CROWN-163-reusable-alerts-component/plan.md`

## Task List

### Phase 1 — Inline Alert Component

- [ ] **T-001**: Create `apps/web/components/ui/alert.tsx` with `Alert`, `AlertTitle`, `AlertDescription` compound components using CVA severity variants (success, info, warning, error).
  - Acceptance: Each variant renders correct color scheme, icon, and ARIA role. Typecheck passes.

### Phase 2 — Toast Alert System

- [ ] **T-002**: Create `apps/web/components/ui/alert-toast.tsx` with `AlertProvider`, `AlertViewport`, `useAlerts` hook, supporting seven position values, auto-dismiss, dismissible close control, and stacking.
  - Acceptance: `showAlert()` dispatches a toast at the requested position; auto-dismiss and manual close work; timers clean up on unmount.

- [ ] **T-003**: Wire `AlertProvider` and `AlertViewport` into `apps/web/app/layout.tsx`.
  - Acceptance: Toast system is available application-wide. Typecheck passes.

### Phase 3 — Migrations

- [ ] **T-004**: Migrate `apps/web/components/auth/login-form.tsx` banner message → `<Alert severity="error">`.
  - Acceptance: Login form error banner uses shared Alert. Existing tests pass.

- [ ] **T-005**: Migrate `apps/web/components/platform/tenant-create-step-tenant-info.tsx` error summary → `<Alert severity="error">` and slug-immutability warning → `<Alert severity="info">`.
  - Acceptance: Both inline alerts use shared Alert. `data-testid` attributes preserved. Existing tests pass.

- [ ] **T-006**: Migrate `apps/web/components/platform/tenant-directory-page.tsx` error state → `<Alert severity="warning">`.
  - Acceptance: Directory error state uses shared Alert. Existing tests pass.

- [ ] **T-007**: Migrate `apps/web/app/platform/page.tsx` dashboard overview error card → `<Alert severity="warning">`.
  - Acceptance: Dashboard error state uses shared Alert. Existing tests pass.

- [ ] **T-008**: Migrate `apps/web/components/auth/session-expiry-notification.tsx` → toast system via `useAlerts` in `auth-provider.tsx`.
  - Acceptance: Session expiry appears as a warning toast at top-right position. Existing tests pass.

### Phase 4 — Documentation

- [ ] **T-009**: Update `docs/process/ui-guidlines.md` with alerts section covering severity semantics, positioning guidance, inline vs. toast decision, and code examples.
  - Acceptance: UI guidelines contain a complete alerts section.

### Phase 5 — Validation

- [ ] **T-010**: Run `pnpm --filter @crown/web typecheck` — zero errors.
- [ ] **T-011**: Run `pnpm --filter @crown/web test -- tests/auth-flow.spec.ts` — all assertions pass.
- [ ] **T-012**: Commit, push, and create PR with Jira linkage and Spec Kit references.
