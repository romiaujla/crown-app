import { z } from "zod";

export const RoleSchema = z.enum(["super_admin", "tenant_admin", "tenant_user"]);
export type Role = z.infer<typeof RoleSchema>;

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
  tenant_id: z.string().nullable()
}).superRefine((claims, ctx) => {
  if ((claims.role === "tenant_admin" || claims.role === "tenant_user") && !claims.tenant_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "tenant_id is required for tenant roles"
    });
  }
});

export type JwtClaims = z.infer<typeof JwtClaimsSchema>;

export const AuthErrorCodeSchema = z.nativeEnum(AuthErrorCodeEnum);
