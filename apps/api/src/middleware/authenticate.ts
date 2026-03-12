import type { NextFunction, Request, Response } from "express";

import { AuthErrorCodeEnum } from "../auth/claims.js";
import { defaultAuthService } from "../auth/default-auth-service.js";
import { JwtClaimsSchema } from "../auth/claims.js";
import { verifyAccessToken } from "../auth/tokens.js";

import { sendAuthError } from "../types/errors.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendAuthError(res, 401, AuthErrorCodeEnum.UNAUTHENTICATED, "Missing bearer token");
  }

  const token = authHeader.slice("Bearer ".length);
  try {
    const claims = JwtClaimsSchema.parse(verifyAccessToken(token));
    if (claims.exp <= Math.floor(Date.now() / 1000)) {
      return sendAuthError(res, 401, AuthErrorCodeEnum.UNAUTHENTICATED, "Session is no longer valid.");
    }
    req.auth = claims;
    return defaultAuthService.resolveCurrentUser(claims).then((currentUserResult) => {
      if (!currentUserResult.ok) {
        return sendAuthError(
          res,
          currentUserResult.status,
          currentUserResult.errorCode,
          currentUserResult.message,
          currentUserResult.routing
        );
      }
      req.authContext = {
        claims,
        currentUser: currentUserResult.currentUser
      };
      return next();
    });
  } catch {
    return sendAuthError(res, 401, AuthErrorCodeEnum.INVALID_CLAIMS, "Invalid authentication claims");
  }
};
