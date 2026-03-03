import cors from "cors";
import express from "express";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";

import { authRouter } from "./routes/auth.js";
import { authorizationRouter } from "./routes/authorization.js";
import { healthRouter } from "./routes/health.js";
import { createPlatformTenantsRouter } from "./routes/platform-tenants.js";

type BuildAppOptions = {
  platformTenantsRouter?: ReturnType<typeof createPlatformTenantsRouter>;
};

export const buildApp = (options: BuildAppOptions = {}) => {
  const app = express();
  const logger = pino({ name: "crown-api" });
  const platformRouter = options.platformTenantsRouter ?? createPlatformTenantsRouter();
  const httpLogger = (pinoHttp as unknown as (opts: { logger: pino.Logger }) => express.RequestHandler)({
    logger
  });

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1", authorizationRouter);
  app.use("/api/v1", platformRouter);
  app.use("/api/v1", healthRouter);

  return app;
};
