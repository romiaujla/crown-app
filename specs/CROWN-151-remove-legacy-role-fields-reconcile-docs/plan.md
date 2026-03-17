# CROWN-151 — Implementation Plan

## Phase 1: Remove dead type exports from shared types package

**Files**: `packages/types/src/index.ts`
**Risk**: Low — zero consumers import these exports

1. Delete `RoleSchema`, `Role` type (lines 3–4)
2. Delete `JwtClaimsSchema`, `JwtClaims` type (lines 205–219)
3. Delete `AuthErrorCodeSchema`, `AuthErrorCode` type (lines 221–227)
4. Run `pnpm --filter api typecheck` and `pnpm --filter web typecheck` to confirm no breakage

## Phase 2: Align seed data type consistency

**Files**: `apps/api/prisma/seed/constants.ts`, `apps/api/prisma/seed/types.ts`
**Risk**: Low — changes are value-preserving type narrowing

1. In `constants.ts`, replace the `role: "super_admin"` string literal in `LOCAL_SEED_USERS.superAdmin` with a typed constant (the value `"super_admin"` is not in `RoleCodeEnum` since it's a platform auth_class, not a domain role code — add a `const` assertion or use a documented constant)
2. In `types.ts`, replace hardcoded `authClass: "super_admin" | "tenant_admin" | "tenant_user"` string unions with the Prisma-generated `RoleAuthClassEnum` enum type imported from the generated Prisma client
3. Run typecheck to confirm

## Phase 3: Add auth_class context to OpenAPI schema descriptions

**Files**: `apps/api/src/docs/openapi.ts`
**Risk**: Low — documentation-only changes to schema descriptions

1. Add `description` fields to the `Role` component schema explaining these values represent `auth_class` from the normalized `roles` table
2. Add `description` to the `JwtClaims` component schema explaining the `role` field is derived from `roles.auth_class` during authentication
3. Run typecheck

## Phase 4: Reconcile architecture and auth documentation

**Files**: `docs/architecture/auth-rbac.md`, `docs/architecture/api-boundaries.md`, `docs/auth/local-authentication.md`, `docs/specs/future-epics.md`
**Risk**: None — documentation-only changes

1. Rewrite `auth-rbac.md` RBAC matrix and token model sections to document the normalized model
2. Update `api-boundaries.md` contract rules to reference auth_class-based policies
3. Add auth_class clarification notes to `local-authentication.md`
4. Update `future-epics.md` stale role references

## Phase 5: Validate

1. `pnpm --filter api typecheck`
2. `pnpm --filter api test`
3. Confirm all tests pass with zero assertion changes

## Commit Strategy

- Single commit: `feat: CROWN-151 - remove legacy role exports and reconcile docs`
- If changes span multiple logical units, split into:
  - `feat: CROWN-151 - remove dead role/JWT/auth exports from @crown/types`
  - `feat: CROWN-151 - align seed types with Prisma RoleAuthClassEnum`
  - `feat: CROWN-151 - reconcile auth docs and OpenAPI with normalized model`
