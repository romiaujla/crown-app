import { z } from "zod";

import { TenantStatusSchema } from "../domain/status-enums.js";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const TenantProvisionRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(48)
    .regex(SLUG_REGEX, "slug must be lowercase kebab-case")
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

export const SoftDeprovisionTenantRequestSchema = z.object({
  tenant_id: z.string().trim().min(1)
});

export type TenantProvisionRequest = z.infer<typeof TenantProvisionRequestSchema>;
export type TenantProvisionResponse = z.infer<typeof TenantProvisionResponseSchema>;
export type SoftDeprovisionTenantRequest = z.infer<typeof SoftDeprovisionTenantRequestSchema>;
export type SoftDeprovisionTenantResponse = z.infer<typeof SoftDeprovisionTenantResponseSchema>;

export { SLUG_REGEX };
