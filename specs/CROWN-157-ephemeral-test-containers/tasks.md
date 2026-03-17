# Task Breakdown: Ephemeral Test Database Containers

**Jira Issue**: [CROWN-157](https://crown-crm.atlassian.net/browse/CROWN-157)
**Feature Branch**: `feat/CROWN-157-ephemeral-test-containers`
**Plan Reference**: [plan.md](plan.md)
**Status**: Draft (Phase Breakdown)

---

## Phase 1: Foundation & Infrastructure Setup

### Task 1.1: Add Dependencies

**Description**: Update `apps/api/package.json` to include Testcontainers dependencies.

**Acceptance Criteria**:

- [ ] `@testcontainers/postgresql` is added as a dev dependency
- [ ] `@testcontainers/core` is added as a dev dependency
- [ ] Both dependencies are pinned to stable versions
- [ ] `pnpm install` succeeds without conflicts

**Implementation Notes**:

- Run: `cd apps/api && pnpm add --save-dev @testcontainers/postgresql@latest @testcontainers/core@latest`
- Verify `pnpm-lock.yaml` is updated
- Estimated effort: 5 minutes

**Deliverable**: Updated `apps/api/package.json` with new dependencies

---

### Task 1.2: Create Container Provider Module

**Description**: Create `apps/api/test/db-container.ts` to encapsulate Testcontainers PostgreSQL container lifecycle.

**Acceptance Criteria**:

- [ ] Module exports `startTestContainer()` function
- [ ] Module exports `stopTestContainer(container)` function
- [ ] `startTestContainer()` returns container connection details (host, port, database, user, password)
- [ ] Container is configured with PostgreSQL default credentials
- [ ] Module includes JSDoc comments for public functions
- [ ] Module handles errors gracefully (throws on startup failure)

**Implementation Notes**:

```typescript
// Expected interface:
export interface TestDatabaseContainer {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  url: string; // Full DATABASE_URL
}

export async function startTestContainer(): Promise<TestDatabaseContainer>;
export async function stopTestContainer(container: any): Promise<void>;
```

**Deliverable**: `apps/api/test/db-container.ts`

---

### Task 1.3: Integrate Vitest Setup Hook

**Description**: Create `apps/api/test/setup.ts` to integrate container startup with Vitest lifecycle.

**Acceptance Criteria**:

- [ ] `setup.ts` is created in `apps/api/test/`
- [ ] Setup file is referenced in Vitest config via `setupFiles`
- [ ] Container is started before any tests run
- [ ] Container connection details are exposed to tests via environment variables
- [ ] Container is properly stopped after all tests complete

**Implementation Notes**:

- Update `apps/api/vitest.config.ts` to include setup file
- Set environment variables: `DATABASE_URL`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`
- Use Vitest's `beforeAll()` and `afterAll()` hooks

**Deliverable**: Updated `apps/api/vitest.config.ts` + new `apps/api/test/setup.ts`

---

### Task 1.4: Smoke Test - Container Lifecycle

**Description**: Create a minimal test to verify container starts and stops correctly.

**Acceptance Criteria**:

- [ ] Test verifies container starts without errors
- [ ] Test verifies database is accessible and responding
- [ ] Test verifies container stops without errors
- [ ] Test can be run locally: `pnpm test test-db-lifecycle.test.ts` (or equivalent)
- [ ] Test passes consistently

**Implementation Notes**:

- Create simple test: `apps/api/test/db-container.test.ts`
- Test should query database to confirm connectivity
- Estimated effort: 15 minutes

**Deliverable**: Passing smoke test confirming container lifecycle works

---

## Phase 2: Seed Integration & Test Configuration

### Task 2.1: Integrate Seed Process with Container Startup

**Description**: Update setup file to run seed process after container is healthy.

**Acceptance Criteria**:

- [ ] Seed process is executed after container is ready (after health check passes)
- [ ] Seed process uses the container connection details (DATABASE_URL from container)
- [ ] Seed process completes before tests run
- [ ] Seed failures are caught and reported clearly
- [ ] Setup output logs connection details for debugging

**Implementation Notes**:

- In `apps/api/test/setup.ts`, after container ready:
  - Run seed via: `prisma db seed` with environment override
  - Or programmatically import and run seed function if available
- Handle and report seed failures with helpful error messages

**Deliverable**: Updated `apps/api/test/setup.ts` with seed integration

---

### Task 2.2: Environment Configuration Module

**Description**: Create `apps/api/test/env-setup.ts` to manage connection configuration for tests.

**Acceptance Criteria**:

- [ ] Module sets `DATABASE_URL` environment variable from container connection
- [ ] Module sets `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD` env vars
- [ ] Module supports both local dev and CI/CD environments
- [ ] Module handles missing or invalid connection details gracefully
- [ ] Configuration is available to test fixtures and Prisma Client

**Implementation Notes**:

- Export function to configure environment based on container details
- Ensure Prisma Client picks up `DATABASE_URL` automatically
- Consider whether existing Prisma Client instances need reconfiguration

**Deliverable**: `apps/api/test/env-setup.ts`

---

### Task 2.3: Verify Test Data Access

**Description**: Create integration test to confirm seeded data is accessible in tests.

**Acceptance Criteria**:

- [ ] Test queries seeded data from the container database
- [ ] Test confirms specific seed records exist (e.g., platform users, roles)
- [ ] Test passes with container connection
- [ ] Test verifies Prisma Client can access seeded data

**Implementation Notes**:

- Create test: `apps/api/test/seed-integration.test.ts`
- Query for known seed data (e.g., seeded users, default roles)
- Confirm data matches expectations from seed file

**Deliverable**: Passing integration test confirming seed data is accessible

---

## Phase 3: Cleanup & Reliability

### Task 3.1: Implement Graceful Cleanup Handler

**Description**: Enhance container provider with robust cleanup and signal handling.

**Acceptance Criteria**:

- [ ] Container cleanup is idempotent (safe to call multiple times)
- [ ] Process signal handlers (SIGTERM, SIGINT) trigger cleanup
- [ ] Cleanup runs even if test process crashes or is interrupted
- [ ] Cleanup errors are logged but don't break test teardown
- [ ] No orphaned containers remain after test runs

**Implementation Notes**:

- In `db-container.ts`, add signal handler registration
- Implement cleanup retry logic with timeouts
- Test manual container cleanup: `docker ps` should show no test containers

**Deliverable**: Updated `apps/api/test/db-container.ts` with robust cleanup

---

### Task 3.2: Configure Startup & Seed Timeouts

**Description**: Set appropriate timeouts for container startup, health checks, and seed process.

**Acceptance Criteria**:

- [ ] Container startup timeout is configured (suggested: 30-60 seconds)
- [ ] Health check timeout is configured (suggested: 60 seconds total)
- [ ] Seed process timeout is configured (suggested: 30 seconds)
- [ ] Timeout failures report clear error messages
- [ ] Timeouts are documented in code comments

**Implementation Notes**:

- Testcontainers allows timeout configuration
- Set reasonable defaults for local + CI/CD contexts
- Document timeouts in JSDoc

**Deliverable**: Updated `apps/api/test/setup.ts` with configured timeouts

---

### Task 3.3: Add Diagnostic Logging

**Description**: Add debug-level logging to container lifecycle for troubleshooting.

**Acceptance Criteria**:

- [ ] Container startup logs connection details (host, port, database)
- [ ] Container startup logs timing information
- [ ] Seed process logs begin/end and any errors
- [ ] Container cleanup logs success or errors
- [ ] Logging uses existing logger or console (as appropriate)

**Implementation Notes**:

- Check if repo uses Pino logger (mentioned in AGENTS.md)
- Use appropriate log level (info for startup, debug for details)
- Structure logs for readability

**Deliverable**: Updated `apps/api/test/db-container.ts` and `setup.ts` with diagnostic logging

---

### Task 3.4: Test Edge Cases & Error Scenarios

**Description**: Create tests for edge cases and error scenarios.

**Acceptance Criteria**:

- [ ] Test verifies graceful failure if container fails to start
- [ ] Test verifies graceful failure if seed process fails
- [ ] Test verifies cleanup on interrupted test process
- [ ] Test verifies no orphaned containers persist
- [ ] All edge case tests are documented

**Implementation Notes**:

- Create: `apps/api/test/edge-cases.test.ts`
- May need to simulate failures (e.g., invalid seed data)
- Manual verification for container cleanup on process interrupt

**Deliverable**: Test suite covering edge cases and error scenarios

---

## Phase 4: Documentation & CI/CD Validation

### Task 4.1: Update README - Local Testing Section

**Description**: Add clear local testing setup instructions to the repository README.

**Acceptance Criteria**:

- [ ] README includes "Running Tests" section
- [ ] Section explains automatic ephemeral container provisioning
- [ ] Prerequisites are clearly stated (Docker must be running)
- [ ] Command examples are provided: `pnpm test`
- [ ] Troubleshooting subsection is included

**Content Template**:

```markdown
## Running Tests

Tests automatically start an ephemeral PostgreSQL container for you. Just run:

\`\`\`sh
pnpm test
\`\`\`

### Prerequisites

- Docker must be installed and running
  - macOS/Windows: Start Docker Desktop
  - Linux: Ensure Docker daemon is running (`systemctl start docker`)

### Troubleshooting

- **Error: Docker daemon not running**: Start Docker Desktop or Docker daemon
- **Port conflicts**: Testcontainers automatically allocates available ports; conflicts are handled
- **Seed failures**: Check DATABASE_URL is set correctly; see debug logs for details
```

**Deliverable**: Updated repository README with local testing section

---

### Task 4.2: Update API README or Contributing Docs

**Description**: Update `apps/api/README.md` (or equivalent) with test-specific guidance.

**Acceptance Criteria**:

- [ ] Document explains ephemeral container approach
- [ ] Document includes troubleshooting for common test issues
- [ ] Document links to main README testing section for context
- [ ] Environment variables are documented if needed for customization

**Deliverable**: Updated `apps/api/README.md` (or created if needed)

---

### Task 4.3: Verify GitHub Actions CI/CD Compatibility

**Description**: Confirm existing GitHub Actions workflows work with ephemeral containers.

**Acceptance Criteria**:

- [ ] GitHub Actions workflow test job runs successfully
- [ ] No additional service container configuration is needed
- [ ] Testcontainers works in GitHub Actions runner (native Docker support)
- [ ] Test results are consistent between local and CI/CD
- [ ] No warnings or errors related to container setup

**Implementation Notes**:

- Run a test workflow on a branch
- Monitor for container-related issues
- Document any CI/CD-specific configuration if needed (typically none)

**Deliverable**: Verified GitHub Actions compatibility; documented if changes needed

---

### Task 4.4: Create Troubleshooting & Setup Guide

**Description**: Document common issues, solutions, and debugging techniques.

**Acceptance Criteria**:

- [ ] Guide covers: Docker not running, port conflicts, seed failures
- [ ] Guide includes manual container cleanup commands
- [ ] Guide explains how to keep containers running for debugging
- [ ] Guide provides environment variable reference
- [ ] Guide is placed in accessible location (e.g., `docs/testing-setup.md`)

**Content Sections**:

- Prerequisites checklist
- Docker setup verification
- Common errors and solutions
- Manual cleanup procedures
- Advanced: Debugging with container logs
- Performance considerations

**Deliverable**: `docs/testing-setup.md` or equivalent

---

### Task 4.5: End-to-End Validation

**Description**: Perform comprehensive validation that ephemeral containers work across environments.

**Acceptance Criteria**:

- [ ] Fresh checkout on macOS (Intel): `pnpm test` works
- [ ] Fresh checkout on macOS (Apple Silicon): `pnpm test` works
- [ ] Fresh checkout on Linux: `pnpm test` works (if applicable)
- [ ] GitHub Actions workflow runs successfully and tests pass
- [ ] No orphaned containers after any of the above runs
- [ ] Setup time is acceptable (target: < 15 seconds per run)

**Implementation Notes**:

- Test on at least 2 different machines if possible
- Verify with fresh checkouts to simulate first-time developer experience
- Run tests 3-5 consecutive times to check for flakiness

**Deliverable**: Validation report confirming cross-environment compatibility

---

## Summary of Deliverables

| Phase | Deliverable            | Files / Changes                                       |
| ----- | ---------------------- | ----------------------------------------------------- |
| 1.1   | Dependencies           | `apps/api/package.json`                               |
| 1.2   | Container Provider     | `apps/api/test/db-container.ts`                       |
| 1.3   | Vitest Integration     | `apps/api/vitest.config.ts`, `apps/api/test/setup.ts` |
| 1.4   | Smoke Test             | `apps/api/test/db-container.test.ts`                  |
| 2.1   | Seed Integration       | Updated `apps/api/test/setup.ts`                      |
| 2.2   | Env Config             | `apps/api/test/env-setup.ts`                          |
| 2.3   | Seed Verification Test | `apps/api/test/seed-integration.test.ts`              |
| 3.1   | Cleanup & Signals      | Updated `apps/api/test/db-container.ts`               |
| 3.2   | Timeouts               | Updated `apps/api/test/setup.ts`                      |
| 3.3   | Logging                | Updated `db-container.ts`, `setup.ts`                 |
| 3.4   | Edge Case Tests        | `apps/api/test/edge-cases.test.ts`                    |
| 4.1   | README Update          | Updated root `README.md`                              |
| 4.2   | API Docs               | Updated/created `apps/api/README.md`                  |
| 4.3   | CI/CD Validation       | GitHub Actions verification (no files)                |
| 4.4   | Troubleshooting Guide  | `docs/testing-setup.md`                               |
| 4.5   | E2E Validation         | Validation report (documentation)                     |

---

## Effort Estimation

| Phase             | Tasks        | Estimated Effort |
| ----------------- | ------------ | ---------------- |
| 1 (Foundation)    | 4 tasks      | 2-3 hours        |
| 2 (Integration)   | 3 tasks      | 2-3 hours        |
| 3 (Reliability)   | 4 tasks      | 2-3 hours        |
| 4 (Documentation) | 5 tasks      | 1-2 hours        |
| **TOTAL**         | **16 tasks** | **7-11 hours**   |

---

## Implementation Notes & Guidelines

### Git Workflow

- Branch: `feat/CROWN-157-ephemeral-test-containers`
- Commit prefix: `feat: CROWN-157 - <specific task description>`
- Example: `feat: CROWN-157 - Add Testcontainers dependencies`

### Code Style

- Follow repository TypeScript configuration (strict mode)
- Include JSDoc comments for exported functions
- Add error handling with meaningful messages
- Use existing logging patterns (Pino if available)

### Testing

- Smoke tests in Phase 1 to verify basic functionality
- Integration tests in Phase 2 to verify seed data access
- Edge case tests in Phase 3 to verify reliability
- Cross-environment validation in Phase 4

### Documentation

- Link spec.md and plan.md from README updates
- Include troubleshooting in setup documentation
- Document assumptions and limitations
- Provide examples for custom configuration

---

## Go/No-Go Checklist for Completion

- [ ] All 4 phases completed
- [ ] All tasks have passing acceptance criteria
- [ ] All deliverables are in place and tested
- [ ] Documentation is complete and reviewed
- [ ] Cross-environment validation is successful
- [ ] Zero orphaned containers on any test run
- [ ] GitHub Actions workflow passes
- [ ] PR is ready for review linking spec.md, plan.md, tasks.md
