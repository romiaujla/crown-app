import { beforeEach, describe, expect, it, vi } from 'vitest';

const userFindUnique = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: userFindUnique,
    },
  },
}));

describe('platform user detail integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps a persisted user into the agreed detail response', async () => {
    userFindUnique.mockResolvedValue({
      id: 'user-1',
      email: 'admin@example.test',
      username: 'admin',
      displayName: 'Admin User',
      accountStatus: 'active',
      createdAt: new Date('2026-03-01T12:00:00.000Z'),
      updatedAt: new Date('2026-03-10T09:30:00.000Z'),
      platformRoleAssignments: [
        {
          id: 'pra-1',
          role: {
            roleCode: 'super_admin',
            displayName: 'Super Admin',
            authClass: 'super_admin',
            scope: 'platform',
          },
          assignmentStatus: 'active',
          assignedAt: new Date('2026-03-01T12:00:00.000Z'),
        },
      ],
      tenantMemberships: [
        {
          id: 'tm-1',
          tenant: { id: 'tenant-1', name: 'Acme Logistics', slug: 'acme-logistics' },
          membershipStatus: 'active',
          joinedAt: new Date('2026-03-02T10:00:00.000Z'),
          roleAssignments: [
            {
              id: 'tmra-1',
              role: {
                roleCode: 'tenant_admin',
                displayName: 'Tenant Admin',
                authClass: 'tenant_admin',
                scope: 'tenant',
              },
              assignmentStatus: 'active',
              isPrimary: true,
              assignedAt: new Date('2026-03-02T10:00:00.000Z'),
            },
          ],
        },
      ],
    });

    const { getPlatformUserDetail } = await import('../../src/platform/users/detail-service.js');

    const response = await getPlatformUserDetail('user-1');

    expect(response).toEqual({
      data: {
        userId: 'user-1',
        email: 'admin@example.test',
        username: 'admin',
        displayName: 'Admin User',
        accountStatus: 'active',
        createdAt: '2026-03-01T12:00:00.000Z',
        updatedAt: '2026-03-10T09:30:00.000Z',
        platformRoleAssignments: [
          {
            assignmentId: 'pra-1',
            roleCode: 'super_admin',
            displayName: 'Super Admin',
            authClass: 'super_admin',
            assignmentStatus: 'active',
            assignedAt: '2026-03-01T12:00:00.000Z',
          },
        ],
        tenantMemberships: [
          {
            membershipId: 'tm-1',
            tenantId: 'tenant-1',
            tenantName: 'Acme Logistics',
            tenantSlug: 'acme-logistics',
            membershipStatus: 'active',
            joinedAt: '2026-03-02T10:00:00.000Z',
            roleAssignments: [
              {
                assignmentId: 'tmra-1',
                roleCode: 'tenant_admin',
                displayName: 'Tenant Admin',
                authClass: 'tenant_admin',
                assignmentStatus: 'active',
                isPrimary: true,
                assignedAt: '2026-03-02T10:00:00.000Z',
              },
            ],
          },
        ],
      },
    });
  });

  it('returns null when the user is not found', async () => {
    userFindUnique.mockResolvedValue(null);

    const { getPlatformUserDetail } = await import('../../src/platform/users/detail-service.js');

    const response = await getPlatformUserDetail('nonexistent');
    expect(response).toBeNull();
  });
});
