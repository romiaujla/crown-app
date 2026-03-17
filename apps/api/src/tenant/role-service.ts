import { TenantRoleListResponseSchema, type TenantRoleListResponse } from '@crown/types';
import type { PrismaClient } from '../generated/prisma/client.js';

import { prisma } from '../db/prisma.js';

export const getTenantRoles = async (
  db: Pick<PrismaClient, 'role'> = prisma,
): Promise<TenantRoleListResponse> => {
  const roles = await db.role.findMany({
    where: { scope: 'tenant' },
    orderBy: { displayName: 'asc' },
    select: {
      roleCode: true,
      displayName: true,
      description: true,
      authClass: true,
      scope: true,
    },
  });

  return TenantRoleListResponseSchema.parse({
    data: {
      roles: roles.map((r) => ({
        roleCode: r.roleCode,
        displayName: r.displayName,
        description: r.description,
        authClass: r.authClass,
        scope: r.scope,
      })),
    },
  });
};
