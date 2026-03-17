import { DashboardOverviewResponseSchema } from '@crown/types';
import { z } from 'zod';

export enum AuthStateStatusEnum {
  BOOTSTRAPPING = 'bootstrapping',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

export enum AuthReasonEnum {
  SESSION_EXPIRED = 'session-expired',
}

export const RoleSchema = z.enum(['super_admin', 'tenant_admin', 'tenant_user']);
export const TenantRoleSchema = z.enum(['tenant_admin', 'tenant_user']);
export const AuthTargetAppSchema = z.enum(['platform', 'tenant']);
export const AuthRoutingStatusSchema = z.enum(['allowed', 'access_denied', 'selection_required']);
export const AuthRoutingReasonCodeSchema = z.enum([
  'missing_active_tenant_membership',
  'multiple_active_tenant_memberships',
]);

export const AuthRoutingSchema = z.object({
  status: AuthRoutingStatusSchema,
  targetApp: AuthTargetAppSchema.nullable(),
  reasonCode: AuthRoutingReasonCodeSchema.nullable(),
});

export const AccessTokenClaimsSchema = z.object({
  sub: z.string(),
  role: RoleSchema,
  tenant_id: z.string().nullable(),
  exp: z.number().int().positive(),
});

export const CurrentUserResponseSchema = z.object({
  principal: z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string().nullable(),
    displayName: z.string(),
    role: RoleSchema,
    accountStatus: z.string(),
  }),
  roleContext: z.object({
    role: RoleSchema,
    tenantId: z.string().nullable(),
  }),
  tenant: z
    .object({
      id: z.string(),
      slug: z.string(),
      name: z.string(),
      role: TenantRoleSchema,
    })
    .nullable(),
  targetApp: AuthTargetAppSchema,
  routing: AuthRoutingSchema,
});

export const AccessTokenResponseSchema = z.object({
  accessToken: z.string(),
  claims: AccessTokenClaimsSchema,
  currentUser: CurrentUserResponseSchema,
});

export const AuthErrorResponseSchema = z.object({
  errorCode: z.string(),
  message: z.string(),
  routing: AuthRoutingSchema.optional(),
});

export type Role = z.infer<typeof RoleSchema>;
export type TenantRole = z.infer<typeof TenantRoleSchema>;
export type AuthTargetApp = z.infer<typeof AuthTargetAppSchema>;
export type AuthRoutingStatus = z.infer<typeof AuthRoutingStatusSchema>;
export type AuthRoutingReasonCode = z.infer<typeof AuthRoutingReasonCodeSchema>;
export type CurrentUserResponse = z.infer<typeof CurrentUserResponseSchema>;
export type AccessTokenClaims = z.infer<typeof AccessTokenClaimsSchema>;
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>;
export type AuthErrorResponse = z.infer<typeof AuthErrorResponseSchema>;
export type DashboardOverviewResponse = z.infer<typeof DashboardOverviewResponseSchema>;
