import { z } from "zod";

import { JwtClaimsSchema } from "./claims.js";

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const LogoutRequestSchema = z.object({}).optional();

export const AccessTokenResponseSchema = z.object({
  access_token: z.string(),
  claims: JwtClaimsSchema
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>;
