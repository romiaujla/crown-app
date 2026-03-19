import { ManagementSystemTypeCodeEnum, RoleCodeEnum } from '@crown/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const managementSystemTypeFindMany = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    managementSystemType: {
      findMany: managementSystemTypeFindMany,
    },
  },
}));

describe('platform tenant create reference data integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps active management-system types into the shared reference-data response', async () => {
    managementSystemTypeFindMany.mockResolvedValue([
      {
        id: 'type-transportation',
        typeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
        version: '1.0',
        displayName: 'Transportation Management System',
        description: 'Transportation workflows',
        availabilityStatus: 'active',
        roles: [
          {
            id: 'transportation-driver',
            isDefault: true,
            role: {
              id: 'driver',
              roleCode: RoleCodeEnum.DRIVER,
              displayName: 'Driver',
              description: 'Executes transportation work.',
            },
          },
          {
            id: 'transportation-admin',
            isDefault: true,
            role: {
              id: 'workspace-admin',
              roleCode: RoleCodeEnum.ADMIN,
              displayName: 'Admin',
              description: 'Management-system administrator role inside the tenant workspace.',
            },
          },
          {
            id: 'transportation-tenant-admin',
            isDefault: true,
            role: {
              id: 'tenant-admin',
              roleCode: RoleCodeEnum.TENANT_ADMIN,
              displayName: 'Tenant Admin',
              description: 'Bootstrap tenant shell administrator role.',
            },
          },
        ],
      },
    ]);

    const { getPlatformTenantCreateReferenceData } =
      await import('../../src/platform/tenants/reference-data-service.js');

    const response = await getPlatformTenantCreateReferenceData();

    expect(response).toEqual({
      data: {
        managementSystemTypeList: [
          {
            typeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
            version: '1.0',
            displayName: 'Transportation Management System',
            description: 'Transportation workflows',
            roleOptions: [
              {
                roleCode: RoleCodeEnum.ADMIN,
                displayName: 'Admin',
                description: 'Management-system administrator role inside the tenant workspace.',
                isDefault: true,
                isRequired: false,
              },
              {
                roleCode: RoleCodeEnum.DRIVER,
                displayName: 'Driver',
                description: 'Executes transportation work.',
                isDefault: true,
                isRequired: false,
              },
              {
                roleCode: RoleCodeEnum.TENANT_ADMIN,
                displayName: 'Tenant Admin',
                description: 'Bootstrap tenant shell administrator role.',
                isDefault: true,
                isRequired: true,
              },
            ],
          },
        ],
      },
    });
  });

  it('queries only active management-system types with nested roles in deterministic order', async () => {
    managementSystemTypeFindMany.mockResolvedValue([]);

    const { getPlatformTenantCreateReferenceData } =
      await import('../../src/platform/tenants/reference-data-service.js');

    await getPlatformTenantCreateReferenceData({
      typeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    });

    expect(managementSystemTypeFindMany).toHaveBeenCalledWith({
      where: {
        availabilityStatus: 'active',
        typeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: [{ displayName: 'asc' }, { typeCode: 'asc' }],
    });
  });

  it('preserves nullable descriptions and empty active catalogs', async () => {
    managementSystemTypeFindMany.mockResolvedValue([
      {
        id: 'type-dealership',
        typeCode: ManagementSystemTypeCodeEnum.DEALERSHIP,
        version: '1.0',
        displayName: 'Dealer Management System',
        description: null,
        availabilityStatus: 'active',
        roles: [
          {
            id: 'dealership-admin',
            isDefault: true,
            role: {
              id: 'tenant-admin',
              roleCode: RoleCodeEnum.TENANT_ADMIN,
              displayName: 'Tenant Admin',
              description: null,
            },
          },
        ],
      },
    ]);

    const { getPlatformTenantCreateReferenceData } =
      await import('../../src/platform/tenants/reference-data-service.js');

    const response = await getPlatformTenantCreateReferenceData();

    expect(response.data.managementSystemTypeList[0]).toEqual({
      typeCode: ManagementSystemTypeCodeEnum.DEALERSHIP,
      version: '1.0',
      displayName: 'Dealer Management System',
      description: null,
      roleOptions: [
        {
          roleCode: RoleCodeEnum.TENANT_ADMIN,
          displayName: 'Tenant Admin',
          description: null,
          isDefault: true,
          isRequired: true,
        },
      ],
    });
  });

  it('returns all active management-system types when no filter is provided', async () => {
    managementSystemTypeFindMany.mockResolvedValue([]);

    const { getPlatformTenantCreateReferenceData } =
      await import('../../src/platform/tenants/reference-data-service.js');

    await getPlatformTenantCreateReferenceData({});

    expect(managementSystemTypeFindMany).toHaveBeenCalledWith({
      where: {
        availabilityStatus: 'active',
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: [{ displayName: 'asc' }, { typeCode: 'asc' }],
    });
  });
});
