import { TenantSlugAvailabilityResponseSchema, type TenantSlugAvailabilityResponse } from "@crown/types";
import type { PrismaClient } from "../../generated/prisma/client.js";

import { prisma } from "../../db/prisma.js";

type PlatformTenantSlugAvailabilityDb = Pick<PrismaClient, "tenant">;

export const getPlatformTenantSlugAvailability = async (
  input: { slug: string },
  db: PlatformTenantSlugAvailabilityDb = prisma
): Promise<TenantSlugAvailabilityResponse> => {
  const existingTenant = await db.tenant.findUnique({
    where: { slug: input.slug }
  });

  return TenantSlugAvailabilityResponseSchema.parse({
    data: {
      slug: input.slug,
      isAvailable: existingTenant === null
    }
  });
};
