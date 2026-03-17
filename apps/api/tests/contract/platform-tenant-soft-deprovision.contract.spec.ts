import { DeprovisionTypeEnum } from '@crown/types';
import type { RequestHandler } from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { buildApp } from '../../src/app.js';
import { TenantStatus } from '../../src/domain/status-enums.js';
import { createPlatformTenantsRouter } from '../../src/routes/platform-tenants.js';
import { createJwtToken, superAdminClaims, tenantAdminClaims } from '../helpers/auth-fixtures.js';

describe('platform tenant soft deprovision contract', () => {
  it('returns 200 for super_admin', async () => {
    const deprovision = vi.fn(async () => ({
      status: 'soft_deprovisioned' as const,
      tenantId: 'tenant-acme',
      slug: 'acme-local',
      schemaName: 'tenant_acme_local',
      previousStatus: TenantStatus.active,
      tenant: {
        id: 'tenant-acme',
        name: 'Acme Local Logistics',
        slug: 'acme-local',
        schemaName: 'tenant_acme_local',
        status: TenantStatus.hard_deprovisioned,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ deprovision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant/deprovision')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ tenantId: 'tenant-acme' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      tenantId: 'tenant-acme',
      slug: 'acme-local',
      schemaName: 'tenant_acme_local',
      previousStatus: 'active',
      status: 'inactive',
      operation: 'soft_deprovisioned',
    });
    expect(deprovision).toHaveBeenCalledWith({
      tenantId: 'tenant-acme',
      deprovisionType: DeprovisionTypeEnum.SOFT,
    });
  });

  it('returns 401 for missing token', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ deprovision: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/deprovision')
      .send({ tenantId: 'tenant-acme' });

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe('unauthenticated');
  });

  it('returns 403 for non-super-admin', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ deprovision: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/deprovision')
      .set('Authorization', `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send({ tenantId: 'tenant-acme' });

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
  });

  it('returns 404 for unknown tenants', async () => {
    const deprovision = vi.fn(async () => ({
      status: 'not_found' as const,
      message: 'Tenant was not found',
      tenantId: 'tenant-missing',
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ deprovision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant/deprovision')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ tenantId: 'tenant-missing' });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe('not_found');
  });

  it('returns 400 for invalid payload', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ deprovision: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/deprovision')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('validation_error');
  });

  it('returns 409 when the tenant is already inactive', async () => {
    const deprovision = vi.fn(async () => ({
      status: 'conflict' as const,
      message: 'Tenant is already inactive',
      tenantId: 'tenant-acme',
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ deprovision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant/deprovision')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ tenantId: 'tenant-acme' });

    expect(response.status).toBe(409);
    expect(response.body.errorCode).toBe('conflict');
  });

  it('returns 429 when rate limited', async () => {
    const rateLimitMiddleware: RequestHandler = (_req, res) => {
      res
        .status(429)
        .json({ errorCode: 'rate_limited', message: 'Too many tenant mutation requests' });
    };
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({
        deprovision: vi.fn(),
        rateLimitMiddleware,
      }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/deprovision')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ tenantId: 'tenant-acme' });

    expect(response.status).toBe(429);
    expect(response.body.errorCode).toBe('rate_limited');
  });

  it('returns 200 for explicit hard deprovision', async () => {
    const deprovision = vi.fn(async () => ({
      status: 'hard_deprovisioned' as const,
      tenantId: 'tenant-acme',
      slug: 'acme-local',
      schemaName: 'tenant_acme_local',
      previousStatus: TenantStatus.active,
      tenant: {
        id: 'tenant-acme',
        name: 'Acme Local Logistics',
        slug: 'acme-local',
        schemaName: 'tenant_acme_local',
        status: TenantStatus.inactive,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ deprovision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant/deprovision')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ tenantId: 'tenant-acme', deprovisionType: 'hard' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      tenantId: 'tenant-acme',
      slug: 'acme-local',
      schemaName: 'tenant_acme_local',
      previousStatus: 'active',
      status: 'hard_deprovisioned',
      operation: 'hard_deprovisioned',
    });
    expect(deprovision).toHaveBeenCalledWith({
      tenantId: 'tenant-acme',
      deprovisionType: DeprovisionTypeEnum.HARD,
    });
  });

  it('returns 400 for unsupported deprovisionType', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ deprovision: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/deprovision')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ tenantId: 'tenant-acme', deprovisionType: 'destroy' });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('validation_error');
  });
});
