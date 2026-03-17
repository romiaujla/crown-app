import { Router } from 'express';

import { RoleEnum } from '../auth/claims.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { DashboardOverviewResponseSchema, type DashboardOverviewResponse } from '@crown/types';
import { getPlatformDashboardOverview } from '../platform/dashboard/overview-service.js';

type PlatformDashboardOverviewRouterOptions = {
  getOverview?: () => Promise<DashboardOverviewResponse>;
};

export const createPlatformDashboardOverviewRouter = (
  options: PlatformDashboardOverviewRouterOptions = {},
) => {
  const router = Router();
  const getOverview = options.getOverview ?? getPlatformDashboardOverview;

  router.get(
    '/platform/dashboard/overview',
    authenticate,
    authorize({ namespace: 'platform', allowedRoles: [RoleEnum.SUPER_ADMIN] }),
    async (_req, res) => {
      const response = DashboardOverviewResponseSchema.parse(await getOverview());

      return res.status(200).json(response);
    },
  );

  return router;
};

export const platformDashboardOverviewRouter = createPlatformDashboardOverviewRouter();
