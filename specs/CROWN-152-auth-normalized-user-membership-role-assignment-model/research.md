# Research: Auth Normalized User, Membership, And Role-Assignment Model

## Decision 1: Keep `PlatformUser` As The Identity Root, But Remove Authorization Meaning From Its Legacy `role` Column

- **Decision**: Treat `PlatformUser` as the long-lived identity and credential anchor, but move authorization meaning into explicit platform-role and tenant-role assignment relationships.
- **Rationale**: `CROWN-60` already established `PlatformUser` for credentials, account status, and profile identity. Reusing it avoids a second identity table while still allowing `PlatformUser.role` to be retired once downstream readers migrate.
- **Alternatives considered**:
  - Replace `PlatformUser` with a new `User` table now: rejected because it would widen the story into identity replatforming rather than role normalization.
  - Keep `PlatformUser.role` as the permanent source of authorization truth: rejected because it cannot model multiple platform grants, tenant memberships, and explicit tenant-role assignments cleanly.

## Decision 2: Model Platform Authorization Separately From Tenant Membership And Tenant Authorization

- **Decision**: Represent platform authorization through explicit platform-role assignments and represent tenant access through tenant memberships plus tenant-role assignments.
- **Rationale**: `super_admin` is fundamentally a platform-scoped authorization concern, while tenant roles are tenant-scoped and should depend on membership. Separating those concerns prevents a single `role` field from carrying multiple incompatible meanings.
- **Alternatives considered**:
  - Treat tenant membership itself as the authorization grant: rejected because membership alone does not express which tenant role the user holds.
  - Put `super_admin` into the tenant role catalog: rejected because it is not tenant-scoped and should not participate in management-system role-template rules.

## Decision 3: Reuse The Shared `Role` Catalog For Canonical Tenant Auth Roles

- **Decision**: Treat the shared `Role` catalog introduced by `CROWN-140` as the canonical tenant auth-role definition set for assignable tenant-scoped roles.
- **Rationale**: The catalog already carries stable `role_code` values for `tenant_admin`, `dispatcher`, `accountant`, `human_resources`, and `driver`. Reusing it keeps one source of truth for tenant role codes across templates, seeds, and assignments.
- **Alternatives considered**:
  - Introduce a second tenant-role definition table separate from `Role`: rejected because it would duplicate role codes and invite drift between template and assignment concepts.
  - Keep tenant auth roles as free-form strings on membership records: rejected because it would continue the denormalized design this story is meant to replace.

## Decision 4: Treat Management-System Role Templates As Eligibility Configuration, Not User Grants

- **Decision**: Keep `ManagementSystemTypeRole` as template/default configuration that describes which tenant auth roles a tenant type may use and which are provisioned by default, but never as proof of user authorization.
- **Rationale**: Template/default configuration belongs to onboarding and tenant-type setup. Actual access must be granted through a user-to-membership-to-role-assignment path so the system can answer who has access today.
- **Alternatives considered**:
  - Infer user access directly from template/default mappings: rejected because defaults do not identify a specific user and cannot support revocation or explicit assignment history.
  - Collapse templates and assignments into the same table: rejected because it would mix tenant configuration with runtime authorization.

## Decision 5: Support Many-To-Many Assignments In Storage, But Resolve One Effective Tenant Role Per Session Initially

- **Decision**: The target schema should support multiple tenant-role assignments per membership over time, but the initial runtime compatibility rule should resolve exactly one effective tenant auth role per session and per JWT.
- **Rationale**: Current JWT claims and route policies expect one `role` and one optional `tenant_id`. Keeping one effective role during the migration window lets follow-up stories normalize storage without rewriting every auth consumer at once.
- **Alternatives considered**:
  - Limit the schema itself to one tenant role per membership forever: rejected because the issue explicitly asks for a model that supports many-to-many.
  - Switch JWTs and route guards to multi-role claims immediately: rejected because that widens scope into a larger auth-contract migration than this design story needs.

## Decision 6: Treat `Admin` As A Display Label For `tenant_admin`, Not A Separate Auth Role Code

- **Decision**: Keep `tenant_admin` as the canonical auth role code and treat `Admin` as the human-facing label for that code.
- **Rationale**: The current seed baseline already uses `Admin` as the display name while the role code remains `tenant_admin`. Preserving that mapping avoids introducing two semantically overlapping tenant admin roles.
- **Alternatives considered**:
  - Introduce both `admin` and `tenant_admin` as separate tenant auth roles: rejected because it would create ambiguous authorization semantics for the same functional permission set.

## Decision 7: Use A Compatibility Rollout With Additive Tables, Backfill, Derived JWT Claims, And Delayed Legacy-Field Removal

- **Decision**: Follow-up implementation should introduce normalized tables additively, backfill from legacy columns, derive current JWT claims from the normalized assignments during a compatibility window, then remove legacy `role` fields only after all auth readers and writers migrate.
- **Rationale**: This reduces rollout risk and lets the codebase preserve current auth behavior while incrementally switching sources of truth.
- **Alternatives considered**:
  - Big-bang replace the role model in one schema/API release: rejected because auth, seed, and admin surfaces are too coupled for a safe single cutover.
  - Keep both normalized and legacy sources of truth indefinitely: rejected because it would preserve ambiguity and maintenance burden.
