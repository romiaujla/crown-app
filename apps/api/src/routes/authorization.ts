import { Router } from 'express';
import { z } from 'zod';

import { AuthErrorCodeEnum, RoleEnum, TenantRoleEnum } from '../auth/claims.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createRateLimitMiddleware } from '../middleware/rate-limit.js';
import { sendAuthError } from '../types/errors.js';

export const authorizationRouter = Router();

const TenantAccessRequestSchema = z.object({
  authClass: z.enum(TenantRoleEnum),
  tenantId: z.string().min(1),
});

const authorizationRateLimitMiddleware = createRateLimitMiddleware({
  windowMs: 60_000,
  maxRequests: 100,
  message: 'Too many authorization requests',
});

authorizationRouter.get(
  '/platform/ping',
  authenticate,
  authorize({ namespace: 'platform' }),
  authorizationRateLimitMiddleware,
  (_req, res) => {
    res.status(200).json({ ok: true, namespace: 'platform' });
  },
);

authorizationRouter.post(
  '/tenant/access',
  authenticate,
  authorizationRateLimitMiddleware,
  (req, res, next) => {
    const parsed = TenantAccessRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendAuthError(
        res,
        400,
        AuthErrorCodeEnum.VALIDATION_ERROR,
        'Invalid tenant access payload',
      );
    }

    req.params.tenantId = parsed.data.tenantId;

    const allowedRoles =
      parsed.data.authClass === TenantRoleEnum.TENANT_ADMIN
        ? [RoleEnum.TENANT_ADMIN]
        : [RoleEnum.TENANT_ADMIN, RoleEnum.TENANT_USER];

    return authorize({ namespace: 'tenant', allowedRoles })(req, res, () => {
      const namespace =
        parsed.data.authClass === TenantRoleEnum.TENANT_ADMIN ? 'tenant-admin' : 'tenant-user';
      return res.status(200).json({ ok: true, namespace });
    });
  },
);
