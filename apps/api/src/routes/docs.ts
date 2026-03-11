import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import { authDocsDocument } from "../docs/openapi.js";

export const createDocsRouter = () => {
  const router = Router();
  const docsHandler = swaggerUi.setup(authDocsDocument, {
    explorer: true,
    customSiteTitle: "Crown API Docs",
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  router.get("", docsHandler);
  router.get("/", docsHandler);
  router.use("/", swaggerUi.serve);

  return router;
};

export const docsRouter = createDocsRouter();
