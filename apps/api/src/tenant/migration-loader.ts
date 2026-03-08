import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { TenantMigrationDefinition } from "./types.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultMigrationsRoot = path.resolve(dirname, "../../tenant-migrations");

// Baseline tenant migration descriptions are derived from the canonical
// management-system filenames to keep version metadata human-readable.
const toDescription = (filename: string) => filename.replace(/^\d+_/, "").replace(/\.sql$/i, "").replace(/_/g, " ");

export const loadTenantMigrations = async (migrationsRoot = defaultMigrationsRoot): Promise<TenantMigrationDefinition[]> => {
  const versionDirs = (await readdir(migrationsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const migrations: TenantMigrationDefinition[] = [];
  let sequence = 1;

  for (const versionDir of versionDirs) {
    const versionPath = path.join(migrationsRoot, versionDir);
    const sqlFiles = (await readdir(versionPath, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));

    for (const sqlFile of sqlFiles) {
      const sqlPath = path.join(versionPath, sqlFile);
      const fileVersion = sqlFile.replace(/\.sql$/i, "");
      migrations.push({
        version: `${versionDir}.${fileVersion}`,
        description: toDescription(sqlFile),
        sqlPath,
        sequence
      });
      sequence += 1;
    }
  }

  return migrations;
};
