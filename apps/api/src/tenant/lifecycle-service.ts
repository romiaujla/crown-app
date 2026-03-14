import { DeprovisionTypeEnum } from "@crown/types";
import { Client } from "pg";

import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";
import { TenantStatus } from "../domain/status-enums.js";

import type {
  DeprovisionTenantInput,
  DeprovisionTenantResult,
  HardDeprovisionTenantInput,
  HardDeprovisionTenantResult,
  SoftDeprovisionTenantInput,
  SoftDeprovisionTenantResult
} from "./types.js";

type TenantRecord = {
  id: string;
  name: string;
  slug: string;
  schemaName: string;
  status: TenantStatus;
  createdAt: Date;
  updatedAt: Date;
};

type TenantLifecyclePrismaClient = {
  tenant: {
    findUnique(args: {
      where: { id: string };
    }): Promise<TenantRecord | null>;
    update(args: {
      where: { id: string };
      data: { status: TenantStatus };
    }): Promise<TenantRecord>;
  };
  platformUserTenant: {
    deleteMany(args: {
      where: { tenantId: string };
    }): Promise<{ count: number }>;
  };
  tenantSchemaVersion: {
    deleteMany(args: {
      where: { tenantId: string };
    }): Promise<{ count: number }>;
  };
};

type SchemaClient = {
  connect(): Promise<void>;
  end(): Promise<void>;
  query(sql: string, params?: unknown[]): Promise<{ rows: unknown[] }>;
};

type TenantLifecycleDependencies = {
  db?: TenantLifecyclePrismaClient;
  createSchemaClient?: () => SchemaClient;
};

const quoteIdentifier = (value: string) => `"${value.replaceAll('"', '""')}"`;

const createDefaultSchemaClient = (): SchemaClient => {
  const client = new Client({ connectionString: env.DATABASE_URL });

  return {
    connect: () => client.connect(),
    end: () => client.end(),
    query: async (sql, params) => {
      const result = (await client.query(sql, params)) as { rows: unknown[] };
      return { rows: result.rows };
    }
  };
};

const schemaExists = async (client: SchemaClient, schemaName: string): Promise<boolean> => {
  const result = await client.query(
    "SELECT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = $1) AS exists",
    [schemaName]
  );

  const [row] = result.rows as Array<{ exists?: boolean }>;
  return row?.exists ?? false;
};

// Soft deprovision is intentionally a status transition only. Session invalidation is deferred.
export const softDeprovisionTenant = async (
  input: SoftDeprovisionTenantInput,
  db: TenantLifecyclePrismaClient = prisma
): Promise<SoftDeprovisionTenantResult> => {
  const existingTenant = await db.tenant.findUnique({
    where: { id: input.tenantId }
  });

  if (!existingTenant) {
    return {
      status: "not_found",
      message: "Tenant was not found",
      tenantId: input.tenantId
    };
  }

  if (existingTenant.status === TenantStatus.inactive) {
    return {
      status: "conflict",
      message: "Tenant is already inactive",
      tenantId: existingTenant.id
    };
  }

  const updatedTenant = await db.tenant.update({
    where: { id: input.tenantId },
    data: { status: TenantStatus.inactive }
  });

  return {
    status: "soft_deprovisioned",
    tenantId: updatedTenant.id,
    slug: updatedTenant.slug,
    schemaName: updatedTenant.schemaName,
    previousStatus: existingTenant.status,
    tenant: updatedTenant
  };
};

export const hardDeprovisionTenant = async (
  input: HardDeprovisionTenantInput,
  dependencies: TenantLifecycleDependencies = {}
): Promise<HardDeprovisionTenantResult> => {
  const db = dependencies.db ?? prisma;
  const existingTenant = await db.tenant.findUnique({
    where: { id: input.tenantId }
  });

  if (!existingTenant) {
    return {
      status: "not_found",
      message: "Tenant was not found",
      tenantId: input.tenantId
    };
  }

  const client = (dependencies.createSchemaClient ?? createDefaultSchemaClient)();
  await client.connect();

  try {
    const exists = await schemaExists(client, existingTenant.schemaName);
    if (!exists) {
      return {
        status: "conflict",
        message: "Tenant schema is already missing",
        tenantId: existingTenant.id
      };
    }

    await client.query(`DROP SCHEMA ${quoteIdentifier(existingTenant.schemaName)} CASCADE`);
  } finally {
    await client.end();
  }

  await db.platformUserTenant.deleteMany({
    where: { tenantId: existingTenant.id }
  });
  await db.tenantSchemaVersion.deleteMany({
    where: { tenantId: existingTenant.id }
  });

  const updatedTenant = await db.tenant.update({
    where: { id: input.tenantId },
    data: { status: TenantStatus.hard_deprovisioned }
  });

  return {
    status: "hard_deprovisioned",
    tenantId: updatedTenant.id,
    slug: updatedTenant.slug,
    schemaName: updatedTenant.schemaName,
    previousStatus: existingTenant.status,
    tenant: updatedTenant
  };
};

export const deprovisionTenant = async (
  input: DeprovisionTenantInput,
  dependencies: TenantLifecycleDependencies = {}
): Promise<DeprovisionTenantResult> => {
  if (input.deprovisionType === DeprovisionTypeEnum.HARD) {
    return hardDeprovisionTenant({ tenantId: input.tenantId }, dependencies);
  }

  return softDeprovisionTenant(input, dependencies.db);
};
