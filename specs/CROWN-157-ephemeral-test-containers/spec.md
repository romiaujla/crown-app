# Feature Specification: Ephemeral Test Database Containers

**Feature Branch**: `feat/CROWN-157-ephemeral-test-containers`
**Jira Issue**: [CROWN-157](https://crown-crm.atlassian.net/browse/CROWN-157)
**Created**: 2026-03-16
**Status**: Draft

## Problem Statement

### Current State

- Tests require a local PostgreSQL database instance to be running on the developer's machine during test execution
- Developers must manually start and manage a local database service (e.g., Docker Desktop, brew services, or cloud-hosted instance)
- Test database state persists between test runs, potentially causing flaky tests due to residual state
- GitHub Actions CI/CD workflows require additional database configuration outside the repository
- High friction for new developers onboarding to the project

### Desired State

- Tests automatically provision an ephemeral PostgreSQL container at test startup
- Database is automatically seeded and destroyed after tests complete
- Same container approach works in both local development and GitHub Actions environments
- Zero manual database setup required for developers
- Test isolation is guaranteed by container lifecycle management

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Developers Can Run Tests Without Local Database Setup (Priority: P1)

As a developer, I need tests to start an ephemeral database container automatically so I can run the test suite without manually managing a local database instance.

**Why this priority**: Blocking: All test workflows are currently blocked by manual database setup, creating friction in daily development and CI/CD.

**Independent Test**: A reviewer can clone the repository on a fresh machine, run `pnpm test` without starting a database service, and confirm all tests pass.

**Acceptance Scenarios**:

1. **Given** a developer checks out the repository, **When** they run `pnpm test`, **Then** the test framework automatically starts a PostgreSQL container and seeds it with initial test data before test execution.
2. **Given** tests are executing in the container-based database, **When** tests complete, **Then** the container is automatically destroyed and no residual database state persists on the machine.
3. **Given** a developer manually stops a running test process mid-execution, **When** the process terminates, **Then** any running database containers are cleaned up to prevent orphaned containers.

---

### User Story 2 - GitHub Actions Uses the Same Container-Based Approach (Priority: P1)

As a CI/CD maintainer, I need GitHub Actions workflows to use the same ephemeral container approach as local development so the test environment is consistent across all contexts.

**Why this priority**: Blocking: CI/CD reliability depends on matching the local development environment; divergent setups cause "works locally but fails in CI" problems.

**Independent Test**: A reviewer can inspect the GitHub Actions workflow definitions and confirm they use the same container-based database approach as the local test setup.

**Acceptance Scenarios**:

1. **Given** GitHub Actions runs `pnpm test` or equivalent, **When** the workflow executes, **Then** the same ephemeral container approach is used without additional service configuration in the workflow.
2. **Given** tests are executing in GitHub Actions, **When** all tests complete, **Then** no manual cleanup is required and no containers persist in the GitHub Actions runner.

---

### User Story 3 - Tests Run in Isolation Without Residual State (Priority: P2)

As a test author, I need to know that each test run operates on a clean database so I can write tests without worrying about state from previous test runs.

**Why this priority**: Important: Test isolation prevents flaky tests and ensures test authoring is straightforward.

**Independent Test**: A reviewer can run the test suite multiple times consecutively and confirm all tests pass every run without state carryover.

**Acceptance Scenarios**:

1. **Given** tests are executed in sequence or in parallel, **When** a new test process starts, **Then** the database is in a clean state initialized by the seed process.
2. **Given** a test modifies database state during execution, **When** that test completes, **Then** subsequent tests do not see the residual state from the previous test.

---

### User Story 4 - Documentation is Updated for Local Testing (Priority: P2)

As a new team member, I need clear documentation of the local testing setup so I can confidently run tests without confusion.

**Why this priority**: Important: Documentation ensures smooth onboarding and reduces support burden for setting up the test environment.

**Independent Test**: A reviewer can follow the updated documentation on a fresh machine and successfully run the test suite.

**Acceptance Scenarios**:

1. **Given** a developer reads the local testing documentation, **When** they follow the provided steps, **Then** they can run `pnpm test` successfully without additional configuration.
2. **Given** documentation is provided, **When** a developer encounters a test-related issue, **Then** the documentation provides troubleshooting guidance for common container-related problems.

### Edge Cases

- The machine is out of disk space and cannot start a new container.
- Docker Desktop is not installed or the Docker daemon is not running.
- Multiple concurrent test processes try to use the same container port.
- A test process crashes or is terminated without cleanup, leaving orphaned containers.
- The container is successfully created but the health check times out.
- The seed process fails partway through, leaving the database in an inconsistent state.
- Network connectivity is interrupted during container startup.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The test framework MUST automatically provision a PostgreSQL container before tests execute.
- **FR-002**: The system MUST apply the seed process to initialize test data into the ephemeral container.
- **FR-003**: The system MUST automatically destroy the container and clean up any resources after tests complete or terminate.
- **FR-004**: The container MUST be isolated per test process or test session to prevent port conflicts and state sharing between concurrent test runs.
- **FR-005**: The system MUST provide deterministic container naming or port allocation to ensure predictable test execution.
- **FR-006**: The system MUST include health checks to confirm the database is ready before tests begin.
- **FR-007**: The system MUST support both local development and GitHub Actions environments without configuration changes.
- **FR-008**: The system MUST provide mechanisms to override or customize the container configuration for debugging or special cases.
- **FR-009**: The system MUST generate and provide connection details (host, port, credentials) to the test suite at runtime.
- **FR-010**: The system MUST handle cleanup gracefully even if test processes are interrupted or crash.

### Non-Functional Requirements

- **NFR-001**: Container startup and teardown MUST complete within a reasonable time frame (target: < 10 seconds per test run overhead).
- **NFR-002**: The solution MUST not require manual intervention or background services running between test executions.
- **NFR-003**: The solution MUST work reliably across macOS (Intel and Apple Silicon), Linux, and GitHub Actions runners.
- **NFR-004**: The solution MUST be compatible with existing test framework setup and CI/CD pipelines.

### Integration Requirements

- **IR-001**: The container setup MUST integrate with the existing Vitest test harness.
- **IR-002**: The container setup MUST use the existing seed process (`apps/api/prisma/seed.ts` or equivalent).
- **IR-003**: The database connection configuration MUST be provided to the existing Prisma Client and test fixtures without major refactoring.
- **IR-004**: The solution MUST not break existing test behavior or require rewriting tests.

## Key Components _(include if feature involves infrastructure)_

- **Test Database Container**: A Docker-based PostgreSQL instance provisioned specifically for a test run.
- **Container Orchestration Layer**: Logic to start, configure, and manage the container lifecycle (using Docker SDK, Testcontainers, or equivalent).
- **Health Check**: A mechanism to confirm the database is ready and accepting connections before yielding to tests.
- **Connection Configuration Provider**: Runtime logic that provides connection details (host, port, credentials, database name) to the test suite.
- **Seed Integration**: The seed process that initializes test data into the ephemeral container.
- **Cleanup Handler**: Logic that reliably destroys containers and cleans up resources on test completion or interruption.
- **Environment Configuration**: Configuration that selects the appropriate container strategy for local vs. CI/CD contexts.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Developers can run `pnpm test` on a fresh machine without starting a database service; all tests pass.
- **SC-002**: GitHub Actions workflows run tests without additional database service configuration; all tests pass with the same pass rate as local development.
- **SC-003**: Container startup and teardown overhead per test run is ≤ 10 seconds.
- **SC-004**: Running the test suite 5 consecutive times produces the same results; no flaky tests due to residual state.
- **SC-005**: Updated documentation guides a new team member through local testing setup successfully.
- **SC-006**: Zero orphaned containers remain on developer machines after test runs complete or crash.

## Technical Constraints

- **Container Tool**: Docker must be available (Docker Desktop on macOS/Windows or Docker on Linux).
- **Database Version**: PostgreSQL version MUST match the production baseline defined in the repository (currently PostgreSQL 13+).
- **Seed Process**: The existing seed process must be applied to populate test data deterministically.
- **Port Allocation**: Container ports MUST not conflict with other services on the developer's machine.

## Assumptions

- Developers have Docker installed and the Docker daemon is running (or can be started automatically where applicable).
- The existing seed process (`apps/api/prisma/seed.ts` or equivalent) contains all necessary test data initialization.
- Tests can be modified slightly to read connection details from environment variables or a configuration provider.
- GitHub Actions runners have Docker available and Docker can be used in workflows.
- The team prefers a solution that minimizes per-container resource usage and startup time.

## Out of Scope

- Building a custom container image; use official PostgreSQL images.
- Implementing database schema migration management beyond existing Prisma migrations.
- Modifying the seed process itself (that is managed separately).
- End-to-end testing of application features; this is about the test environment infrastructure.
- Performance testing or load testing of the container setup.
- Supporting multiple database backends (PostgreSQL only for this feature).

## Context & Prior Art

- The repository already uses Prisma ORM with PostgreSQL as the canonical database.
- Existing seed process is in `apps/api/prisma/seed.ts`.
- Current Docker setup is defined in `infra/docker/`.
- Test framework is Vitest.
- CI/CD is GitHub Actions.
