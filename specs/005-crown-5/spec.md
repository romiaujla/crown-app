# Feature Specification: Tenant Provisioning and Schema Bootstrap

**Feature Branch**: `005-crown-5`  
**Created**: 2026-03-03  
**Status**: Draft  
**Input**: Jira issue `CROWN-5` (Tenant Provisioning and Schema Bootstrap)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Provision Tenant with Isolated Schema (Priority: P1)

As a super admin, I want tenant provisioning to create an isolated tenant schema so that CRM data remains partitioned by tenant.

**Why this priority**: Isolated schema creation is the primary safety boundary for multi-tenant data separation.

**Independent Test**: Can be tested by provisioning a tenant and verifying schema creation in PostgreSQL plus global tenant metadata persistence.

**Acceptance Scenarios**:

1. **Given** a valid super-admin provisioning request with unique `slug`, **When** provisioning is executed, **Then** schema `tenant_<slug>` is created and tenant metadata is persisted.
2. **Given** a provisioning request with duplicate tenant `slug`, **When** provisioning is executed, **Then** the request is rejected with conflict semantics and no partial provisioning side effects.

---

### User Story 2 - Bootstrap Baseline Management-System Tables (Priority: P1)

As a super admin, I want baseline tenant SQL migrations to execute during provisioning so that new tenants are immediately usable for core management-system entities.

**Why this priority**: Provisioned tenants are not operational until baseline domain tables exist.

**Independent Test**: Can be tested by provisioning a tenant and verifying required tables (`organizations`, `people`, `work_items`, `activity_records`) in the tenant schema.

**Acceptance Scenarios**:

1. **Given** schema creation succeeds, **When** baseline migrations run, **Then** all baseline tables are created in tenant schema.
2. **Given** a migration failure during provisioning, **When** execution ends, **Then** failure is reported and migration version tracking reflects only successful migration steps.

---

### User Story 3 - Track Provisioning and Schema Version Metadata (Priority: P2)

As an operator, I want global metadata to record tenant provisioning and applied schema versions so that platform state is auditable and repeatable.

**Why this priority**: Operational observability and safe recovery require durable version history per tenant.

**Independent Test**: Can be tested by verifying `tenants` and `tenant_schema_versions` records after successful or partial provisioning runs.

**Acceptance Scenarios**:

1. **Given** successful provisioning, **When** metadata is queried, **Then** tenant record and baseline schema version entries exist.
2. **Given** repeated provisioning attempts for an existing tenant, **When** metadata is queried, **Then** duplicate version rows are prevented and existing state remains consistent.

### Edge Cases

- Tenant `slug` contains invalid characters or exceeds allowed length and must be rejected before schema creation.
- Provisioning request targets an already existing `schema_name` and must fail atomically.
- Migration files are missing, out of order, or malformed SQL; provisioning must abort with explicit failure reason.
- Retry of a previously failed provisioning run must not duplicate already-applied version records.
- Non-super-admin caller attempts provisioning and is denied before any database side effects.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST expose a platform-level tenant provisioning interface callable only by `super_admin` identity.
- **FR-002**: The system MUST validate tenant input (`name`, `slug`) before database side effects.
- **FR-003**: The system MUST derive schema name as `tenant_<slug>` and enforce uniqueness across tenants.
- **FR-004**: The system MUST create tenant metadata in global `tenants` table.
- **FR-005**: The system MUST create PostgreSQL schema `tenant_<slug>` for each successfully provisioned tenant.
- **FR-006**: The system MUST execute baseline tenant SQL migrations from versioned migration files.
- **FR-007**: The system MUST write version-tracking records to global `tenant_schema_versions` for each applied migration version.
- **FR-008**: The system MUST prevent duplicate migration version entries per tenant.
- **FR-009**: The system MUST return deterministic error categories for validation failures, authorization failures, conflicts, and migration execution failures.
- **FR-010**: The system MUST log provisioning attempts and outcomes using structured logs suitable for audit and incident triage.
- **FR-011**: The system MUST ensure provisioning operations are idempotent-safe for retry paths where initial attempt partially applied migrations.
- **FR-012**: The system MUST document provisioning API and migration runner contracts for implementation and testing.

### Key Entities _(include if feature involves data)_

- **TenantProvisionRequest**: Input payload defining tenant identity attributes (`name`, `slug`) and actor context.
- **Tenant**: Global control-plane tenant record containing `id`, `name`, `slug`, `schema_name`, `status`, timestamps.
- **TenantMigrationDefinition**: Versioned migration file metadata (`version`, `description`, `sqlPath`, checksum optional).
- **TenantSchemaVersion**: Durable record of applied migration versions per tenant with actor/timestamp.
- **ProvisioningResult**: Outcome artifact with created tenant metadata, schema name, applied versions, and failure details when applicable.

### Assumptions

- Existing RBAC/auth middleware from CROWN-4 is available to gate platform endpoints.
- Global control-plane tables defined in Prisma schema are the source of truth for tenant metadata and version tracking.
- Baseline migration files under `apps/api/tenant-migrations/0001_base` remain canonical for initial tenant bootstrap.

### Dependencies

- PostgreSQL user has permission to create schemas and execute DDL in tenant schemas.
- Existing tenant migration runner strategy in `apps/api/src/tenant/migrator.ts` is extended for execution behavior.
- Contract and integration tests can run against disposable PostgreSQL instances (Testcontainers).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of successful provisioning requests create a unique tenant metadata record and corresponding `tenant_<slug>` schema.
- **SC-002**: 100% of successful provisioning requests apply baseline migration set and create version records for each baseline migration step.
- **SC-003**: 100% of duplicate-tenant provisioning attempts return conflict outcomes with no additional schema/version side effects.
- **SC-004**: 100% of unauthorized provisioning attempts are denied before schema creation or migration execution.
- **SC-005**: In integration testing, provisioning retry behavior after a simulated mid-run failure preserves consistency (no duplicate schema version rows) in all tested scenarios.
