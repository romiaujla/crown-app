# Research: Signed JWT Issuance And Verification For API Auth

## Current Runtime Baseline

- `apps/api/src/routes/auth.ts` currently builds access tokens with a local `toToken` helper that emits `alg: "none"` JWT-like strings and a static `.signature` suffix.
- `apps/api/src/middleware/authenticate.ts` currently accepts bearer tokens by decoding JSON or the base64url payload segment directly, without cryptographic signature verification.
- `apps/api/src/config/env.ts` already defines `JWT_ACCESS_SECRET`, which provides a natural configuration surface for this story’s signed access-token implementation.
- `apps/api/tests/helpers/auth-fixtures.ts` and multiple contract/integration tests currently depend on placeholder token generation and therefore need to move to signed test fixtures.

## Design Direction

- Introduce a shared auth-token utility that is responsible for both issuance and verification so login and middleware cannot drift.
- Keep the existing claims shape (`sub`, `role`, `tenant_id`, `exp`) and current-user response contract intact where possible.
- Validate the decoded payload with `JwtClaimsSchema` after signature verification succeeds, preserving the repository’s Zod-first external input rule.
- Preserve current structured auth error responses by mapping verification failures into the existing `UNAUTHENTICATED` or `INVALID_CLAIMS` outcomes as appropriate.

## Library Choice

- Use a maintained JWT library with explicit sign/verify APIs for symmetric secret handling.
- Favor the smallest additive choice that works cleanly in Node.js 20 and the current Express/Vitest setup.
- The implementation does not need refresh-token support, JWK handling, or asymmetric key rotation in this phase.

## Scope Boundaries

- In scope:
  - signed access-token issuance
  - signed access-token verification
  - environment/config alignment for the access-token secret
  - auth helper and test fixture updates
- Out of scope:
  - refresh tokens
  - persistent sessions
  - logout revocation
  - cookie transport
  - claims redesign beyond what verification requires
