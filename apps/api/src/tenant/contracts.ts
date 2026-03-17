import {
  DeprovisionTypeEnum,
  DeprovisionTypeSchema,
  ManagementSystemTypeCodeSchema,
} from '@crown/types';
import { z } from 'zod';

import { TenantStatusSchema } from '../domain/status-enums.js';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const TenantProvisionRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(1).max(48).regex(SLUG_REGEX, 'slug must be lowercase kebab-case'),
  managementSystemTypeCode: ManagementSystemTypeCodeSchema,
});

export const TenantProvisionResponseSchema = z.object({
  tenantId: z.string(),
  slug: z.string(),
  schemaName: z.string(),
  appliedVersions: z.array(z.string()),
  managementSystemTypeCode: ManagementSystemTypeCodeSchema,
  status: z.literal('provisioned'),
});

export const SoftDeprovisionTenantResponseSchema = z.object({
  tenantId: z.string(),
  slug: z.string(),
  schemaName: z.string(),
  previousStatus: TenantStatusSchema,
  status: z.literal('inactive'),
  operation: z.literal('soft_deprovisioned'),
});

export const HardDeprovisionTenantResponseSchema = z.object({
  tenantId: z.string(),
  slug: z.string(),
  schemaName: z.string(),
  previousStatus: TenantStatusSchema,
  status: z.literal('hard_deprovisioned'),
  operation: z.literal('hard_deprovisioned'),
});

export const DeprovisionTenantRequestSchema = z.object({
  tenantId: z.string().trim().min(1),
  deprovisionType: DeprovisionTypeSchema.default(DeprovisionTypeEnum.SOFT).optional(),
});

export type TenantProvisionRequest = z.infer<typeof TenantProvisionRequestSchema>;
export type TenantProvisionResponse = z.infer<typeof TenantProvisionResponseSchema>;
export type DeprovisionTenantRequest = z.infer<typeof DeprovisionTenantRequestSchema>;
export type SoftDeprovisionTenantResponse = z.infer<typeof SoftDeprovisionTenantResponseSchema>;
export type HardDeprovisionTenantResponse = z.infer<typeof HardDeprovisionTenantResponseSchema>;

export { SLUG_REGEX };
