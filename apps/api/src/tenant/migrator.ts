import { readFile } from 'node:fs/promises';

import { Client } from 'pg';

import { env } from '../config/env.js';
import { prisma } from '../db/prisma.js';

import type { ExecuteTenantMigrationsInput, TenantMigrationExecutionResult } from './types.js';

export type TenantMigration = {
  version: string;
  description: string;
  sqlPath: string;
};

export const tenantMigrationStrategy = {
  prismaScope: 'public',
  tenantScope: 'tenant_<slug>',
  execution: 'versioned-sql',
} as const;

type ExecuteTenantMigrationsOptions = {
  client?: Client;
};

const quoteIdentifier = (value: string) => `"${value.replaceAll('"', '""')}"`;

export const executeTenantMigrations = async (
  input: ExecuteTenantMigrationsInput,
  options: ExecuteTenantMigrationsOptions = {},
): Promise<TenantMigrationExecutionResult> => {
  const ownedClient = !options.client;
  const client = options.client ?? new Client({ connectionString: env.DATABASE_URL });
  const appliedVersions: string[] = [];
  const skippedVersions: string[] = [];

  if (ownedClient) {
    await client.connect();
  }

  try {
    for (const migration of input.migrations) {
      const alreadyApplied = await prisma.tenantSchemaVersion.findUnique({
        where: {
          tenantId_version: {
            tenantId: input.tenantId,
            version: migration.version,
          },
        },
      });

      if (alreadyApplied) {
        skippedVersions.push(migration.version);
        continue;
      }

      const sql = await readFile(migration.sqlPath, 'utf8');

      try {
        await client.query('BEGIN');
        await client.query(`SET LOCAL search_path TO ${quoteIdentifier(input.schemaName)}`);
        await client.query(sql);

        await prisma.tenantSchemaVersion.create({
          data: {
            tenantId: input.tenantId,
            version: migration.version,
            appliedBy: input.actorSub,
            description: migration.description,
          },
        });

        await client.query('COMMIT');
        appliedVersions.push(migration.version);
      } catch (error) {
        await client.query('ROLLBACK');
        return {
          status: 'failed',
          failedVersion: migration.version,
          appliedVersions,
          skippedVersions,
          message: error instanceof Error ? error.message : 'Migration execution failed',
        };
      }
    }

    return {
      status: 'provisioned',
      appliedVersions,
      skippedVersions,
    };
  } finally {
    if (ownedClient) {
      await client.end();
    }
  }
};
