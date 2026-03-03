import { beforeEach, describe, expect, it, vi } from "vitest";

const tenantCreate = vi.fn();
const tenantFindUnique = vi.fn();
const tenantUpdate = vi.fn();

const query = vi.fn();
const connect = vi.fn();
const end = vi.fn();

const loadTenantMigrations = vi.fn();
const executeTenantMigrations = vi.fn();

vi.mock("../../src/db/prisma.js", () => ({
  prisma: {
    tenant: {
      create: tenantCreate,
      findUnique: tenantFindUnique,
      update: tenantUpdate
    }
  }
}));

vi.mock("../../src/tenant/migration-loader.js", () => ({
  loadTenantMigrations
}));

vi.mock("../../src/tenant/migrator.js", () => ({
  executeTenantMigrations,
  tenantMigrationStrategy: {
    prismaScope: "public",
    tenantScope: "tenant_<slug>",
    execution: "versioned-sql"
  }
}));

vi.mock("pg", () => ({
  Client: vi.fn(() => ({
    connect,
    query,
    end
  }))
}));

describe("tenant provisioning integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    tenantCreate.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      schemaName: "tenant_acme",
      status: "provisioning",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    tenantUpdate.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      schemaName: "tenant_acme",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    loadTenantMigrations.mockResolvedValue([
      { version: "0001_base.001_accounts", description: "accounts", sqlPath: "a.sql", sequence: 1 }
    ]);
    executeTenantMigrations.mockResolvedValue({
      status: "provisioned",
      appliedVersions: ["0001_base.001_accounts"],
      skippedVersions: []
    });
  });

  it("creates schema and metadata on success", async () => {
    const { provisionTenant } = await import("../../src/tenant/provision-service.js");

    const result = await provisionTenant({
      name: "Acme",
      slug: "acme",
      actorSub: "user-super-admin"
    });

    expect(result.status).toBe("provisioned");
    expect(query).toHaveBeenCalledWith('CREATE SCHEMA IF NOT EXISTS "tenant_acme"');
  });

  it("returns conflict for active duplicate tenant", async () => {
    tenantCreate.mockRejectedValue({ code: "P2002" });
    tenantFindUnique.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      schemaName: "tenant_acme",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const { provisionTenant } = await import("../../src/tenant/provision-service.js");

    const result = await provisionTenant({
      name: "Acme",
      slug: "acme",
      actorSub: "user-super-admin"
    });

    expect(result).toEqual({
      status: "conflict",
      message: "tenant slug already exists"
    });
    expect(query).not.toHaveBeenCalled();
  });
});
