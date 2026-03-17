# CROWN-151 — Remove Legacy Role Fields and Reconcile Documentation

## Status
Draft

## Context
The normalized auth model introduced in CROWN-153, migrated by CROWN-155, consolidated by CROWN-158, and aligned with role templates in CROWN-150 is now the authoritative source for all role resolution. The `roles` table contains `roleCode`, `scope` (platform | tenant), and `authClass` (super_admin | tenant_admin | tenant_user). Role assignments flow through `user_platform_role_assignments` and `tenant_membership_role_assignments` join tables.

Despite this, several legacy artifacts remain in the codebase:
1. **Duplicate type exports** in `packages/types/src/index.ts` — `RoleSchema`, `Role`, `JwtClaimsSchema`, `JwtClaims`, `AuthErrorCodeSchema`, `AuthErrorCode` that conflict with the authoritative versions in `apps/api/src/auth/claims.ts` and are not imported by any consumer.
2. **Stale documentation** that describes the flat 3-value role model without mentioning the normalized `roles` table or `auth_class` derivation.
3. **Inconsistent seed data references** mixing string literals with enum references.
4. **OpenAPI schemas** referencing legacy enum naming without clarifying the normalized-model relationship.

## Scope
This story removes dead legacy type exports, reconciles documentation and OpenAPI references to match the implemented normalized model, and ensures seed data and test fixtures use consistent typed references.

### In Scope
- Remove dead `RoleSchema`, `Role`, `JwtClaimsSchema`, `JwtClaims`, `AuthErrorCodeSchema`, `AuthErrorCode` exports from `packages/types/src/index.ts`
- Update `docs/architecture/auth-rbac.md` to document the normalized role model, auth_class derivation, and current JWT claim contract
- Update `docs/architecture/api-boundaries.md` to reflect current auth model terminology
- Update `docs/auth/local-authentication.md` to clarify that seeded account roles map from the `roles.auth_class` column
- Update `docs/specs/future-epics.md` to replace stale flat-role references
- Update OpenAPI schema doc-block labels in `apps/api/src/docs/openapi.ts` to clarify auth_class relationship
- Fix inconsistent `role: "super_admin"` string literal in `apps/api/prisma/seed/constants.ts` to use a proper typed reference
- Fix hardcoded `authClass` string unions in `apps/api/prisma/seed/types.ts` to use the Prisma-generated `RoleAuthClassEnum`

### Out of Scope
- Renaming `RoleEnum` / `TenantRoleEnum` in `apps/api/src/auth/claims.ts` — these represent the JWT claim `role` field values and are actively used by 12+ source files; renaming is a separate story
- Renaming `apps/web/lib/auth/types.ts` inline role schemas — the web app duplicates role string enums for client-side validation, which is the web app's concern and a separate story
- Modifying the JWT claim shape (`role`, `tenant_id`, `sub`, `exp`) — the claim contract is stable
- Changing auth resolution logic in `prisma-auth-service.ts`, `role-resolution.ts`, or `identity.ts`
- Schema migrations — the legacy `role` columns on `users` and `tenant_memberships` were already removed by migration `20260316000000_remove_legacy_role_columns`

## Requirements

### FR-001: Remove duplicate type exports from shared types package
The following exports MUST be removed from `packages/types/src/index.ts` because they duplicate authoritative definitions in `apps/api/src/auth/claims.ts` and have zero import consumers:
- `RoleSchema`
- `Role` (type)
- `JwtClaimsSchema`
- `JwtClaims` (type)
- `AuthErrorCodeSchema`
- `AuthErrorCode` (type)

### FR-002: Reconcile architecture documentation
`docs/architecture/auth-rbac.md` MUST be updated to:
- Document the normalized `roles` table with `roleCode`, `scope`, and `authClass` columns
- Explain that the JWT claim `role` field is derived from the `roles.auth_class` column during auth resolution
- List the normalized join tables: `user_platform_role_assignments`, `tenant_membership_role_assignments`
- Preserve the denial semantics and session-expiry sections

### FR-003: Reconcile API boundaries documentation
`docs/architecture/api-boundaries.md` MUST clarify that platform, tenant-admin, and tenant-user access policies map from the `auth_class` values resolved through the normalized role model, not from hardcoded role strings.

### FR-004: Reconcile local authentication documentation
`docs/auth/local-authentication.md` MUST clarify that the "Role" column in the seeded accounts table refers to the `auth_class` value derived from each user's assigned role, not a direct column on the `users` table.

### FR-005: Reconcile planning artifact references
`docs/specs/future-epics.md` MUST update references to flat-role names (`super_admin`, `tenant_admin`, `tenant_user`) to frame them as auth-class values from the normalized model.

### FR-006: Clarify OpenAPI schema naming
Schema descriptions in `apps/api/src/docs/openapi.ts` for the `Role` and `JwtClaims` OpenAPI schemas MUST include descriptions that clarify the values represent the `auth_class` dimension from the normalized roles table.

### FR-007: Align seed data type consistency
- `apps/api/prisma/seed/constants.ts`: The `role: "super_admin"` string literal in `LOCAL_SEED_USERS.superAdmin` MUST be replaced with a typed reference that matches the existing `RoleCodeEnum` or equivalent pattern used for other seed users.
- `apps/api/prisma/seed/types.ts`: Hardcoded `authClass: "super_admin" | "tenant_admin" | "tenant_user"` string unions MUST be replaced with the Prisma-generated `RoleAuthClassEnum` type or the equivalent typed reference.

### NFR-001: Zero consumer breakage
All changes MUST pass the existing test suite (`pnpm --filter api test`) and typecheck (`pnpm --filter api typecheck`) without modification to test assertions.

### NFR-002: No runtime behavioral change
No auth resolution, JWT claim generation, policy evaluation, or route authorization behavior may change.

## Acceptance Criteria
1. Legacy role fields and obsolete schema artifacts are removed or fully deprecated
2. Documentation, OpenAPI references, and planning artifacts reflect the normalized model
3. Test helpers, fixtures, and validation suites no longer rely on the legacy role layout
4. Residual drift between schema, auth behavior, docs, and seed data is reconciled

## Dependencies
- CROWN-153 (schema normalization) — merged
- CROWN-155 (auth resolution migration) — merged
- CROWN-158 (tenant access consolidation) — merged
- CROWN-150 (provisioning role-template alignment) — merged

## Audit Trail

### Legacy artifacts inventory
| Category | File | Issue | Action |
|---|---|---|---|
| Dead exports | `packages/types/src/index.ts` | Duplicate `RoleSchema`, `JwtClaimsSchema`, `AuthErrorCodeSchema` with zero consumers | Remove |
| Documentation | `docs/architecture/auth-rbac.md` | Describes flat 3-value role model only | Rewrite RBAC section |
| Documentation | `docs/architecture/api-boundaries.md` | Uses legacy role names | Update terminology |
| Documentation | `docs/auth/local-authentication.md` | Labels accounts by legacy role names | Add auth_class clarification |
| Documentation | `docs/specs/future-epics.md` | References flat-role personas | Update framing |
| OpenAPI | `apps/api/src/docs/openapi.ts` | Role schema lacks auth_class context | Add descriptions |
| Seed data | `apps/api/prisma/seed/constants.ts` | Mixed string literal / enum references | Use typed reference |
| Seed types | `apps/api/prisma/seed/types.ts` | Hardcoded string unions | Use Prisma enum |
