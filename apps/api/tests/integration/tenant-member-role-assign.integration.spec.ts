import { beforeEach, describe, expect, it, vi } from 'vitest';

const tenantMembershipFindUnique = vi.fn();
const roleFindFirst = vi.fn();
const roleAssignmentFindUnique = vi.fn();
const roleAssignmentCreate = vi.fn();
const roleAssignmentUpdate = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    tenantMembership: { findUnique: tenantMembershipFindUnique },
    role: { findFirst: roleFindFirst },
    tenantMembershipRoleAssignment: {
      findUnique: roleAssignmentFindUnique,
      create: roleAssignmentCreate,
      update: roleAssignmentUpdate,
    },
  },
}));

describe('assign tenant member role integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a new role assignment when none exists', async () => {
    tenantMembershipFindUnique.mockResolvedValue({
      id: 'tm-1',
      tenantId: 'tenant-1',
    });
    roleFindFirst.mockResolvedValue({ id: 'role-1', roleCode: 'tenant_user', scope: 'tenant' });
    roleAssignmentFindUnique.mockResolvedValue(null);
    roleAssignmentCreate.mockResolvedValue({
      id: 'ra-new',
      assignmentStatus: 'active',
      isPrimary: false,
      assignedAt: new Date('2026-04-01T12:00:00.000Z'),
      role: { roleCode: 'tenant_user', displayName: 'Tenant User' },
    });

    const { assignTenantMemberRole } = await import('../../src/tenant/member-service.js');

    const result = await assignTenantMemberRole('tenant-1', 'tm-1', 'tenant_user');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.data.assignmentId).toBe('ra-new');
      expect(result.data.data.roleCode).toBe('tenant_user');
      expect(result.data.data.isPrimary).toBe(false);
    }
  });

  it('re-activates an inactive assignment instead of creating a duplicate', async () => {
    tenantMembershipFindUnique.mockResolvedValue({
      id: 'tm-1',
      tenantId: 'tenant-1',
    });
    roleFindFirst.mockResolvedValue({ id: 'role-1', roleCode: 'tenant_user', scope: 'tenant' });
    roleAssignmentFindUnique.mockResolvedValue({
      id: 'ra-old',
      assignmentStatus: 'inactive',
    });
    roleAssignmentUpdate.mockResolvedValue({
      id: 'ra-old',
      assignmentStatus: 'active',
      isPrimary: false,
      assignedAt: new Date('2026-04-01T12:00:00.000Z'),
      role: { roleCode: 'tenant_user', displayName: 'Tenant User' },
    });

    const { assignTenantMemberRole } = await import('../../src/tenant/member-service.js');

    const result = await assignTenantMemberRole('tenant-1', 'tm-1', 'tenant_user');

    expect(result.ok).toBe(true);
    expect(roleAssignmentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ra-old' },
        data: { assignmentStatus: 'active', endedAt: null },
      }),
    );
  });

  it('returns 409 when role is already actively assigned', async () => {
    tenantMembershipFindUnique.mockResolvedValue({
      id: 'tm-1',
      tenantId: 'tenant-1',
    });
    roleFindFirst.mockResolvedValue({ id: 'role-1' });
    roleAssignmentFindUnique.mockResolvedValue({
      id: 'ra-active',
      assignmentStatus: 'active',
    });

    const { assignTenantMemberRole } = await import('../../src/tenant/member-service.js');

    const result = await assignTenantMemberRole('tenant-1', 'tm-1', 'tenant_user');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(409);
      expect(result.errorCode).toBe('conflict');
    }
  });

  it('returns 403 when membership does not belong to the tenant', async () => {
    tenantMembershipFindUnique.mockResolvedValue({
      id: 'tm-1',
      tenantId: 'other-tenant',
    });

    const { assignTenantMemberRole } = await import('../../src/tenant/member-service.js');

    const result = await assignTenantMemberRole('tenant-1', 'tm-1', 'tenant_user');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(403);
      expect(result.errorCode).toBe('forbidden_tenant');
    }
  });
});
