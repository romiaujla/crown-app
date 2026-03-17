import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';

import { createAuthRouter } from './routes/auth.js';
import { authorizationRouter } from './routes/authorization.js';
import { docsRouter } from './routes/docs.js';
import { healthRouter } from './routes/health.js';
import { createPlatformDashboardOverviewRouter } from './routes/platform-dashboard-overview.js';
import { createPlatformTenantsRouter } from './routes/platform-tenants.js';
import { createPlatformUsersRouter } from './routes/platform-users.js';
import { createTenantMembersRouter } from './routes/tenant-members.js';

type BuildAppOptions = {
  authRouter?: ReturnType<typeof createAuthRouter>;
  platformDashboardOverviewRouter?: ReturnType<typeof createPlatformDashboardOverviewRouter>;
  platformTenantsRouter?: ReturnType<typeof createPlatformTenantsRouter>;
  platformUsersRouter?: ReturnType<typeof createPlatformUsersRouter>;
  tenantMembersRouter?: ReturnType<typeof createTenantMembersRouter>;
};

export const buildApp = (options: BuildAppOptions = {}) => {
  const app = express();
  const logger = pino({ name: 'crown-api' });
  const authRouter = options.authRouter ?? createAuthRouter();
  const platformDashboardRouter =
    options.platformDashboardOverviewRouter ?? createPlatformDashboardOverviewRouter();
  const platformRouter = options.platformTenantsRouter ?? createPlatformTenantsRouter();
  const platformUsersRouter = options.platformUsersRouter ?? createPlatformUsersRouter();
  const tenantMembersRouter = options.tenantMembersRouter ?? createTenantMembersRouter();
  const httpLogger = (
    pinoHttp as unknown as (opts: { logger: pino.Logger }) => express.RequestHandler
  )({
    logger,
  });

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);

  app.use('/api/v1/docs', docsRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1', authorizationRouter);
  app.use('/api/v1', platformDashboardRouter);
  app.use('/api/v1', platformRouter);
  app.use('/api/v1', platformUsersRouter);
  app.use('/api/v1', tenantMembersRouter);
  app.use('/api/v1', healthRouter);

  return app;
};
