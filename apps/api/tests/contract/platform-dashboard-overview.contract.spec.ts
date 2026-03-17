import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import {
  DashboardMetricWindowEnum,
  TenantStatusEnum,
  type DashboardOverviewResponse,
} from '@crown/types';
import { buildApp } from '../../src/app.js';
import { createPlatformDashboardOverviewRouter } from '../../src/routes/platform-dashboard-overview.js';
import {
  createJwtToken,
  superAdminClaims,
  tenantAdminClaims,
  tenantUserClaims,
} from '../helpers/auth-fixtures.js';

const createOverviewPayload = (): DashboardOverviewResponse => ({
  widgets: {
    tenantSummary: {
      totalTenantCount: 3,
      tenantUserCount: 12,
      tenantStatusCounts: [
        { status: TenantStatusEnum.ACTIVE, count: 1 },
        { status: TenantStatusEnum.INACTIVE, count: 1 },
        { status: TenantStatusEnum.PROVISIONING, count: 1 },
        { status: TenantStatusEnum.PROVISIONING_FAILED, count: 0 },
        { status: TenantStatusEnum.HARD_DEPROVISIONED, count: 0 },
      ],
      newTenantCounts: [
        { window: DashboardMetricWindowEnum.WEEK, count: 1 },
        { window: DashboardMetricWindowEnum.MONTH, count: 2 },
        { window: DashboardMetricWindowEnum.YEAR, count: 3 },
      ],
      tenantGrowthRates: [
        { window: DashboardMetricWindowEnum.WEEK, growthRatePercentage: 100 },
        { window: DashboardMetricWindowEnum.MONTH, growthRatePercentage: 33.33 },
        { window: DashboardMetricWindowEnum.YEAR, growthRatePercentage: 50 },
      ],
    },
  },
});

describe('platform dashboard overview contract', () => {
  it('returns 200 with the widgets envelope for super_admin', async () => {
    const getOverview = vi.fn(async () => createOverviewPayload());
    const app = buildApp({
      platformDashboardOverviewRouter: createPlatformDashboardOverviewRouter({ getOverview }),
    });

    const response = await request(app)
      .get('/api/v1/platform/dashboard/overview')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`);

    expect(response.status).toBe(200);
    expect(response.body.widgets.tenantSummary.totalTenantCount).toBe(3);
    expect(response.body.widgets.tenantSummary.tenantUserCount).toBe(12);
    expect(response.body.widgets.tenantSummary.tenantStatusCounts).toEqual([
      { status: 'active', count: 1 },
      { status: 'inactive', count: 1 },
      { status: 'provisioning', count: 1 },
      { status: 'provisioning_failed', count: 0 },
      { status: 'hard_deprovisioned', count: 0 },
    ]);
    expect(response.body.widgets.tenantSummary.newTenantCounts).toEqual([
      { window: DashboardMetricWindowEnum.WEEK, count: 1 },
      { window: DashboardMetricWindowEnum.MONTH, count: 2 },
      { window: DashboardMetricWindowEnum.YEAR, count: 3 },
    ]);
    expect(response.body.widgets.tenantSummary.tenantGrowthRates).toEqual([
      { window: DashboardMetricWindowEnum.WEEK, growthRatePercentage: 100 },
      { window: DashboardMetricWindowEnum.MONTH, growthRatePercentage: 33.33 },
      { window: DashboardMetricWindowEnum.YEAR, growthRatePercentage: 50 },
    ]);
    expect(response.body.widgets.tenantSummary.recentActivity).toBeUndefined();
  });

  it('returns 401 for missing token', async () => {
    const getOverview = vi.fn(async () => createOverviewPayload());
    const app = buildApp({
      platformDashboardOverviewRouter: createPlatformDashboardOverviewRouter({ getOverview }),
    });

    const response = await request(app).get('/api/v1/platform/dashboard/overview');

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe('unauthenticated');
    expect(getOverview).not.toHaveBeenCalled();
  });

  it('returns 403 for tenant_admin', async () => {
    const getOverview = vi.fn(async () => createOverviewPayload());
    const app = buildApp({
      platformDashboardOverviewRouter: createPlatformDashboardOverviewRouter({ getOverview }),
    });

    const response = await request(app)
      .get('/api/v1/platform/dashboard/overview')
      .set('Authorization', `Bearer ${createJwtToken(tenantAdminClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
    expect(getOverview).not.toHaveBeenCalled();
  });

  it('returns 403 for tenant_user', async () => {
    const getOverview = vi.fn(async () => createOverviewPayload());
    const app = buildApp({
      platformDashboardOverviewRouter: createPlatformDashboardOverviewRouter({ getOverview }),
    });

    const response = await request(app)
      .get('/api/v1/platform/dashboard/overview')
      .set('Authorization', `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
    expect(getOverview).not.toHaveBeenCalled();
  });
});
