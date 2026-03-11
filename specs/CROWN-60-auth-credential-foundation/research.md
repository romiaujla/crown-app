# Research: Auth Credential Foundation And Role Mapping

## Decision 1: Extend `PlatformUser` with first-phase credential and account-status fields

- **Decision**: Keep the control-plane identity root on `PlatformUser` and add the minimal first-phase credential fields there, including a unique username, hashed password material, and an explicit account-status field.
- **Rationale**: The repository already uses `PlatformUser` as the global identity anchor and `PlatformUserTenant` as the tenant relationship. Extending `PlatformUser` keeps `CROWN-60` additive, avoids a second identity table, and gives later auth work a stable place to read username/email credentials and inactive-account state.
- **Alternatives considered**:
  - Create a separate credentials table now: rejected because it adds another lifecycle surface before the platform has even shipped its first real login flow.
  - Store credential state on tenant membership rows: rejected because credentials belong to the person-level identity, not to one tenant link.

## Decision 2: Keep first-phase role resolution aligned to the existing role columns

- **Decision**: Treat `PlatformUser.role` as the first-phase login persona and use `PlatformUserTenant.role` plus tenant membership validation for tenant-scoped users.
- **Rationale**: The codebase, seed baseline, and route authorization contracts already reason in terms of `super_admin`, `tenant_admin`, and `tenant_user`. Reusing those role columns lets `CROWN-60` establish real persisted auth identities without redesigning the broader multi-tenant role model too early.
- **Alternatives considered**:
  - Replace `PlatformUser.role` with a fully normalized role graph now: rejected because that is wider than the story scope and would overlap later admin and tenant-role work.
  - Ignore tenant membership during role resolution: rejected because tenant-scoped personas must prove tenant context before later routing and authorization can trust them.

## Decision 3: Use hashed passwords with local/dev-friendly deterministic seeding

- **Decision**: Store only hashed passwords in persistence and let deterministic local/dev accounts be created from known seed inputs that are hashed during seed execution.
- **Rationale**: This keeps the control-plane auth model secure by default while still supporting the deterministic seeded accounts needed by later `CROWN-24` login and routing stories.
- **Alternatives considered**:
  - Persist clear-text development passwords in the database: rejected because it breaks the platform’s baseline security expectations.
  - Leave seeded auth accounts for a later story with a parallel fixture path: rejected because the canonical local bootstrap flow is already the agreed source of truth for role-path testing.

## Decision 4: Keep `CROWN-60` scoped to access-token-only auth and treat refresh work as deferred

- **Decision**: Limit `CROWN-60` to the credential foundation and role resolution needed for access-token-only authentication, with no persistent refresh-session model.
- **Rationale**: The Jira scope and recent `CROWN-24` decomposition intentionally defer session persistence, token refresh, password recovery, and profile management to later stories or epics.
- **Alternatives considered**:
  - Introduce refresh-token storage now: rejected because it would widen the story into session management rather than credential foundation.
  - Leave the scope boundary implicit: rejected because later API and UI stories need an explicit planning contract.

## Decision 5: Capture inactive/disabled status now even though admin management lands later

- **Decision**: Add the foundational account-status concept in `CROWN-60`, but defer the admin workflows that toggle account state to later work in `CROWN-25` and `CROWN-26`.
- **Rationale**: Later login flows need a consistent way to reject disabled identities, but the user-facing management surfaces are already scoped to future admin epics.
- **Alternatives considered**:
  - Omit account status entirely until admin UI work starts: rejected because later login contracts would have no consistent inactive-user behavior.
  - Build account enable/disable workflows in `CROWN-60`: rejected because that would exceed the auth-foundation scope.
