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
    expect(response.meta.filters).toEqual({ search: null, roleCode: null });
  });

  it('applies search and roleCode filters', async () => {
    tenantMembershipFindMany.mockResolvedValue([]);
    tenantMembershipCount.mockResolvedValue(0);

    const { getTenantMembers } = await import('../../src/tenant/member-service.js');

    await getTenantMembers('tenant-1', {
      filters: { search: 'member', roleCode: RoleCodeEnum.TENANT_ADMIN },
      page: 1,
      pageSize: 25,
    });

    expect(tenantMembershipFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: 'tenant-1',
          membershipStatus: 'active',
          user: {
            OR: [
              { email: { contains: 'member', mode: 'insensitive' } },
              { username: { contains: 'member', mode: 'insensitive' } },
              { displayName: { contains: 'member', mode: 'insensitive' } },
            ],
          },
          roleAssignments: {
            some: {
              assignmentStatus: 'active',
              role: { roleCode: 'tenant_admin' },
            },
          },
        }),
      }),
    );
  });
});
