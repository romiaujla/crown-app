import { PlatformUserDetailResponseSchema, type PlatformUserDetailResponse } from '@crown/types';
import type { PrismaClient } from '../../generated/prisma/client.js';

import { prisma } from '../../db/prisma.js';

export const getPlatformUserDetail = async (
  userId: string,
  db: Pick<PrismaClient, 'user'> = prisma,
): Promise<PlatformUserDetailResponse | null> => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      platformRoleAssignments: {
        include: {
          role: {
            select: {
              roleCode: true,
              displayName: true,
              authClass: true,
              scope: true,
            },
          },
        },
      },
      tenantMemberships: {
        include: {
          tenant: {
            select: { id: true, name: true, slug: true },
          },
          roleAssignments: {
            include: {
              role: {
                select: {
                  roleCode: true,
                  displayName: true,
                  authClass: true,
                  scope: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  return PlatformUserDetailResponseSchema.parse({
    data: {
      userId: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      platformRoleAssignments: user.platformRoleAssignments.map((a) => ({
        assignmentId: a.id,
        roleCode: a.role.roleCode,
        displayName: a.role.displayName,
        authClass: a.role.authClass,
        assignmentStatus: a.assignmentStatus,
        assignedAt: a.assignedAt.toISOString(),
      })),
      tenantMemberships: user.tenantMemberships.map((m) => ({
        membershipId: m.id,
        tenantId: m.tenant.id,
        tenantName: m.tenant.name,
        tenantSlug: m.tenant.slug,
        membershipStatus: m.membershipStatus,
        joinedAt: m.joinedAt.toISOString(),
        roleAssignments: m.roleAssignments.map((ra) => ({
          assignmentId: ra.id,
          roleCode: ra.role.roleCode,
          displayName: ra.role.displayName,
          authClass: ra.role.authClass,
          assignmentStatus: ra.assignmentStatus,
          isPrimary: ra.isPrimary,
          assignedAt: ra.assignedAt.toISOString(),
        })),
      })),
    },
  });
};
