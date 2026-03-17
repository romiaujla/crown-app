# Tasks: Align All API Request/Response Body Properties To camelCase

**Branch**: `chore/CROWN-159-align-api-camelcase-contracts`
**Spec**: `specs/CROWN-159-align-api-camelcase-contracts/spec.md`
**Plan**: `specs/CROWN-159-align-api-camelcase-contracts/plan.md`
**Status**: Draft

## Task Breakdown

### Task 1 — Add Engineering Rule

- [ ] Add camelCase API property rule to `docs/process/engineering-constitution.md` under Coding Standards.

### Task 2 — Rename Shared Types

- [ ] `packages/types/src/index.ts`: Rename `growth_rate_percentage` → `growthRatePercentage` in `TenantGrowthRateMetricSchema`.
- [ ] `packages/types/src/index.ts`: Rename all snake_case properties in `TenantSummaryWidgetSchema` and `DashboardOverviewWidgetsSchema`.

### Task 3 — Rename Tenant Contract Schemas

- [ ] `apps/api/src/tenant/contracts.ts`: Rename all snake_case properties across `TenantProvisionRequestSchema`, `TenantProvisionResponseSchema`, `SoftDeprovisionTenantResponseSchema`, `HardDeprovisionTenantResponseSchema`, `DeprovisionTenantRequestSchema`.

### Task 4 — Rename Auth Contract Schemas

- [ ] `apps/api/src/auth/contracts.ts`: Rename all snake_case properties across `AuthRoutingSchema`, `AllowedAuthRoutingSchema`, `CurrentUserPrincipalSchema`, `CurrentUserResponseSchema`, `AccessTokenResponseSchema`.

### Task 5 — Rename Error Contract and Helper

- [ ] `apps/api/src/types/errors.ts`: Rename `error_code` → `errorCode` in `ErrorResponseSchema` and update `sendAuthError` response builder.

### Task 6 — Update Route Handler: Auth

- [ ] `apps/api/src/routes/auth.ts`: Update `toCurrentUserResponse` helper and login response assembly to produce camelCase keys.

### Task 7 — Update Route Handler: Platform Tenants

- [ ] `apps/api/src/routes/platform-tenants.ts`: Update provision and deprovision response builders.

### Task 8 — Update Dashboard Overview Service

- [ ] `apps/api/src/platform/dashboard/overview-service.ts`: Update dashboard widget response assembly.

### Task 9 — Update OpenAPI Documentation

- [ ] `apps/api/src/docs/openapi.ts`: Rename all snake_case property names, required array entries, and example values to camelCase.

### Task 10 — Update Web Auth Types

- [ ] `apps/web/lib/auth/types.ts`: Rename all snake_case properties in type definitions.

### Task 11 — Update Web Auth Utilities

- [ ] `apps/web/lib/auth/api.ts`: Update API response property access.
- [ ] `apps/web/lib/auth/storage.ts`: Update token property access.
- [ ] `apps/web/lib/routing/auth-routing.ts`: Update routing property access.

### Task 12 — Update Web Page Components

- [ ] `apps/web/app/platform/page.tsx`: Update dashboard widget property access.
- [ ] `apps/web/components/platform/platform-shell-frame.tsx`: Update `display_name` → `displayName`.
- [ ] `apps/web/app/tenant/page.tsx`: Update `display_name` → `displayName`.

### Task 13 — Update API Integration Tests

- [ ] `apps/api/tests/integration/platform-dashboard-overview.integration.spec.ts`
- [ ] `apps/api/tests/integration/authenticate.middleware.spec.ts`
- [ ] `apps/api/tests/integration/platform-rbac.spec.ts`
- [ ] `apps/api/tests/integration/tenant-admin-rbac.spec.ts`
- [ ] `apps/api/tests/integration/tenant-user-rbac.spec.ts`

### Task 14 — Update Web Tests

- [ ] `apps/web/tests/auth-flow.spec.ts`

### Task 15 — Validation

- [ ] Run `pnpm typecheck` — all packages pass.
- [ ] Run `pnpm test` — all tests pass.
