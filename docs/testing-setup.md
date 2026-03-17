# Testing Setup & Troubleshooting Guide

This guide covers the ephemeral PostgreSQL test container setup for Crown backend tests and how to troubleshoot common issues.

## Overview

Tests use **Testcontainers** to automatically provision ephemeral PostgreSQL containers. This means:

- ✅ **No manual database setup required** — containers start automatically
- ✅ **Isolated test environments** — each test run gets a clean database
- ✅ **Works everywhere** — local development, CI/CD pipelines, and containerized environments
- ✅ **Fast cleanup** — containers are destroyed after tests complete

## Quick Start

### Prerequisites

1. **Docker must be installed and running**
   - macOS: [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Windows: [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Linux: `sudo apt-get install docker.io` (Ubuntu/Debian) or equivalent for your distribution

2. **Verify Docker is running**
   ```bash
   docker ps
   ```
   If this command fails, start Docker:
   - macOS/Windows: Open Docker Desktop
   - Linux: `sudo systemctl start docker`

### Running Tests

```bash
# From the repository root or apps/api directory
pnpm test

# Watch mode for development
cd apps/api && pnpm test:watch

# Run specific test file
pnpm test tests/integration/db-container.spec.ts
```

## How It Works

### Container Lifecycle

1. **Startup** (~2-3 seconds)
   - Testcontainers pulls the PostgreSQL 16 Alpine image (if not cached)
   - Container starts with default credentials: `postgres` / `postgres`
   - Health check confirms database is ready

2. **Schema Initialization** (~0.8 seconds)
   - Prisma migrations run automatically
   - Database schema is created from migrations in `apps/api/prisma/migrations/`

3. **Seed Process** (~0.2 seconds)
   - Seed data is applied from `apps/api/prisma/seed.ts`
   - Test fixtures include seeded users, roles, tenants, and relationships

4. **Test Execution**
   - Tests run against the clean, seeded database
   - All tests share the same container instance

5. **Cleanup** (~0.2 seconds)
   - After tests complete, the container is automatically destroyed
   - No residual processes or volumes remain

### Total Overhead

- First test run: ~5-10 seconds (includes Docker image pull)
- Subsequent runs: ~3-4 seconds (container startup + schema + seed)
- Per-test isolation: Guaranteed by ephemeral containers

## Troubleshooting

### "Cannot connect to Docker daemon"

**Error**: `error during connect: This error may indicate that the docker daemon is not running.`

**Solution**:

- macOS: Open Docker Desktop from Applications
- Windows: Start Docker Desktop
- Linux: Run `sudo systemctl start docker`

**Verify**: `docker ps` should show no error

---

### "No space left on device" or disk full errors

**Error**: `no space left on device` or container fails to start

**Solutions**:

1. **Clean up unused Docker images and containers**

   ```bash
   docker system prune -a
   ```

2. **Check disk space**

   ```bash
   df -h
   ```

3. **Increase Docker daemon resources** (if needed)
   - macOS/Windows: Docker Desktop→Preferences→Resources→Increase disk image size
   - Linux: Configure Docker storage driver

---

### Tests timeout or hang

**Error**: `Hook timed out in 120000ms`

**Possible causes**:

- Docker daemon is unresponsive
- System is out of resources
- PostgreSQL image failed to download

**Solutions**:

1. Verify Docker is responsive: `docker ps`
2. Check system resources: `free -h` (Linux) or Activity Monitor (macOS)
3. Restart Docker daemon:
   - macOS/Windows: Restart Docker Desktop
   - Linux: `sudo systemctl restart docker`
4. Force image pull: `docker pull postgres:16-alpine`

---

### "Permission denied" errors

**Error**: `permission denied while trying to connect to Docker daemon`

**Solution** (Linux only):

```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Apply group changes (no logout needed)
newgrp docker

# Verify
docker ps
```

---

### Prisma migration failures

**Error**: `The table 'public.X' does not exist` or migration-related errors

**Solutions**:

1. **Regenerate Prisma client**

   ```bash
   cd apps/api && pnpm db:generate
   ```

2. **Verify migrations exist**

   ```bash
   ls apps/api/prisma/migrations/
   ```

3. **Check Prisma schema syntax**
   ```bash
   cd apps/api && npx prisma validate
   ```

---

### Seed process fails

**Error**: Seed-related errors in setup logs

**Solutions**:

1. **Verify seed file exists and is valid**

   ```bash
   cat apps/api/prisma/seed.ts
   ```

2. **Test seed manually** (requires running local PostgreSQL)

   ```bash
   cd apps/api
   export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
   pnpm db:seed:local
   ```

3. **Check seed logs for details** — the test output includes seed phase and error details

---

### Orphaned containers remain after tests crash

**Error**: Old container processes persist even after tests fail

**Manual cleanup**:

```bash
# List all containers (including stopped)
docker ps -a | grep postgres

# Stop specific container
docker stop <container-id>

# Remove all stopped containers
docker container prune -f
```

---

### Tests pass locally but fail in CI/CD

**Possible causes**:

- Different Docker image versions between local and CI
- Resource constraints in CI runner
- Database state not properly isolated

**Solutions**:

1. **Ensure same PostgreSQL version locally and CI**: Currently `postgres:16-alpine`
2. **Increase timeout in CI workflows** if needed
3. **Check CI runner Docker availability**: Confirm Docker is enabled in CI config

---

## Performance Tuning

### Slow container startup

**Issue**: Containers take significantly longer than expected to start

**Check**:

- Docker daemon responsiveness: `docker info`
- Available disk space: `docker system df`
- Resource allocation in Docker Desktop (macOS/Windows)

**Optimization**:

- Pre-pull the image locally: `docker pull postgres:16-alpine`
- Increase Docker daemon memory/CPU allocation (if applicable)

### Slow migrations or seed

**Issue**: Database schema takes too long to initialize

**Check**:

- Verify Prisma migration files are not creating excessive indexes or constraints
- Check seed process performance with detailed logging

**Enable debug logging**:

```bash
LOG_LEVEL=debug pnpm test
```

---

## Advanced Configuration

### Environment Variables

The following environment variables can be used to customize test behavior:

- **`LOG_LEVEL`**: Set logging verbosity

  ```bash
  LOG_LEVEL=debug pnpm test
  ```

- **`DATABASE_URL`**: Override (typically set automatically by container setup)
  ```bash
  DATABASE_URL="..." pnpm test
  ```

### Vitest Configuration

Test timeouts and setup behavior can be configured in `apps/api/vitest.config.ts`:

- **`hookTimeout`**: Maximum time for setup/teardown hooks (default: 120000ms = 2 min)
- **`testTimeout`**: Maximum time for individual tests (default: 120000ms = 2 min)

---

## Debugging Tips

### View container logs

```bash
# List running test containers
docker ps | grep postgres

# View container logs
docker logs <container-id>

# Follow container logs in real-time
docker logs -f <container-id>
```

### Connect to running container manually

```bash
# List containers
docker ps

# Open shell in container
docker exec -it <container-id> /bin/sh

# Connect to database directly
psql -h localhost -p <port> -U postgres -d postgres
```

### Inspect test database

While tests are running:

```bash
# Get container details
docker ps | grep postgres

# Extract port from container
PORT=$(docker port <container-id> 5432 | cut -d: -f2)

# Connect to database
psql -h localhost -p $PORT -U postgres -d postgres -c "SELECT * FROM users;"
```

---

## Related Documentation

- [Testcontainers Documentation](https://testcontainers.com/)
- [PostgreSQL Official Image](https://hub.docker.com/_/postgres)
- [Engineering Constitution - Testing Standards](../process/engineering-constitution.md#testing-standards)
- [Spec Kit: CROWN-157 - Ephemeral Test Containers](../specs/CROWN-157-ephemeral-test-containers/spec.md)

---

## Support

For issues not covered here:

1. Check test output logs for detailed error messages
2. Enable debug logging: `LOG_LEVEL=debug pnpm test`
3. Verify Docker is working: `docker run hello-world`
4. Consult repository Jira issue: [CROWN-157](https://crown-crm.atlassian.net/browse/CROWN-157)
