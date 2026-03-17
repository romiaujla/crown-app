import {
  DashboardMetricWindowEnum,
  DashboardOverviewResponseSchema,
  TenantStatusEnum,
  type DashboardOverviewResponse,
} from '@crown/types';
import { prisma } from '../../db/prisma.js';
import { TenantStatus } from '../../domain/status-enums.js';

type DashboardOverviewPrismaClient = {
  user: {
    count(args?: { where?: unknown }): Promise<number>;
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
    groupBy(args: {
      by: ['status'];
      _count: { _all: true };
    }): Promise<Array<{ status: TenantStatus; _count: { _all: number } }>>;
  };
};

const tenantStatusOrder = Object.values(TenantStatusEnum);
const dashboardMetricWindows = [
  { window: DashboardMetricWindowEnum.WEEK, durationDays: 7 },
  { window: DashboardMetricWindowEnum.MONTH, durationDays: 30 },
  { window: DashboardMetricWindowEnum.YEAR, durationDays: 365 },
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
  now: Date = new Date(),
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
              lte: now,
            },
          },
        }),
        db.tenant.count({
          where: {
            createdAt: {
              gte: previousWindowStart,
              lt: currentWindowStart,
            },
          },
        }),
      ]);

      return {
        currentCount,
        previousCount,
        window,
      };
    }),
  );

  const [tenantUserCount, totalTenantCount, groupedStatusCounts] = await Promise.all([
    db.user.count({
      where: {
        tenantMemberships: {
          some: {
            roleAssignments: {
              some: {
                role: {
                  authClass: 'tenant_user',
                },
              },
            },
          },
        },
      },
    }),
    db.tenant.count(),
    db.tenant.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
  ]);

  const statusCountMap = new Map(
    groupedStatusCounts.map((entry) => [entry.status, entry._count._all]),
  );

  return DashboardOverviewResponseSchema.parse({
    widgets: {
      tenantSummary: {
        totalTenantCount: totalTenantCount,
        tenantUserCount: tenantUserCount,
        tenantStatusCounts: tenantStatusOrder.map((status) => ({
          status,
          count: statusCountMap.get(status) ?? 0,
        })),
        newTenantCounts: windowCounts.map(({ currentCount, window }) => ({
          window,
          count: currentCount,
        })),
        tenantGrowthRates: windowCounts.map(({ currentCount, previousCount, window }) => ({
          window,
          growthRatePercentage: calculateGrowthRatePercentage(currentCount, previousCount),
        })),
      },
    },
  });
};
