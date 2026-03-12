import { z } from "zod";

export enum RoleEnum {
  SUPER_ADMIN = "super_admin",
  TENANT_ADMIN = "tenant_admin",
  TENANT_USER = "tenant_user"
}

export enum TenantRoleEnum {
  TENANT_ADMIN = "tenant_admin",
  TENANT_USER = "tenant_user"
}

export const RoleSchema = z.enum(RoleEnum);

export const TenantRoleSchema = z.enum(TenantRoleEnum);

export enum AuthErrorCodeEnum {
  VALIDATION_ERROR = "validation_error",
  UNAUTHENTICATED = "unauthenticated",
  INVALID_CREDENTIALS = "invalid_credentials",
  DISABLED_ACCOUNT = "disabled_account",
  INVALID_CLAIMS = "invalid_claims",
  TENANT_MEMBERSHIP_REQUIRED = "tenant_membership_required",
  TENANT_SELECTION_REQUIRED = "tenant_selection_required",
  FORBIDDEN_ROLE = "forbidden_role",
  FORBIDDEN_TENANT = "forbidden_tenant",
  CONFLICT = "conflict",
  MIGRATION_FAILED = "migration_failed"
}

export const JwtClaimsSchema = z.object({
  sub: z.string(),
  role: RoleSchema,
  tenant_id: z.string().nullable(),
  exp: z.number().int().positive()
}).superRefine((claims, ctx) => {
  if ((claims.role === RoleEnum.TENANT_ADMIN || claims.role === RoleEnum.TENANT_USER) && !claims.tenant_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "tenant_id is required for tenant roles"
    });
  }
});

export type JwtClaims = {
  sub: string;
  role: RoleEnum;
  tenant_id: string | null;
  exp: number;
};

export const AuthErrorCodeSchema = z.enum(AuthErrorCodeEnum);
