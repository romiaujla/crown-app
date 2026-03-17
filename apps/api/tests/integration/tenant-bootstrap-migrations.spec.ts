import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("tenant migration bootstrap integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({});
  });

  it("applies baseline migrations and records versions", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "tenant-migrations-"));
    const sqlPath = path.join(tempDir, "001_organizations.sql");
    await writeFile(sqlPath, "create table organizations(id text primary key);", "utf8");

    const query = vi.fn().mockResolvedValue({});
    const client = { query } as unknown as import("pg").Client;

    const { executeTenantMigrations } = await import("../../src/tenant/migrator.js");

    const result = await executeTenantMigrations(
      {
        tenantId: "tenant-1",
        schemaName: "tenant_acme",
        actorSub: "user-super-admin",
        migrations: [{ version: "0001_base.001_organizations", description: "organizations", sqlPath, sequence: 1 }]
      },
      { client }
    );

    expect(result.status).toBe("provisioned");
    expect(result.appliedVersions).toEqual(["0001_base.001_organizations"]);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("stops on first failed migration and reports migration_failed context", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "tenant-migrations-"));
    const sqlPathA = path.join(tempDir, "001_organizations.sql");
    const sqlPathB = path.join(tempDir, "002_people.sql");
    await writeFile(sqlPathA, "create table organizations(id text primary key);", "utf8");
    await writeFile(sqlPathB, "create table people(id text primary key);", "utf8");

    const query = vi
      .fn()
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce({});

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

    expect(result.status).toBe("failed");
    expect(result.failedVersion).toBe("0001_base.002_people");
    expect(result.appliedVersions).toEqual(["0001_base.001_organizations"]);
  });
});
