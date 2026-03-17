import { env } from '../config/env.js';

export const DEFAULT_SEEDED_PASSWORD = env.SEED_DEFAULT_PASSWORD;

export const SEEDED_AUTH_PASSWORDS = {
  superAdmin: env.SEED_SUPER_ADMIN_PASSWORD,
  tenantAdmin: env.SEED_TENANT_ADMIN_PASSWORD,
  tenantUser: env.SEED_TENANT_USER_PASSWORD,
  disabledUser: DEFAULT_SEEDED_PASSWORD,
  tenantUserWithoutMembership: DEFAULT_SEEDED_PASSWORD,
  tenantAdminMultiTenant: DEFAULT_SEEDED_PASSWORD,
} as const;
