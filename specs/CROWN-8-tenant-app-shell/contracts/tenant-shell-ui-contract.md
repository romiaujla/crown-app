# Tenant Shell UI Contract

## Purpose

Define the user-visible contract for the `CROWN-8` tenant workspace shell.

## Entry Conditions

- Caller is authenticated.
- Caller has a tenant-scoped role.
- Caller has an active tenant context.
- Caller reaches the tenant-facing app entry point or a tenant-shell route included in scope.

## Required Shell Elements

1. A clear tenant workspace heading or equivalent tenant-facing identity.
2. Supporting copy that positions the workspace as powered by Crown.
3. Primary navigation for tenant workspace areas.
4. A tenant overview area that remains meaningful in empty-state conditions.
5. A visible distinction between the tenant workspace and the super-admin control plane.

## Access Rules

- tenant-scoped user: allowed to enter and use the shell.
- `super_admin`: redirected or denied away from the tenant shell.
- unauthenticated visitor: denied and sent through the normal authentication path.

## Navigation Contract

The shell must expose tenant-facing destinations that cover:

- `Workspace`
- `Organizations`
- `Activity`

These labels represent:

- tenant workspace operations
- tenant overview or status areas
- future tenant-management expansion areas

Exact labels may evolve, but the navigation must remain clearly tenant-scoped and distinct from platform administration.

## Copy Contract

- Shell headings, labels, descriptions, and empty states must use management-system workspace language.
- Shell copy must not describe the tenant workspace as a CRM.
- Shell branding must identify the workspace as powered by Crown.

## Empty-State Contract

When tenant data is unavailable or minimal, the shell must still:

- orient the tenant user to the workspace purpose
- show usable navigation
- explain the next meaningful tenant action

## Acceptance Signals

- A tenant user can identify the shell as a tenant workspace immediately after entry.
- A super admin does not remain in the tenant shell.
- Powered-by-Crown branding is visible without presenting the workspace as a platform-admin surface.
- A reviewer can distinguish the tenant workspace from the platform control plane without extra explanation.
