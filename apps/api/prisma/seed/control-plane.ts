import type { SeedControlPlaneBaseline, SeedPrismaClient } from "./types.js";
import { LOCAL_SEED_TENANT, LOCAL_SEED_USERS } from "./constants.js";
import { hashPassword } from "../../src/auth/passwords.js";

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

  const superAdmin = await prisma.platformUser.upsert({
    where: {
      email: LOCAL_SEED_USERS.superAdmin.email
    },
    create: {
      email: LOCAL_SEED_USERS.superAdmin.email,
      username: LOCAL_SEED_USERS.superAdmin.username,
      passwordHash: superAdminPasswordHash,
      accountStatus: LOCAL_SEED_USERS.superAdmin.accountStatus,
      displayName: LOCAL_SEED_USERS.superAdmin.displayName,
      role: LOCAL_SEED_USERS.superAdmin.role
    },
    update: {
      username: LOCAL_SEED_USERS.superAdmin.username,
      passwordHash: superAdminPasswordHash,
      accountStatus: LOCAL_SEED_USERS.superAdmin.accountStatus,
      displayName: LOCAL_SEED_USERS.superAdmin.displayName,
      role: LOCAL_SEED_USERS.superAdmin.role
    }
  });

  const tenantAdmin = await prisma.platformUser.upsert({
    where: {
      email: LOCAL_SEED_USERS.tenantAdmin.email
    },
    create: {
      email: LOCAL_SEED_USERS.tenantAdmin.email,
      username: LOCAL_SEED_USERS.tenantAdmin.username,
      passwordHash: tenantAdminPasswordHash,
      accountStatus: LOCAL_SEED_USERS.tenantAdmin.accountStatus,
      displayName: LOCAL_SEED_USERS.tenantAdmin.displayName,
      role: LOCAL_SEED_USERS.tenantAdmin.role
    },
    update: {
      username: LOCAL_SEED_USERS.tenantAdmin.username,
      passwordHash: tenantAdminPasswordHash,
      accountStatus: LOCAL_SEED_USERS.tenantAdmin.accountStatus,
      displayName: LOCAL_SEED_USERS.tenantAdmin.displayName,
      role: LOCAL_SEED_USERS.tenantAdmin.role
    }
  });

  const tenantUser = await prisma.platformUser.upsert({
    where: {
      email: LOCAL_SEED_USERS.tenantUser.email
    },
    create: {
      email: LOCAL_SEED_USERS.tenantUser.email,
      username: LOCAL_SEED_USERS.tenantUser.username,
      passwordHash: tenantUserPasswordHash,
      accountStatus: LOCAL_SEED_USERS.tenantUser.accountStatus,
      displayName: LOCAL_SEED_USERS.tenantUser.displayName,
      role: LOCAL_SEED_USERS.tenantUser.role
    },
    update: {
      username: LOCAL_SEED_USERS.tenantUser.username,
      passwordHash: tenantUserPasswordHash,
      accountStatus: LOCAL_SEED_USERS.tenantUser.accountStatus,
      displayName: LOCAL_SEED_USERS.tenantUser.displayName,
      role: LOCAL_SEED_USERS.tenantUser.role
    }
  });

  await prisma.platformUserTenant.upsert({
    where: {
      platformUserId_tenantId: {
        platformUserId: superAdmin.id,
        tenantId: tenant.id
      }
    },
    create: {
      platformUserId: superAdmin.id,
      tenantId: tenant.id,
      role: "super_admin"
    },
    update: {
      role: "super_admin"
    }
  });

  await prisma.platformUserTenant.upsert({
    where: {
      platformUserId_tenantId: {
        platformUserId: tenantAdmin.id,
        tenantId: tenant.id
      }
    },
    create: {
      platformUserId: tenantAdmin.id,
      tenantId: tenant.id,
      role: "tenant_admin"
    },
    update: {
      role: "tenant_admin"
    }
  });

  await prisma.platformUserTenant.upsert({
    where: {
      platformUserId_tenantId: {
        platformUserId: tenantUser.id,
        tenantId: tenant.id
      }
    },
    create: {
      platformUserId: tenantUser.id,
      tenantId: tenant.id,
      role: "tenant_user"
    },
    update: {
      role: "tenant_user"
    }
  });

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
