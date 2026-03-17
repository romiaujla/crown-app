import { beforeEach, describe, expect, it, vi } from 'vitest';

const roleFindMany = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    role: {
      findMany: roleFindMany,
    },
  },
}));

describe('tenant role catalog integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns tenant-scoped roles in the agreed envelope', async () => {
    roleFindMany.mockResolvedValue([
      {
        roleCode: 'tenant_admin',
        displayName: 'Tenant Admin',
        description: 'Has administrative access to the tenant.',
        authClass: 'tenant_admin',
        scope: 'tenant',
      },
      {
        roleCode: 'tenant_user',
        displayName: 'Tenant User',
        description: null,
        authClass: 'tenant_user',
        scope: 'tenant',
      },
    ]);

    const { getTenantRoles } = await import('../../src/tenant/role-service.js');

    const response = await getTenantRoles();

    expect(response).toEqual({
      data: {
        roles: [
          {
            roleCode: 'tenant_admin',
            displayName: 'Tenant Admin',
            description: 'Has administrative access to the tenant.',
            authClass: 'tenant_admin',
            scope: 'tenant',
          },
          {
            roleCode: 'tenant_user',
            displayName: 'Tenant User',
            description: null,
            authClass: 'tenant_user',
            scope: 'tenant',
          },
        ],
      },
    });
  });

  it('queries only tenant-scoped roles from the persistence layer', async () => {
    roleFindMany.mockResolvedValue([]);

    const { getTenantRoles } = await import('../../src/tenant/role-service.js');

    await getTenantRoles();

    expect(roleFindMany).toHaveBeenCalledWith({
      where: { scope: 'tenant' },
      orderBy: { displayName: 'asc' },
      select: {
        roleCode: true,
        displayName: true,
        description: true,
        authClass: true,
        scope: true,
      },
    });
  });
});
