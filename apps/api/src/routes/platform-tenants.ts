import { Router } from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { sendAuthError } from "../types/errors.js";

import { TenantProvisionRequestSchema, TenantProvisionResponseSchema } from "../tenant/contracts.js";
import { provisionTenant } from "../tenant/provision-service.js";

type PlatformTenantsRouterOptions = {
  provision?: typeof provisionTenant;
};

export const createPlatformTenantsRouter = (options: PlatformTenantsRouterOptions = {}) => {
  const router = Router();
  const provision = options.provision ?? provisionTenant;

  router.post("/platform/tenants", authenticate, authorize({ namespace: "platform", allowedRoles: ["super_admin"] }), async (req, res) => {
    const parsed = TenantProvisionRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendAuthError(res, 400, "validation_error", "Invalid tenant provisioning payload");
    }

    const result = await provision({
      ...parsed.data,
      actorSub: req.auth?.sub ?? "unknown-actor"
    });

    if (result.status === "conflict") {
      return sendAuthError(res, 409, "conflict", result.message);
    }

    if (result.status === "failed") {
      return sendAuthError(res, 500, "migration_failed", result.message);
    }

    const response = TenantProvisionResponseSchema.parse({
      tenant_id: result.tenantId,
      slug: result.slug,
      schema_name: result.schemaName,
      applied_versions: result.appliedVersions,
      status: "provisioned"
    });

    return res.status(201).json(response);
  });

  return router;
};

export const platformTenantsRouter = createPlatformTenantsRouter();
