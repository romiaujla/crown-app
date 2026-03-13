import { Router } from "express";

import { AuthErrorCodeEnum, RoleEnum } from "../auth/claims.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { sendAuthError } from "../types/errors.js";

import {
  SoftDeprovisionTenantRequestSchema,
  SoftDeprovisionTenantResponseSchema,
  TenantProvisionRequestSchema,
  TenantProvisionResponseSchema
} from "../tenant/contracts.js";
import { softDeprovisionTenant } from "../tenant/lifecycle-service.js";
import { provisionTenant } from "../tenant/provision-service.js";
import type { SoftDeprovisionTenantResult } from "../tenant/types.js";

type PlatformTenantsRouterOptions = {
  provision?: typeof provisionTenant;
  softDeprovision?: (input: { tenantId: string }) => Promise<SoftDeprovisionTenantResult>;
};

export const createPlatformTenantsRouter = (options: PlatformTenantsRouterOptions = {}) => {
  const router = Router();
  const provision = options.provision ?? provisionTenant;
  const deprovision = options.softDeprovision ?? softDeprovisionTenant;

  router.post("/platform/tenants", authenticate, authorize({ namespace: "platform", allowedRoles: [RoleEnum.SUPER_ADMIN] }), async (req, res) => {
    const parsed = TenantProvisionRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendAuthError(res, 400, AuthErrorCodeEnum.VALIDATION_ERROR, "Invalid tenant provisioning payload");
    }

    const result = await provision({
      ...parsed.data,
      actorSub: req.auth?.sub ?? "unknown-actor"
    });

    if (result.status === "conflict") {
      return sendAuthError(res, 409, AuthErrorCodeEnum.CONFLICT, result.message);
    }

    if (result.status === "failed") {
      return sendAuthError(res, 500, AuthErrorCodeEnum.MIGRATION_FAILED, result.message);
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

  router.post(
    "/platform/tenant/deprovision",
    authenticate,
    authorize({ namespace: "platform", allowedRoles: [RoleEnum.SUPER_ADMIN] }),
    async (req, res) => {
      const parsed = SoftDeprovisionTenantRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendAuthError(res, 400, AuthErrorCodeEnum.VALIDATION_ERROR, "Invalid tenant soft deprovision payload");
      }

      const result = await deprovision({ tenantId: parsed.data.tenant_id });

      if (result.status === "not_found") {
        return sendAuthError(res, 404, AuthErrorCodeEnum.NOT_FOUND, result.message);
      }

      if (result.status === "conflict") {
        return sendAuthError(res, 409, AuthErrorCodeEnum.CONFLICT, result.message);
      }

      const response = SoftDeprovisionTenantResponseSchema.parse({
        tenant_id: result.tenantId,
        slug: result.slug,
        schema_name: result.schemaName,
        previous_status: result.previousStatus,
        status: "inactive",
        operation: "soft_deprovisioned"
      });

      return res.status(200).json(response);
    }
  );

  return router;
};

export const platformTenantsRouter = createPlatformTenantsRouter();
