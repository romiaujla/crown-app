# Research: Normalize Control-Plane Schema For Users, Memberships, And Role Assignments

## Decision 1: Use One Shared `roles` Table With Explicit Role Metadata

- **Decision**: Implement `users`, `roles`, `user_platform_role_assignments`, `tenant_memberships`, and `tenant_membership_role_assignments`, with the shared `roles` table carrying both scope and auth-behavior metadata.
- **Rationale**: The clarified product rule is simpler than the earlier split-catalog design. A shared role catalog keeps the schema easier to reason about while still preserving normalized assignment boundaries.
- **Alternatives considered**:
  - Keep separate `platform_roles` and `tenant_roles` tables: rejected because the extra split did not add enough value once most tenant roles collapsed to `tenant_user` runtime behavior.
  - Keep the legacy table names and only add new relation tables around them: rejected because it would preserve naming drift against the approved design.

## Decision 1a: Keep Concrete Tenant Roles But Derive Auth Behavior From Metadata

- **Decision**: Keep `admin`, `dispatcher`, `driver`, `accountant`, and `human_resources` as concrete rows in `roles`, but mark them as `tenant_user`-class auth behavior.
- **Rationale**: This preserves the actual business roles the product wants in the database while keeping the current JWT and route-authorization behavior stable.
- **Alternatives considered**:
  - Introduce a synthetic `tenant_user` row in `roles`: rejected because the desired database model is based on concrete role codes, with runtime auth derived from metadata instead of a generic tenant-user role row.

## Decision 2: Keep Legacy Role Columns Temporarily If They Are Still Needed For Compatibility

- **Decision**: Preserve legacy role columns only if needed for a safe compatibility window; otherwise remove them as part of the schema migration.
- **Rationale**: The story acceptance criteria allow phased migration. Current auth resolution and seed flows still read legacy role strings, so a clean schema cutover may require a brief compatibility bridge instead of deleting every legacy field immediately.
- **Alternatives considered**:
  - Remove all legacy role columns immediately with no compatibility bridge: rejected if it would force a much wider auth rewrite than the story scope supports.
  - Keep legacy role columns indefinitely as first-class fields: rejected because that would preserve ambiguous sources of truth.

## Decision 3: Keep `management_system_type_roles` As Template Configuration Only

- **Decision**: Preserve `management_system_type_roles` as type-to-role template/default configuration even though it now references the same shared `roles` table that auth assignments use.
- **Rationale**: Reusing the shared catalog is fine as long as the junction still answers “which roles are available/default for this management-system type?” rather than “who has this access today?”.
- **Alternatives considered**:
  - Reuse `management_system_type_roles` for actual user grants: rejected because it cannot answer who has access to a tenant today.

## Decision 4: Update Seed And Auth Support Code Only As Far As Needed To Validate The New Schema

- **Decision**: Update control-plane seed code, auth support, and focused test helpers enough to operate on the normalized schema and keep validation meaningful.
- **Rationale**: The story is about schema normalization, but validation would be weak if the repo’s canonical seed path and direct auth-schema readers still broke on the new model.
- **Alternatives considered**:
  - Change Prisma only and leave all direct consumers broken: rejected because it would fail the “focused validation” acceptance criteria.
  - Broaden into a complete auth API redesign: rejected because that belongs to follow-up implementation stories under `CROWN-149`.
