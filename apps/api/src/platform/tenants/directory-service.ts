import {
  TenantDirectoryListResponseSchema,
  type TenantDirectoryListFilter,
  type TenantDirectoryListResponse,
  type TenantStatus
} from "@crown/types";

import { prisma } from "../../db/prisma.js";

type TenantDirectoryWhere = {
  name?: {
    contains: string;
    mode: "insensitive";
  };
  status?: TenantStatus;
};

type TenantDirectoryPrismaClient = {
  tenant: {
    findMany(args: {
      where?: TenantDirectoryWhere;
      orderBy: {
        createdAt: "desc";
      };
    }): Promise<
      Array<{
        id: string;
        name: string;
        slug: string;
        schemaName: string;
        status: TenantStatus;
        createdAt: Date;
        updatedAt: Date;
      }>
    >;
    count(args?: {
      where?: TenantDirectoryWhere;
    }): Promise<number>;
  };
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
  ...(status ? { status } : {})
});

export const getPlatformTenantDirectory = async (
  filters: TenantDirectoryListFilter,
  db: TenantDirectoryPrismaClient = prisma
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
        status: tenant.status,
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
