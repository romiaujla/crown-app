import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardMetricWindowEnum } from '@crown/types';
import { TenantStatus } from '../../src/domain/status-enums.js';

const userCount = vi.fn();
const tenantCount = vi.fn();
const tenantGroupBy = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    user: {
      count: userCount,
    },
    tenant: {
      count: tenantCount,
      groupBy: tenantGroupBy,
    },
  },
}));

describe('platform dashboard overview integration', () => {
  const fixedNow = new Date('2026-03-13T12:00:00.000Z');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns deterministic zero-filled counts for every tenant status and metric window', async () => {
    userCount.mockResolvedValue(12);
    tenantCount.mockImplementation(
      async (args?: { where?: { createdAt?: { gte?: Date; lt?: Date; lte?: Date } } }) => {
        if (!args?.where?.createdAt) {
          return 3;
        }

        const { gte, lt, lte } = args.where.createdAt;
        const matches = [
          new Date('2026-03-10T12:00:00.000Z'),
          new Date('2026-02-20T12:00:00.000Z'),
          new Date('2025-09-01T12:00:00.000Z'),
        ].filter((createdAt) => {
          if (gte && createdAt < gte) {
            return false;
          }

          if (lt && createdAt >= lt) {
            return false;
          }

          if (lte && createdAt > lte) {
            return false;
          }

          return true;
        });

        return matches.length;
      },
    );
    tenantGroupBy.mockResolvedValue([
      { status: TenantStatus.active, _count: { _all: 2 } },
      { status: TenantStatus.provisioning, _count: { _all: 1 } },
    ]);

    const { getPlatformDashboardOverview } =
      await import('../../src/platform/dashboard/overview-service.js');

    const response = await getPlatformDashboardOverview(undefined, fixedNow);

    expect(response).toEqual({
      widgets: {
        tenantSummary: {
          totalTenantCount: 3,
          tenantUserCount: 12,
          tenantStatusCounts: [
            { status: TenantStatus.active, count: 2 },
            { status: TenantStatus.inactive, count: 0 },
            { status: TenantStatus.provisioning, count: 1 },
            { status: TenantStatus.provisioning_failed, count: 0 },
            { status: TenantStatus.hard_deprovisioned, count: 0 },
          ],
          newTenantCounts: [
            { window: DashboardMetricWindowEnum.WEEK, count: 1 },
            { window: DashboardMetricWindowEnum.MONTH, count: 2 },
            { window: DashboardMetricWindowEnum.YEAR, count: 3 },
          ],
          tenantGrowthRates: [
            { window: DashboardMetricWindowEnum.WEEK, growthRatePercentage: 100 },
            { window: DashboardMetricWindowEnum.MONTH, growthRatePercentage: 100 },
            { window: DashboardMetricWindowEnum.YEAR, growthRatePercentage: 100 },
          ],
        },
      },
    });
  });

  it('returns an all-zero status breakdown and zeroed metric windows when no tenants exist', async () => {
    userCount.mockResolvedValue(0);
    tenantCount.mockResolvedValue(0);
    tenantGroupBy.mockResolvedValue([]);

    const { getPlatformDashboardOverview } =
      await import('../../src/platform/dashboard/overview-service.js');

    const response = await getPlatformDashboardOverview(undefined, fixedNow);

    expect(response.widgets.tenantSummary.totalTenantCount).toBe(0);
    expect(response.widgets.tenantSummary.tenantUserCount).toBe(0);
    expect(response.widgets.tenantSummary.tenantStatusCounts).toEqual([
      { status: TenantStatus.active, count: 0 },
      { status: TenantStatus.inactive, count: 0 },
      { status: TenantStatus.provisioning, count: 0 },
      { status: TenantStatus.provisioning_failed, count: 0 },
      { status: TenantStatus.hard_deprovisioned, count: 0 },
    ]);
    expect(response.widgets.tenantSummary.newTenantCounts).toEqual([
      { window: DashboardMetricWindowEnum.WEEK, count: 0 },
      { window: DashboardMetricWindowEnum.MONTH, count: 0 },
      { window: DashboardMetricWindowEnum.YEAR, count: 0 },
    ]);
    expect(response.widgets.tenantSummary.tenantGrowthRates).toEqual([
      { window: DashboardMetricWindowEnum.WEEK, growthRatePercentage: 0 },
      { window: DashboardMetricWindowEnum.MONTH, growthRatePercentage: 0 },
      { window: DashboardMetricWindowEnum.YEAR, growthRatePercentage: 0 },
    ]);
  });

  it('rounds growth rates from the immediately preceding trailing window', async () => {
    userCount.mockResolvedValue(4);
    tenantCount.mockImplementation(
      async (args?: { where?: { createdAt?: { gte?: Date; lt?: Date; lte?: Date } } }) => {
        if (!args?.where?.createdAt) {
          return 4;
        }

        const { gte, lt, lte } = args.where.createdAt;
        const matches = [
          new Date('2026-03-12T12:00:00.000Z'),
          new Date('2026-03-08T12:00:00.000Z'),
          new Date('2026-03-01T12:00:00.000Z'),
          new Date('2025-10-01T12:00:00.000Z'),
          new Date('2026-02-10T12:00:00.000Z'),
          new Date('2026-01-20T12:00:00.000Z'),
          new Date('2025-08-20T12:00:00.000Z'),
          new Date('2025-07-20T12:00:00.000Z'),
        ].filter((createdAt) => {
          if (gte && createdAt < gte) {
            return false;
          }

          if (lt && createdAt >= lt) {
            return false;
          }

          if (lte && createdAt > lte) {
            return false;
          }

          return true;
        });

        return matches.length;
      },
    );
    tenantGroupBy.mockResolvedValue([{ status: TenantStatus.active, _count: { _all: 4 } }]);

    const { getPlatformDashboardOverview } =
      await import('../../src/platform/dashboard/overview-service.js');

    const response = await getPlatformDashboardOverview(undefined, fixedNow);

    expect(response.widgets.tenantSummary.tenantGrowthRates).toEqual([
      { window: DashboardMetricWindowEnum.WEEK, growthRatePercentage: 100 },
      { window: DashboardMetricWindowEnum.MONTH, growthRatePercentage: 50 },
      { window: DashboardMetricWindowEnum.YEAR, growthRatePercentage: 100 },
    ]);
  });
});
