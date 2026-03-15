# Contract: Tenant Create Shell UI Behavior

## Route

- **Path**: `/platform/tenants/new`
- **Auth**: Existing protected platform shell
- **Allowed role**: `super_admin`

## Shell Rules

- Render as a full page section inside the existing platform shell.
- Show a visible ordered stepper for the tenant-create flow.
- Present placeholder step content for future workflow stages without implementing the actual business logic of those stages.
- Provide `Next`, `Back`, and `Cancel` controls in consistent positions within the shell.
- Keep the route stable while moving between placeholder steps.

## Placeholder Step Sequence

1. `Tenant info`
2. `Role selection`
3. `User assignment`
4. `Review`

## Exit Protection Rules

- When no in-progress data exists, `Cancel` may return to `/platform/tenants` without confirmation.
- When in-progress data exists, the shell must warn before in-app exit completes.
- When the browser allows route/page-exit interception, the shell should warn before data loss for refresh/close/back-style exit attempts.

## Out Of Scope

- Tenant provisioning submission
- Management-system type selection business rules
- Real role-selection behavior
- Real user-assignment behavior
- Final review/submit workflow
