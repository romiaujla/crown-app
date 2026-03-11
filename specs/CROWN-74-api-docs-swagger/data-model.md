# Data Model: CROWN-74 API Docs Swagger

## Runtime Documentation Models

### OpenApiDocument

- **Role in `CROWN-74`**: Top-level in-memory document passed to Swagger UI for rendering the docs page.
- **Key fields**:
  - `openapi`
  - `info`
  - `servers`
  - `tags`
  - `components`
  - `paths`
- **Rules**:
  - Exists only in application memory for this story.
  - Must include only the auth-bearing endpoints currently in scope.
  - Must not be published through a separate raw JSON route.

### SecurityScheme

- **Role in `CROWN-74`**: Describes bearer-token expectations for protected routes in Swagger UI.
- **Key fields**:
  - `type`
  - `scheme`
  - `bearerFormat`
- **Rules**:
  - Applies to protected routes such as `/api/v1/auth/me`, `/api/v1/platform/ping`, `/api/v1/tenant/admin/{tenantId}`, `/api/v1/tenant/user/{tenantId}`, and `/api/v1/platform/tenants`.
  - Login and logout remain documented separately according to their runtime behavior.

### OperationDescriptor

- **Role in `CROWN-74`**: Captures route-level summary, request body, parameters, and response expectations for each documented endpoint.
- **Key fields**:
  - `summary`
  - `description`
  - `tags`
  - `parameters`
  - `requestBody`
  - `responses`
  - `security`
- **Rules**:
  - Must reflect the current API contracts already enforced by tests.
  - Should include representative examples for login payloads and auth error responses where useful.

### DocsRouteConfig

- **Role in `CROWN-74`**: Encapsulates how `/api/v1/docs` is mounted into the Express app.
- **Key fields**:
  - `mountPath`
  - `swaggerUiOptions`
  - `documentProvider`
- **Rules**:
  - Mount path is fixed to `/api/v1/docs` for this story.
  - The route should be additive and should not interfere with existing auth or health endpoints.

## Existing Runtime Contracts Reused

### AuthRouteSchemas

- **Source**: `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/contracts.ts`
- **Role in `CROWN-74`**: Provide the canonical request and response field shapes for login, logout, and current-user docs.

### AuthErrorResponse

- **Source**: existing error response behavior across auth and authorization routes
- **Role in `CROWN-74`**: Shared documented error envelope for `401`, `403`, `400`, and `409` examples in auth-bearing routes.
