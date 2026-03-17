import {
  DeprovisionTypeEnum,
  TenantCreateReferenceDataRequestSchema,
  TenantDirectoryListRequestSchema,
  TenantSlugAvailabilityRequestSchema,
  TenantSlugSchema,
  TenantStatusEnum,
  type TenantCreateReferenceDataFilter,
  type TenantCreateReferenceDataResponse,
  type TenantDirectoryListResponse,
  type TenantSlugAvailabilityResponse,
} from '@crown/types';
import { Router, type RequestHandler } from 'express';

import { AuthErrorCodeEnum, RoleEnum } from '../auth/claims.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createRateLimitMiddleware } from '../middleware/rate-limit.js';
import { sendAuthError } from '../types/errors.js';

import { getPlatformTenantDirectory } from '../platform/tenants/directory-service.js';
import { getPlatformTenantCreateReferenceData } from '../platform/tenants/reference-data-service.js';
import { getPlatformTenantSlugAvailability } from '../platform/tenants/slug-availability-service.js';
import {
  DeprovisionTenantRequestSchema,
  HardDeprovisionTenantResponseSchema,
  SoftDeprovisionTenantResponseSchema,
  TenantProvisionRequestSchema,
  TenantProvisionResponseSchema,
} from '../tenant/contracts.js';
import { deprovisionTenant } from '../tenant/lifecycle-service.js';
import { provisionTenant } from '../tenant/provision-service.js';
import { normalizeSlug } from '../tenant/slug.js';
import type { DeprovisionTenantResult } from '../tenant/types.js';

type PlatformTenantsRouterOptions = {
  getSlugAvailability?: (input: { slug: string }) => Promise<TenantSlugAvailabilityResponse>;
  getReferenceData?: (
    filter: TenantCreateReferenceDataFilter,
  ) => Promise<TenantCreateReferenceDataResponse>;
  listTenants?: (input: {
    name?: string;
    status?: TenantStatusEnum;
  }) => Promise<TenantDirectoryListResponse>;
  provision?: typeof provisionTenant;
  rateLimitMiddleware?: RequestHandler;
  searchRateLimitMiddleware?: RequestHandler;
  deprovision?: (input: {
    tenantId: string;
    deprovisionType: DeprovisionTypeEnum;
  }) => Promise<DeprovisionTenantResult>;
};

export const createPlatformTenantsRouter = (options: PlatformTenantsRouterOptions = {}) => {
  const router = Router();
  const getSlugAvailability = options.getSlugAvailability ?? getPlatformTenantSlugAvailability;
  const getReferenceData = options.getReferenceData ?? getPlatformTenantCreateReferenceData;
  const listTenants = options.listTenants ?? getPlatformTenantDirectory;
  const provision = options.provision ?? provisionTenant;
  const rateLimitMiddleware =
    options.rateLimitMiddleware ??
    createRateLimitMiddleware({
      windowMs: 60_000,
      maxRequests: 10,
      message: 'Too many tenant mutation requests',
    });
  const searchRateLimitMiddleware =
    options.searchRateLimitMiddleware ??
    createRateLimitMiddleware({
      windowMs: 60_000,
      maxRequests: 100,
      message: 'Too many tenant directory requests',
    });
  const deprovision = options.deprovision ?? deprovisionTenant;

  router.post(
    '/platform/tenant/slug-availability',
    authenticate,
    authorize({ namespace: 'platform', allowedRoles: [RoleEnum.SUPER_ADMIN] }),
    searchRateLimitMiddleware,
    async (req, res) => {
      const parsed = TenantSlugAvailabilityRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid tenant slug availability payload',
        );
      }

      const normalizedSlug = normalizeSlug(parsed.data.slug);
      const validatedSlug = TenantSlugSchema.safeParse(normalizedSlug);
      if (!validatedSlug.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid tenant slug availability payload',
        );
      }

      const response = await getSlugAvailability({ slug: validatedSlug.data });
      return res.status(200).json(response);
    },
  );

  router.post(
    '/platform/tenant/reference-data',
    authenticate,
    authorize({ namespace: 'platform', allowedRoles: [RoleEnum.SUPER_ADMIN] }),
    searchRateLimitMiddleware,
    async (req, res) => {
      const parsed = TenantCreateReferenceDataRequestSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid tenant create reference-data filter',
        );
      }

      const response = await getReferenceData(parsed.data.filter ?? {});
      return res.status(200).json(response);
    },
  );

  router.post(
    '/platform/tenants/search',
    authenticate,
    authorize({ namespace: 'platform', allowedRoles: [RoleEnum.SUPER_ADMIN] }),
    searchRateLimitMiddleware,
    async (req, res) => {
      const parsed = TenantDirectoryListRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid tenant directory filter',
        );
      }

      const response = await listTenants(parsed.data.filters ?? {});
      return res.status(200).json(response);
    },
  );

  router.post(
    '/platform/tenant',
    authenticate,
    authorize({ namespace: 'platform', allowedRoles: [RoleEnum.SUPER_ADMIN] }),
    rateLimitMiddleware,
    async (req, res) => {
      const parsed = TenantProvisionRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid tenant provisioning payload',
        );
      }

      const result = await provision({
        name: parsed.data.name,
        slug: parsed.data.slug,
        managementSystemTypeCode: parsed.data.managementSystemTypeCode,
        actorSub: req.auth?.sub ?? 'unknown-actor',
      });

      if (result.status === 'conflict') {
        return sendAuthError(res, 409, AuthErrorCodeEnum.CONFLICT, result.message);
      }

      if (result.status === 'failed') {
        return sendAuthError(res, 500, AuthErrorCodeEnum.MIGRATION_FAILED, result.message);
      }

      const response = TenantProvisionResponseSchema.parse({
        tenantId: result.tenantId,
        slug: result.slug,
        schemaName: result.schemaName,
        appliedVersions: result.appliedVersions,
        managementSystemTypeCode: result.managementSystemTypeCode,
        status: 'provisioned',
      });

      return res.status(201).json(response);
    },
  );

  router.post(
    '/platform/tenant/deprovision',
    authenticate,
    authorize({ namespace: 'platform', allowedRoles: [RoleEnum.SUPER_ADMIN] }),
    rateLimitMiddleware,
    async (req, res) => {
      const parsed = DeprovisionTenantRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid tenant deprovision payload',
        );
      }

      const result = await deprovision({
        tenantId: parsed.data.tenantId,
        deprovisionType: parsed.data.deprovisionType ?? DeprovisionTypeEnum.SOFT,
      });

      if (result.status === 'not_found') {
        return sendAuthError(res, 404, AuthErrorCodeEnum.NOT_FOUND, result.message);
      }

      if (result.status === 'conflict') {
        return sendAuthError(res, 409, AuthErrorCodeEnum.CONFLICT, result.message);
      }

      const response =
        result.status === 'hard_deprovisioned'
          ? HardDeprovisionTenantResponseSchema.parse({
              tenantId: result.tenantId,
              slug: result.slug,
              schemaName: result.schemaName,
              previousStatus: result.previousStatus,
              status: 'hard_deprovisioned',
              operation: 'hard_deprovisioned',
            })
          : SoftDeprovisionTenantResponseSchema.parse({
              tenantId: result.tenantId,
              slug: result.slug,
              schemaName: result.schemaName,
              previousStatus: result.previousStatus,
              status: 'inactive',
              operation: 'soft_deprovisioned',
            });

      return res.status(200).json(response);
    },
  );

  return router;
};

export const platformTenantsRouter = createPlatformTenantsRouter();
