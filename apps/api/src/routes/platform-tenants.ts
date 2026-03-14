import { DeprovisionTypeEnum, TenantDirectoryListRequestSchema, type TenantDirectoryListResponse } from "@crown/types";
import { Router, type RequestHandler } from "express";

import { AuthErrorCodeEnum, RoleEnum } from "../auth/claims.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { createRateLimitMiddleware } from "../middleware/rate-limit.js";
import { sendAuthError } from "../types/errors.js";

import {
  DeprovisionTenantRequestSchema,
  HardDeprovisionTenantResponseSchema,
  SoftDeprovisionTenantResponseSchema,
  TenantProvisionRequestSchema,
  TenantProvisionResponseSchema
} from "../tenant/contracts.js";
import { getPlatformTenantDirectory } from "../platform/tenants/directory-service.js";
import { deprovisionTenant } from "../tenant/lifecycle-service.js";
import { provisionTenant } from "../tenant/provision-service.js";
import type { DeprovisionTenantResult } from "../tenant/types.js";

type PlatformTenantsRouterOptions = {
  listTenants?: (input: { name?: string; status?: "active" | "inactive" | "provisioning" | "provisioning_failed" }) => Promise<TenantDirectoryListResponse>;
  provision?: typeof provisionTenant;
  rateLimitMiddleware?: RequestHandler;
  deprovision?: (input: { tenantId: string; deprovisionType: DeprovisionTypeEnum }) => Promise<DeprovisionTenantResult>;
};

export const createPlatformTenantsRouter = (options: PlatformTenantsRouterOptions = {}) => {
  const router = Router();
  const listTenants = options.listTenants ?? getPlatformTenantDirectory;
  const provision = options.provision ?? provisionTenant;
  const rateLimitMiddleware =
    options.rateLimitMiddleware ??
    createRateLimitMiddleware({
      windowMs: 60_000,
      maxRequests: 10,
      message: "Too many tenant mutation requests"
    });
  const deprovision = options.deprovision ?? deprovisionTenant;

  router.post("/platform/tenants/search", authenticate, authorize({ namespace: "platform", allowedRoles: [RoleEnum.SUPER_ADMIN] }), async (req, res) => {
    const parsed = TenantDirectoryListRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendAuthError(res, 400, AuthErrorCodeEnum.VALIDATION_ERROR, "Invalid tenant directory filter");
    }

    const response = await listTenants(parsed.data.filters ?? {});
    return res.status(200).json(response);
  });

  router.post("/platform/tenant", authenticate, authorize({ namespace: "platform", allowedRoles: [RoleEnum.SUPER_ADMIN] }), rateLimitMiddleware, async (req, res) => {
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
    rateLimitMiddleware,
    async (req, res) => {
      const parsed = DeprovisionTenantRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendAuthError(res, 400, AuthErrorCodeEnum.VALIDATION_ERROR, "Invalid tenant deprovision payload");
      }

      const result = await deprovision({
        tenantId: parsed.data.tenant_id,
        deprovisionType: parsed.data.deprovisionType ?? DeprovisionTypeEnum.SOFT
      });

      if (result.status === "not_found") {
        return sendAuthError(res, 404, AuthErrorCodeEnum.NOT_FOUND, result.message);
      }

      if (result.status === "conflict") {
        return sendAuthError(res, 409, AuthErrorCodeEnum.CONFLICT, result.message);
      }

      const response =
        result.status === "hard_deprovisioned"
          ? HardDeprovisionTenantResponseSchema.parse({
              tenant_id: result.tenantId,
              slug: result.slug,
              schema_name: result.schemaName,
              previous_status: result.previousStatus,
              status: "inactive",
              operation: "hard_deprovisioned"
            })
          : SoftDeprovisionTenantResponseSchema.parse({
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
