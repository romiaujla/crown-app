import type { PlatformUserAccountStatus } from "../domain/status-enums.js";
import type { RoleEnum } from "./claims.js";

export type AuthIdentityRecord = {
  id: string;
  email: string;
  username: string | null;
  passwordHash: string | null;
  accountStatus: PlatformUserAccountStatus;
  role: RoleEnum;
  tenantLinks: Array<{
    tenantId: string;
    role: RoleEnum;
  }>;
};

type PlatformUserLookup = {
  findFirst(args: {
    where: {
      OR: Array<{
        email?: string;
        username?: string;
      }>;
    };
    include: {
      tenantLinks: {
        select: {
          tenantId: true;
          role: true;
        };
      };
    };
  }): Promise<AuthIdentityRecord | null>;
};

export type AuthIdentityPrismaClient = {
  platformUser: PlatformUserLookup;
};

export const normalizeLoginIdentifier = (identifier: string): string => identifier.trim().toLowerCase();

export const findAuthIdentityByIdentifier = async (
  prisma: AuthIdentityPrismaClient,
  identifier: string
): Promise<AuthIdentityRecord | null> => {
  const normalizedIdentifier = normalizeLoginIdentifier(identifier);

  return prisma.platformUser.findFirst({
    where: {
      OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }]
    },
    include: {
      tenantLinks: {
        select: {
          tenantId: true,
          role: true
        }
      }
    }
  });
};
