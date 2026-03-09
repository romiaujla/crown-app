# Platform Shell UI Contract

## Purpose

Define the user-visible contract for the `CROWN-7` super-admin control-plane shell.

## Entry Conditions

- Caller is authenticated.
- Caller has role `super_admin`.
- Caller reaches the main Crown app entry point or a platform-shell route included in this feature.

## Required Shell Elements

1. A clear Crown platform heading or equivalent operator-facing identity.
2. Supporting copy that positions Crown as a platform for tenant management systems.
3. Primary navigation for platform management areas.
4. A platform overview area that remains meaningful in empty-state conditions.
5. A visible distinction between the control plane and tenant-scoped experiences.

## Access Rules

- `super_admin`: allowed to enter and use the shell.
- `tenant_admin`: denied or redirected away from the shell.
- `tenant_user`: denied or redirected away from the shell.
- unauthenticated user: denied and sent through the normal sign-in/authentication path.

## Navigation Contract

The shell must expose platform-level destinations that cover:

- `Tenants`
- `Operations`
- `Expansion`

These labels represent:

- tenant management
- platform oversight
- future platform-management expansion areas

The navigation must remain clearly platform-scoped and must not depend on entering a tenant workspace first.

## Copy Contract

- Shell headings, labels, descriptions, and empty states must use management-system platform language.
- Shell copy must not describe Crown as a CRM.
- Tenant-facing phrasing such as “powered by Crown” is reserved for tenant workspaces, not the platform shell itself.

## Empty-State Contract

When platform data is unavailable or the system has no tenants yet, the shell must still:

- orient the super admin to the purpose of the control plane
- show usable navigation
- explain the next meaningful operator action

## Acceptance Signals

- A super admin can identify the shell as the platform control plane immediately after entry.
- A non-super-admin cannot remain in the shell.
- A non-super-admin sees a restricted access state instead of platform navigation.
- A reviewer can distinguish platform shell language from tenant workspace language without additional explanation.
