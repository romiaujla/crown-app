# Feature Specification: Signed JWT Issuance And Verification For API Auth

**Feature Branch**: `feat/CROWN-73-signed-jwt-api-auth`  
**Created**: 2026-03-12  
**Status**: Draft  
**Input**: Jira issue `CROWN-73` - "Implement signed JWT issuance and verification for API auth"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Issue signed access tokens on login (Priority: P1)

As a Crown developer, I want the login route to issue signed JWT access tokens so authenticated API requests are backed by cryptographic integrity instead of placeholder token strings.

**Why this priority**: Replacing unsigned login tokens is the core value of the story. Without signed issuance, the auth flow remains explicitly non-production-grade.

**Independent Test**: A reviewer can log in successfully, inspect the returned access token, and verify it is a signed JWT that can be accepted by the protected-route middleware without relying on the old `alg: none` placeholder format.

**Acceptance Scenarios**:

1. **Given** valid login credentials, **When** `POST /api/v1/auth/login` succeeds, **Then** the response returns a signed JWT access token and the existing claims and current-user contract.
2. **Given** invalid login credentials, **When** the login request is processed, **Then** the API returns the existing structured auth error contract and does not issue a token.

---

### User Story 2 - Verify JWT signatures on protected routes (Priority: P2)

As a Crown developer, I want protected-route middleware to verify JWT signatures and expected signing configuration so tampered or malformed bearer tokens are rejected consistently.

**Why this priority**: Signed issuance alone is not sufficient if protected routes still trust decoded payloads without cryptographic verification.

**Independent Test**: A reviewer can call protected routes with a valid signed token, a malformed token, a tampered token, and an expired token and verify the middleware accepts only the valid token while preserving the defined auth error behavior for failures.

**Acceptance Scenarios**:

1. **Given** a valid signed access token, **When** the request reaches authenticated middleware, **Then** the middleware verifies the token and resolves the authenticated principal for downstream handlers.
2. **Given** a token with an invalid signature or modified payload, **When** the request reaches authenticated middleware, **Then** the API rejects the request with the defined auth error response.
3. **Given** an expired signed token, **When** the request reaches authenticated middleware, **Then** the API rejects the request as unauthenticated.

---

### User Story 3 - Define the signing configuration surface clearly (Priority: P3)

As a maintainer, I want the API auth layer to define its JWT signing configuration explicitly so local development and future hosted environments use a consistent, documented secret-based signing surface.

**Why this priority**: The implementation needs an explicit and stable configuration contract, otherwise signed JWT behavior will drift between environments.

**Independent Test**: A reviewer can inspect the auth configuration and quickstart guidance and verify the signed-token flow works with the repository’s configured JWT secret inputs without introducing refresh-token persistence or unrelated session scope.

**Acceptance Scenarios**:

1. **Given** the API runs in local development, **When** auth configuration is loaded, **Then** the access-token signing secret is read from the defined environment surface used by the signed JWT implementation.
2. **Given** the story is reviewed for scope, **When** implementation and docs are inspected, **Then** refresh-session persistence and refresh-token storage remain out of scope.

### Edge Cases

- A bearer token is syntactically shaped like a JWT but signed with the wrong secret.
- A bearer token payload is modified after issuance while preserving the original header and structure.
- A token is otherwise valid but uses an unexpected algorithm configuration for this implementation.
- A token is well-signed but expired and must still be rejected consistently.
- Existing tests or helpers still generate placeholder `alg: none` tokens and need to move to signed fixtures without widening story scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST issue signed JWT access tokens from `POST /api/v1/auth/login` instead of unsigned placeholder tokens.
- **FR-002**: The system MUST preserve the existing login response contract shape for `claims` and `current_user` while replacing only the token integrity behavior.
- **FR-003**: The system MUST verify JWT signatures on protected routes before accepting authenticated claims.
- **FR-004**: The system MUST enforce the expected signing configuration and reject tokens that are malformed, tampered, expired, or signed with invalid configuration.
- **FR-005**: The system MUST continue returning the established structured auth error responses for invalid or unverifiable tokens.
- **FR-006**: The system MUST define the access-token signing configuration surface for local and future hosted environments through repository-supported environment configuration.
- **FR-007**: The system MUST keep persistent refresh sessions, refresh-token storage, and logout revocation behavior out of scope for this story.
- **FR-008**: The system MUST update auth helpers and tests that currently depend on placeholder token generation so validation reflects the signed-token runtime behavior.

### Key Entities *(include if feature involves data)*

- **Signed Access Token**: The JWT issued after successful login whose integrity depends on the configured signing secret and expected algorithm.
- **JWT Signing Configuration**: The environment-backed access-token signing settings used for issue and verify behavior.
- **Verified Auth Claims**: The claims payload accepted by middleware only after signature and expiration validation succeeds.
- **Token Validation Failure**: The set of malformed, tampered, expired, or misconfigured-token outcomes that map to the existing auth error contract.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of successful login responses return signed access tokens instead of the previous `alg: none` placeholder format.
- **SC-002**: Reviewers can verify that 100% of protected-route requests with valid signed tokens continue to resolve authenticated principal context successfully.
- **SC-003**: Reviewers can verify that malformed, tampered, wrongly signed, and expired tokens are rejected consistently across the protected auth surface.
- **SC-004**: Reviewers can confirm from configuration, code, and tests that signed JWT behavior is implemented without adding refresh-session persistence or refresh-token storage.

## Assumptions

- `CROWN-73` builds directly on the auth route and middleware foundation already delivered under `CROWN-61`.
- The first signed-token implementation can use a shared secret and a single expected algorithm rather than asymmetric keys or key rotation.
- The existing `claims` shape remains authoritative for this phase, so this story replaces issuance and verification mechanics rather than redesigning auth claims.
