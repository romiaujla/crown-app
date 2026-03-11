# Data Model: CROWN-61 API Auth Foundation

## Existing Entities Reused

### PlatformUser

- **Role in `CROWN-61`**: Source of credential lookup and account-status validation.
- **Relevant fields**:
  - `id`
  - `email`
  - `username`
  - `passwordHash`
  - `accountStatus`
  - `displayName`
  - `role`
- **Rules**:
  - Login lookup may match by normalized email or normalized username.
  - Disabled or inactive statuses are rejected before token issuance.

### PlatformUserTenant

- **Role in `CROWN-61`**: Tenant membership context for tenant-scoped users.
- **Relevant fields**:
  - `platformUserId`
  - `tenantId`
  - `role`
- **Rules**:
  - Tenant-scoped current-user responses must include the resolved tenant membership.
  - Tenant role mismatch remains a forbidden outcome for protected tenant routes.

### Tenant

- **Role in `CROWN-61`**: Source of tenant identity fields returned in current-user payloads when tenant context exists.
- **Relevant fields**:
  - `id`
  - `name`
  - `slug`
  - `schemaName`
  - `status`

## Derived Response Models

### LoginRequest

- **Fields**:
  - `identifier`
  - `password`
- **Rules**:
  - `identifier` accepts either username or email.
  - Empty or malformed request bodies are validation failures, not auth failures.

### AuthenticatedPrincipal

- **Fields**:
  - `platformUserId`
  - `email`
  - `username`
  - `displayName`
  - `role`
  - `accountStatus`
- **Rules**:
  - Represents the authenticated person-level context shared by login, current-user, and middleware.

### TenantMembershipContext

- **Fields**:
  - `tenantId`
  - `tenantSlug`
  - `tenantName`
  - `role`
- **Rules**:
  - Present only for tenant-scoped users.
  - Must align with the resolved authenticated role context.

### CurrentUserResponse

- **Fields**:
  - `principal`
  - `roleContext`
  - `tenant`
  - `targetApp`
- **Rules**:
  - `targetApp` is `platform` for `super_admin`.
  - `targetApp` is `tenant` for `tenant_admin` and `tenant_user`.
  - `tenant` is `null` for `super_admin`.

### AuthErrorResponse

- **Fields**:
  - `error_code`
  - `message`
  - `details` (optional)
- **Rules**:
  - Used for invalid credentials, disabled account, unauthenticated token failures, and forbidden role mismatches.
  - The error-code set must remain stable across auth routes and middleware responses in this story.
