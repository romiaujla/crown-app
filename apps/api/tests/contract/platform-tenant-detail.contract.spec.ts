import { TenantStatusEnum } from '@crown/types';
import type { RequestHandler } from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { buildApp } from '../../src/app.js';
import { createPlatformTenantsRouter } from '../../src/routes/platform-tenants.js';
import { createJwtToken, superAdminClaims, tenantAdminClaims } from '../helpers/auth-fixtures.js';

describe('platform tenant detail contract', () => {
  it('returns 200 for super_admin', async () => {
    const getTenantDetail = vi.fn(async () => ({
      data: {
        tenantId: 'tenant-acme',
        name: 'Acme Logistics',
        slug: 'acme-logistics',
        schemaName: 'tenant_acme_logistics',
        status: TenantStatusEnum.ACTIVE,
        createdAt: '2026-03-01T12:00:00.000Z',
        updatedAt: '2026-03-10T09:30:00.000Z',
      },
    }));
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getTenantDetail }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/details')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ slug: 'acme-logistics' });

    expect(response.status).toBe(200);
    expect(response.body.data.slug).toBe('acme-logistics');
    expect(getTenantDetail).toHaveBeenCalledWith('acme-logistics');
  });

  it('returns 404 when the tenant does not exist', async () => {
    const getTenantDetail = vi.fn(async () => null);
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getTenantDetail }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/details')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ slug: 'missing-tenant' });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe('not_found');
    expect(response.body.message).toBe('Tenant not found');
  });

  it('returns 400 for an invalid payload', async () => {
    const getTenantDetail = vi.fn();
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getTenantDetail }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/details')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ slug: 'Not Valid' });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('validation_error');
    expect(getTenantDetail).not.toHaveBeenCalled();
  });

  it('returns 401 for missing token', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getTenantDetail: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/details')
      .send({ slug: 'acme-logistics' });

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe('unauthenticated');
  });

  it('returns 403 for non-super-admin', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getTenantDetail: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/details')
      .set('Authorization', `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send({ slug: 'acme-logistics' });

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
  });

  it('returns 429 when rate limited', async () => {
    const searchRateLimitMiddleware: RequestHandler = (_req, res) => {
      res
        .status(429)
        .json({ errorCode: 'rate_limited', message: 'Too many tenant directory requests' });
    };
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({
        getTenantDetail: vi.fn(),
        searchRateLimitMiddleware,
      }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/details')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ slug: 'acme-logistics' });

    expect(response.status).toBe(429);
    expect(response.body.errorCode).toBe('rate_limited');
    expect(response.body.message).toBe('Too many tenant directory requests');
  });
});
