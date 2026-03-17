# Local Authentication Guide

Use this guide when you want to exercise the seeded Crown login flows locally.

## Prerequisites

- Install dependencies: `pnpm install`
- Start local PostgreSQL: `pnpm postgres`
- Copy `apps/api/.env.example` to `apps/api/.env.local`
- Run the canonical bootstrap workflow: `pnpm db:bootstrap:local`
- Start the applications: `pnpm dev`

The copied API env file provides the default seeded auth password values and access-token lifetime used by local login flows:

- `JWT_ACCESS_TTL_SECONDS=7200`
- `SEED_SUPER_ADMIN_PASSWORD=SeedSuperAdmin123!`
- `SEED_TENANT_ADMIN_PASSWORD=SeedTenantAdmin123!`
- `SEED_TENANT_USER_PASSWORD=SeedTenantUser123!`
- `SEED_DEFAULT_PASSWORD=Password123!` remains the fallback for seeded records that do not have a role-specific override.

Default local endpoints:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`

## Canonical Local Auth Workflow

The local auth experience depends on the same canonical bootstrap workflow as the rest of the seeded local environment.

`pnpm db:bootstrap:local`:

- prepares the control-plane schema
- bootstraps the canonical tenant when needed
- reloads the deterministic seeded baseline used by local auth flows

If the local database is already prepared and you only need to refresh seeded tenant data, use `pnpm db:seed:local`.

## Seeded Login Accounts

Primary seeded accounts for local login. The "Auth Class" column shows the `roles.auth_class` value derived from each user's assigned role via the normalized role-assignment tables — it is not a direct column on the `users` table.

| Auth Class     | Identifier                     | Alternate Identifier | Password              | Expected Destination |
| -------------- | ------------------------------ | -------------------- | --------------------- | -------------------- |
| `super_admin`  | `super-admin@acme-local.test`  | `super.admin`        | `SeedSuperAdmin123!`  | `/platform`          |
| `tenant_admin` | `tenant-admin@acme-local.test` | `tenant.admin`       | `SeedTenantAdmin123!` | `/tenant`            |
| `tenant_user`  | `tenant-user@acme-local.test`  | `tenant.user`        | `SeedTenantUser123!`  | `/tenant`            |

Additional seeded auth records used for negative-path validation:

| Case                        | Identifier                           | Password       | Expected Outcome          |
| --------------------------- | ------------------------------------ | -------------- | ------------------------- |
| Disabled account            | `disabled-user@acme-local.test`      | `Password123!` | Sign-in denied            |
| No tenant membership        | `tenant-user-orphan@acme-local.test` | `Password123!` | Access denied             |
| Multiple tenant memberships | `tenant-admin-multi@acme-local.test` | `Password123!` | Tenant selection required |

## Login Journeys

### `super_admin` (auth_class)

- Sign in on `/login`
- Crown routes the user to `/platform`
- The platform shell is the only allowed authenticated shell for this auth_class

### `tenant_admin` (auth_class)

- Sign in on `/login`
- Crown routes the user to `/tenant`
- The tenant shell is the allowed authenticated shell when exactly one active tenant membership exists

### `tenant_user` (auth_class)

- Sign in on `/login`
- Crown routes the user to `/tenant`
- The tenant shell is the allowed authenticated shell when exactly one active tenant membership exists

## High-Level Routing Outcomes

- Unauthenticated access to protected routes redirects to `/login`
- If a valid protected return path was captured before login, Crown restores it after sign-in when the authenticated user is allowed to access it
- If a user manually lands in the wrong shell, Crown redirects them to the correct allowed shell
- If the authenticated routing contract is blocked or unsupported, Crown sends the user to `/unauthorized`

## Current Session Behavior

For this phase, the web app uses browser `sessionStorage` for the access token.

That means:

- the login session is scoped to the current browser tab
- opening a new tab does not automatically share the existing session
- logging out clears the stored access token in that tab

Session expiry behavior:

- the access token includes an `exp` claim
- the default local access-token lifetime is 2 hours
- Crown shows a top-right warning shortly before expiry
- when expiry is reached, Crown logs the user out and returns them to `/login`
- the login screen shows the session-expired message so the re-authentication reason is clear

## Related Docs

- [Auth and RBAC](../architecture/auth-rbac.md)
- [System Overview](../architecture/system-overview.md)
