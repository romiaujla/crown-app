import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { assertNoDuplicateVersions, collectVersionsForTenant, type VersionRow } from "../helpers/tenant-provisioning-db.js";

const findUnique = vi.fn();
const create = vi.fn();

vi.mock("../../src/db/prisma.js", () => ({
  prisma: {
    tenantSchemaVersion: {
      findUnique,
      create
    }
  }
}));

describe("tenant schema versioning integration", () => {
  const rows: VersionRow[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    rows.length = 0;

    findUnique.mockImplementation(async ({ where }: { where: { tenantId_version: { tenantId: string; version: string } } }) => {
      const { tenantId, version } = where.tenantId_version;
      return rows.find((row) => row.tenantId === tenantId && row.version === version) ?? null;
    });

    create.mockImplementation(async ({ data }: { data: VersionRow & { description: string } }) => {
      rows.push({ tenantId: data.tenantId, version: data.version, appliedBy: data.appliedBy });
      return data;
    });
  });

  it("persists version rows for successful bootstrap", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "tenant-migrations-"));
    const sqlPathA = path.join(tempDir, "001_organizations.sql");
    const sqlPathB = path.join(tempDir, "002_people.sql");
    await writeFile(sqlPathA, "create table organizations(id text primary key);", "utf8");
    await writeFile(sqlPathB, "create table people(id text primary key);", "utf8");

    const query = vi.fn().mockResolvedValue({});
    const client = { query } as unknown as import("pg").Client;

    const { executeTenantMigrations } = await import("../../src/tenant/migrator.js");

    const result = await executeTenantMigrations(
      {
        tenantId: "tenant-1",
        schemaName: "tenant_acme",
        actorSub: "user-super-admin",
        migrations: [
          { version: "0001_base.001_organizations", description: "organizations", sqlPath: sqlPathA, sequence: 1 },
          { version: "0001_base.002_people", description: "people", sqlPath: sqlPathB, sequence: 2 }
        ]
      },
      { client }
    );

    expect(result.status).toBe("provisioned");
    expect(collectVersionsForTenant(rows, "tenant-1")).toEqual(["0001_base.001_organizations", "0001_base.002_people"]);
  });

  it("skips already-applied versions on retry without duplicates", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "tenant-migrations-"));
    const sqlPathA = path.join(tempDir, "001_organizations.sql");
    await writeFile(sqlPathA, "create table organizations(id text primary key);", "utf8");

    const query = vi.fn().mockResolvedValue({});
    const client = { query } as unknown as import("pg").Client;

    const { executeTenantMigrations } = await import("../../src/tenant/migrator.js");

    const firstRun = await executeTenantMigrations(
      {
        tenantId: "tenant-1",
        schemaName: "tenant_acme",
        actorSub: "user-super-admin",
        migrations: [{ version: "0001_base.001_organizations", description: "organizations", sqlPath: sqlPathA, sequence: 1 }]
      },
      { client }
    );

    const secondRun = await executeTenantMigrations(
      {
        tenantId: "tenant-1",
        schemaName: "tenant_acme",
        actorSub: "user-super-admin",
        migrations: [{ version: "0001_base.001_organizations", description: "organizations", sqlPath: sqlPathA, sequence: 1 }]
      },
      { client }
    );

    expect(firstRun.status).toBe("provisioned");
    expect(secondRun.status).toBe("provisioned");
    expect(secondRun.skippedVersions).toEqual(["0001_base.001_organizations"]);
    expect(assertNoDuplicateVersions(rows, "tenant-1")).toBe(true);
  });
});
