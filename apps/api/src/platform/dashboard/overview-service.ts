import { RoleEnum } from "../../auth/claims.js";
import { prisma } from "../../db/prisma.js";
import { TenantStatus } from "../../domain/status-enums.js";

import {
  DashboardMetricWindowEnum,
  DashboardOverviewResponseSchema,
  type DashboardOverviewResponse
} from "./contracts.js";

type DashboardOverviewPrismaClient = {
  platformUser: {
    count(args: { where: { role: RoleEnum.TENANT_USER } }): Promise<number>;
  };
  tenant: {
    count(args?: {
      where?: {
        createdAt?: {
          gte?: Date;
          lt?: Date;
          lte?: Date;
        };
      };
    }): Promise<number>;
    groupBy(args: { by: ["status"]; _count: { _all: true } }): Promise<Array<{ status: TenantStatus; _count: { _all: number } }>>;
  };
};

const tenantStatusOrder = Object.values(TenantStatus) as TenantStatus[];
const dashboardMetricWindows = [
  { window: DashboardMetricWindowEnum.WEEK, durationDays: 7 },
  { window: DashboardMetricWindowEnum.MONTH, durationDays: 30 },
  { window: DashboardMetricWindowEnum.YEAR, durationDays: 365 }
] as const;

const getTrailingWindowStart = (now: Date, durationDays: number) =>
  new Date(now.getTime() - durationDays * 24 * 60 * 60 * 1000);

const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

const calculateGrowthRatePercentage = (currentCount: number, previousCount: number) => {
  // Normalize zero-history windows so the API returns deterministic dashboard values.
  if (previousCount === 0) {
    return currentCount > 0 ? 100 : 0;
  }

  return roundToTwoDecimals(((currentCount - previousCount) / previousCount) * 100);
};

export const getPlatformDashboardOverview = async (
  db: DashboardOverviewPrismaClient = prisma,
  now: Date = new Date()
): Promise<DashboardOverviewResponse> => {
  const windowCounts = await Promise.all(
    dashboardMetricWindows.map(async ({ durationDays, window }) => {
      const currentWindowStart = getTrailingWindowStart(now, durationDays);
      const previousWindowStart = getTrailingWindowStart(currentWindowStart, durationDays);

      const [currentCount, previousCount] = await Promise.all([
        db.tenant.count({
          where: {
            createdAt: {
              gte: currentWindowStart,
              lte: now
            }
          }
        }),
        db.tenant.count({
          where: {
            createdAt: {
              gte: previousWindowStart,
              lt: currentWindowStart
            }
          }
        })
      ]);

      return {
        currentCount,
        previousCount,
        window
      };
    })
  );

  const [tenantUserCount, totalTenantCount, groupedStatusCounts] = await Promise.all([
    db.platformUser.count({
      where: {
        role: RoleEnum.TENANT_USER
      }
    }),
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
        tenant_user_count: tenantUserCount,
        tenant_status_counts: tenantStatusOrder.map((status) => ({
          status,
          count: statusCountMap.get(status) ?? 0
        })),
        new_tenant_counts: windowCounts.map(({ currentCount, window }) => ({
          window,
          count: currentCount
        })),
        tenant_growth_rates: windowCounts.map(({ currentCount, previousCount, window }) => ({
          window,
          growth_rate_percentage: calculateGrowthRatePercentage(currentCount, previousCount)
        }))
      }
    }
  });
};
