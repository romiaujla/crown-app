import { hashPassword } from "../../src/auth/passwords.js";
import {
  LOCAL_SEED_MANAGEMENT_SYSTEM_TYPE_ROLES,
  LOCAL_SEED_MANAGEMENT_SYSTEM_TYPES,
  LOCAL_SEED_ROLES,
  LOCAL_SEED_TENANT,
  LOCAL_SEED_USERS
} from "./constants.js";
import type { SeedControlPlaneBaseline, SeedPrismaClient } from "./types.js";

type EnsureControlPlaneBaselineOptions = {
  prisma: SeedPrismaClient;
};

export const ensureControlPlaneBaseline = async ({
  prisma
}: EnsureControlPlaneBaselineOptions): Promise<SeedControlPlaneBaseline> => {
  const [superAdminPasswordHash, tenantAdminPasswordHash, tenantUserPasswordHash] = await Promise.all([
    hashPassword(LOCAL_SEED_USERS.superAdmin.password, LOCAL_SEED_USERS.superAdmin.username),
    hashPassword(LOCAL_SEED_USERS.tenantAdmin.password, LOCAL_SEED_USERS.tenantAdmin.username),
    hashPassword(LOCAL_SEED_USERS.tenantUser.password, LOCAL_SEED_USERS.tenantUser.username)
  ]);

  const tenant = await prisma.tenant.upsert({
    where: {
      slug: LOCAL_SEED_TENANT.slug
    },
    create: {
      name: LOCAL_SEED_TENANT.name,
      slug: LOCAL_SEED_TENANT.slug,
      schemaName: LOCAL_SEED_TENANT.schemaName,
      status: LOCAL_SEED_TENANT.status
    },
    update: {
      name: LOCAL_SEED_TENANT.name,
      schemaName: LOCAL_SEED_TENANT.schemaName,
      status: LOCAL_SEED_TENANT.status
    }
  });

  const superAdmin = await prisma.user.upsert({
    where: {
      email: LOCAL_SEED_USERS.superAdmin.email
    },
    create: {
      email: LOCAL_SEED_USERS.superAdmin.email,
      username: LOCAL_SEED_USERS.superAdmin.username,
      passwordHash: superAdminPasswordHash,
      accountStatus: LOCAL_SEED_USERS.superAdmin.accountStatus,
      displayName: LOCAL_SEED_USERS.superAdmin.displayName
    },
    update: {
      username: LOCAL_SEED_USERS.superAdmin.username,
      passwordHash: superAdminPasswordHash,
      accountStatus: LOCAL_SEED_USERS.superAdmin.accountStatus,
      displayName: LOCAL_SEED_USERS.superAdmin.displayName
    }
  });

  const tenantAdmin = await prisma.user.upsert({
    where: {
      email: LOCAL_SEED_USERS.tenantAdmin.email
    },
    create: {
      email: LOCAL_SEED_USERS.tenantAdmin.email,
      username: LOCAL_SEED_USERS.tenantAdmin.username,
      passwordHash: tenantAdminPasswordHash,
      accountStatus: LOCAL_SEED_USERS.tenantAdmin.accountStatus,
      displayName: LOCAL_SEED_USERS.tenantAdmin.displayName
    },
    update: {
      username: LOCAL_SEED_USERS.tenantAdmin.username,
      passwordHash: tenantAdminPasswordHash,
      accountStatus: LOCAL_SEED_USERS.tenantAdmin.accountStatus,
      displayName: LOCAL_SEED_USERS.tenantAdmin.displayName
    }
  });

  const tenantUser = await prisma.user.upsert({
    where: {
      email: LOCAL_SEED_USERS.tenantUser.email
    },
    create: {
      email: LOCAL_SEED_USERS.tenantUser.email,
      username: LOCAL_SEED_USERS.tenantUser.username,
      passwordHash: tenantUserPasswordHash,
      accountStatus: LOCAL_SEED_USERS.tenantUser.accountStatus,
      displayName: LOCAL_SEED_USERS.tenantUser.displayName
    },
    update: {
      username: LOCAL_SEED_USERS.tenantUser.username,
      passwordHash: tenantUserPasswordHash,
      accountStatus: LOCAL_SEED_USERS.tenantUser.accountStatus,
      displayName: LOCAL_SEED_USERS.tenantUser.displayName
    }
  });

  const superAdminMembership = await prisma.tenantMembership.upsert({
    where: {
      userId_tenantId: {
        userId: superAdmin.id,
        tenantId: tenant.id
      }
    },
    create: {
      userId: superAdmin.id,
      tenantId: tenant.id
    },
    update: {}
  });

  const tenantAdminMembership = await prisma.tenantMembership.upsert({
    where: {
      userId_tenantId: {
        userId: tenantAdmin.id,
        tenantId: tenant.id
      }
    },
    create: {
      userId: tenantAdmin.id,
      tenantId: tenant.id
    },
    update: {}
  });

  const tenantUserMembership = await prisma.tenantMembership.upsert({
    where: {
      userId_tenantId: {
        userId: tenantUser.id,
        tenantId: tenant.id
      }
    },
    create: {
      userId: tenantUser.id,
      tenantId: tenant.id
    },
    update: {}
  });

  const roles = new Map<string, string>();

  for (const role of LOCAL_SEED_ROLES) {
    const persistedRole = await prisma.role.upsert({
      where: {
        roleCode: role.roleCode
      },
      create: {
        roleCode: role.roleCode,
        scope: role.scope,
        authClass: role.authClass,
        displayName: role.displayName,
        description: role.description
      },
      update: {
        scope: role.scope,
        authClass: role.authClass,
        displayName: role.displayName,
        description: role.description
      }
    });

    roles.set(role.roleCode, persistedRole.id);
  }

  await prisma.userPlatformRoleAssignment.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: roles.get("super_admin") as string
      }
    },
    create: {
      userId: superAdmin.id,
      roleId: roles.get("super_admin") as string
    },
    update: {}
  });

  await prisma.tenantMembershipRoleAssignment.upsert({
    where: {
      tenantMembershipId_roleId: {
        tenantMembershipId: tenantAdminMembership.id,
        roleId: roles.get("tenant_admin") as string
      }
    },
    create: {
      tenantMembershipId: tenantAdminMembership.id,
      roleId: roles.get("tenant_admin") as string,
      isPrimary: true
    },
    update: {
      isPrimary: true
    }
  });

  await prisma.tenantMembershipRoleAssignment.upsert({
    where: {
      tenantMembershipId_roleId: {
        tenantMembershipId: tenantUserMembership.id,
        roleId: roles.get(LOCAL_SEED_USERS.tenantUser.role) as string
      }
    },
    create: {
      tenantMembershipId: tenantUserMembership.id,
      roleId: roles.get(LOCAL_SEED_USERS.tenantUser.role) as string,
      isPrimary: true
    },
    update: {
      isPrimary: true
    }
  });

  const managementSystemTypes = new Map<string, string>();

  for (const managementSystemType of LOCAL_SEED_MANAGEMENT_SYSTEM_TYPES) {
    const persistedType = await prisma.managementSystemType.upsert({
      where: {
        typeCode_version: {
          typeCode: managementSystemType.typeCode,
          version: managementSystemType.version
        }
      },
      create: {
        typeCode: managementSystemType.typeCode,
        version: managementSystemType.version,
        displayName: managementSystemType.displayName,
        description: managementSystemType.description,
        availabilityStatus: managementSystemType.availabilityStatus
      },
      update: {
        version: managementSystemType.version,
        displayName: managementSystemType.displayName,
        description: managementSystemType.description,
        availabilityStatus: managementSystemType.availabilityStatus
      }
    });

    managementSystemTypes.set(`${managementSystemType.typeCode}:${managementSystemType.version}`, persistedType.id);
  }

  for (const managementSystemTypeRole of LOCAL_SEED_MANAGEMENT_SYSTEM_TYPE_ROLES) {
    const managementSystemTypeId = managementSystemTypes.get(
      `${managementSystemTypeRole.managementSystemTypeCode}:${managementSystemTypeRole.managementSystemTypeVersion}`
    );
    if (!managementSystemTypeId) {
      throw new Error(
        `Missing management system type baseline for ${managementSystemTypeRole.managementSystemTypeCode}:${managementSystemTypeRole.managementSystemTypeVersion}`
      );
    }

    const roleId = roles.get(managementSystemTypeRole.roleCode);
    if (!roleId) {
      throw new Error(`Missing role baseline for ${managementSystemTypeRole.roleCode}`);
    }

    await prisma.managementSystemTypeRole.upsert({
      where: {
        managementSystemTypeId_roleId: {
          managementSystemTypeId,
          roleId
        }
      },
      create: {
        managementSystemTypeId,
        roleId,
        isDefault: managementSystemTypeRole.isDefault
      },
      update: {
        isDefault: managementSystemTypeRole.isDefault
      }
    });
  }

  return {
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    schemaName: tenant.schemaName,
    platformUserIds: {
      superAdmin: superAdmin.id,
      tenantAdmin: tenantAdmin.id,
      tenantUser: tenantUser.id
    }
  };
};
