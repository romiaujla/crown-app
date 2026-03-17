import {
  AssignTenantMemberRoleResponseSchema,
  RevokeTenantMemberRoleResponseSchema,
  TenantMemberSearchResponseSchema,
  type AssignTenantMemberRoleResponse,
  type RevokeTenantMemberRoleResponse,
  type TenantMemberSearchFilter,
  type TenantMemberSearchResponse,
} from '@crown/types';
import type { PrismaClient } from '../generated/prisma/client.js';

import { prisma } from '../db/prisma.js';

// ── Tenant Member Search ─────────────────────────────────────────────────────

type TenantMembershipWhere = {
  tenantId: string;
  membershipStatus: 'active';
  user?: {
    OR: Array<{
      email?: { contains: string; mode: 'insensitive' };
      username?: { contains: string; mode: 'insensitive' };
      displayName?: { contains: string; mode: 'insensitive' };
    }>;
  };
  roleAssignments?: {
    some: {
      assignmentStatus: 'active';
      role: { roleCode: string };
    };
  };
};

const buildTenantMemberWhere = (
  tenantId: string,
  filters: TenantMemberSearchFilter,
): TenantMembershipWhere => {
  const where: TenantMembershipWhere = {
    tenantId,
    membershipStatus: 'active',
  };

  if (filters.search) {
    where.user = {
      OR: [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { username: { contains: filters.search, mode: 'insensitive' } },
        { displayName: { contains: filters.search, mode: 'insensitive' } },
      ],
    };
  }

  if (filters.roleCode) {
    where.roleAssignments = {
      some: {
        assignmentStatus: 'active',
        role: { roleCode: filters.roleCode },
      },
    };
  }

  return where;
};

export const getTenantMembers = async (
  tenantId: string,
  input: { filters: TenantMemberSearchFilter; page: number; pageSize: number },
  db: Pick<PrismaClient, 'tenantMembership'> = prisma,
): Promise<TenantMemberSearchResponse> => {
  const where = buildTenantMemberWhere(tenantId, input.filters);
  const skip = (input.page - 1) * input.pageSize;

  const [memberships, totalRecords] = await Promise.all([
    db.tenantMembership.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            accountStatus: true,
          },
        },
        roleAssignments: {
          where: { assignmentStatus: 'active' },
          include: {
            role: {
              select: {
                roleCode: true,
                displayName: true,
                authClass: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
      skip,
      take: input.pageSize,
    }),
    db.tenantMembership.count({ where }),
  ]);

  return TenantMemberSearchResponseSchema.parse({
    data: {
      memberList: memberships.map((m) => ({
        membershipId: m.id,
        userId: m.user.id,
        email: m.user.email,
        username: m.user.username,
        displayName: m.user.displayName,
        accountStatus: m.user.accountStatus,
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
    meta: {
      totalRecords,
      page: input.page,
      pageSize: input.pageSize,
      filters: {
        search: input.filters.search ?? null,
        roleCode: input.filters.roleCode ?? null,
      },
    },
  });
};

// ── Assign Role ──────────────────────────────────────────────────────────────

type RoleAssignResult =
  | { ok: true; data: AssignTenantMemberRoleResponse }
  | { ok: false; status: number; errorCode: string; message: string };

export const assignTenantMemberRole = async (
  tenantId: string,
  membershipId: string,
  roleCode: string,
  db: PrismaClient = prisma,
): Promise<RoleAssignResult> => {
  const membership = await db.tenantMembership.findUnique({
    where: { id: membershipId },
  });

  if (!membership || membership.tenantId !== tenantId) {
    return {
      ok: false,
      status: 403,
      errorCode: 'forbidden_tenant',
      message: 'Membership does not belong to this tenant',
    };
  }

  const role = await db.role.findFirst({
    where: { roleCode, scope: 'tenant' },
  });

  if (!role) {
    return {
      ok: false,
      status: 400,
      errorCode: 'validation_error',
      message: 'Role code is not a valid tenant-scoped role',
    };
  }

  const existingAssignment = await db.tenantMembershipRoleAssignment.findUnique({
    where: {
      tenantMembershipId_roleId: {
        tenantMembershipId: membershipId,
        roleId: role.id,
      },
    },
  });

  if (existingAssignment && existingAssignment.assignmentStatus === 'active') {
    return {
      ok: false,
      status: 409,
      errorCode: 'conflict',
      message: 'Member already has an active assignment for this role',
    };
  }

  const assignment = existingAssignment
    ? await db.tenantMembershipRoleAssignment.update({
        where: { id: existingAssignment.id },
        data: { assignmentStatus: 'active', endedAt: null },
        include: { role: { select: { roleCode: true, displayName: true } } },
      })
    : await db.tenantMembershipRoleAssignment.create({
        data: {
          tenantMembershipId: membershipId,
          roleId: role.id,
          assignmentStatus: 'active',
          isPrimary: false,
        },
        include: { role: { select: { roleCode: true, displayName: true } } },
      });

  return {
    ok: true,
    data: AssignTenantMemberRoleResponseSchema.parse({
      data: {
        assignmentId: assignment.id,
        membershipId,
        roleCode: assignment.role.roleCode,
        displayName: assignment.role.displayName,
        assignmentStatus: assignment.assignmentStatus,
        isPrimary: assignment.isPrimary,
        assignedAt: assignment.assignedAt.toISOString(),
      },
    }),
  };
};

// ── Revoke Role ──────────────────────────────────────────────────────────────

type RoleRevokeResult =
  | { ok: true; data: RevokeTenantMemberRoleResponse }
  | { ok: false; status: number; errorCode: string; message: string };

export const revokeTenantMemberRole = async (
  tenantId: string,
  membershipId: string,
  roleCode: string,
  db: PrismaClient = prisma,
): Promise<RoleRevokeResult> => {
  const membership = await db.tenantMembership.findUnique({
    where: { id: membershipId },
  });

  if (!membership || membership.tenantId !== tenantId) {
    return {
      ok: false,
      status: 403,
      errorCode: 'forbidden_tenant',
      message: 'Membership does not belong to this tenant',
    };
  }

  const role = await db.role.findFirst({
    where: { roleCode, scope: 'tenant' },
  });

  if (!role) {
    return {
      ok: false,
      status: 400,
      errorCode: 'validation_error',
      message: 'Role code is not a valid tenant-scoped role',
    };
  }

  const assignment = await db.tenantMembershipRoleAssignment.findFirst({
    where: {
      tenantMembershipId: membershipId,
      roleId: role.id,
      assignmentStatus: 'active',
    },
  });

  if (!assignment) {
    return {
      ok: false,
      status: 404,
      errorCode: 'not_found',
      message: 'No active assignment found for this role',
    };
  }

  const activeAssignmentCount = await db.tenantMembershipRoleAssignment.count({
    where: {
      tenantMembershipId: membershipId,
      assignmentStatus: 'active',
    },
  });

  if (activeAssignmentCount <= 1) {
    return {
      ok: false,
      status: 400,
      errorCode: 'validation_error',
      message: 'Cannot revoke the last active role on this membership',
    };
  }

  const now = new Date();
  const updated = await db.tenantMembershipRoleAssignment.update({
    where: { id: assignment.id },
    data: { assignmentStatus: 'inactive', endedAt: now },
  });

  return {
    ok: true,
    data: RevokeTenantMemberRoleResponseSchema.parse({
      data: {
        assignmentId: updated.id,
        membershipId,
        roleCode,
        assignmentStatus: updated.assignmentStatus,
        endedAt: updated.endedAt!.toISOString(),
      },
    }),
  };
};
