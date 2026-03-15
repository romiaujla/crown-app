# Research: Normalize Control-Plane Schema For Users, Memberships, And Role Assignments

## Decision 1: Implement The `CROWN-152` Normalized Table Names In This Story

- **Decision**: Use the approved normalized table names `users`, `platform_roles`, `user_platform_role_assignments`, `tenant_memberships`, `tenant_roles`, and `tenant_membership_role_assignments`.
- **Rationale**: `CROWN-152` already resolved the target naming and relationship model. Reverting to the old `platform_users`, `platform_user_tenants`, or generic `roles` names in implementation would re-open a design decision that the previous story intentionally closed.
- **Alternatives considered**:
  - Keep the legacy table names and only add new relation tables around them: rejected because it would preserve naming drift against the approved design.
  - Rename only some tables now and defer the rest: rejected because partial normalization would keep the control-plane model conceptually inconsistent.

## Decision 2: Keep Legacy Role Columns Temporarily If They Are Still Needed For Compatibility

- **Decision**: Preserve legacy role columns only if needed for a safe compatibility window; otherwise remove them as part of the schema migration.
- **Rationale**: The story acceptance criteria allow phased migration. Current auth resolution and seed flows still read legacy role strings, so a clean schema cutover may require a brief compatibility bridge instead of deleting every legacy field immediately.
- **Alternatives considered**:
  - Remove all legacy role columns immediately with no compatibility bridge: rejected if it would force a much wider auth rewrite than the story scope supports.
  - Keep legacy role columns indefinitely as first-class fields: rejected because that would preserve ambiguous sources of truth.

## Decision 3: Keep `management_system_type_roles` As Template Configuration Only

- **Decision**: Preserve `management_system_type_roles` as type-to-role template/default configuration and add separate user-grant tables rather than repurposing the existing junction.
- **Rationale**: `CROWN-140` introduced that table specifically for available/default roles per management-system type. Using it as a user grant would collapse configuration and authorization back together.
- **Alternatives considered**:
  - Reuse `management_system_type_roles` for actual user grants: rejected because it cannot answer who has access to a tenant today.

## Decision 4: Update Seed And Auth Support Code Only As Far As Needed To Validate The New Schema

- **Decision**: Update control-plane seed code, auth support, and focused test helpers enough to operate on the normalized schema and keep validation meaningful.
- **Rationale**: The story is about schema normalization, but validation would be weak if the repo’s canonical seed path and direct auth-schema readers still broke on the new model.
- **Alternatives considered**:
  - Change Prisma only and leave all direct consumers broken: rejected because it would fail the “focused validation” acceptance criteria.
  - Broaden into a complete auth API redesign: rejected because that belongs to follow-up implementation stories under `CROWN-149`.
