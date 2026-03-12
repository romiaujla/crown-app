# Contract Notes: Signed JWT API Auth

## Preserved Runtime Contracts

- `POST /api/v1/auth/login` keeps returning:
  - `access_token`
  - `claims`
  - `current_user`
- `GET /api/v1/auth/me` continues to require a bearer token and returns the existing current-user contract on success.
- Existing protected routes continue to rely on the same request auth context populated by authenticated middleware.

## Behavioral Change In Scope

- `access_token` changes from an unsigned placeholder token to a signed JWT.
- Authenticated middleware changes from payload decoding to cryptographic verification before claims are accepted.
- Invalid, tampered, malformed, or expired tokens must map to the established auth error response patterns already used by the API.
