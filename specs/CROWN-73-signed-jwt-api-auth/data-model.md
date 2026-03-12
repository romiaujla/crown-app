# Data Model: Signed JWT Issuance And Verification For API Auth

## Signed Access Token

- Represents the bearer token returned by `POST /api/v1/auth/login`.
- Encodes the existing JWT claims payload already used by the API auth foundation:
  - `sub`
  - `role`
  - `tenant_id`
  - `exp`
- Adds cryptographic integrity via the configured signing secret and expected algorithm.

## JWT Signing Configuration

- `accessSecret`: secret value used to sign and verify access tokens.
- `algorithm`: the single supported algorithm for this phase.
- `expiresIn`: derived from the existing access-token TTL behavior already used by the auth service.

## Verified Auth Context

- Produced only after the bearer token signature and expiration are validated successfully.
- Reuses the existing `JwtClaims` shape and current-user resolution path.
- Continues to populate:
  - `req.auth`
  - `req.authContext`

## Validation Failure States

- `malformed_token`: bearer value cannot be parsed as the expected signed JWT form.
- `invalid_signature`: token structure is present but verification fails against the configured secret or algorithm.
- `expired_token`: token verifies structurally but is no longer valid based on `exp`.
- `invalid_claims`: token verifies cryptographically but the payload does not satisfy the repository claims schema or cannot be resolved to a current user.
