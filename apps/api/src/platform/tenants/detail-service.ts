import {
  PlatformTenantDetailResponseSchema,
  type PlatformTenantDetailResponse,
} from '@crown/types';
import type { PrismaClient } from '../../generated/prisma/client.js';

import { prisma } from '../../db/prisma.js';

export const getPlatformTenantDetail = async (
  slug: string,
  db: Pick<PrismaClient, 'tenant'> = prisma,
): Promise<PlatformTenantDetailResponse | null> => {
  const tenant = await db.tenant.findUnique({
    where: { slug },
  });

  if (!tenant) {
    return null;
  }

  return PlatformTenantDetailResponseSchema.parse({
    data: {
      tenantId: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      schemaName: tenant.schemaName,
      status: tenant.status,
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    },
  });
};
