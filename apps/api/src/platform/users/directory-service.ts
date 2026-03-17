import {
  PlatformUserSearchResponseSchema,
  type PlatformUserSearchFilter,
  type PlatformUserSearchResponse,
} from '@crown/types';
import type { PrismaClient } from '../../generated/prisma/client.js';
import type { PlatformUserAccountStatus } from '../../generated/prisma/enums.js';

import { prisma } from '../../db/prisma.js';

type UserDirectoryWhere = {
  OR?: Array<{
    email?: { contains: string; mode: 'insensitive' };
    username?: { contains: string; mode: 'insensitive' };
    displayName?: { contains: string; mode: 'insensitive' };
  }>;
  accountStatus?: PlatformUserAccountStatus;
};

const buildUserDirectoryWhere = (filters: PlatformUserSearchFilter): UserDirectoryWhere => {
  const where: UserDirectoryWhere = {};

  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search, mode: 'insensitive' } },
      { username: { contains: filters.search, mode: 'insensitive' } },
      { displayName: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.accountStatus) {
    where.accountStatus = filters.accountStatus as PlatformUserAccountStatus;
  }

  return where;
};

export const getPlatformUserDirectory = async (
  input: { filters: PlatformUserSearchFilter; page: number; pageSize: number },
  db: Pick<PrismaClient, 'user'> = prisma,
): Promise<PlatformUserSearchResponse> => {
  const where = buildUserDirectoryWhere(input.filters);
  const skip = (input.page - 1) * input.pageSize;

  const [users, totalRecords] = await Promise.all([
    db.user.findMany({
      where,
      include: {
        platformRoleAssignments: {
          where: { assignmentStatus: 'active' },
          include: { role: { select: { roleCode: true, authClass: true } } },
        },
        _count: {
          select: {
            tenantMemberships: { where: { membershipStatus: 'active' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: input.pageSize,
    }),
    db.user.count({ where }),
  ]);

  return PlatformUserSearchResponseSchema.parse({
    data: {
      userList: users.map((user) => ({
        userId: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        accountStatus: user.accountStatus,
        platformRoles: user.platformRoleAssignments.map((a) => a.role.authClass),
        tenantMembershipCount: user._count.tenantMemberships,
        createdAt: user.createdAt.toISOString(),
      })),
    },
    meta: {
      totalRecords,
      page: input.page,
      pageSize: input.pageSize,
      filters: {
        search: input.filters.search ?? null,
        accountStatus: input.filters.accountStatus ?? null,
      },
    },
  });
};
