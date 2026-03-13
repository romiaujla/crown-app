# Quickstart: Super-Admin Control-Plane Navigation Shell

## Validate Locally

1. Start the web app and any required auth/backend dependencies for protected-route flows.
2. Sign in as a `super_admin` user and navigate to `/platform`.
3. Confirm the shell shows the left navigation with all nine required destinations.
4. Confirm the active destination is visually highlighted.
5. Select each destination and verify the right-side panel updates.
6. For unfinished sections, confirm the content title renders as `<Menu title> Coming Soon`.
7. Resize to an iPad-sized viewport and confirm the left navigation collapses to icons only.
8. Hover or focus collapsed navigation items and confirm tooltips reveal the destination names.
9. Confirm tenant-scoped users are still redirected away from `/platform`.

## Validation Commands

```bash
pnpm --filter @crown/web typecheck
pnpm --filter @crown/web test
```

## Notes

- This story is shell-only; deeper content for `Users`, `Billing`, `Audit Log`, and similar areas should remain placeholder states unless separately scoped.
- The shell should remain visibly distinct from the tenant workspace introduced by `CROWN-8`.
