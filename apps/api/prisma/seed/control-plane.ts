import type { SeedControlPlaneBaseline, SeedPrismaClient } from "./types.js";
import { LOCAL_SEED_TENANT, LOCAL_SEED_USERS } from "./constants.js";

type EnsureControlPlaneBaselineOptions = {
  prisma: SeedPrismaClient;
};

export const ensureControlPlaneBaseline = async ({
  prisma
}: EnsureControlPlaneBaselineOptions): Promise<SeedControlPlaneBaseline> => {
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
      displayName: LOCAL_SEED_USERS.superAdmin.displayName,
      role: LOCAL_SEED_USERS.superAdmin.role
    },
    update: {
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
      displayName: LOCAL_SEED_USERS.tenantAdmin.displayName,
      role: LOCAL_SEED_USERS.tenantAdmin.role
    },
    update: {
      displayName: LOCAL_SEED_USERS.tenantAdmin.displayName,
      role: LOCAL_SEED_USERS.tenantAdmin.role
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

  return {
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    schemaName: tenant.schemaName,
    platformUserIds: {
      superAdmin: superAdmin.id,
      tenantAdmin: tenantAdmin.id
    }
  };
};
