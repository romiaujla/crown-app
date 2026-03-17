import { beforeEach, describe, expect, it, vi } from 'vitest';

const tenantMembershipFindUnique = vi.fn();
const roleFindFirst = vi.fn();
const roleAssignmentFindFirst = vi.fn();
const roleAssignmentCount = vi.fn();
const roleAssignmentUpdate = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    tenantMembership: { findUnique: tenantMembershipFindUnique },
    role: { findFirst: roleFindFirst },
    tenantMembershipRoleAssignment: {
      findFirst: roleAssignmentFindFirst,
      count: roleAssignmentCount,
      update: roleAssignmentUpdate,
    },
  },
}));

describe('revoke tenant member role integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('soft-deactivates an active role assignment', async () => {
    tenantMembershipFindUnique.mockResolvedValue({
      id: 'tm-1',
      tenantId: 'tenant-1',
    });
    roleFindFirst.mockResolvedValue({ id: 'role-1', roleCode: 'tenant_user', scope: 'tenant' });
    roleAssignmentFindFirst.mockResolvedValue({
      id: 'ra-1',
      assignmentStatus: 'active',
    });
    roleAssignmentCount.mockResolvedValue(2);
    const endedAt = new Date('2026-04-01T12:00:00.000Z');
    roleAssignmentUpdate.mockResolvedValue({
      id: 'ra-1',
      assignmentStatus: 'inactive',
      endedAt,
    });

    const { revokeTenantMemberRole } = await import('../../src/tenant/member-service.js');

    const result = await revokeTenantMemberRole('tenant-1', 'tm-1', 'tenant_user');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.data.assignmentId).toBe('ra-1');
      expect(result.data.data.assignmentStatus).toBe('inactive');
    }
  });

  it('prevents revoking the last active role', async () => {
    tenantMembershipFindUnique.mockResolvedValue({
      id: 'tm-1',
      tenantId: 'tenant-1',
    });
    roleFindFirst.mockResolvedValue({ id: 'role-1' });
    roleAssignmentFindFirst.mockResolvedValue({
      id: 'ra-1',
      assignmentStatus: 'active',
    });
    roleAssignmentCount.mockResolvedValue(1);

    const { revokeTenantMemberRole } = await import('../../src/tenant/member-service.js');

    const result = await revokeTenantMemberRole('tenant-1', 'tm-1', 'tenant_user');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(400);
      expect(result.message).toContain('last active role');
    }
  });

  it('returns 404 when no active assignment is found', async () => {
    tenantMembershipFindUnique.mockResolvedValue({
      id: 'tm-1',
      tenantId: 'tenant-1',
    });
    roleFindFirst.mockResolvedValue({ id: 'role-1' });
    roleAssignmentFindFirst.mockResolvedValue(null);

    const { revokeTenantMemberRole } = await import('../../src/tenant/member-service.js');

    const result = await revokeTenantMemberRole('tenant-1', 'tm-1', 'tenant_user');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(404);
      expect(result.errorCode).toBe('not_found');
    }
  });

  it('returns 403 when membership does not belong to the tenant', async () => {
    tenantMembershipFindUnique.mockResolvedValue({
      id: 'tm-1',
      tenantId: 'other-tenant',
    });

    const { revokeTenantMemberRole } = await import('../../src/tenant/member-service.js');

    const result = await revokeTenantMemberRole('tenant-1', 'tm-1', 'tenant_user');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(403);
    }
  });
});
