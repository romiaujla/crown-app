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

export enum TenantStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PROVISIONING = "provisioning",
  PROVISIONING_FAILED = "provisioning_failed"
}

export const TenantStatusSchema = z.enum(TenantStatusEnum);
export type TenantStatus = z.infer<typeof TenantStatusSchema>;

export const TenantStatusCountEntrySchema = z.object({
  status: TenantStatusSchema,
  count: z.number().int().nonnegative()
});
export type TenantStatusCountEntry = z.infer<typeof TenantStatusCountEntrySchema>;

export const NewTenantCountMetricSchema = z.object({
  window: DashboardMetricWindowSchema,
  count: z.number().int().nonnegative()
});
export type NewTenantCountMetric = z.infer<typeof NewTenantCountMetricSchema>;

export const TenantGrowthRateMetricSchema = z.object({
  window: DashboardMetricWindowSchema,
  growth_rate_percentage: z.number()
});
export type TenantGrowthRateMetric = z.infer<typeof TenantGrowthRateMetricSchema>;

export const TenantSummaryWidgetSchema = z.object({
  total_tenant_count: z.number().int().nonnegative(),
  tenant_user_count: z.number().int().nonnegative(),
  tenant_status_counts: z.array(TenantStatusCountEntrySchema),
  new_tenant_counts: z.array(NewTenantCountMetricSchema),
  tenant_growth_rates: z.array(TenantGrowthRateMetricSchema)
});
export type TenantSummaryWidget = z.infer<typeof TenantSummaryWidgetSchema>;

export const DashboardOverviewWidgetsSchema = z.object({
  tenant_summary: TenantSummaryWidgetSchema
});
export type DashboardOverviewWidgets = z.infer<typeof DashboardOverviewWidgetsSchema>;

export const DashboardOverviewResponseSchema = z.object({
  widgets: DashboardOverviewWidgetsSchema
});
export type DashboardOverviewResponse = z.infer<typeof DashboardOverviewResponseSchema>;

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
