import { z } from "zod";

export const RoleSchema = z.enum(["super_admin", "tenant_admin", "tenant_user"]);
export type Role = z.infer<typeof RoleSchema>;

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

export const AuthErrorCodeSchema = z.enum([
  "validation_error",
  "unauthenticated",
  "invalid_credentials",
  "disabled_account",
  "invalid_claims",
  "forbidden_role",
  "forbidden_tenant",
  "conflict",
  "migration_failed"
]);
export type AuthErrorCode = z.infer<typeof AuthErrorCodeSchema>;
