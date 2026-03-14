import {
  TenantDirectoryListResponseSchema,
  TenantStatusSchema,
  type TenantDirectoryListFilter,
  type TenantDirectoryListResponse
} from "@crown/types";
import type { PrismaClient } from "../../generated/prisma/client.js";
import type { TenantStatus as PrismaTenantStatus } from "../../generated/prisma/enums.js";

import { prisma } from "../../db/prisma.js";

type TenantDirectoryWhere = {
  name?: {
    contains: string;
    mode: "insensitive";
  };
  status?: PrismaTenantStatus;
};

const buildTenantDirectoryWhere = ({ name, status }: TenantDirectoryListFilter): TenantDirectoryWhere => ({
  ...(name
    ? {
      name: {
        contains: name,
        mode: "insensitive" as const
      }
    }
    : {}),
  ...(status ? { status: status as PrismaTenantStatus } : {})
});

export const getPlatformTenantDirectory = async (
  filters: TenantDirectoryListFilter,
  db: Pick<PrismaClient, "tenant"> = prisma
): Promise<TenantDirectoryListResponse> => {
  const where = buildTenantDirectoryWhere(filters);
  const [tenants, totalRecords] = await Promise.all([
    db.tenant.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      }
    }),
    db.tenant.count({ where })
  ]);

  return TenantDirectoryListResponseSchema.parse({
    data: {
      tenantList: tenants.map((tenant) => ({
        tenantId: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        schemaName: tenant.schemaName,
        status: TenantStatusSchema.parse(tenant.status),
        createdAt: tenant.createdAt.toISOString(),
        updatedAt: tenant.updatedAt.toISOString()
      }))
    },
    meta: {
      totalRecords,
      filters: {
        name: filters.name ?? null,
        status: filters.status ?? null
      }
    }
  });
};
