import { prisma } from "../../db/prisma.js";
import { TenantStatus } from "../../domain/status-enums.js";

import { DashboardOverviewResponseSchema, type DashboardOverviewResponse } from "./contracts.js";

type DashboardOverviewPrismaClient = {
  tenant: {
    count(): Promise<number>;
    groupBy(args: { by: ["status"]; _count: { _all: true } }): Promise<Array<{ status: TenantStatus; _count: { _all: number } }>>;
  };
};

const tenantStatusOrder = Object.values(TenantStatus) as TenantStatus[];

export const getPlatformDashboardOverview = async (
  db: DashboardOverviewPrismaClient = prisma
): Promise<DashboardOverviewResponse> => {
  const [totalTenantCount, groupedStatusCounts] = await Promise.all([
    db.tenant.count(),
    db.tenant.groupBy({
      by: ["status"],
      _count: { _all: true }
    })
  ]);

  const statusCountMap = new Map(groupedStatusCounts.map((entry) => [entry.status, entry._count._all]));

  return DashboardOverviewResponseSchema.parse({
    widgets: {
      tenant_summary: {
        total_tenant_count: totalTenantCount,
        tenant_status_counts: tenantStatusOrder.map((status) => ({
          status,
          count: statusCountMap.get(status) ?? 0
        }))
      }
    }
  });
};
