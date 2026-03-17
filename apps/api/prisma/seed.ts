import { Client } from "pg";

import { env } from "../src/config/env.js";
import { prisma } from "../src/db/prisma.js";

import { bootstrapCanonicalTenantSchema } from "./seed/bootstrap.js";
import { LOCAL_SEED_TENANT } from "./seed/constants.js";
import { ensureControlPlaneBaseline } from "./seed/control-plane.js";
import { loadCanonicalBaseline } from "./seed/load.js";
import { createSeedExecutionSummary, formatSeedExecutionSummary } from "./seed/reporting.js";
import { assertTenantSchemaReady, resetTenantDomainTables, setTenantSearchPath, tenantSchemaHasFoundationalTables } from "./seed/reset.js";
import { SeedExecutionError, type SeedBootstrapContext, type SeedExecutionSummary, type SeedPhaseName, type SeedPrismaClient, type SeedSqlClient } from "./seed/types.js";

type RunLocalSeedOptions = {
  prismaClient?: SeedPrismaClient;
  client?: SeedSqlClient;
  failAtPhase?: SeedPhaseName;
  bootstrapTenantSchema?: (context: SeedBootstrapContext) => Promise<void>;
};

const maybeFail = (failAtPhase: SeedPhaseName | undefined, phase: SeedPhaseName): void => {
  if (failAtPhase === phase) {
    throw new SeedExecutionError(`Injected seed failure at phase ${phase}`, phase);
  }
};

export const runLocalSeed = async (options: RunLocalSeedOptions = {}): Promise<SeedExecutionSummary> => {
  const prismaClient = options.prismaClient ?? prisma;
  const ownedPgClient = options.client ? null : new Client({ connectionString: env.DATABASE_URL });
  const client: SeedSqlClient =
    options.client ??
    ({
      connect: () => ownedPgClient!.connect(),
      end: () => ownedPgClient!.end(),
      query: (text, values) =>
        ownedPgClient!.query(text, values ? [...values] : undefined) as unknown as Promise<{
          rows: Record<string, unknown>[];
          rowCount?: number | null;
        }>
    } satisfies SeedSqlClient);
  const ownsClient = !options.client;
  const bootstrapTenantSchema = options.bootstrapTenantSchema ?? bootstrapCanonicalTenantSchema;

  if (ownsClient) {
    await client.connect();
  }

  try {
    const controlPlane = await ensureControlPlaneBaseline({
      prisma: prismaClient
    });

    maybeFail(options.failAtPhase, "after-control-plane");

    const schemaReady = await tenantSchemaHasFoundationalTables(client, controlPlane.schemaName);
    if (!schemaReady) {
      await bootstrapTenantSchema({
        tenantId: controlPlane.tenantId,
        tenantSlug: controlPlane.tenantSlug,
        schemaName: controlPlane.schemaName,
        client
      });
    }

    await client.query("BEGIN");

    try {
      await setTenantSearchPath(client, controlPlane.schemaName);
      await assertTenantSchemaReady(client);
      await resetTenantDomainTables(client);

      maybeFail(options.failAtPhase, "after-reset");

      const loadedCounts = await loadCanonicalBaseline({
        client,
        failAtPhase: options.failAtPhase
      });

      maybeFail(options.failAtPhase, "after-load");

      await client.query("COMMIT");

      return createSeedExecutionSummary(controlPlane.tenantSlug, controlPlane.schemaName, loadedCounts, controlPlane.tenantId, controlPlane.platformUserIds, controlPlane.edgeCaseUserIds);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } finally {
    if (ownsClient) {
      await client.end();
    }
  }
};

const main = async (): Promise<void> => {
  const summary = await runLocalSeed();
  console.info(formatSeedExecutionSummary(summary));
};

const isDirectExecution = process.argv[1] !== undefined && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));

if (isDirectExecution) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Local seed execution failed";
    console.error(message);
    process.exitCode = 1;
  });
}

export const canonicalSeedTenantSlug = LOCAL_SEED_TENANT.slug;
