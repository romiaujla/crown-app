# Quickstart

## Goal

Verify that the control-plane `Tenants` navigation opens a dedicated tenant-directory route, the directory filters by name and `TenantStatusEnum`, and the action entry points navigate to stable follow-up destinations.

## Prerequisites

1. Run the web app locally.
2. Ensure the API is available locally or use the existing browser-test mocks.
3. Sign in as a `super_admin`.

## Browser Validation

1. Open `/platform`.
2. Activate `Tenants` in the left navigation.
3. Confirm the browser lands on the dedicated tenant-directory route and the old `Tenants Coming Soon` placeholder no longer appears.
4. Confirm the first table column is the tenant name.
5. Enter a partial tenant name in search and confirm the visible rows narrow.
6. Change the status filter between explicit `TenantStatusEnum` values and confirm the rows narrow accordingly.
7. Activate a tenant-name link and confirm the app routes to the stable tenant-details entry point.
8. Return to the directory, activate `Add new`, and confirm the app routes to the stable tenant-creation entry point.
9. Return to the directory, activate a row-level edit action, and confirm the app routes to the stable tenant-edit entry point.

## Suggested Validation Commands

```bash
pnpm specify.audit
pnpm --filter @crown/web typecheck
pnpm --filter @crown/web test
```
