# Quickstart: Signed JWT Issuance And Verification For API Auth

## Local Verification

1. Run the API test suite:

```bash
pnpm --filter @crown/api test
```

2. Start the API locally if manual verification is needed:

```bash
pnpm --filter @crown/api dev
```

3. Submit a valid login request to confirm the API returns a signed bearer token:

```bash
curl -s http://localhost:4000/api/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"identifier":"super-admin@acme-local.test","password":"Password123!"}'
```

4. Reuse the returned bearer token against an authenticated route such as:

```bash
curl -i http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer <signed-token>"
```

5. Confirm tampered or malformed tokens are rejected with the existing auth error contract.

## Environment Surface

- `JWT_ACCESS_SECRET` must be present for access-token signing and verification.
- `JWT_REFRESH_SECRET` remains defined in config today but refresh-session behavior stays out of scope for `CROWN-73`.
