import {
  ManagementSystemTypeCodeEnum,
  RoleCodeEnum,
  type TenantCreateReferenceDataFilter,
  TenantCreateReferenceDataResponseSchema,
  type TenantCreateReferenceDataResponse,
} from '@crown/types';
import type { PrismaClient } from '../../generated/prisma/client.js';
import { ManagementSystemTypeAvailabilityStatusEnum } from '../../generated/prisma/enums.js';

import { prisma } from '../../db/prisma.js';

const REQUIRED_ROLE_CODE = RoleCodeEnum.TENANT_ADMIN;

type PlatformTenantReferenceDataDb = Pick<PrismaClient, 'managementSystemType'>;

export const getPlatformTenantCreateReferenceData = async (
  filter: TenantCreateReferenceDataFilter = {},
  db: PlatformTenantReferenceDataDb = prisma,
): Promise<TenantCreateReferenceDataResponse> => {
  const managementSystemTypes = await db.managementSystemType.findMany({
    where: {
      availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum.active,
      ...(filter.typeCode ? { typeCode: filter.typeCode } : {}),
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

  return TenantCreateReferenceDataResponseSchema.parse({
    data: {
      managementSystemTypeList: managementSystemTypes.map((managementSystemType) => ({
        typeCode: managementSystemType.typeCode,
        version: managementSystemType.version,
        displayName: managementSystemType.displayName,
        description: managementSystemType.description ?? null,
        roleOptions: managementSystemType.roles
          .map(({ isDefault, role }) => ({
            roleCode: role.roleCode,
            displayName: role.displayName,
            description: role.description ?? null,
            isDefault,
            isRequired: role.roleCode === REQUIRED_ROLE_CODE,
          }))
          .sort((left, right) => left.displayName.localeCompare(right.displayName)),
      })),
    },
  });
};
