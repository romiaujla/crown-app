import { z } from "zod";

import { TenantStatusSchema } from "../../domain/status-enums.js";

export const TenantStatusCountEntrySchema = z.object({
  status: TenantStatusSchema,
  count: z.number().int().nonnegative()
});

export const TenantSummaryWidgetSchema = z.object({
  total_tenant_count: z.number().int().nonnegative(),
  tenant_user_count: z.number().int().nonnegative(),
  tenant_status_counts: z.array(TenantStatusCountEntrySchema)
});

export const DashboardOverviewWidgetsSchema = z.object({
  tenant_summary: TenantSummaryWidgetSchema
});

export const DashboardOverviewResponseSchema = z.object({
  widgets: DashboardOverviewWidgetsSchema
});

export type TenantStatusCountEntry = z.infer<typeof TenantStatusCountEntrySchema>;
export type TenantSummaryWidget = z.infer<typeof TenantSummaryWidgetSchema>;
export type DashboardOverviewWidgets = z.infer<typeof DashboardOverviewWidgetsSchema>;
export type DashboardOverviewResponse = z.infer<typeof DashboardOverviewResponseSchema>;
