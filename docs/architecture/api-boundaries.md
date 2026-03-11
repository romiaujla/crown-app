# API Boundaries

## Namespaces
- `/api/v1/auth/*`: login and logout
- `/api/v1/platform/*`: tenant provisioning and platform controls
- `/api/v1/tenant/*`: tenant-scoped management-system operations

## Contract rules
- Platform endpoints require `super_admin`.
- Tenant admin endpoints require `tenant_admin` and tenant context match.
- Tenant user endpoints require `tenant_user` (or `tenant_admin`) and tenant context match.
- All payloads validated with Zod.

## Current contract examples
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/platform/ping`
- `GET /api/v1/tenant/admin/:tenantId`
- `GET /api/v1/tenant/user/:tenantId`
