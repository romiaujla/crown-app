import {
  CreateTenantMembershipRequestSchema,
  PlatformUserDetailRequestSchema,
  PlatformUserSearchRequestSchema,
} from '@crown/types';
import { Router, type RequestHandler } from 'express';

import { AuthErrorCodeEnum, RoleEnum } from '../auth/claims.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createRateLimitMiddleware } from '../middleware/rate-limit.js';
import { sendAuthError } from '../types/errors.js';

import { getPlatformUserDetail } from '../platform/users/detail-service.js';
import { getPlatformUserDirectory } from '../platform/users/directory-service.js';
import { createTenantMembership } from '../platform/users/membership-service.js';

type PlatformUsersRouterOptions = {
  rateLimitMiddleware?: RequestHandler;
  searchRateLimitMiddleware?: RequestHandler;
};

export const createPlatformUsersRouter = (options: PlatformUsersRouterOptions = {}) => {
  const router = Router();
  const rateLimitMiddleware =
    options.rateLimitMiddleware ??
    createRateLimitMiddleware({
      windowMs: 60_000,
      maxRequests: 10,
      message: 'Too many user management requests',
    });
  const searchRateLimitMiddleware =
    options.searchRateLimitMiddleware ??
    createRateLimitMiddleware({
      windowMs: 60_000,
      maxRequests: 100,
      message: 'Too many user directory requests',
    });

  router.post(
    '/platform/users/search',
    authenticate,
    authorize({ namespace: 'platform', allowedRoles: [RoleEnum.SUPER_ADMIN] }),
    searchRateLimitMiddleware,
    async (req, res) => {
      const parsed = PlatformUserSearchRequestSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid user search payload',
        );
      }

      const response = await getPlatformUserDirectory({
        filters: parsed.data.filters,
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
      });

      return res.status(200).json(response);
    },
  );

  router.post(
    '/platform/user',
    authenticate,
    authorize({ namespace: 'platform', allowedRoles: [RoleEnum.SUPER_ADMIN] }),
    searchRateLimitMiddleware,
    async (req, res) => {
      const parsed = PlatformUserDetailRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid user detail payload',
        );
      }

      const response = await getPlatformUserDetail(parsed.data.userId);
      if (!response) {
        return sendAuthError(res, 404, AuthErrorCodeEnum.NOT_FOUND, 'User not found');
      }

      return res.status(200).json(response);
    },
  );

  router.post(
    '/platform/tenant/membership',
    authenticate,
    authorize({ namespace: 'platform', allowedRoles: [RoleEnum.SUPER_ADMIN] }),
    rateLimitMiddleware,
    async (req, res) => {
      const parsed = CreateTenantMembershipRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid tenant membership payload',
        );
      }

      const result = await createTenantMembership({
        userId: parsed.data.userId,
        tenantId: parsed.data.tenantId,
        roleCode: parsed.data.roleCode,
      });

      if (!result.ok) {
        return sendAuthError(
          res,
          result.status,
          result.errorCode as AuthErrorCodeEnum,
          result.message,
        );
      }

      return res.status(201).json(result.data);
    },
  );

  return router;
};
