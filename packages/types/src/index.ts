import { z } from "zod";

export const RoleSchema = z.enum(["super_admin", "tenant_admin", "tenant_user"]);
export type Role = z.infer<typeof RoleSchema>;

export enum DashboardMetricWindowEnum {
  WEEK = "week",
  MONTH = "month",
  YEAR = "year"
}

export const DashboardMetricWindowSchema = z.enum(DashboardMetricWindowEnum);
export type DashboardMetricWindow = z.infer<typeof DashboardMetricWindowSchema>;

export const JwtClaimsSchema = z.object({
  sub: z.string(),
  role: RoleSchema,
  tenant_id: z.string().nullable(),
  exp: z.number().int().positive()
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
  "unauthenticated",
  "invalid_claims",
  "forbidden_role",
  "forbidden_tenant"
]);
export type AuthErrorCode = z.infer<typeof AuthErrorCodeSchema>;
