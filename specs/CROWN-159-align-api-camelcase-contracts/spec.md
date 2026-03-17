# Specification: Align All API Request/Response Body Properties To camelCase

**Branch**: `chore/CROWN-159-align-api-camelcase-contracts`
**Created**: 2026-03-17
**Status**: Draft
**Input**: Jira issue `CROWN-159` — "Tech debt: align all API request/response body properties to camelCase"

## Problem

API request and response payload contracts currently mix `snake_case` and `camelCase` property names. This causes inconsistent developer experience, contract ambiguity, and avoidable mapping bugs across API and web clients. Internal service code already uses camelCase (e.g., `displayName`, `tenantId`), but the Zod schemas and route-level response builders emit `snake_case` over the wire.

## Goal

Standardize **all** endpoint request bodies and response payloads to camelCase property names, add a repository-level engineering rule mandating the convention, update OpenAPI docs, and update all tests and web-side consumers.

## Scope

### In Scope

1. **Engineering rule** — Add a documented rule to `docs/process/engineering-constitution.md` requiring camelCase for all public API request/response body properties.
2. **Contract audit and migration** — Rename every `snake_case` property to `camelCase` in all Zod schemas that define API request or response shapes.
3. **Route-level response builders** — Update all route handlers that manually map service results into response objects so they produce camelCase keys.
4. **Shared types package** — Update `packages/types/src/index.ts` schemas that define API-facing response shapes (dashboard widgets).
5. **OpenAPI docs** — Align `apps/api/src/docs/openapi.ts` property names with the camelCase contract changes.
6. **Web-side consumers** — Update `apps/web` code that reads API response properties (types, routing helpers, page components, auth utilities).
7. **Tests** — Update integration tests and web test fixtures to assert camelCase payloads.

### Out of Scope

- Database column names (remain `snake_case` per constitution).
- Prisma model field names (internal, not API-facing).
- JWT registered claim names (`sub`, `exp`) — these follow RFC 7519.
- Enum member **values** (e.g., `"super_admin"`, `"soft_deprovisioned"`) — these are domain constants, not property keys.
- Internal TypeScript variable names that are already camelCase.
- `JwtClaimsSchema.tenant_id` — JWT claims are an internal token structure validated at the middleware boundary, not part of a public request/response body contract. This property remains `snake_case` for symmetry with other JWT fields (`sub`, `exp`) and because changing it would require coordinated JWT signing/verification migration.

### Breaking Change Notice

This is a **breaking API contract change**. Any external consumer reading `snake_case` property names from API responses must update to camelCase. Migration guidance will be documented in the PR description.

## Affected Files — Full Inventory

### API Contract Schemas

| File                               | Snake_case Properties                                                                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/api/src/tenant/contracts.ts` | `management_system_type_code`, `tenant_id`, `schema_name`, `applied_versions`, `previous_status`                                                          |
| `apps/api/src/auth/contracts.ts`   | `target_app`, `reason_code`, `display_name`, `account_status`, `role_context`, `tenant_id`, `access_token`, `current_user`                                |
| `apps/api/src/types/errors.ts`     | `error_code`, `target_app`, `reason_code`                                                                                                                 |
| `packages/types/src/index.ts`      | `growth_rate_percentage`, `total_tenant_count`, `tenant_user_count`, `tenant_status_counts`, `new_tenant_counts`, `tenant_growth_rates`, `tenant_summary` |

### API Route Handlers (Response Builder Mapping)

| File                                                  | Snake_case Properties                                                                                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/api/src/routes/auth.ts`                         | `display_name`, `account_status`, `role_context`, `tenant_id`, `target_app`, `reason_code`, `access_token`, `current_user`                                |
| `apps/api/src/routes/platform-tenants.ts`             | `management_system_type_code`, `tenant_id`, `schema_name`, `applied_versions`, `previous_status`                                                          |
| `apps/api/src/platform/dashboard/overview-service.ts` | `tenant_summary`, `total_tenant_count`, `tenant_user_count`, `tenant_status_counts`, `new_tenant_counts`, `tenant_growth_rates`, `growth_rate_percentage` |
| `apps/api/src/types/errors.ts` (`sendAuthError`)      | `error_code`, `target_app`, `reason_code`                                                                                                                 |

