import { Router } from "express";

import type { JwtClaims } from "../auth/claims.js";

import {
  LoginRequestSchema,
  LogoutRequestSchema,
  RefreshRequestSchema,
  TokenPairResponseSchema
} from "../auth/contracts.js";
import { sendAuthError } from "../types/errors.js";

const toToken = (claims: JwtClaims) => {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" }), "utf8").toString("base64url");
  const payload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
  return `${header}.${payload}.signature`;
};

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const parsed = LoginRequestSchema.safeParse(req.body);
  if (!parsed.success) return sendAuthError(res, 401, "unauthenticated", "Invalid credentials");

  const claims: JwtClaims =
    parsed.data.email === "super@crowncrm.dev"
      ? { sub: "user-super-admin", role: "super_admin", tenant_id: null }
      : { sub: "user-tenant-admin", role: "tenant_admin", tenant_id: "tenant-acme" };

  const response = TokenPairResponseSchema.parse({
    access_token: toToken(claims),
    refresh_token: `refresh-${claims.sub}`,
    claims
  });

  return res.status(200).json(response);
});

authRouter.post("/refresh", (req, res) => {
  const parsed = RefreshRequestSchema.safeParse(req.body);
  if (!parsed.success || !parsed.data.refresh_token.startsWith("refresh-")) {
    return sendAuthError(res, 401, "unauthenticated", "Invalid refresh token");
  }

  const claims: JwtClaims = parsed.data.refresh_token.includes("super")
    ? { sub: "user-super-admin", role: "super_admin", tenant_id: null }
    : { sub: "user-tenant-admin", role: "tenant_admin", tenant_id: "tenant-acme" };

  const response = TokenPairResponseSchema.parse({
    access_token: toToken(claims),
    refresh_token: `refresh-${claims.sub}`,
    claims
  });

  return res.status(200).json(response);
});

authRouter.post("/logout", (req, res) => {
  const parsed = LogoutRequestSchema.safeParse(req.body);
  if (!parsed.success || !parsed.data.refresh_token.startsWith("refresh-")) {
    return sendAuthError(res, 401, "unauthenticated", "Invalid token/session context");
  }
  return res.status(204).send();
});
