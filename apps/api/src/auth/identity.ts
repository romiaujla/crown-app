import type { PlatformUserAccountStatus } from '../domain/status-enums.js';
import type { RoleEnum } from './claims.js';

export type AuthIdentityRecord = {
  id: string;
  email: string;
  username: string | null;
  passwordHash: string | null;
  accountStatus: PlatformUserAccountStatus;
  displayName: string;
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
  displayName: string;
  platformRoleAssignments: Array<{
    role: {
      authClass: string;
    };
  }>;
  tenantMemberships: Array<{
    tenantId: string;
    roleAssignments: Array<{
      isPrimary: boolean;
      role: {
        authClass: string;
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
        where: { assignmentStatus: 'active' };
        include: {
          role: {
            select: {
              authClass: true;
            };
          };
        };
      };
      tenantMemberships: {
        where: { membershipStatus: 'active' };
        include: {
          roleAssignments: {
            where: { assignmentStatus: 'active' };
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
  displayName: record.displayName,
  platformRoleCodes: record.platformRoleAssignments.map(
    (assignment) => assignment.role.authClass as RoleEnum,
  ),
  tenantMemberships: record.tenantMemberships.map((membership) => {
    const roleCodes = membership.roleAssignments.map(
      (assignment) => assignment.role.authClass as RoleEnum,
    );
    const primaryRoleCode =
      (membership.roleAssignments.find((assignment) => assignment.isPrimary)?.role.authClass as
        | RoleEnum
        | undefined) ?? (roleCodes.length === 1 ? roleCodes[0] : null);

    return {
      tenantId: membership.tenantId,
      roleCodes,
      primaryRoleCode,
    };
  }),
});

export const normalizeLoginIdentifier = (identifier: string): string =>
  identifier.trim().toLowerCase();

export const findAuthIdentityByIdentifier = async (
  prisma: AuthIdentityPrismaClient,
  identifier: string,
): Promise<AuthIdentityRecord | null> => {
  const normalizedIdentifier = normalizeLoginIdentifier(identifier);

  const record = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
    },
    include: {
      platformRoleAssignments: {
        where: { assignmentStatus: 'active' },
        include: {
          role: {
            select: {
              authClass: true,
            },
          },
        },
      },
      tenantMemberships: {
        where: { membershipStatus: 'active' },
        include: {
          roleAssignments: {
            where: { assignmentStatus: 'active' },
            include: {
              role: {
                select: {
                  authClass: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return record ? toAuthIdentityRecord(record) : null;
};
