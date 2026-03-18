import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TenantStatus } from '../../src/domain/status-enums.js';

const tenantCreate = vi.fn();
const tenantFindUnique = vi.fn();
const tenantUpdate = vi.fn();

const managementSystemTypeFindUnique = vi.fn();
const roleFindMany = vi.fn();

const txUserUpsert = vi.fn();
const txTenantMembershipCreate = vi.fn();
const txTenantMembershipRoleAssignmentCreate = vi.fn();
const prismaTransaction = vi.fn();

const query = vi.fn();
const connect = vi.fn();
const end = vi.fn();

const loadTenantMigrations = vi.fn();
const executeTenantMigrations = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    tenant: {
      create: tenantCreate,
      findUnique: tenantFindUnique,
      update: tenantUpdate,
    },
    managementSystemType: {
      findUnique: managementSystemTypeFindUnique,
    },
    role: {
      findMany: roleFindMany,
    },
    $transaction: (...args: unknown[]) => prismaTransaction(...args),
  },
}));

vi.mock('../../src/tenant/migration-loader.js', () => ({
  loadTenantMigrations,
}));

vi.mock('../../src/tenant/migrator.js', () => ({
  executeTenantMigrations,
  tenantMigrationStrategy: {
    prismaScope: 'public',
    tenantScope: 'tenant_<slug>',
    execution: 'versioned-sql',
  },
}));

vi.mock('pg', () => ({
  Client: vi.fn(() => ({
    connect,
    query,
    end,
  })),
}));

const defaultInitialUsers = [
  {
    displayName: 'Alex Admin',
    email: 'alex.admin@example.com',
    username: 'alex_admin',
    roleCode: 'tenant_admin',
  },
];

const defaultInput = {
  name: 'Acme',
  slug: 'acme',
  actorSub: 'user-super-admin',
  managementSystemTypeCode: 'transportation',
  selectedRoleCodes: ['tenant_admin'],
  initialUsers: defaultInitialUsers,
};

