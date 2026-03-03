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
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({});
  });

  it("applies baseline migrations and records versions", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "tenant-migrations-"));
    const sqlPath = path.join(tempDir, "001_accounts.sql");
    await writeFile(sqlPath, "create table accounts(id text primary key);", "utf8");

    const query = vi.fn().mockResolvedValue({});
    const client = { query } as unknown as import("pg").Client;

    const { executeTenantMigrations } = await import("../../src/tenant/migrator.js");

    const result = await executeTenantMigrations(
      {
        tenantId: "tenant-1",
        schemaName: "tenant_acme",
        actorSub: "user-super-admin",
        migrations: [{ version: "0001_base.001_accounts", description: "accounts", sqlPath, sequence: 1 }]
      },
      { client }
    );

    expect(result.status).toBe("provisioned");
    expect(result.appliedVersions).toEqual(["0001_base.001_accounts"]);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("stops on first failed migration and reports migration_failed context", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "tenant-migrations-"));
    const sqlPathA = path.join(tempDir, "001_accounts.sql");
    const sqlPathB = path.join(tempDir, "002_contacts.sql");
    await writeFile(sqlPathA, "create table accounts(id text primary key);", "utf8");
    await writeFile(sqlPathB, "create table contacts(id text primary key);", "utf8");

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
          { version: "0001_base.001_accounts", description: "accounts", sqlPath: sqlPathA, sequence: 1 },
          { version: "0001_base.002_contacts", description: "contacts", sqlPath: sqlPathB, sequence: 2 }
        ]
      },
      { client }
    );

    expect(result.status).toBe("failed");
    expect(result.failedVersion).toBe("0001_base.002_contacts");
    expect(result.appliedVersions).toEqual(["0001_base.001_accounts"]);
  });
});