### OpenAPI Documentation

| File                           | Impact                                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `apps/api/src/docs/openapi.ts` | All schema property names, required arrays, and example values that use `snake_case` must be updated to camelCase. |

### Web-Side Consumers

| File                                                    | Snake_case Properties                                                                                                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web/lib/auth/types.ts`                            | `target_app`, `reason_code`, `tenant_id`, `display_name`, `account_status`, `role_context`, `access_token`, `current_user`, `error_code`                  |
| `apps/web/lib/routing/auth-routing.ts`                  | `target_app`, `reason_code`                                                                                                                               |
| `apps/web/lib/auth/api.ts`                              | `error_code`, `access_token`, `current_user`                                                                                                              |
| `apps/web/lib/auth/storage.ts`                          | `access_token`                                                                                                                                            |
| `apps/web/app/platform/page.tsx`                        | `tenant_summary`, `total_tenant_count`, `tenant_user_count`, `tenant_status_counts`, `new_tenant_counts`, `tenant_growth_rates`, `growth_rate_percentage` |
| `apps/web/components/platform/platform-shell-frame.tsx` | `display_name`                                                                                                                                            |
| `apps/web/app/tenant/page.tsx`                          | `display_name`                                                                                                                                            |

### Tests

| File                                                                         | Snake_case Properties                                                                                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `apps/api/tests/integration/platform-dashboard-overview.integration.spec.ts` | `tenant_summary`, `total_tenant_count`, `tenant_user_count`, `tenant_status_counts`, `new_tenant_counts`, `tenant_growth_rates` |
| `apps/api/tests/integration/authenticate.middleware.spec.ts`                 | `error_code`                                                                                                                    |
| `apps/api/tests/integration/platform-rbac.spec.ts`                           | `error_code`                                                                                                                    |
| `apps/api/tests/integration/tenant-admin-rbac.spec.ts`                       | `tenant_id`, `error_code`                                                                                                       |
| `apps/api/tests/integration/tenant-user-rbac.spec.ts`                        | `tenant_id`, `error_code`                                                                                                       |
| `apps/web/tests/auth-flow.spec.ts`                                           | All auth property references                                                                                                    |

## Property Rename Map

| Current (snake_case)             | Target (camelCase)         |
| -------------------------------- | -------------------------- |
| `management_system_type_code`    | `managementSystemTypeCode` |
| `tenant_id` (in response bodies) | `tenantId`                 |
| `schema_name`                    | `schemaName`               |
| `applied_versions`               | `appliedVersions`          |
| `previous_status`                | `previousStatus`           |
| `target_app`                     | `targetApp`                |
| `reason_code`                    | `reasonCode`               |
| `display_name`                   | `displayName`              |
| `account_status`                 | `accountStatus`            |
| `role_context`                   | `roleContext`              |
| `access_token`                   | `accessToken`              |
| `current_user`                   | `currentUser`              |
| `error_code`                     | `errorCode`                |
| `growth_rate_percentage`         | `growthRatePercentage`     |
| `total_tenant_count`             | `totalTenantCount`         |
| `tenant_user_count`              | `tenantUserCount`          |
| `tenant_status_counts`           | `tenantStatusCounts`       |
| `new_tenant_counts`              | `newTenantCounts`          |
| `tenant_growth_rates`            | `tenantGrowthRates`        |
| `tenant_summary`                 | `tenantSummary`            |

## Acceptance Criteria

1. A repository-level engineering rule is documented in `docs/process/engineering-constitution.md` mandating camelCase for API request/response body properties.
2. Every Zod schema defining a public API request or response shape uses camelCase property names.
3. All route handlers and service functions that build response objects use camelCase keys.
4. OpenAPI documentation in `apps/api/src/docs/openapi.ts` is aligned with the camelCase contracts.
5. Web-side types, utilities, and components are updated to consume camelCase API payloads.
6. All integration tests and web test fixtures assert camelCase property names.
7. TypeScript compilation passes across all packages (`pnpm typecheck`).
8. All existing tests pass after the renaming (`pnpm test`).
9. Breaking changes and migration guidance are documented in the PR description.
