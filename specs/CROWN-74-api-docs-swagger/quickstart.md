# Quickstart: CROWN-74 API Docs Swagger

## Goal

Validate that the API serves a local browser-friendly Swagger UI page for the current auth-bearing routes.

## Prerequisites

- API workspace dependencies are installed.
- The API can start locally.
- Existing auth-bearing route contracts remain green before and after the docs route is added.

## Validation Flow

1. Start the API locally.
2. Open `/api/v1/docs` in a browser.
3. Confirm Swagger UI renders successfully instead of a raw JSON payload or plain HTML placeholder.
4. Confirm the docs page includes:
   - `POST /api/v1/auth/login`
   - `GET /api/v1/auth/me`
   - `POST /api/v1/auth/logout`
   - `GET /api/v1/platform/ping`
   - `GET /api/v1/tenant/admin/{tenantId}`
   - `GET /api/v1/tenant/user/{tenantId}`
   - `POST /api/v1/platform/tenants`
5. Confirm protected routes clearly indicate bearer authentication requirements.
6. Confirm login docs show the supported `identifier` and `password` payload shape.
7. Run focused docs-route tests in the API workspace.
8. Run the full API test suite and fix any regressions before handoff.

## Out of Scope Checks

- Separate public OpenAPI JSON exposure
- Hosted or production docs publishing strategy
- Full non-auth API documentation coverage
