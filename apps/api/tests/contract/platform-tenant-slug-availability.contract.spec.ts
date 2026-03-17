import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { RequestHandler } from 'express';

import { buildApp } from '../../src/app.js';
import { createPlatformTenantsRouter } from '../../src/routes/platform-tenants.js';
import { createJwtToken, superAdminClaims, tenantAdminClaims } from '../helpers/auth-fixtures.js';

describe('platform tenant slug availability contract', () => {
  it('returns 200 with an available result for super_admin', async () => {
    const getSlugAvailability = vi.fn(async () => ({
      data: {
        slug: 'acme-logistics',
        isAvailable: true,
      },
    }));
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getSlugAvailability }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/slug-availability')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ slug: 'acme-logistics' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        slug: 'acme-logistics',
        isAvailable: true,
      },
    });
    expect(getSlugAvailability).toHaveBeenCalledWith({ slug: 'acme-logistics' });
  });

  it('normalizes the slug before performing the lookup', async () => {
    const getSlugAvailability = vi.fn(async () => ({
      data: {
        slug: 'acme-logistics',
        isAvailable: false,
      },
    }));
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getSlugAvailability }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/slug-availability')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ slug: '  Acme-Logistics  ' });

    expect(response.status).toBe(200);
    expect(response.body.data.slug).toBe('acme-logistics');
    expect(getSlugAvailability).toHaveBeenCalledWith({ slug: 'acme-logistics' });
  });

  it('returns 400 for an invalid slug payload', async () => {
    const getSlugAvailability = vi.fn();
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getSlugAvailability }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/slug-availability')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ slug: 'not valid!' });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('validation_error');
    expect(getSlugAvailability).not.toHaveBeenCalled();
  });

  it('returns 401 for missing token', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getSlugAvailability: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/slug-availability')
      .send({ slug: 'acme-logistics' });

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe('unauthenticated');
  });

  it('returns 403 for non-super-admin', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getSlugAvailability: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/slug-availability')
      .set('Authorization', `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send({ slug: 'acme-logistics' });

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
        getSlugAvailability: vi.fn(),
        searchRateLimitMiddleware,
      }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/slug-availability')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ slug: 'acme-logistics' });

    expect(response.status).toBe(429);
    expect(response.body.error_code).toBe('rate_limited');
    expect(response.body.message).toBe('Too many tenant directory requests');
  });
});
