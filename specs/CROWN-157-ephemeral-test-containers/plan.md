# Implementation Plan: Ephemeral Test Database Containers

**Jira Issue**: [CROWN-157](https://crown-crm.atlassian.net/browse/CROWN-157)  
**Feature Branch**: `feat/CROWN-157-ephemeral-test-containers`  
**Last Updated**: 2026-03-16

## High-Level Strategy

To eliminate manual database setup, this plan implements automated ephemeral container provisioning for tests using **Testcontainers** library. The solution:

1. Provides a Docker-based PostgreSQL container that starts automatically before tests
2. Applies the existing seed process to initialize test data
3. Cleans up containers automatically after tests complete
4. Works identically in local development and GitHub Actions
5. Requires minimal modifications to existing test code

### Why Testcontainers?

- **Language Aligned**: Testcontainers has first-class Node.js support via `@testcontainers/postgresql`
- **Test Framework Integration**: Integrates cleanly with Vitest and Jest
- **Reliability**: Production-tested and widely adopted
- **Minimal Config**: Handles port allocation, health checks, and cleanup automatically
- **CI/CD Ready**: Works in GitHub Actions out of the box without service container definitions

## Architecture Overview

```
┌─────────────────────────┐
│  Test Execution Start   │
└────────┬────────────────┘
         │ 
         ▼
┌─────────────────────────────────┐
│ Initialize Container Provider    │ ← Loads Testcontainers
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Start PostgreSQL Container       │ ← Docker pulls & runs image
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Wait for DB Ready (Health Check) │ ← Testcontainers waits
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Apply Seed Data                  │ ← Prisma seed.ts
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Provide Connection Details       │ ← Env vars to test suite
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Run Tests                        │ ← Vitest uses container DB
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Test Completion                  │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Stop & Clean Up Container        │ ← Testcontainers cleanup
└──────────────────────────────────┘
```

## Phase 1: Setup & Infrastructure (Foundation)

### Phase 1 Objectives

1. Add Testcontainers and dependencies
2. Create a container provider module
3. Integrate with Vitest test setup
4. Verify container startup and teardown

### Phase 1 Deliverables

- **Dependency additions**: `@testcontainers/postgresql`, `@testcontainers/core`
- **Module**: `apps/api/test/db-container.ts` — Container lifecycle management
- **Module**: `apps/api/test/setup.ts` — Vitest setup hook integration
- **Verification**: Basic smoke tests confirming container starts and stops

### Phase 1 Changes

1. **Update `apps/api/package.json`**: Add dev dependencies
   - `@testcontainers/postgresql`
   - `@testcontainers/core`

2. **Create `apps/api/test/db-container.ts`**: Container provider
   - Exports `startTestContainer()` and `stopTestContainer()`
   - Manages PostgreSQL container lifecycle
   - Provides connection details (host, port, database, credentials)
   
3. **Update `apps/api/vitest.config.ts`**: Setup hook
   - Register setup file in Vitest config
   - Configure `setupFiles` to trigger container startup

4. **Create `apps/api/test/setup.ts`**: Vitest setup integration
   - Runs before all tests
   - Starts container
   - Seeds database
   - Exports connection details to test environment

## Phase 2: Seed Integration & Test Configuration

### Phase 2 Objectives

1. Integrate existing seed process with container
2. Configure Prisma Client to use ephemeral container connection
3. Update test environment variables
4. Verify seed data is available in tests

### Phase 2 Deliverables

- **Seed Integration**: Apply `apps/api/prisma/seed.ts` to container DB
- **Connection Configuration**: Expose connection details to test suite
- **Test Database URL**: Dynamic DATABASE_URL env var for Prisma Client
- **Verification**: Tests can read seeded data from container

### Phase 2 Changes

1. **Update `apps/api/test/setup.ts`**: Run seed process
   - After container is ready, execute seed process
   - Pass connection details to seed runner
   - Handle seed failures with clear error messages

2. **Create `apps/api/test/env-setup.ts`**: Environment configuration
   - Sets `DATABASE_URL`, `DATABASE_HOST`, `DATABASE_PORT` env vars
   - Provides connection details to Prisma Client
   - Configurable for local dev vs. CI/CD contexts

3. **Update test fixtures and helpers**: Use container connection
   - Any test fixtures that create Prisma Client should use env-configured connection
   - Verify existing tests work with container DB

## Phase 3: Cleanup & Reliability

### Phase 3 Objectives

1. Ensure reliable container cleanup
2. Handle edge cases (crashes, timeouts, interrupts)
3. Add diagnostics and logging
4. Verify zero orphaned containers

### Phase 3 Deliverables

- **Cleanup Handler**: Graceful container shutdown and resource cleanup
- **Interrupt Handler**: Handle SIGTERM, SIGINT for test process interruption
- **Timeouts**: Configure appropriate timeouts for startup and seed
- **Diagnostics**: Logging and error messages for troubleshooting

### Phase 3 Changes

1. **Enhanced `apps/api/test/db-container.ts`**: 
   - Add cleanup error handling
   - Register process signal handlers (SIGTERM, SIGINT)
   - Implement robust resource cleanup

2. **Error Handling in `apps/api/test/setup.ts`**:
   - Handle container startup failures gracefully
   - Handle seed process failures with clear messages
   - Provide diagnostic information for debugging

3. **Logging & Diagnostics**:
   - Add debug-level logging for startup/shutdown
   - Log connection details for troubleshooting
   - Output helpful error messages on failures

## Phase 4: Documentation & CI/CD

### Phase 4 Objectives

1. Update README with testing instructions
2. Update GitHub Actions workflows
3. Add troubleshooting guide
4. Verify CI/CD compatibility

### Phase 4 Deliverables

- **README Update**: Clear testing setup instructions
- **CI/CD Update**: GitHub Actions workflow compatibility verification
- **Troubleshooting Guide**: Common issues and solutions
- **Verification**: CI/CD pipeline runs successfully with ephemeral containers

### Phase 4 Changes

1. **Update Repository Root README**:
   - Add "Running Tests" section
   - Explain automatic container provisioning
   - Provide prerequisites (Docker must be running)
   - Add troubleshooting subsection

2. **Update `apps/api/README.md`** (if exists):
   - Document local testing commands
   - Explain container auto-provisioning
   - Document environment variable configuration

3. **GitHub Actions Workflows**:
   - Verify existing workflows don't need changes
   - Testcontainers supports GitHub Actions natively
   - No service container configuration needed

4. **Create Troubleshooting Guide**:
   - Docker daemon not running: how to fix
   - Port conflicts: how to troubleshoot
   - Container cleanup issues: manual cleanup commands
   - Seed failures: how to debug

## Implementation Sequence

1. **Phase 1** (Foundation)
   - Add dependencies
   - Create container provider
   - Integrate with Vitest
   - Verify E2E container lifecycle

2. **Phase 2** (Integration)
   - Integrate seed process
   - Configure Prisma connection
   - Run example test against container

3. **Phase 3** (Reliability)
   - Add error handling
   - Test edge cases
   - Verify cleanup

4. **Phase 4** (Documentation)
   - Write documentation
   - Verify CI/CD
   - Final testing and validation

## Key Implementation Details

### Container Configuration

```typescript
// Testcontainers auto-configures PostgreSQL with:
// - Default username: "postgres"
// - Default password: "postgres"
// - Automatic port allocation (random available port)
// - Health check built-in (waits for DB readiness)
```

### Connection String Pattern

```
DATABASE_URL="postgresql://postgres:postgres@localhost:PORT/postgres"
```

Where `PORT` is dynamically allocated and provided by Testcontainers.

### Seed Integration

The existing seed process must be invoked with:

```bash
DATABASE_URL="<container connection>" npx tsx prisma db seed
```

Or via Prisma Client:

```typescript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ datasources: { db: { url } } });
// Then run seed script
```

## Rollback Plan

If ephemeral containers prove problematic:

1. Remove Testcontainers dependencies
2. Revert test setup files
3. Document requirement to manually start local database
4. Consider alternative solutions (Postgres docker-compose, direct database connection pooling)

## Success Metrics

By phase completion, verify:

- ✅ `pnpm test` works without manual database startup
- ✅ Docker daemon check is clear if not running
- ✅ Container starts within 5-10 seconds
- ✅ Seed data is applied correctly
- ✅ Tests pass consistently (no flakiness)
- ✅ GitHub Actions runs successfully
- ✅ Zero orphaned containers after test runs
- ✅ Documentation is clear and complete

## Open Questions / Risks

1. **Docker Availability**: Testcontainers requires Docker; what about environments without it?
   - *Mitigation*: Clear documentation about Docker requirement; consider CI/CD-only setup if needed
   
2. **Performance**: Container startup overhead on M1 Macs or CI runners?
   - *Mitigation*: Target < 10 seconds total overhead; measure and optimize if needed
   
3. **Parallel Test Execution**: How does Testcontainers handle concurrent test runs?
   - *Mitigation*: Testcontainers auto-allocates unique ports; verify no conflicts in CI
   
4. **Debugging**: How do developers inspect the test database during execution?
   - *Mitigation*: Document connection details output during test setup; provide option to keep container running for debugging

## References & Resources

- Testcontainers Documentation: https://testcontainers.com/
- Testcontainers for Node.js: https://node.testcontainers.org/
- PostgreSQL Module: https://node.testcontainers.org/docs/modules/postgresql/
- Vitest Configuration: https://vitest.dev/config/
- Existing Seed Process: `apps/api/prisma/seed.ts`
