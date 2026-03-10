import { loadTenantMigrations } from "../../src/tenant/migration-loader.js";
import { executeTenantMigrations } from "../../src/tenant/migrator.js";

import { LOCAL_SEED_ACTOR_SUB } from "./constants.js";
import { tenantSchemaHasFoundationalTables } from "./reset.js";
import type { SeedBootstrapContext } from "./types.js";

const quoteIdentifier = (value: string): string => `"${value.replaceAll('"', '""')}"`;

export const bootstrapCanonicalTenantSchema = async ({
  tenantId,
  schemaName,
  client
}: SeedBootstrapContext): Promise<void> => {
  const schemaReady = await tenantSchemaHasFoundationalTables(client, schemaName);
  if (schemaReady) {
    return;
  }

  await client.query(`CREATE SCHEMA IF NOT EXISTS ${quoteIdentifier(schemaName)}`);

  const migrations = await loadTenantMigrations();
  if (!migrations.length) {
    throw new Error("No tenant migrations were found for canonical local seed bootstrap.");
  }

  const result = await executeTenantMigrations(
    {
      tenantId,
      schemaName,
      actorSub: LOCAL_SEED_ACTOR_SUB,
      migrations
    },
    { client: client as never }
  );

  if (result.status === "failed") {
    throw new Error(result.message ?? "Canonical tenant schema bootstrap failed during migration execution.");
  }
};
