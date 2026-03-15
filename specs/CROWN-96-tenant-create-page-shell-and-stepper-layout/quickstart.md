# Quickstart: Tenant Create Page Shell And Stepper Layout

## Validate The Shell Manually

1. Start the web app and authenticate as a `super_admin`.
2. Open `/platform/tenants`.
3. Activate `Add new` and confirm the browser routes to `/platform/tenants/new`.
4. Verify the page renders as a dedicated shell inside the control plane with a visible four-step progress indicator.
5. Move forward with `Next` and backward with `Back`, confirming the active-step styling and placeholder content update without leaving the page.
6. Enter text into a placeholder field, then choose `Cancel` and confirm the discard warning appears.
7. Repeat the cancel flow without entering any data and confirm the page exits without warning.
8. Verify a non-super-admin session is redirected or blocked by the existing protected-shell behavior.

## Focused Validation Targets

- `pnpm --filter @crown/web typecheck`
- `pnpm --filter @crown/web test -- --runInBand apps/web/tests/auth-flow.spec.ts`
- `pnpm specify.audit`
