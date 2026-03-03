import { z } from "zod";

import { JwtClaimsSchema } from "./claims.js";

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const RefreshRequestSchema = z.object({
  refresh_token: z.string()
});

export const LogoutRequestSchema = z.object({
  refresh_token: z.string()
});

export const TokenPairResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  claims: JwtClaimsSchema
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type TokenPairResponse = z.infer<typeof TokenPairResponseSchema>;
