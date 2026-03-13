import type { NextFunction, Request, Response, RequestHandler } from "express";

import { AuthErrorCodeEnum } from "../auth/claims.js";
import { sendAuthError } from "../types/errors.js";

type RateLimitOptions = {
  errorCode?: AuthErrorCodeEnum;
  keyGenerator?: (req: Request) => string;
  maxRequests: number;
  message: string;
  windowMs: number;
};

type RateLimitState = {
  count: number;
  resetAt: number;
};

export const createRateLimitMiddleware = ({
  errorCode = AuthErrorCodeEnum.RATE_LIMITED,
  keyGenerator = (req) => req.auth?.sub ?? req.ip ?? "anonymous",
  maxRequests,
  message,
  windowMs
}: RateLimitOptions): RequestHandler => {
  const state = new Map<string, RateLimitState>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = keyGenerator(req);
    const existing = state.get(key);

    if (!existing || existing.resetAt <= now) {
      state.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (existing.count >= maxRequests) {
      res.setHeader("Retry-After", Math.max(1, Math.ceil((existing.resetAt - now) / 1000)).toString());
      return sendAuthError(res, 429, errorCode, message);
    }

    existing.count += 1;
    return next();
  };
};
