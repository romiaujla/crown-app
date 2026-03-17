import { z } from 'zod';

import { PlatformUserAccountStatusSchema } from '../domain/status-enums.js';
import { JwtClaimsSchema, RoleSchema, TenantRoleSchema } from './claims.js';
import { AuthRoutingReasonCodeEnum, AuthRoutingStatusEnum, AuthTargetAppEnum } from './service.js';

export const AuthRoutingReasonCodeSchema = z.enum(AuthRoutingReasonCodeEnum);
export const AuthTargetAppSchema = z.enum(AuthTargetAppEnum);

export const AuthRoutingSchema = z.object({
  status: z.enum(AuthRoutingStatusEnum),
  targetApp: AuthTargetAppSchema.nullable(),
  reasonCode: AuthRoutingReasonCodeSchema.nullable(),
});

export const AllowedAuthRoutingSchema = AuthRoutingSchema.superRefine((routing, ctx) => {
  if (routing.status !== AuthRoutingStatusEnum.ALLOWED) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Allowed routing must use allowed status',
    });
  }

  if (routing.targetApp === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Allowed routing requires a target app',
    });
  }

  if (routing.reasonCode !== null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Allowed routing cannot include a reason code',
    });
  }
});

export const LoginRequestSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8),
});

export const LogoutRequestSchema = z.object({}).optional();

export const CurrentUserPrincipalSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().nullable(),
  displayName: z.string(),
  role: RoleSchema,
  accountStatus: PlatformUserAccountStatusSchema,
});

export const CurrentUserTenantSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    role: TenantRoleSchema,
  })
  .nullable();

export const CurrentUserResponseSchema = z.object({
  principal: CurrentUserPrincipalSchema,
  roleContext: z.object({
    role: RoleSchema,
    tenantId: z.string().nullable(),
  }),
  tenant: CurrentUserTenantSchema,
  targetApp: AuthTargetAppSchema,
  routing: AllowedAuthRoutingSchema,
});

export const AccessTokenResponseSchema = z.object({
  accessToken: z.string(),
  claims: JwtClaimsSchema,
  currentUser: CurrentUserResponseSchema,
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type CurrentUserResponse = z.infer<typeof CurrentUserResponseSchema>;
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>;
