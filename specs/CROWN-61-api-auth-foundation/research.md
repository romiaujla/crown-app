# Research: CROWN-61 API Auth Foundation

## Decision: Reuse the `CROWN-60` credential foundation directly

- **Why**: `CROWN-60` already introduced canonical credential, username, and account-status support on `PlatformUser`. `CROWN-61` should consume that foundation rather than create parallel auth storage or duplicate status concepts.
- **Alternatives considered**:
  - Introduce a separate auth-profile table: rejected because it adds unnecessary joins and widens scope beyond the current Jira story.
  - Embed route-specific auth state in JWT issuance only: rejected because current-user and middleware still need a single source of truth for identity lookup and account status.

## Decision: Keep authentication stateless and access-token only

- **Why**: Jira explicitly excludes persistent refresh sessions and server-side token revocation in this phase. The API contract should make logout a client-discard operation and keep token validation request-scoped.
- **Alternatives considered**:
  - Add refresh-token persistence now: rejected because it violates issue scope and introduces storage, rotation, and revocation concerns not required for this story.
  - Track server-side logout tombstones: rejected because it creates revocation semantics that contradict the intended stateless logout contract.

## Decision: Support one login identifier field that accepts username or email

- **Why**: The issue requires one login contract that accepts either identifier. A single request shape keeps the API stable for web clients and leaves lookup normalization in the API service layer.
- **Alternatives considered**:
  - Separate `username` and `email` fields in the request: rejected because clients would need branching behavior and the contract would expose unnecessary lookup distinctions.
  - Email-only login: rejected because it does not meet the Jira acceptance criteria.

## Decision: Model current-user output around resolved role context and app target

- **Why**: The web shell needs enough response data to decide whether to route the user to the control-plane app or tenant app. The response should expose principal identity, resolved role, tenant context where applicable, and a deterministic app target.
- **Alternatives considered**:
  - Return only raw JWT claims: rejected because the client would need to re-derive routing and membership semantics.
  - Return only user profile fields: rejected because it omits the role and target-app information required by the acceptance criteria.

## Decision: Keep auth errors structurally consistent across unauthenticated and forbidden outcomes

- **Why**: The specification requires predictable error handling for invalid credentials, disabled accounts, and role mismatch. Shared response shape and error codes reduce client branching and simplify contract tests.
- **Alternatives considered**:
  - Route-specific bespoke error payloads: rejected because they fragment the auth contract.
  - Plain-text error messages only: rejected because structured clients need stable machine-readable codes.
