# Research: Tenant Provisioning and Schema Bootstrap

## Decision 1: Tenant provisioning entrypoint stays under platform namespace

- Decision: Define provisioning contract at `POST /api/v1/platform/tenants` and gate it with existing `super_admin` platform authorization middleware.
- Rationale: Existing API boundaries document platform controls under `/api/v1/platform/*`, and CROWN-4 already enforces namespace-based RBAC.
- Alternatives considered:
  - Add provisioning under `/api/v1/tenant/*`: rejected because tenant namespace is for tenant-scoped operations, not tenant creation.
  - Build an internal-only script without API contract: rejected because CROWN-5 explicitly requires contract/testable behavior.

## Decision 2: Slug normalization and schema naming contract

- Decision: Enforce lowercase kebab-case slug pattern `^[a-z0-9]+(?:-[a-z0-9]+)*$` with max length 48 and derive schema name as `tenant_<slug>`.
- Rationale: Prevents SQL identifier ambiguity, keeps schema names predictable, and aligns with existing architecture/ADR language.
- Alternatives considered:
  - Allow underscores or mixed-case slugs: rejected due to operator inconsistency and migration path complexity.
  - Generate opaque schema names unrelated to slug: rejected because it reduces operational traceability.

## Decision 3: Migration execution order and tracking semantics

- Decision: Apply tenant migrations in lexical order from versioned directories/files and insert one `tenant_schema_versions` row per applied version inside the same transaction boundary for each version step.
- Rationale: Deterministic ordering and per-version tracking simplify restart behavior and auditability.
- Alternatives considered:
  - Single monolithic migration SQL blob: rejected because partial-failure diagnosis and version recovery become difficult.
  - Track only latest version number: rejected because detailed audit and replay diagnostics are lost.

## Decision 4: Failure behavior and idempotent-safe retries

- Decision: Provisioning flow performs: validate input -> create tenant row + schema -> run migrations; duplicate slug/schema conflicts return deterministic conflict error; reruns skip already-applied versions using unique `(tenantId, version)`.
- Rationale: Matches acceptance criteria for consistency under retries and avoids duplicate side effects.
- Alternatives considered:
  - Full rollback of tenant row/schema on any migration failure: rejected for now due to operational risk and complexity in mixed DDL scenarios.
  - Re-run all migrations on retry without checking versions: rejected because duplicate DDL would fail and violate idempotency goals.

## Decision 5: Validation and error taxonomy

- Decision: Use Zod request validation for tenant provisioning payload and map failures to explicit categories: `validation_error`, `unauthenticated`, `forbidden_role`, `conflict`, `migration_failed`.
- Rationale: Deterministic error classes improve API contract tests and operator debugging.
- Alternatives considered:
  - Generic `400/500` with free-form messages: rejected because test and client behavior become ambiguous.
  - Surface raw SQL errors to clients: rejected to avoid leaking internals.

## Decision 6: Testing strategy for CROWN-5

- Decision: Add contract tests for provisioning endpoint semantics and integration tests with Testcontainers PostgreSQL covering happy path, duplicate slug conflict, and retry-after-partial-failure behavior.
- Rationale: Constitution requires tests for behavior changes; this feature’s risk is in DB side effects and isolation guarantees.
- Alternatives considered:
  - Unit tests only: rejected because schema creation/migration behavior requires real database execution.
  - Manual QA only: rejected because deterministic regression protection is required.
