import { z } from "zod";
import { DashboardMetricWindowEnum, DashboardMetricWindowSchema } from "@crown/types";

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

export const AccessTokenClaimsSchema = z.object({
  sub: z.string(),
  role: RoleSchema,
  tenant_id: z.string().nullable(),
  exp: z.number().int().positive()
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
  claims: AccessTokenClaimsSchema,
  current_user: CurrentUserResponseSchema
});

export const AuthErrorResponseSchema = z.object({
  error_code: z.string(),
  message: z.string(),
  routing: AuthRoutingSchema.optional()
});

export const TenantStatusSchema = z.enum(["active", "inactive", "provisioning", "provisioning_failed"]);

export const TenantStatusCountEntrySchema = z.object({
  status: TenantStatusSchema,
  count: z.number().int().nonnegative()
});

export const NewTenantCountMetricSchema = z.object({
  window: DashboardMetricWindowSchema,
  count: z.number().int().nonnegative()
});

export const TenantGrowthRateMetricSchema = z.object({
  window: DashboardMetricWindowSchema,
  growth_rate_percentage: z.number()
});

export const TenantSummaryWidgetSchema = z.object({
  total_tenant_count: z.number().int().nonnegative(),
  tenant_user_count: z.number().int().nonnegative(),
  tenant_status_counts: z.array(TenantStatusCountEntrySchema),
  new_tenant_counts: z.array(NewTenantCountMetricSchema),
  tenant_growth_rates: z.array(TenantGrowthRateMetricSchema)
});

export const DashboardOverviewWidgetsSchema = z.object({
  tenant_summary: TenantSummaryWidgetSchema
});

export const DashboardOverviewResponseSchema = z.object({
  widgets: DashboardOverviewWidgetsSchema
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
export type TenantStatus = z.infer<typeof TenantStatusSchema>;
export type TenantStatusCountEntry = z.infer<typeof TenantStatusCountEntrySchema>;
export type NewTenantCountMetric = z.infer<typeof NewTenantCountMetricSchema>;
export type TenantGrowthRateMetric = z.infer<typeof TenantGrowthRateMetricSchema>;
export type TenantSummaryWidget = z.infer<typeof TenantSummaryWidgetSchema>;
export type DashboardOverviewWidgets = z.infer<typeof DashboardOverviewWidgetsSchema>;
export type DashboardOverviewResponse = z.infer<typeof DashboardOverviewResponseSchema>;
export { DashboardMetricWindowEnum };
