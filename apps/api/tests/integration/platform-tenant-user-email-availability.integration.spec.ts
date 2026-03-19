import { beforeEach, describe, expect, it, vi } from 'vitest';

const userFindUnique = vi.fn();

vi.mock('../../src/db/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: userFindUnique,
    },
  },
}));

describe('platform tenant user email availability integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns available when no user owns the email', async () => {
    userFindUnique.mockResolvedValue(null);

    const { getPlatformTenantUserEmailAvailability } =
      await import('../../src/platform/tenants/user-email-availability-service.js');

    const response = await getPlatformTenantUserEmailAvailability({
      email: 'alex.admin@example.com',
    });

    expect(response).toEqual({
      data: {
        email: 'alex.admin@example.com',
        isAvailable: true,
      },
    });
  });

  it('returns unavailable when any user already owns the email', async () => {
    userFindUnique.mockResolvedValue({
      id: 'user-1',
      email: 'alex.admin@example.com',
    });

    const { getPlatformTenantUserEmailAvailability } =
      await import('../../src/platform/tenants/user-email-availability-service.js');

    const response = await getPlatformTenantUserEmailAvailability({
      email: 'alex.admin@example.com',
    });

    expect(response).toEqual({
      data: {
        email: 'alex.admin@example.com',
        isAvailable: false,
      },
    });
  });

  it('queries persisted users by normalized email', async () => {
    userFindUnique.mockResolvedValue(null);

    const { getPlatformTenantUserEmailAvailability } =
      await import('../../src/platform/tenants/user-email-availability-service.js');

    await getPlatformTenantUserEmailAvailability({ email: 'alex.admin@example.com' });

    expect(userFindUnique).toHaveBeenCalledWith({
      where: { email: 'alex.admin@example.com' },
    });
  });
});
