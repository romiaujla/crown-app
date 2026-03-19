import type { RequestHandler } from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { buildApp } from '../../src/app.js';
import { createPlatformTenantsRouter } from '../../src/routes/platform-tenants.js';
import { createJwtToken, superAdminClaims, tenantAdminClaims } from '../helpers/auth-fixtures.js';

describe('platform tenant user email availability contract', () => {
  it('returns 200 with an available result for super_admin', async () => {
    const getUserEmailAvailability = vi.fn(async () => ({
      data: {
        email: 'alex.admin@example.com',
        isAvailable: true,
      },
    }));
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getUserEmailAvailability }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/user-email-availability')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ email: 'alex.admin@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        email: 'alex.admin@example.com',
        isAvailable: true,
      },
    });
    expect(getUserEmailAvailability).toHaveBeenCalledWith({
      email: 'alex.admin@example.com',
    });
  });

  it('normalizes the email before performing the lookup', async () => {
    const getUserEmailAvailability = vi.fn(async () => ({
      data: {
        email: 'alex.admin@example.com',
        isAvailable: false,
      },
    }));
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getUserEmailAvailability }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/user-email-availability')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ email: '  Alex.Admin@Example.com  ' });

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('alex.admin@example.com');
    expect(getUserEmailAvailability).toHaveBeenCalledWith({
      email: 'alex.admin@example.com',
    });
  });

  it('returns 400 for an invalid email payload', async () => {
    const getUserEmailAvailability = vi.fn();
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getUserEmailAvailability }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/user-email-availability')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ email: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('validation_error');
    expect(getUserEmailAvailability).not.toHaveBeenCalled();
  });

  it('returns 401 for missing token', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getUserEmailAvailability: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/user-email-availability')
      .send({ email: 'alex.admin@example.com' });

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe('unauthenticated');
  });

  it('returns 403 for non-super-admin', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getUserEmailAvailability: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/user-email-availability')
      .set('Authorization', `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send({ email: 'alex.admin@example.com' });

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
  });

  it('returns 429 when rate limited', async () => {
    const searchRateLimitMiddleware: RequestHandler = (_req, res) => {
      res
        .status(429)
        .json({ error_code: 'rate_limited', message: 'Too many tenant directory requests' });
    };
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({
        getUserEmailAvailability: vi.fn(),
        searchRateLimitMiddleware,
      }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/user-email-availability')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ email: 'alex.admin@example.com' });

    expect(response.status).toBe(429);
    expect(response.body.error_code).toBe('rate_limited');
    expect(response.body.message).toBe('Too many tenant directory requests');
  });
});
