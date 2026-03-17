# CROWN-151 — Task Breakdown

## Phase 1: Remove dead type exports

- [ ] **T-01** Remove `RoleSchema` and `Role` type from `packages/types/src/index.ts`
- [ ] **T-02** Remove `JwtClaimsSchema` and `JwtClaims` type from `packages/types/src/index.ts`
- [ ] **T-03** Remove `AuthErrorCodeSchema` and `AuthErrorCode` type from `packages/types/src/index.ts`
- [ ] **T-04** Run `pnpm --filter @crown/types typecheck` to confirm no build breakage

## Phase 2: Align seed data types

- [ ] **T-05** Replace `role: "super_admin"` string literal in `LOCAL_SEED_USERS.superAdmin` in `apps/api/prisma/seed/constants.ts`
- [ ] **T-06** Replace hardcoded `authClass` string unions in `apps/api/prisma/seed/types.ts` with `RoleAuthClassEnum`
- [ ] **T-07** Run `pnpm --filter api typecheck`

## Phase 3: OpenAPI schema descriptions

- [ ] **T-08** Add `description` to `Role` component schema in `apps/api/src/docs/openapi.ts`
- [ ] **T-09** Add `description` to `JwtClaims` component schema in `apps/api/src/docs/openapi.ts`
- [ ] **T-10** Run `pnpm --filter api typecheck`

## Phase 4: Documentation reconciliation

- [ ] **T-11** Rewrite `docs/architecture/auth-rbac.md` to document normalized model
- [ ] **T-12** Update `docs/architecture/api-boundaries.md` contract rules
- [ ] **T-13** Add auth_class clarification to `docs/auth/local-authentication.md`
- [ ] **T-14** Update `docs/specs/future-epics.md` stale references

## Phase 5: Validation

- [ ] **T-15** Run full `pnpm --filter api typecheck`
- [ ] **T-16** Run full `pnpm --filter api test`
- [ ] **T-17** Confirm zero test assertion changes required
