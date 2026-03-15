import { DeprovisionTypeEnum, DeprovisionTypeSchema, TENANT_SLUG_PATTERN, TenantSlugSchema } from "@crown/types";
import { z } from "zod";

import { TenantStatusSchema } from "../domain/status-enums.js";

const SLUG_REGEX = new RegExp(TENANT_SLUG_PATTERN);

export const TenantProvisionRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: TenantSlugSchema
});

export const TenantProvisionResponseSchema = z.object({
  tenant_id: z.string(),
  slug: z.string(),
  schema_name: z.string(),
  applied_versions: z.array(z.string()),
  status: z.literal("provisioned")
});

export const SoftDeprovisionTenantResponseSchema = z.object({
  tenant_id: z.string(),
  slug: z.string(),
  schema_name: z.string(),
  previous_status: TenantStatusSchema,
  status: z.literal("inactive"),
  operation: z.literal("soft_deprovisioned")
});

export const HardDeprovisionTenantResponseSchema = z.object({
  tenant_id: z.string(),
  slug: z.string(),
  schema_name: z.string(),
  previous_status: TenantStatusSchema,
  status: z.literal("hard_deprovisioned"),
  operation: z.literal("hard_deprovisioned")
});

export const DeprovisionTenantRequestSchema = z.object({
  tenant_id: z.string().trim().min(1),
  deprovisionType: DeprovisionTypeSchema.default(DeprovisionTypeEnum.SOFT).optional()
});

export type TenantProvisionRequest = z.infer<typeof TenantProvisionRequestSchema>;
export type TenantProvisionResponse = z.infer<typeof TenantProvisionResponseSchema>;
export type DeprovisionTenantRequest = z.infer<typeof DeprovisionTenantRequestSchema>;
export type SoftDeprovisionTenantResponse = z.infer<typeof SoftDeprovisionTenantResponseSchema>;
export type HardDeprovisionTenantResponse = z.infer<typeof HardDeprovisionTenantResponseSchema>;

export { SLUG_REGEX };
