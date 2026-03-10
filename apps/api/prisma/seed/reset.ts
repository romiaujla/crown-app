import { LOCAL_SEED_RESET_TABLES } from "./constants.js";
import type { SeedSqlClient } from "./types.js";

const quoteIdentifier = (value: string): string => `"${value.replaceAll('"', '""')}"`;

export const setTenantSearchPath = async (client: SeedSqlClient, schemaName: string): Promise<void> => {
  await client.query(`SET LOCAL search_path TO ${quoteIdentifier(schemaName)}`);
};

export const assertTenantSchemaReady = async (client: SeedSqlClient): Promise<void> => {
  const result = (await client.query("SELECT to_regclass('organizations') AS regclass")) as {
    rows: Array<{ regclass: string | null }>;
  };

  if (!result.rows[0]?.regclass) {
    throw new Error("Canonical tenant schema is missing foundational tables. Apply tenant migrations before seeding.");
  }
};

export const resetTenantDomainTables = async (client: SeedSqlClient): Promise<void> => {
  for (const tableName of LOCAL_SEED_RESET_TABLES) {
    await client.query(`DELETE FROM ${quoteIdentifier(tableName)}`);
  }
};
