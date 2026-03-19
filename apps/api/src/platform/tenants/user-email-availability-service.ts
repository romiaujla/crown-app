import {
  TenantUserEmailAvailabilityResponseSchema,
  type TenantUserEmailAvailabilityResponse,
} from '@crown/types';
import type { PrismaClient } from '../../generated/prisma/client.js';

import { prisma } from '../../db/prisma.js';

type PlatformTenantUserEmailAvailabilityDb = Pick<PrismaClient, 'user'>;

export const getPlatformTenantUserEmailAvailability = async (
  input: { email: string },
  db: PlatformTenantUserEmailAvailabilityDb = prisma,
): Promise<TenantUserEmailAvailabilityResponse> => {
  const existingUser = await db.user.findUnique({
    where: { email: input.email },
  });

  return TenantUserEmailAvailabilityResponseSchema.parse({
    data: {
      email: input.email,
      isAvailable: existingUser === null,
    },
  });
};
