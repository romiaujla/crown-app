import { z } from "zod";

import { PlatformUserAccountStatusSchema } from "../domain/status-enums.js";
import { JwtClaimsSchema, RoleSchema } from "./claims.js";

export const LoginRequestSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8)
});

export const LogoutRequestSchema = z.object({}).optional();

export const CurrentUserPrincipalSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().nullable(),
  display_name: z.string(),
  role: RoleSchema,
  account_status: PlatformUserAccountStatusSchema
});

export const CurrentUserTenantSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    role: z.enum(["tenant_admin", "tenant_user"])
  })
  .nullable();

export const CurrentUserResponseSchema = z.object({
  principal: CurrentUserPrincipalSchema,
  role_context: z.object({
    role: RoleSchema,
    tenant_id: z.string().nullable()
  }),
  tenant: CurrentUserTenantSchema,
  target_app: z.enum(["platform", "tenant"])
});

export const AccessTokenResponseSchema = z.object({
  access_token: z.string(),
  claims: JwtClaimsSchema,
  current_user: CurrentUserResponseSchema
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type CurrentUserResponse = z.infer<typeof CurrentUserResponseSchema>;
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>;
