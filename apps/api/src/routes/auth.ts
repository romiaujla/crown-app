import { Router } from 'express';

import { AuthErrorCodeEnum } from '../auth/claims.js';
import { CurrentUserResponseSchema } from '../auth/contracts.js';
import { defaultAuthService } from '../auth/default-auth-service.js';
import type { AuthService, CurrentUserContext } from '../auth/service.js';
import { signAccessToken } from '../auth/tokens.js';
import { authenticate } from '../middleware/authenticate.js';

import {
  LoginRequestSchema,
  LogoutRequestSchema,
  AccessTokenResponseSchema,
} from '../auth/contracts.js';
import { sendAuthError } from '../types/errors.js';

type AuthRouterOptions = {
  authService?: AuthService;
};

const toCurrentUserResponse = (currentUser: CurrentUserContext) =>
  CurrentUserResponseSchema.parse({
    principal: {
      id: currentUser.principal.id,
      email: currentUser.principal.email,
      username: currentUser.principal.username ?? null,
      display_name: currentUser.principal.displayName,
      role: currentUser.principal.role,
      account_status: currentUser.principal.accountStatus,
    },
    role_context: {
      role: currentUser.roleContext.role,
      tenant_id: currentUser.roleContext.tenantId ?? null,
    },
    tenant: currentUser.tenant
      ? {
          id: currentUser.tenant.id,
          slug: currentUser.tenant.slug,
          name: currentUser.tenant.name,
          role: currentUser.tenant.role,
        }
      : null,
    target_app: currentUser.targetApp,
    routing: {
      status: currentUser.routing.status,
      target_app: currentUser.routing.targetApp,
      reason_code: currentUser.routing.reasonCode,
    },
  });

export const createAuthRouter = (options: AuthRouterOptions = {}) => {
  const router = Router();
  const authService = options.authService ?? defaultAuthService;

  router.post('/login', async (req, res) => {
    const parsed = LoginRequestSchema.safeParse(req.body);
    if (!parsed.success)
      return sendAuthError(res, 400, AuthErrorCodeEnum.VALIDATION_ERROR, 'Invalid login payload');

    const result = await authService.login(parsed.data.identifier, parsed.data.password);
    if (!result.ok) {
      return sendAuthError(res, result.status, result.errorCode, result.message, result.routing);
    }

    const response = AccessTokenResponseSchema.parse({
      access_token: signAccessToken(result.claims),
      claims: result.claims,
      current_user: toCurrentUserResponse(result.currentUser),
    });

    return res.status(200).json(response);
  });

  router.get('/me', authenticate, async (req, res) => {
    if (!req.auth)
      return sendAuthError(res, 401, AuthErrorCodeEnum.UNAUTHENTICATED, 'Missing bearer token');
    const currentUser = req.authContext
      ? { ok: true as const, currentUser: req.authContext.currentUser }
      : await authService.resolveCurrentUser(req.auth);

    if (!currentUser.ok) {
      return sendAuthError(
        res,
        currentUser.status,
        currentUser.errorCode,
        currentUser.message,
        currentUser.routing,
      );
    }

    return res.status(200).json(toCurrentUserResponse(currentUser.currentUser));
  });

  router.post('/logout', (req, res) => {
    const parsed = LogoutRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendAuthError(res, 400, AuthErrorCodeEnum.VALIDATION_ERROR, 'Invalid logout payload');
    }
    return res.status(204).send();
  });

  return router;
};

export const authRouter = createAuthRouter();
