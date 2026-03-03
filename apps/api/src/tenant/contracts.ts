import { z } from "zod";

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

export type TenantProvisionRequest = z.infer<typeof TenantProvisionRequestSchema>;
export type TenantProvisionResponse = z.infer<typeof TenantProvisionResponseSchema>;

export { SLUG_REGEX };
