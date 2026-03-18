import {
  TenantCreateOnboardingSubmissionRequestSchema,
  TenantCreateOnboardingSubmissionResponseSchema,
  DeprovisionTypeEnum,
  DeprovisionTypeSchema,
  TENANT_SLUG_PATTERN,
} from '@crown/types';
import { z } from 'zod';

import { TenantStatusSchema } from '../domain/status-enums.js';

const SLUG_REGEX = new RegExp(TENANT_SLUG_PATTERN);

export const TenantProvisionRequestSchema = TenantCreateOnboardingSubmissionRequestSchema;

export const TenantProvisionResponseSchema = TenantCreateOnboardingSubmissionResponseSchema;

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
