import { beforeEach, describe, expect, it, vi } from 'vitest';

const userFindUnique = vi.fn();
const tenantFindUnique = vi.fn();
const roleFindFirst = vi.fn();
const tenantMembershipFindUnique = vi.fn();
const tenantMembershipCreate = vi.fn();
const roleAssignmentCreate = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    user: { findUnique: userFindUnique },
    tenant: { findUnique: tenantFindUnique },
    role: { findFirst: roleFindFirst },
    tenantMembership: {
      findUnique: tenantMembershipFindUnique,
      create: tenantMembershipCreate,
    },
    tenantMembershipRoleAssignment: {
      create: roleAssignmentCreate,
    },
  },
}));

describe('create tenant membership integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates membership and initial role assignment', async () => {
    userFindUnique.mockResolvedValue({ id: 'user-1' });
    tenantFindUnique.mockResolvedValue({ id: 'tenant-1' });
    roleFindFirst.mockResolvedValue({ id: 'role-1', roleCode: 'tenant_admin', scope: 'tenant' });
    tenantMembershipFindUnique.mockResolvedValue(null);
    tenantMembershipCreate.mockResolvedValue({
      id: 'tm-1',
      userId: 'user-1',
      tenantId: 'tenant-1',
      membershipStatus: 'active',
    });
    roleAssignmentCreate.mockResolvedValue({
      id: 'ra-1',
      assignmentStatus: 'active',
      isPrimary: true,
    });

    const { createTenantMembership } =
      await import('../../src/platform/users/membership-service.js');

    const result = await createTenantMembership({
      userId: 'user-1',
      tenantId: 'tenant-1',
      roleCode: 'tenant_admin',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.data.membershipId).toBe('tm-1');
      expect(result.data.data.membershipStatus).toBe('active');
      expect(result.data.data.isPrimary).toBe(true);
    }
  });

  it('returns 404 when user does not exist', async () => {
    userFindUnique.mockResolvedValue(null);
    tenantFindUnique.mockResolvedValue({ id: 'tenant-1' });
    roleFindFirst.mockResolvedValue({ id: 'role-1' });

    const { createTenantMembership } =
      await import('../../src/platform/users/membership-service.js');

    const result = await createTenantMembership({
      userId: 'no-user',
      tenantId: 'tenant-1',
      roleCode: 'tenant_admin',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(404);
      expect(result.errorCode).toBe('not_found');
    }
  });

  it('returns 409 when membership already exists', async () => {
    userFindUnique.mockResolvedValue({ id: 'user-1' });
    tenantFindUnique.mockResolvedValue({ id: 'tenant-1' });
    roleFindFirst.mockResolvedValue({ id: 'role-1' });
    tenantMembershipFindUnique.mockResolvedValue({ id: 'tm-existing' });

    const { createTenantMembership } =
      await import('../../src/platform/users/membership-service.js');

    const result = await createTenantMembership({
      userId: 'user-1',
      tenantId: 'tenant-1',
      roleCode: 'tenant_admin',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(409);
      expect(result.errorCode).toBe('conflict');
    }
  });
});
