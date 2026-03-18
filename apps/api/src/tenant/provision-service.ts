import { Client } from 'pg';

import { env } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { TenantStatus } from '../domain/status-enums.js';

import { loadTenantMigrations } from './migration-loader.js';
import { executeTenantMigrations } from './migrator.js';
import { deriveTenantSchemaName, normalizeSlug, validateSlug } from './slug.js';
import type { ProvisionTenantInput, ProvisionTenantResult } from './types.js';

const quoteIdentifier = (value: string) => `"${value.replaceAll('"', '""')}"`;

const isUniqueConstraintError = (error: unknown): error is { code: string } =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code: string }).code === 'P2002';

const CURRENT_TYPE_VERSION = '1.0';
const TENANT_ADMIN_ROLE_CODE = 'tenant_admin';

export const provisionTenant = async (
  input: ProvisionTenantInput,
): Promise<ProvisionTenantResult> => {
  const normalizedName = input.name.trim();
  const normalizedSlug = normalizeSlug(input.slug);

  if (!normalizedName || !validateSlug(normalizedSlug)) {
    return {
      status: 'conflict',
      message: 'invalid tenant provisioning input',
    };
  }

  const managementSystemType = await prisma.managementSystemType.findUnique({
    where: {
      typeCode_version: {
        typeCode: input.managementSystemTypeCode,
        version: CURRENT_TYPE_VERSION,
      },
    },
  });

  if (!managementSystemType) {
    return {
      status: 'conflict',
      message: 'invalid management system type code',
    };
  }

  const schemaName = deriveTenantSchemaName(normalizedSlug);

  let tenant = null;
  try {
    tenant = await prisma.tenant.create({
      data: {
        name: normalizedName,
        slug: normalizedSlug,
        schemaName,
        status: TenantStatus.provisioning,
      },
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) throw error;

    const existing = await prisma.tenant.findUnique({
      where: { slug: normalizedSlug },
    });

    if (
      !existing ||
      existing.schemaName !== schemaName ||
      existing.status === TenantStatus.active
    ) {
      return {
        status: 'conflict',
        message: 'tenant slug already exists',
      };
    }

    tenant = existing;
  }

  const client = new Client({ connectionString: env.DATABASE_URL });
  await client.connect();

  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${quoteIdentifier(schemaName)}`);

    const migrations = await loadTenantMigrations();
    if (!migrations.length) {
      return {
        status: 'failed',
        errorCode: 'migration_failed',
        message: 'No tenant migrations were found',
        tenantId: tenant.id,
        slug: normalizedSlug,
        schemaName,
        appliedVersions: [],
      };
    }

    const migrationResult = await executeTenantMigrations(
      {
        tenantId: tenant.id,
        schemaName,
        actorSub: input.actorSub,
        migrations,
      },
      { client },
    );

    if (migrationResult.status === 'failed') {
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { status: TenantStatus.provisioning_failed },
      });

      return {
        status: 'failed',
        errorCode: 'migration_failed',
        message: migrationResult.message ?? 'baseline migration execution failed',
        failedVersion: migrationResult.failedVersion,
        tenantId: tenant.id,
        slug: normalizedSlug,
        schemaName,
        appliedVersions: migrationResult.appliedVersions,
      };
    }

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: { status: TenantStatus.active },
    });

    const uniqueRoleCodes = [...new Set(input.initialUsers.map((u) => u.roleCode))];
    const roles = await prisma.role.findMany({
      where: { roleCode: { in: uniqueRoleCodes } },
    });
    const roleByCode = new Map(roles.map((r) => [r.roleCode, r]));

    const missingRoles = uniqueRoleCodes.filter((code) => !roleByCode.has(code));
    if (missingRoles.length > 0) {
      return {
        status: 'conflict',
        message: `role codes not found: ${missingRoles.join(', ')}`,
      };
    }

    let foundFirstTenantAdmin = false;

    await prisma.$transaction(async (tx) => {
      for (const initialUser of input.initialUsers) {
        const normalizedEmail = initialUser.email.trim().toLowerCase();
        const normalizedUsername = initialUser.username.trim().toLowerCase();
        const displayName = initialUser.displayName.trim();

        const user = await tx.user.upsert({
          where: { email: normalizedEmail },
          create: {
            email: normalizedEmail,
            username: normalizedUsername,
            displayName,
            accountStatus: 'active',
          },
          update: {
            username: normalizedUsername,
          },
        });

        const membership = await tx.tenantMembership.create({
          data: {
            userId: user.id,
            tenantId: updatedTenant.id,
            membershipStatus: 'active',
          },
        });

        const role = roleByCode.get(initialUser.roleCode)!;
        const isPrimary = !foundFirstTenantAdmin && initialUser.roleCode === TENANT_ADMIN_ROLE_CODE;
        if (isPrimary) foundFirstTenantAdmin = true;

        await tx.tenantMembershipRoleAssignment.create({
          data: {
            tenantMembershipId: membership.id,
            roleId: role.id,
            assignmentStatus: 'active',
            isPrimary,
          },
        });
      }
    });

    return {
      status: 'provisioned',
      tenantId: updatedTenant.id,
      slug: updatedTenant.slug,
      schemaName: updatedTenant.schemaName,
      appliedVersions: migrationResult.appliedVersions,
      skippedVersions: migrationResult.skippedVersions,
      managementSystemTypeCode: input.managementSystemTypeCode,
      tenant: updatedTenant,
    };
  } finally {
    await client.end();
  }
};
