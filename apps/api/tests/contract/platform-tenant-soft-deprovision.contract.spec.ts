import { DeprovisionTypeEnum } from '@crown/types';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { RequestHandler } from 'express';

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
      .send({ tenant_id: 'tenant-acme' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      tenant_id: 'tenant-acme',
      slug: 'acme-local',
      schema_name: 'tenant_acme_local',
      previous_status: 'active',
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
      .send({ tenant_id: 'tenant-acme' });

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe('unauthenticated');
  });

  it('returns 403 for non-super-admin', async () => {
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ deprovision: vi.fn() }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant/deprovision')
      .set('Authorization', `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send({ tenant_id: 'tenant-acme' });

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe('forbidden_role');
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
      .send({ tenant_id: 'tenant-missing' });

    expect(response.status).toBe(404);
    expect(response.body.error_code).toBe('not_found');
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
    expect(response.body.error_code).toBe('validation_error');
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
      .send({ tenant_id: 'tenant-acme' });

    expect(response.status).toBe(409);
    expect(response.body.error_code).toBe('conflict');
  });

  it('returns 429 when rate limited', async () => {
    const rateLimitMiddleware: RequestHandler = (_req, res) => {
      res
        .status(429)
        .json({ error_code: 'rate_limited', message: 'Too many tenant mutation requests' });
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
      .send({ tenant_id: 'tenant-acme' });

    expect(response.status).toBe(429);
    expect(response.body.error_code).toBe('rate_limited');
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
      .send({ tenant_id: 'tenant-acme', deprovisionType: 'hard' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      tenant_id: 'tenant-acme',
      slug: 'acme-local',
      schema_name: 'tenant_acme_local',
      previous_status: 'active',
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
      .send({ tenant_id: 'tenant-acme', deprovisionType: 'destroy' });

    expect(response.status).toBe(400);
    expect(response.body.error_code).toBe('validation_error');
  });
});
