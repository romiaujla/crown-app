import { beforeEach, describe, expect, it, vi } from "vitest";

const tenantFindMany = vi.fn();
const tenantCount = vi.fn();

vi.mock("../../src/db/prisma.js", () => ({
  prisma: {
    tenant: {
      findMany: tenantFindMany,
      count: tenantCount
    }
  }
}));

describe("platform tenant directory integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps persisted tenants into the agreed response envelope", async () => {
    tenantFindMany.mockResolvedValue([
      {
        id: "tenant-acme",
        name: "Acme Logistics",
        slug: "acme-logistics",
        schemaName: "tenant_acme_logistics",
        status: "active",
        createdAt: new Date("2026-03-01T12:00:00.000Z"),
        updatedAt: new Date("2026-03-10T09:30:00.000Z")
      }
    ]);
    tenantCount.mockResolvedValue(1);

    const { getPlatformTenantDirectory } = await import("../../src/platform/tenants/directory-service.js");

    const response = await getPlatformTenantDirectory({
      search: "acme",
      status: "active"
    });

    expect(response).toEqual({
      data: {
        tenantList: [
          {
            tenantId: "tenant-acme",
            name: "Acme Logistics",
            slug: "acme-logistics",
            schemaName: "tenant_acme_logistics",
            status: "active",
            createdAt: "2026-03-01T12:00:00.000Z",
            updatedAt: "2026-03-10T09:30:00.000Z"
          }
        ]
      },
      meta: {
        totalRecords: 1,
        filters: {
          search: "acme",
          status: "active"
        }
      }
    });
  });

  it("applies search and status filters to the persistence query", async () => {
    tenantFindMany.mockResolvedValue([]);
    tenantCount.mockResolvedValue(0);

    const { getPlatformTenantDirectory } = await import("../../src/platform/tenants/directory-service.js");

    await getPlatformTenantDirectory({
      search: "acme",
      status: "inactive"
    });

    expect(tenantFindMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: "acme",
          mode: "insensitive"
        },
        status: "inactive"
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    expect(tenantCount).toHaveBeenCalledWith({
      where: {
        name: {
          contains: "acme",
          mode: "insensitive"
        },
        status: "inactive"
      }
    });
  });

  it("returns null filters when no search or status is provided", async () => {
    tenantFindMany.mockResolvedValue([]);
    tenantCount.mockResolvedValue(0);

    const { getPlatformTenantDirectory } = await import("../../src/platform/tenants/directory-service.js");

    const response = await getPlatformTenantDirectory({});

    expect(response.meta).toEqual({
      totalRecords: 0,
      filters: {
        search: null,
        status: null
      }
    });
    expect(tenantFindMany).toHaveBeenCalledWith({
      where: {},
      orderBy: {
        createdAt: "desc"
      }
    });
  });
});
