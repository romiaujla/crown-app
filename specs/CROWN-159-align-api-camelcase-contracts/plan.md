# Plan: Align All API Request/Response Body Properties To camelCase

**Branch**: `chore/CROWN-159-align-api-camelcase-contracts`
**Spec**: `specs/CROWN-159-align-api-camelcase-contracts/spec.md`
**Status**: Draft

## Approach

Perform a bottom-up rename: update shared types first, then API contract schemas, then route handlers, then OpenAPI docs, then web consumers, then tests. This ordering ensures each layer compiles cleanly before the next layer is touched, and TypeScript type inference propagates camelCase property names upward through `z.infer<>`.

## Phase Sequence

### Phase 1 — Engineering Rule

Add a bullet to `docs/process/engineering-constitution.md` under **Coding Standards** requiring camelCase for all public API request/response body properties and declaring snake_case properties non-compliant.

### Phase 2 — Shared Types Package (`packages/types`)

Rename snake_case properties in `packages/types/src/index.ts`:

- `TenantGrowthRateMetricSchema`: `growth_rate_percentage` → `growthRatePercentage`
- `TenantSummaryWidgetSchema`: `total_tenant_count` → `totalTenantCount`, `tenant_user_count` → `tenantUserCount`, `tenant_status_counts` → `tenantStatusCounts`, `new_tenant_counts` → `newTenantCounts`, `tenant_growth_rates` → `tenantGrowthRates`
- `DashboardOverviewWidgetsSchema`: `tenant_summary` → `tenantSummary`

Inferred types (`TenantGrowthRateMetric`, `TenantSummaryWidget`, etc.) update automatically via `z.infer<>`.

### Phase 3 — API Contract Schemas (`apps/api`)

Rename snake_case properties in Zod schemas:

- `apps/api/src/tenant/contracts.ts` — All schemas: `TenantProvisionRequestSchema`, `TenantProvisionResponseSchema`, `SoftDeprovisionTenantResponseSchema`, `HardDeprovisionTenantResponseSchema`, `DeprovisionTenantRequestSchema`.
- `apps/api/src/auth/contracts.ts` — All schemas: `AuthRoutingSchema`, `AllowedAuthRoutingSchema`, `CurrentUserPrincipalSchema`, `CurrentUserResponseSchema`, `AccessTokenResponseSchema`.
- `apps/api/src/types/errors.ts` — `ErrorResponseSchema` and `sendAuthError` function body.

### Phase 4 — Route Handlers and Services

Update response builders in route handlers to produce camelCase keys that match the updated schemas:

- `apps/api/src/routes/auth.ts` — `toCurrentUserResponse` helper, login response assembly.
- `apps/api/src/routes/platform-tenants.ts` — Provision and deprovision response assembly.
- `apps/api/src/platform/dashboard/overview-service.ts` — Dashboard widget response assembly.

### Phase 5 — OpenAPI Documentation

Update every property name, required array entry, and example value in `apps/api/src/docs/openapi.ts` from snake_case to camelCase. Cover JWT claims (where exposed in response), error response, auth routing, current user, tenant provision/deprovision, and dashboard widget schemas.

### Phase 6 — Web-Side Consumers

Update all apps/web files that reference snake_case API response properties:

- `apps/web/lib/auth/types.ts` — Type definitions consuming API response shapes.
- `apps/web/lib/routing/auth-routing.ts` — Routing decision logic reading `targetApp`, `reasonCode`.
- `apps/web/lib/auth/api.ts` — Login/me response parsing.
- `apps/web/lib/auth/storage.ts` — Token storage reading `accessToken`.
- `apps/web/app/platform/page.tsx` — Dashboard widget data access.
- `apps/web/components/platform/platform-shell-frame.tsx` — Display name rendering.
- `apps/web/app/tenant/page.tsx` — Display name rendering.

### Phase 7 — Tests

Update all test files:

- `apps/api/tests/integration/platform-dashboard-overview.integration.spec.ts`
- `apps/api/tests/integration/authenticate.middleware.spec.ts`
- `apps/api/tests/integration/platform-rbac.spec.ts`
- `apps/api/tests/integration/tenant-admin-rbac.spec.ts`
- `apps/api/tests/integration/tenant-user-rbac.spec.ts`
- `apps/web/tests/auth-flow.spec.ts`

### Phase 8 — Validation

- Run `pnpm typecheck` across all packages.
- Run `pnpm test` across all packages.
- Verify OpenAPI docs render correctly.

## Risks and Mitigations

| Risk                                           | Mitigation                                                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Breaking change for external API consumers     | Document migration guidance with full property rename map in PR description.                                                                |
| Missed rename causes runtime Zod parse failure | TypeScript compiler + Zod `.parse()` in route handlers will surface any property name mismatch at compile time or during integration tests. |
| Web app breaks if deployed before API          | Coordinate deployment: API and web must deploy together since both sides change in this PR.                                                 |

## Decisions

1. **JWT `tenant_id` excluded** — `JwtClaimsSchema.tenant_id` is an internal token field, not a public request/response property. Changing it would require coordinated JWT signing migration. Excluded from scope.
2. **Enum values unchanged** — Values like `"super_admin"`, `"soft_deprovisioned"` are domain constants, not property keys. They remain snake_case per existing convention.
3. **Single atomic PR** — All changes ship in one PR so API and web consumers stay synchronized. No phased rollout needed for an internal app.
