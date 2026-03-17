import {
  CreateTenantMembershipResponseSchema,
  type CreateTenantMembershipResponse,
} from '@crown/types';
import type { PrismaClient } from '../../generated/prisma/client.js';

import { prisma } from '../../db/prisma.js';

type CreateTenantMembershipInput = {
  userId: string;
  tenantId: string;
  roleCode: string;
};

type CreateTenantMembershipResult =
  | { ok: true; data: CreateTenantMembershipResponse }
  | { ok: false; status: number; errorCode: string; message: string };

export const createTenantMembership = async (
  input: CreateTenantMembershipInput,
  db: PrismaClient = prisma,
): Promise<CreateTenantMembershipResult> => {
  const [user, tenant, role] = await Promise.all([
    db.user.findUnique({ where: { id: input.userId } }),
    db.tenant.findUnique({ where: { id: input.tenantId } }),
    db.role.findFirst({ where: { roleCode: input.roleCode, scope: 'tenant' } }),
  ]);

  if (!user) {
    return { ok: false, status: 404, errorCode: 'not_found', message: 'User not found' };
  }

  if (!tenant) {
    return { ok: false, status: 404, errorCode: 'not_found', message: 'Tenant not found' };
  }

  if (!role) {
    return {
      ok: false,
      status: 400,
      errorCode: 'validation_error',
      message: 'Role code is not a valid tenant-scoped role',
    };
  }

  const existingMembership = await db.tenantMembership.findUnique({
    where: { userId_tenantId: { userId: input.userId, tenantId: input.tenantId } },
  });

  if (existingMembership) {
    return {
      ok: false,
      status: 409,
      errorCode: 'conflict',
      message: 'User already has a membership in this tenant',
    };
  }

  const membership = await db.tenantMembership.create({
    data: {
      userId: input.userId,
      tenantId: input.tenantId,
      membershipStatus: 'active',
    },
  });

  const assignment = await db.tenantMembershipRoleAssignment.create({
    data: {
      tenantMembershipId: membership.id,
      roleId: role.id,
      assignmentStatus: 'active',
      isPrimary: true,
    },
  });

  return {
    ok: true,
    data: CreateTenantMembershipResponseSchema.parse({
      data: {
        membershipId: membership.id,
        userId: input.userId,
        tenantId: input.tenantId,
        roleCode: input.roleCode,
        membershipStatus: membership.membershipStatus,
        assignmentStatus: assignment.assignmentStatus,
        isPrimary: assignment.isPrimary,
      },
    }),
  };
};