describe('tenant provisioning integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    managementSystemTypeFindUnique.mockResolvedValue({
      id: 'mst-1',
      typeCode: 'transportation',
      version: '1.0',
      displayName: 'Transportation Management System',
      availabilityStatus: 'active',
    });

    roleFindMany.mockResolvedValue([
      {
        id: 'role-tenant-admin',
        roleCode: 'tenant_admin',
        scope: 'tenant',
        authClass: 'tenant_admin',
        displayName: 'Tenant Admin',
      },
    ]);

    txUserUpsert.mockResolvedValue({
      id: 'user-1',
      email: 'alex.admin@example.com',
      displayName: 'Alex Admin',
      accountStatus: 'active',
    });

    txTenantMembershipCreate.mockResolvedValue({
      id: 'membership-1',
      userId: 'user-1',
      tenantId: 'tenant-1',
      membershipStatus: 'active',
    });

    txTenantMembershipRoleAssignmentCreate.mockResolvedValue({
      id: 'assignment-1',
      tenantMembershipId: 'membership-1',
      roleId: 'role-tenant-admin',
      assignmentStatus: 'active',
      isPrimary: true,
    });

    prismaTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<void>) => {
      await fn({
        user: { upsert: txUserUpsert },
        tenantMembership: { create: txTenantMembershipCreate },
        tenantMembershipRoleAssignment: { create: txTenantMembershipRoleAssignmentCreate },
      });
    });

    tenantCreate.mockResolvedValue({
      id: 'tenant-1',
      name: 'Acme',
      slug: 'acme',
      schemaName: 'tenant_acme',
      status: TenantStatus.provisioning,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    tenantUpdate.mockResolvedValue({
      id: 'tenant-1',
      name: 'Acme',
      slug: 'acme',
      schemaName: 'tenant_acme',
      status: TenantStatus.active,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    loadTenantMigrations.mockResolvedValue([
      {
        version: '0001_base.001_foundational_tms_schema',
        description: 'foundational tms schema',
        sqlPath: 'a.sql',
        sequence: 1,
      },
    ]);
    executeTenantMigrations.mockResolvedValue({
      status: 'provisioned',
      appliedVersions: ['0001_base.001_foundational_tms_schema'],
      skippedVersions: [],
    });
  });

  it('creates schema and metadata on success', async () => {
    const { provisionTenant } = await import('../../src/tenant/provision-service.js');

    const result = await provisionTenant(defaultInput);

    expect(result.status).toBe('provisioned');
    expect(query).toHaveBeenCalledWith('CREATE SCHEMA IF NOT EXISTS "tenant_acme"');
  });

  it('creates user, membership, and role assignment for each initial user', async () => {
    const { provisionTenant } = await import('../../src/tenant/provision-service.js');

    const result = await provisionTenant(defaultInput);

    expect(result.status).toBe('provisioned');
    expect(txUserUpsert).toHaveBeenCalledWith({
      where: { email: 'alex.admin@example.com' },
      create: {
        email: 'alex.admin@example.com',
        username: 'alex_admin',
        displayName: 'Alex Admin',
        accountStatus: 'active',
      },
      update: {
        username: 'alex_admin',
      },
    });
    expect(txTenantMembershipCreate).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        tenantId: 'tenant-1',
        membershipStatus: 'active',
      },
    });
    expect(txTenantMembershipRoleAssignmentCreate).toHaveBeenCalledWith({
      data: {
        tenantMembershipId: 'membership-1',
        roleId: 'role-tenant-admin',
        assignmentStatus: 'active',
        isPrimary: true,
      },
    });
  });

  it('sets isPrimary only on first tenant_admin assignment', async () => {
    roleFindMany.mockResolvedValue([
      { id: 'role-tenant-admin', roleCode: 'tenant_admin' },
      { id: 'role-dispatcher', roleCode: 'dispatcher' },
    ]);

    let upsertCallCount = 0;
    txUserUpsert.mockImplementation(async () => {
      upsertCallCount++;
      return {
        id: `user-${upsertCallCount}`,
        email: upsertCallCount === 1 ? 'alex@example.com' : 'bob@example.com',
        displayName: upsertCallCount === 1 ? 'Alex Admin' : 'Bob Dispatcher',
        accountStatus: 'active',
      };
    });

    let membershipCallCount = 0;
    txTenantMembershipCreate.mockImplementation(async () => {
      membershipCallCount++;
      return {
        id: `membership-${membershipCallCount}`,
        userId: `user-${membershipCallCount}`,
        tenantId: 'tenant-1',
        membershipStatus: 'active',
      };
    });

    const { provisionTenant } = await import('../../src/tenant/provision-service.js');

    const result = await provisionTenant({
      ...defaultInput,
      selectedRoleCodes: ['tenant_admin', 'dispatcher'],
      initialUsers: [
        {
          displayName: 'Alex Admin',
          email: 'alex@example.com',
          username: 'alex_admin',
          roleCode: 'tenant_admin',
        },
        {
          displayName: 'Bob Dispatcher',
          email: 'bob@example.com',
          username: 'bob_dispatcher',
          roleCode: 'dispatcher',
        },
      ],
    });

    expect(result.status).toBe('provisioned');
    expect(txTenantMembershipRoleAssignmentCreate).toHaveBeenCalledTimes(2);
    expect(txTenantMembershipRoleAssignmentCreate).toHaveBeenNthCalledWith(1, {
      data: expect.objectContaining({ roleId: 'role-tenant-admin', isPrimary: true }),
    });
    expect(txTenantMembershipRoleAssignmentCreate).toHaveBeenNthCalledWith(2, {
      data: expect.objectContaining({ roleId: 'role-dispatcher', isPrimary: false }),
    });
  });

  it('reuses existing user when email already exists', async () => {
    txUserUpsert.mockResolvedValue({
      id: 'existing-user-id',
      email: 'alex.admin@example.com',
      displayName: 'Previously Created',
      accountStatus: 'active',
    });

    const { provisionTenant } = await import('../../src/tenant/provision-service.js');

    const result = await provisionTenant(defaultInput);

    expect(result.status).toBe('provisioned');
    expect(txUserUpsert).toHaveBeenCalledTimes(1);
    expect(txTenantMembershipCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: 'existing-user-id' }),
    });
  });

  it('does not create membership for actorSub when not in initialUsers', async () => {
    const { provisionTenant } = await import('../../src/tenant/provision-service.js');

    const result = await provisionTenant({
      ...defaultInput,
      actorSub: 'platform-super-admin-not-in-list',
    });

    expect(result.status).toBe('provisioned');
    expect(txUserUpsert).not.toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'platform-super-admin-not-in-list' },
      }),
    );
  });

  it('does not create records for unstaffed selected roles', async () => {
    roleFindMany.mockResolvedValue([{ id: 'role-tenant-admin', roleCode: 'tenant_admin' }]);

    const { provisionTenant } = await import('../../src/tenant/provision-service.js');

    const result = await provisionTenant({
      ...defaultInput,
      selectedRoleCodes: ['tenant_admin', 'dispatcher', 'driver'],
    });

    expect(result.status).toBe('provisioned');
    expect(txTenantMembershipCreate).toHaveBeenCalledTimes(1);
    expect(txTenantMembershipRoleAssignmentCreate).toHaveBeenCalledTimes(1);
  });

  it('returns conflict when role code is missing from roles table', async () => {
    roleFindMany.mockResolvedValue([]);

    const { provisionTenant } = await import('../../src/tenant/provision-service.js');

    const result = await provisionTenant(defaultInput);

    expect(result).toEqual({
      status: 'conflict',
      message: 'role codes not found: tenant_admin',
    });
    expect(prismaTransaction).not.toHaveBeenCalled();
  });

  it('includes managementSystemTypeCode in success result', async () => {
    const { provisionTenant } = await import('../../src/tenant/provision-service.js');

    const result = await provisionTenant(defaultInput);

    expect(result.status).toBe('provisioned');
    if (result.status === 'provisioned') {
      expect(result.managementSystemTypeCode).toBe('transportation');
    }
  });

  it('returns conflict for invalid management system type code', async () => {
    managementSystemTypeFindUnique.mockResolvedValue(null);

    const { provisionTenant } = await import('../../src/tenant/provision-service.js');

    const result = await provisionTenant({
      ...defaultInput,
      managementSystemTypeCode: 'nonexistent',
    });

    expect(result).toEqual({
      status: 'conflict',
      message: 'invalid management system type code',
    });
    expect(tenantCreate).not.toHaveBeenCalled();
  });

  it('returns conflict for active duplicate tenant', async () => {
    tenantCreate.mockRejectedValue({ code: 'P2002' });
    tenantFindUnique.mockResolvedValue({
      id: 'tenant-1',
      name: 'Acme',
      slug: 'acme',
      schemaName: 'tenant_acme',
      status: TenantStatus.active,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const { provisionTenant } = await import('../../src/tenant/provision-service.js');

    const result = await provisionTenant(defaultInput);

    expect(result).toEqual({
      status: 'conflict',
      message: 'tenant slug already exists',
    });
    expect(query).not.toHaveBeenCalled();
  });
});
