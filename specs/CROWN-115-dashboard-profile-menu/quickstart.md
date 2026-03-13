# Quickstart: Dashboard Left-Menu Profile Actions

## Validate Locally

1. Start the web app and required auth/backend dependencies for protected-route flows.
2. Sign in as a `super_admin` user and open `/platform`.
3. Confirm the old top-level `Authenticated as` block is no longer visible.
4. Confirm a compact profile entry appears beneath the left navigation rail.
5. Verify the profile entry shows a circular avatar treatment with the signed-in user's initials.
6. Activate the profile entry and confirm a compact menu opens in place.
7. Verify the opened menu shows the user's full display name and role.
8. Activate logout from the compact menu and confirm the browser returns to `/login`.
9. Repeat the shell check on `/tenant` for a tenant-scoped persona if the shared shell behavior was updated there as well.

## Validation Commands

```bash
pnpm --filter @crown/web typecheck
pnpm --filter @crown/web test -- --grep "profile|logout|shell"
```

## Notes

- This story should only relocate and restyle the existing authenticated profile/logout affordance inside the dashboard shell.
- If implementation work suggests adding profile settings, account editing, or a broader menu system, that should move to a follow-up Jira issue instead of expanding `CROWN-115`.
