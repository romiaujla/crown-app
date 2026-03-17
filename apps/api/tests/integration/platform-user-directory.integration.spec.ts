import { PlatformUserAccountStatusEnum } from '@crown/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const userFindMany = vi.fn();
const userCount = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    user: {
      findMany: userFindMany,
      count: userCount,
    },
  },
}));

describe('platform user directory integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps persisted users into the agreed response envelope', async () => {
    userFindMany.mockResolvedValue([
      {
        id: 'user-1',
        email: 'admin@example.test',
        username: 'admin',
        displayName: 'Admin User',
        accountStatus: 'active',
        createdAt: new Date('2026-03-01T12:00:00.000Z'),
        platformRoleAssignments: [{ role: { roleCode: 'super_admin', authClass: 'super_admin' } }],
        _count: { tenantMemberships: 2 },
      },
    ]);
    userCount.mockResolvedValue(1);

    const { getPlatformUserDirectory } =
      await import('../../src/platform/users/directory-service.js');

    const response = await getPlatformUserDirectory({
      filters: {},
      page: 1,
      pageSize: 25,
    });

    expect(response).toEqual({
      data: {
        userList: [
          {
            userId: 'user-1',
            email: 'admin@example.test',
            username: 'admin',
            displayName: 'Admin User',
            accountStatus: 'active',
            platformRoles: ['super_admin'],
            tenantMembershipCount: 2,
            createdAt: '2026-03-01T12:00:00.000Z',
          },
        ],
      },
      meta: {
        totalRecords: 1,
        page: 1,
        pageSize: 25,
        filters: { search: null, accountStatus: null },
      },
    });
  });

  it('applies search and accountStatus filters to the persistence query', async () => {
    userFindMany.mockResolvedValue([]);
    userCount.mockResolvedValue(0);

    const { getPlatformUserDirectory } =
      await import('../../src/platform/users/directory-service.js');

    await getPlatformUserDirectory({
      filters: { search: 'admin', accountStatus: PlatformUserAccountStatusEnum.ACTIVE },
      page: 2,
      pageSize: 10,
    });

    expect(userFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { email: { contains: 'admin', mode: 'insensitive' } },
            { username: { contains: 'admin', mode: 'insensitive' } },
            { displayName: { contains: 'admin', mode: 'insensitive' } },
          ],
          accountStatus: 'active',
        },
        skip: 10,
        take: 10,
      }),
    );
  });

  it('returns empty userList when no users match', async () => {
    userFindMany.mockResolvedValue([]);
    userCount.mockResolvedValue(0);

    const { getPlatformUserDirectory } =
      await import('../../src/platform/users/directory-service.js');

    const response = await getPlatformUserDirectory({
      filters: { search: 'nonexistent' },
      page: 1,
      pageSize: 25,
    });

    expect(response.data.userList).toEqual([]);
    expect(response.meta.totalRecords).toBe(0);
  });
});
