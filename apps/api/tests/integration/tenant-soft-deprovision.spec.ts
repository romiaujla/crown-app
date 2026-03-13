import { beforeEach, describe, expect, it, vi } from "vitest";

import { TenantStatus } from "../../src/domain/status-enums.js";

const tenantFindUnique = vi.fn();
const tenantUpdate = vi.fn();

vi.mock("../../src/db/prisma.js", () => ({
  prisma: {
    tenant: {
      findUnique: tenantFindUnique,
      update: tenantUpdate
    }
  }
}));

describe("tenant soft deprovision integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("marks the tenant inactive without deleting metadata", async () => {
    tenantFindUnique.mockResolvedValue({
      id: "tenant-acme",
      name: "Acme Local Logistics",
      slug: "acme-local",
      schemaName: "tenant_acme_local",
      status: TenantStatus.active,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    tenantUpdate.mockResolvedValue({
      id: "tenant-acme",
      name: "Acme Local Logistics",
      slug: "acme-local",
      schemaName: "tenant_acme_local",
      status: TenantStatus.inactive,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const { softDeprovisionTenant } = await import("../../src/tenant/lifecycle-service.js");

    const result = await softDeprovisionTenant({ tenantId: "tenant-acme" });

    expect(result.status).toBe("soft_deprovisioned");
    expect(tenantFindUnique).toHaveBeenCalledWith({ where: { id: "tenant-acme" } });
    expect(tenantUpdate).toHaveBeenCalledWith({
      where: { id: "tenant-acme" },
      data: { status: TenantStatus.inactive }
    });
  });

  it("returns not_found for unknown tenants", async () => {
    tenantFindUnique.mockResolvedValue(null);

    const { softDeprovisionTenant } = await import("../../src/tenant/lifecycle-service.js");

    await expect(softDeprovisionTenant({ tenantId: "tenant-missing" })).resolves.toEqual({
      status: "not_found",
      message: "Tenant was not found",
      tenantId: "tenant-missing"
    });
    expect(tenantUpdate).not.toHaveBeenCalled();
  });

  it("returns conflict when the tenant is already inactive", async () => {
    tenantFindUnique.mockResolvedValue({
      id: "tenant-acme",
      name: "Acme Local Logistics",
      slug: "acme-local",
      schemaName: "tenant_acme_local",
      status: TenantStatus.inactive,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const { softDeprovisionTenant } = await import("../../src/tenant/lifecycle-service.js");

    await expect(softDeprovisionTenant({ tenantId: "tenant-acme" })).resolves.toEqual({
      status: "conflict",
      message: "Tenant is already inactive",
      tenantId: "tenant-acme"
    });
    expect(tenantUpdate).not.toHaveBeenCalled();
  });
});
