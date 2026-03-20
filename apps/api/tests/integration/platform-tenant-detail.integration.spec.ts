import { TenantStatusEnum } from '@crown/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const tenantFindUnique = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    tenant: {
      findUnique: tenantFindUnique,
    },
  },
}));

describe('platform tenant detail integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps a persisted tenant into the agreed response envelope', async () => {
    tenantFindUnique.mockResolvedValue({
      id: 'tenant-acme',
      name: 'Acme Logistics',
      slug: 'acme-logistics',
      schemaName: 'tenant_acme_logistics',
      status: 'active',
      createdAt: new Date('2026-03-01T12:00:00.000Z'),
      updatedAt: new Date('2026-03-10T09:30:00.000Z'),
    });

    const { getPlatformTenantDetail } =
      await import('../../src/platform/tenants/detail-service.js');

    const response = await getPlatformTenantDetail('acme-logistics');

    expect(response).toEqual({
      data: {
        tenantId: 'tenant-acme',
        name: 'Acme Logistics',
        slug: 'acme-logistics',
        schemaName: 'tenant_acme_logistics',
        status: TenantStatusEnum.ACTIVE,
        createdAt: '2026-03-01T12:00:00.000Z',
        updatedAt: '2026-03-10T09:30:00.000Z',
      },
    });
  });

  it('looks tenants up by slug', async () => {
    tenantFindUnique.mockResolvedValue(null);

    const { getPlatformTenantDetail } =
      await import('../../src/platform/tenants/detail-service.js');

    await getPlatformTenantDetail('acme-logistics');

    expect(tenantFindUnique).toHaveBeenCalledWith({
      where: {
        slug: 'acme-logistics',
      },
    });
  });

  it('returns null when the tenant does not exist', async () => {
    tenantFindUnique.mockResolvedValue(null);

    const { getPlatformTenantDetail } =
      await import('../../src/platform/tenants/detail-service.js');

    const response = await getPlatformTenantDetail('missing-tenant');

    expect(response).toBeNull();
  });
});
