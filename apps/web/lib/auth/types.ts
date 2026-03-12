import { z } from "zod";

export enum AuthStateStatusEnum {
  BOOTSTRAPPING = "bootstrapping",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated"
}

export enum AuthReasonEnum {
  SESSION_EXPIRED = "session-expired"
}

export const RoleSchema = z.enum(["super_admin", "tenant_admin", "tenant_user"]);
export const TenantRoleSchema = z.enum(["tenant_admin", "tenant_user"]);
export const AuthTargetAppSchema = z.enum(["platform", "tenant"]);
export const AuthRoutingStatusSchema = z.enum(["allowed", "access_denied", "selection_required"]);
export const AuthRoutingReasonCodeSchema = z.enum([
  "missing_active_tenant_membership",
  "multiple_active_tenant_memberships"
]);

export const AuthRoutingSchema = z.object({
  status: AuthRoutingStatusSchema,
  target_app: AuthTargetAppSchema.nullable(),
  reason_code: AuthRoutingReasonCodeSchema.nullable()
});

export const CurrentUserResponseSchema = z.object({
  principal: z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string().nullable(),
    display_name: z.string(),
    role: RoleSchema,
    account_status: z.string()
  }),
  role_context: z.object({
    role: RoleSchema,
    tenant_id: z.string().nullable()
  }),
  tenant: z
    .object({
      id: z.string(),
      slug: z.string(),
      name: z.string(),
      role: TenantRoleSchema
    })
    .nullable(),
  target_app: AuthTargetAppSchema,
  routing: AuthRoutingSchema
});

export const AccessTokenResponseSchema = z.object({
  access_token: z.string(),
  current_user: CurrentUserResponseSchema
});

export const AuthErrorResponseSchema = z.object({
  error_code: z.string(),
  message: z.string(),
  routing: AuthRoutingSchema.optional()
});

export type Role = z.infer<typeof RoleSchema>;
export type TenantRole = z.infer<typeof TenantRoleSchema>;
export type AuthTargetApp = z.infer<typeof AuthTargetAppSchema>;
export type AuthRoutingStatus = z.infer<typeof AuthRoutingStatusSchema>;
export type AuthRoutingReasonCode = z.infer<typeof AuthRoutingReasonCodeSchema>;
export type CurrentUserResponse = z.infer<typeof CurrentUserResponseSchema>;
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>;
export type AuthErrorResponse = z.infer<typeof AuthErrorResponseSchema>;
