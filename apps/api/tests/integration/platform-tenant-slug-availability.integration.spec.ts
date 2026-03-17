import { beforeEach, describe, expect, it, vi } from "vitest";

const tenantFindUnique = vi.fn();

vi.mock("../../src/db/prisma.js", () => ({
  prisma: {
    tenant: {
      findUnique: tenantFindUnique
    }
  }
}));

describe("platform tenant slug availability integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns available when no tenant owns the slug", async () => {
    tenantFindUnique.mockResolvedValue(null);

    const { getPlatformTenantSlugAvailability } = await import(
      "../../src/platform/tenants/slug-availability-service.js"
    );

    const response = await getPlatformTenantSlugAvailability({ slug: "acme-logistics" });

    expect(response).toEqual({
      data: {
        slug: "acme-logistics",
        isAvailable: true
      }
    });
  });

  it("returns unavailable when any retained tenant owns the slug", async () => {
    tenantFindUnique.mockResolvedValue({
      id: "tenant-legacy",
      slug: "legacy-fleet",
      status: "hard_deprovisioned"
    });

    const { getPlatformTenantSlugAvailability } = await import(
      "../../src/platform/tenants/slug-availability-service.js"
    );

    const response = await getPlatformTenantSlugAvailability({ slug: "legacy-fleet" });

    expect(response).toEqual({
      data: {
        slug: "legacy-fleet",
        isAvailable: false
      }
    });
  });

  it("queries persisted tenant metadata by normalized slug without a status filter", async () => {
    tenantFindUnique.mockResolvedValue(null);

    const { getPlatformTenantSlugAvailability } = await import(
      "../../src/platform/tenants/slug-availability-service.js"
    );

    await getPlatformTenantSlugAvailability({ slug: "acme-logistics" });

    expect(tenantFindUnique).toHaveBeenCalledWith({
      where: { slug: "acme-logistics" }
    });
  });
});
