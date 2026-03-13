import { beforeEach, describe, expect, it, vi } from "vitest";

import { TenantStatus } from "../../src/domain/status-enums.js";

const tenantCount = vi.fn();
const tenantGroupBy = vi.fn();

vi.mock("../../src/db/prisma.js", () => ({
  prisma: {
    tenant: {
      count: tenantCount,
      groupBy: tenantGroupBy
    }
  }
}));

describe("platform dashboard overview integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns deterministic zero-filled counts for every tenant status", async () => {
    tenantCount.mockResolvedValue(3);
    tenantGroupBy.mockResolvedValue([
      { status: TenantStatus.active, _count: { _all: 2 } },
      { status: TenantStatus.provisioning, _count: { _all: 1 } }
    ]);

    const { getPlatformDashboardOverview } = await import("../../src/platform/dashboard/overview-service.js");

    const response = await getPlatformDashboardOverview();

    expect(response).toEqual({
      widgets: {
        tenant_summary: {
          total_tenant_count: 3,
          tenant_status_counts: [
            { status: TenantStatus.active, count: 2 },
            { status: TenantStatus.inactive, count: 0 },
            { status: TenantStatus.provisioning, count: 1 },
            { status: TenantStatus.provisioning_failed, count: 0 }
          ]
        }
      }
    });
  });

  it("returns an all-zero status breakdown when no tenants exist", async () => {
    tenantCount.mockResolvedValue(0);
    tenantGroupBy.mockResolvedValue([]);

    const { getPlatformDashboardOverview } = await import("../../src/platform/dashboard/overview-service.js");

    const response = await getPlatformDashboardOverview();

    expect(response.widgets.tenant_summary.total_tenant_count).toBe(0);
    expect(response.widgets.tenant_summary.tenant_status_counts).toEqual([
      { status: TenantStatus.active, count: 0 },
      { status: TenantStatus.inactive, count: 0 },
      { status: TenantStatus.provisioning, count: 0 },
      { status: TenantStatus.provisioning_failed, count: 0 }
    ]);
  });
});
