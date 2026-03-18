import { RoleCodeEnum } from '@crown/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const tenantMembershipFindMany = vi.fn();
const tenantMembershipCount = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    tenantMembership: {
      findMany: tenantMembershipFindMany,
      count: tenantMembershipCount,
    },
  },
}));

describe('tenant member search integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps persisted memberships into the agreed response envelope', async () => {
    tenantMembershipFindMany.mockResolvedValue([
      {
        id: 'tm-1',
        membershipStatus: 'active',
        joinedAt: new Date('2026-03-02T10:00:00.000Z'),
        user: {
          id: 'user-1',
          email: 'member@example.test',
          username: 'member1',
          displayName: 'Member One',
          accountStatus: 'active',
        },
        roleAssignments: [
          {
            id: 'ra-1',
            role: {
              roleCode: 'tenant_admin',
              displayName: 'Tenant Admin',
              authClass: 'tenant_admin',
            },
            assignmentStatus: 'active',
            isPrimary: true,
            assignedAt: new Date('2026-03-02T10:00:00.000Z'),
          },
        ],
      },
    ]);
    tenantMembershipCount.mockResolvedValue(1);

    const { getTenantMembers } = await import('../../src/tenant/member-service.js');

    const response = await getTenantMembers('tenant-1', {
      filters: {},
      page: 1,
      pageSize: 25,
    });

    expect(response.data.memberList).toHaveLength(1);
    expect(response.data.memberList[0].membershipId).toBe('tm-1');
    expect(response.data.memberList[0].email).toBe('member@example.test');
    expect(response.meta.totalRecords).toBe(1);
    expect(response.meta.filters).toEqual({
      email: null,
      username: null,
      displayName: null,
      roleCode: null,
    });
  });

  it('applies explicit user-field filters and roleCode filters', async () => {
    tenantMembershipFindMany.mockResolvedValue([]);
    tenantMembershipCount.mockResolvedValue(0);

    const { getTenantMembers } = await import('../../src/tenant/member-service.js');

    await getTenantMembers('tenant-1', {
      filters: {
        email: 'member@example.test',
        username: 'member1',
        displayName: 'Member One',
        roleCode: RoleCodeEnum.TENANT_ADMIN,
      },
      page: 1,
      pageSize: 25,
    });

    expect(tenantMembershipFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: 'tenant-1',
          membershipStatus: 'active',
          user: {
            AND: [
              { email: { contains: 'member@example.test', mode: 'insensitive' } },
              { username: { contains: 'member1', mode: 'insensitive' } },
              { displayName: { contains: 'Member One', mode: 'insensitive' } },
            ],
          },
          roleAssignments: {
            some: {
              assignmentStatus: 'active',
              role: {
                OR: [{ roleCode: 'tenant_admin' }, { authClass: 'tenant_admin' }],
              },
            },
          },
        }),
      }),
    );
  });

  it('maps admin roleCode filter to tenant_admin auth-class match for compatibility', async () => {
    tenantMembershipFindMany.mockResolvedValue([]);
    tenantMembershipCount.mockResolvedValue(0);

    const { getTenantMembers } = await import('../../src/tenant/member-service.js');

    await getTenantMembers('tenant-1', {
      filters: { roleCode: RoleCodeEnum.ADMIN },
      page: 1,
      pageSize: 25,
    });

    expect(tenantMembershipFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          roleAssignments: {
            some: {
              assignmentStatus: 'active',
              role: {
                OR: [{ roleCode: 'admin' }, { authClass: 'tenant_admin' }],
              },
            },
          },
        }),
      }),
    );
  });
});
