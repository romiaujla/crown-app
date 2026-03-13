import { z } from "zod";
import { DashboardMetricWindowEnum, DashboardMetricWindowSchema } from "@crown/types";

import { TenantStatusSchema } from "../../domain/status-enums.js";

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

export type TenantStatusCountEntry = z.infer<typeof TenantStatusCountEntrySchema>;
export type NewTenantCountMetric = z.infer<typeof NewTenantCountMetricSchema>;
export type TenantGrowthRateMetric = z.infer<typeof TenantGrowthRateMetricSchema>;
export type TenantSummaryWidget = z.infer<typeof TenantSummaryWidgetSchema>;
export type DashboardOverviewWidgets = z.infer<typeof DashboardOverviewWidgetsSchema>;
export type DashboardOverviewResponse = z.infer<typeof DashboardOverviewResponseSchema>;
export { DashboardMetricWindowEnum };
