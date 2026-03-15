# Contract: Auth Normalized Model Handoff

## Purpose

Define what downstream `CROWN-149` implementation stories may rely on from `CROWN-152`.

## Guaranteed Outputs

- A normalized target model that separates user identity, platform authorization, tenant membership, and tenant authorization
- A clear boundary between management-system role-template configuration and actual user auth-role assignments
- Canonical placement of `super_admin` as a platform-scoped role and tenant-scoped auth roles as reusable tenant role definitions
- A compatibility rule for how one effective tenant role is derived per session while storage supports many-to-many assignments
- A staged migration outline covering schema, seed/backfill, JWT derivation, API follow-up, and legacy-field removal

## Downstream Consumers

- Follow-up schema stories under `CROWN-149` use the target entities and relationships as the source of truth for Prisma and migration design.
- Seed and backfill stories use the role-mapping and migration outline to populate platform-role assignments, memberships, and tenant-role assignments.
- Auth/JWT stories use the effective-role compatibility rule to preserve the current claim contract during migration.
- Admin/API stories use the explicit membership-versus-assignment boundary to design role-management endpoints and views.

## Review Rules

- `PlatformUser` remains the identity root unless a follow-up issue explicitly changes that decision.
- `super_admin` must remain a platform-scoped role rather than moving into the tenant role catalog.
- `ManagementSystemTypeRole` must remain template/default configuration and must not be reused as a user-grant table.
- `Admin` remains a display label for `tenant_admin`; downstream work should not introduce a second overlapping `admin` auth role without a new design decision.
- Initial runtime behavior must continue to derive one effective tenant role per session until a later issue explicitly widens the JWT and RBAC contracts.

## Out Of Scope For This Contract

- Exact Prisma model names or SQL migration files
- Final API payload shapes for role-management endpoints
- UI-level role-switching or tenant-selection behavior
- Multi-role JWT claims or policy-engine redesign

## Escalation Rule

If downstream implementation needs to collapse membership and assignment back into one record, treat management-system templates as user grants, or introduce both `admin` and `tenant_admin` as separate auth roles, `CROWN-152` must be revisited before implementation proceeds.
