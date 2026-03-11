import type { NextFunction, Request, Response } from "express";

import { defaultAuthService } from "../auth/default-auth-service.js";
import { JwtClaimsSchema } from "../auth/claims.js";

import { sendAuthError } from "../types/errors.js";

const decodeTokenPayload = (rawToken: string): unknown => {
  const trimmed = rawToken.trim();

  // Supports JSON tokens for local testing.
  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  const parts = trimmed.split(".");
  if (parts.length < 2) throw new Error("Malformed token");

  const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const normalized = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
  return JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendAuthError(res, 401, "unauthenticated", "Missing bearer token");
  }

  const token = authHeader.slice("Bearer ".length);
  try {
    const claims = JwtClaimsSchema.parse(decodeTokenPayload(token));
    req.auth = claims;
    return defaultAuthService.resolveCurrentUser(claims).then((currentUser) => {
      if (!currentUser) return sendAuthError(res, 401, "invalid_claims", "Invalid authentication claims");
      req.authContext = {
        claims,
        currentUser
      };
      return next();
    });
  } catch {
    return sendAuthError(res, 401, "invalid_claims", "Invalid authentication claims");
  }
};
