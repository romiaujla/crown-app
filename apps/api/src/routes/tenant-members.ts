import {
  AssignTenantMemberRoleRequestSchema,
  RevokeTenantMemberRoleRequestSchema,
  TenantMemberSearchRequestSchema,
} from '@crown/types';
import { Router, type RequestHandler } from 'express';

import { AuthErrorCodeEnum, RoleEnum } from '../auth/claims.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createRateLimitMiddleware } from '../middleware/rate-limit.js';
import { sendAuthError } from '../types/errors.js';

import {
  assignTenantMemberRole,
  getTenantMembers,
  revokeTenantMemberRole,
} from '../tenant/member-service.js';
import { getTenantRoles } from '../tenant/role-service.js';

type TenantMembersRouterOptions = {
  rateLimitMiddleware?: RequestHandler;
  searchRateLimitMiddleware?: RequestHandler;
};

export const createTenantMembersRouter = (options: TenantMembersRouterOptions = {}) => {
  const router = Router();
  const rateLimitMiddleware =
    options.rateLimitMiddleware ??
    createRateLimitMiddleware({
      windowMs: 60_000,
      maxRequests: 10,
      message: 'Too many tenant member management requests',
    });
  const searchRateLimitMiddleware =
    options.searchRateLimitMiddleware ??
    createRateLimitMiddleware({
      windowMs: 60_000,
      maxRequests: 100,
      message: 'Too many tenant member requests',
    });

  router.post(
    '/tenant/members/search',
    authenticate,
    authorize({ namespace: 'tenant', allowedRoles: [RoleEnum.TENANT_ADMIN] }),
    searchRateLimitMiddleware,
    async (req, res) => {
      const tenantId = req.auth?.tenant_id;
      if (!tenantId) {
        return sendAuthError(
          res,
          403,
          AuthErrorCodeEnum.FORBIDDEN_TENANT,
          'No tenant context available',
        );
      }

      const parsed = TenantMemberSearchRequestSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid member search payload',
        );
      }

      const response = await getTenantMembers(tenantId, {
        filters: parsed.data.filters,
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
      });

      return res.status(200).json(response);
    },
  );

  router.post(
    '/tenant/members/roles',
    authenticate,
    authorize({ namespace: 'tenant', allowedRoles: [RoleEnum.TENANT_ADMIN] }),
    rateLimitMiddleware,
    async (req, res) => {
      const tenantId = req.auth?.tenant_id;
      if (!tenantId) {
        return sendAuthError(
          res,
          403,
          AuthErrorCodeEnum.FORBIDDEN_TENANT,
          'No tenant context available',
        );
      }

      const parsed = AssignTenantMemberRoleRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid role assignment payload',
        );
      }

      const result = await assignTenantMemberRole(
        tenantId,
        parsed.data.membershipId,
        parsed.data.roleCode,
      );

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

  router.post(
    '/tenant/members/roles/revoke',
    authenticate,
    authorize({ namespace: 'tenant', allowedRoles: [RoleEnum.TENANT_ADMIN] }),
    rateLimitMiddleware,
    async (req, res) => {
      const tenantId = req.auth?.tenant_id;
      if (!tenantId) {
        return sendAuthError(
          res,
          403,
          AuthErrorCodeEnum.FORBIDDEN_TENANT,
          'No tenant context available',
        );
      }

      const parsed = RevokeTenantMemberRoleRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendAuthError(
          res,
          400,
          AuthErrorCodeEnum.VALIDATION_ERROR,
          'Invalid role revocation payload',
        );
      }

      const result = await revokeTenantMemberRole(
        tenantId,
        parsed.data.membershipId,
        parsed.data.roleCode,
      );

      if (!result.ok) {
        return sendAuthError(
          res,
          result.status,
          result.errorCode as AuthErrorCodeEnum,
          result.message,
        );
      }

      return res.status(200).json(result.data);
    },
  );

  router.get(
    '/tenant/roles',
    authenticate,
    authorize({ namespace: 'tenant', allowedRoles: [RoleEnum.TENANT_ADMIN] }),
    searchRateLimitMiddleware,
    async (_req, res) => {
      const response = await getTenantRoles();
      return res.status(200).json(response);
    },
  );

  return router;
};
