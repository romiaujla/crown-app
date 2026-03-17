import { PrismaPg } from '@prisma/adapter-pg';
import { execSync } from 'child_process';
import path from 'path';
import { Client } from 'pg';
import pino from 'pino';

import { startTestContainer, stopTestContainer } from './db-container.js';

const logger = pino({ name: 'crown-test-global-setup', level: process.env.LOG_LEVEL ?? 'info' });

/**
 * Vitest globalSetup — runs once before all test files.
 *
 * 1. Starts an ephemeral PostgreSQL container
 * 2. Sets DATABASE_URL so all downstream imports resolve to the container
 * 3. Applies Prisma migrations
 * 4. Seeds the database with canonical test data
 * 5. Closes one-time setup connections (PrismaClient + pg)
 *
 * Returns a teardown function that stops the container after all tests finish.
 */
export default async function setup(): Promise<() => Promise<void>> {
  logger.info('Setting up test environment (globalSetup)');

  // ── 1. Start ephemeral container ────────────────────────────────────────
  const containerDetails = await startTestContainer();

  // Set DATABASE_URL BEFORE any module that reads process.env is loaded in workers.
  process.env.DATABASE_URL = containerDetails.url;
  logger.info('Container started and DATABASE_URL configured');

  // ── 2. Apply Prisma migrations ──────────────────────────────────────────
  logger.info('Running Prisma migrations to initialize database schema');
  try {
    execSync('prisma migrate deploy', {
      cwd: path.resolve(process.cwd()),
      env: { ...process.env, DATABASE_URL: containerDetails.url },
      stdio: 'pipe',
    });
    logger.info('Prisma migrations completed successfully');
  } catch (error) {
    logger.error({ error }, 'Prisma migrations failed');
    throw new Error(`Failed to run Prisma migrations: ${error}`);
  }

  // ── 3. Seed the database ────────────────────────────────────────────────
  // Dynamic imports so the modules evaluate AFTER DATABASE_URL is set.
  const { runLocalSeed } = await import('../prisma/seed.js');
  const { PrismaClient } = await import('../src/generated/prisma/client.js');

  const pgClient = new Client({ connectionString: containerDetails.url });
  await pgClient.connect();

  const prismaClient = new PrismaClient({
    adapter: new PrismaPg({ connectionString: containerDetails.url }),
  });

  logger.info('Running seed process for test data initialization');
  const seedSummary = await runLocalSeed({
    prismaClient,
    client: {
      connect: () => Promise.resolve(),
      end: () => Promise.resolve(), // we close pgClient ourselves below
      query: (text: string, values?: readonly unknown[]) =>
        pgClient.query(text, values ? [...values] : undefined) as never,
    },
  });
  logger.info(
    {
      tenantSlug: seedSummary.tenantSlug,
      schemaName: seedSummary.schemaName,
      loadedCounts: seedSummary.loadedCounts,
    },
    'Seed process completed successfully',
  );

  // Expose seeded user IDs and tenant ID so test fixtures can build
  // JWT claims that reference real database records.
  process.env.SEED_SUPER_ADMIN_USER_ID = seedSummary.platformUserIds.superAdmin;
  process.env.SEED_TENANT_ADMIN_USER_ID = seedSummary.platformUserIds.tenantAdmin;
  process.env.SEED_TENANT_USER_ID = seedSummary.platformUserIds.tenantUser;
  process.env.SEED_TENANT_ID = seedSummary.tenantId;
  process.env.SEED_DISABLED_USER_ID = seedSummary.edgeCaseUserIds.disabledUser;
  process.env.SEED_TENANT_USER_ORPHAN_ID = seedSummary.edgeCaseUserIds.tenantUserOrphan;
  process.env.SEED_TENANT_ADMIN_MULTI_ID = seedSummary.edgeCaseUserIds.tenantAdminMulti;

  // ── 4. Close setup-only connections ─────────────────────────────────────
  // runLocalSeed does NOT call client.end() when a client is provided
  // (ownsClient = false in seed.ts).  Close everything explicitly so no
  // stale connections remain when the container eventually stops.
  await pgClient.end();
  await prismaClient.$disconnect();

  // Also disconnect the module-level prisma singleton that was eagerly created
  // when seed.ts imported src/db/prisma.ts.
  const { prisma: prismaSingleton } = await import('../src/db/prisma.js');
  await prismaSingleton.$disconnect();

  // ── 5. Return teardown ──────────────────────────────────────────────────
  return async function teardown(): Promise<void> {
    logger.info('Tearing down test environment (globalSetup teardown)');
    await stopTestContainer();
    logger.info('Test container cleaned up successfully');
  };
}
