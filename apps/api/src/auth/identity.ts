import type { PlatformUserAccountStatus } from "../domain/status-enums.js";
import type { RoleEnum } from "./claims.js";

export type AuthIdentityRecord = {
  id: string;
  email: string;
  username: string | null;
  passwordHash: string | null;
  accountStatus: PlatformUserAccountStatus;
  platformRoleCodes: RoleEnum[];
  tenantMemberships: Array<{
    tenantId: string;
    roleCodes: RoleEnum[];
    primaryRoleCode: RoleEnum | null;
  }>;
};

type RawAuthIdentityRecord = {
  id: string;
  email: string;
  username: string | null;
  passwordHash: string | null;
  accountStatus: PlatformUserAccountStatus;
  platformRoleAssignments: Array<{
    role: {
      authClass: RoleEnum;
    };
  }>;
  tenantMemberships: Array<{
    tenantId: string;
    roleAssignments: Array<{
      isPrimary: boolean;
      role: {
        authClass: RoleEnum;
      };
    }>;
  }>;
};

type UserLookup = {
  findFirst(args: {
    where: {
      OR: Array<{
        email?: string;
        username?: string;
      }>;
    };
    include: {
      platformRoleAssignments: {
        include: {
          role: {
            select: {
              authClass: true;
            };
          };
        };
      };
      tenantMemberships: {
        include: {
          roleAssignments: {
            include: {
              role: {
                select: {
                  authClass: true;
                };
              };
            };
          };
        };
      };
    };
  }): Promise<RawAuthIdentityRecord | null>;
};

export type AuthIdentityPrismaClient = {
  user: UserLookup;
};

const toAuthIdentityRecord = (record: RawAuthIdentityRecord): AuthIdentityRecord => ({
  id: record.id,
  email: record.email,
  username: record.username,
  passwordHash: record.passwordHash,
  accountStatus: record.accountStatus,
  platformRoleCodes: record.platformRoleAssignments.map((assignment) => assignment.role.authClass),
  tenantMemberships: record.tenantMemberships.map((membership) => {
    const roleCodes = membership.roleAssignments.map((assignment) => assignment.role.authClass);
    const primaryRoleCode =
      membership.roleAssignments.find((assignment) => assignment.isPrimary)?.role.authClass ??
      (roleCodes.length === 1 ? roleCodes[0] : null);

    return {
      tenantId: membership.tenantId,
      roleCodes,
      primaryRoleCode
    };
  })
});

export const normalizeLoginIdentifier = (identifier: string): string => identifier.trim().toLowerCase();

export const findAuthIdentityByIdentifier = async (
  prisma: AuthIdentityPrismaClient,
  identifier: string
): Promise<AuthIdentityRecord | null> => {
  const normalizedIdentifier = normalizeLoginIdentifier(identifier);

  const record = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }]
    },
    include: {
      platformRoleAssignments: {
        include: {
          role: {
            select: {
              authClass: true
            }
          }
        }
      },
      tenantMemberships: {
        include: {
          roleAssignments: {
            include: {
              role: {
                select: {
                  authClass: true
                }
              }
            }
          }
        }
      }
    }
  });

  return record ? toAuthIdentityRecord(record) : null;
};
