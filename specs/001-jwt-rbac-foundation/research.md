# Research: Global Auth and RBAC Foundation

## Decision 1: JWT Claim Contract Uses `sub`, `role`, `tenant_id`

- Decision: Keep the canonical claim set as `sub`, `role`, and `tenant_id`, with `tenant_id` nullable only for `super_admin`.
- Rationale: This matches existing architecture and ADR guidance while preserving tenant-bound enforcement for non-platform roles.
- Alternatives considered:
  - Include additional claims now (permissions arrays, feature flags): rejected to keep MVP contract minimal and testable.
  - Omit `tenant_id`: rejected because tenant-scope enforcement requires explicit tenant context.

## Decision 2: Role Matrix Uses Explicit Namespace Rules

- Decision: Define authorization at namespace level:
  - `/api/v1/platform/*` -> `super_admin` only
  - `/api/v1/tenant/*` -> tenant roles with matching `tenant_id`
  - `/api/v1/auth/*` -> route-specific behavior for token lifecycle
- Rationale: Namespace-level policy is easy to reason about, aligns with current API boundaries, and supports deterministic testing.
- Alternatives considered:
  - Per-endpoint ad hoc rules: rejected due to drift risk and policy duplication.
  - Single global "authenticated" rule: rejected because it does not enforce role boundaries.

## Decision 3: Denial Semantics Standardized to Authentication vs Authorization Outcomes

- Decision: Use consistent outcomes:
  - Missing/invalid token or claims -> unauthenticated denial
  - Valid identity with insufficient role or tenant mismatch -> unauthorized denial
- Rationale: Clear separation improves operator debugging, test clarity, and predictable client behavior.
- Alternatives considered:
  - Single generic deny outcome for all failures: rejected because it obscures root cause.
  - Role-specific custom error payloads: rejected because this can leak sensitive authorization details.

## Decision 4: Contract Artifacts Include OpenAPI for Auth Routes and Decision Table for Middleware

- Decision: Produce:
  - `auth-routes.openapi.yaml` for login/refresh/logout contracts
  - `middleware-rbac-contract.md` for authorization decision rules and invariants
- Rationale: Route interfaces are best represented as API contracts, while middleware decisions are best represented as a role/tenant matrix and rule list.
- Alternatives considered:
  - OpenAPI-only: rejected because middleware decision logic becomes ambiguous.
  - Markdown-only: rejected because API request/response contracts lose machine-readable precision.

## Decision 5: Validation Ownership and Reuse

- Decision: Keep claim shape validation in shared `packages/types` and enforce it in API middleware before role evaluation.
- Rationale: Shared schema prevents drift across modules and supports contract-level tests.
- Alternatives considered:
  - Duplicate schema per route/middleware: rejected due to maintenance risk.
  - Validate only at route handlers: rejected because authorization checks must run before business handlers.
