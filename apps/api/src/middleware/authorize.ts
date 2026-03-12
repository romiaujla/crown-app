import type { NextFunction, Request, Response } from "express";

import { AuthErrorCodeEnum, type RoleEnum } from "../auth/claims.js";

import { evaluateAccess, resolveNamespaceFromPath, type Namespace } from "../auth/policy.js";
import { sendAuthError } from "../types/errors.js";

type AuthorizeOptions = {
  namespace?: Namespace;
  allowedRoles?: RoleEnum[];
};

const resolveTargetTenant = (req: Request) => req.header("x-tenant-id") ?? req.params.tenantId ?? null;

export const authorize =
  (options: AuthorizeOptions = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return sendAuthError(res, 401, AuthErrorCodeEnum.UNAUTHENTICATED, "Authentication required");

    const namespace = options.namespace ?? resolveNamespaceFromPath(req.path);
    if (!namespace) return sendAuthError(res, 403, AuthErrorCodeEnum.FORBIDDEN_ROLE, "No authorization policy matched route");

    if (options.allowedRoles && !options.allowedRoles.includes(req.auth.role)) {
      return sendAuthError(res, 403, AuthErrorCodeEnum.FORBIDDEN_ROLE, "Role is not permitted");
    }

    const decision = evaluateAccess(req.auth, namespace, resolveTargetTenant(req));
    if (decision.allow) return next();

    if (decision.reason === "forbidden_tenant") {
      return sendAuthError(res, 403, AuthErrorCodeEnum.FORBIDDEN_TENANT, "Tenant scope mismatch");
    }
    return sendAuthError(res, 403, AuthErrorCodeEnum.FORBIDDEN_ROLE, "Role is not permitted");
  };
