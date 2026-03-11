# Contract: API Docs Swagger

## Purpose

Define the runtime contract for serving Swagger UI for the auth-bearing API surface at `/api/v1/docs`.

## Docs Route

### `GET /api/v1/docs`

- Serves Swagger UI for local/dev use.
- Renders a browser-friendly documentation page for the current auth-bearing endpoints.
- Does not replace or alter existing auth route behavior.

## Documented Endpoint Scope

The docs page must cover these existing auth-bearing routes:

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/platform/ping`
- `GET /api/v1/tenant/admin/{tenantId}`
- `GET /api/v1/tenant/user/{tenantId}`
- `POST /api/v1/platform/tenants`

## Documentation Expectations

- Login documents the `identifier` plus `password` request body and authenticated success response.
- Current-user documents bearer-auth requirements and the principal/role-context response.
- Logout documents the stateless `204 No Content` behavior.
- Protected routes document bearer-auth requirements and relevant `401` or `403` outcomes.
- Platform tenant provisioning documents bearer-auth, request payload expectations, and success/error outcomes.

## Out of Scope Contract

- No separate public raw OpenAPI JSON endpoint is introduced in this story.
- No hosted/public docs publication workflow is introduced in this story.
- No expansion to unrelated non-auth route documentation is required in this story.
