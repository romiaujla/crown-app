import type { RequestHandler } from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { buildApp } from '../../src/app.js';
import { TenantStatus } from '../../src/domain/status-enums.js';
import { createPlatformTenantsRouter } from '../../src/routes/platform-tenants.js';
import type { ProvisionTenantResult } from '../../src/tenant/types.js';
import { createJwtToken, superAdminClaims, tenantAdminClaims } from '../helpers/auth-fixtures.js';

const createProvisioned = (): ProvisionTenantResult => ({
  status: 'provisioned',
  tenantId: 'tenant-id-1',
  slug: 'acme',
  schemaName: 'tenant_acme',
  appliedVersions: ['0001_base.001_foundational_tms_schema'],
  skippedVersions: [],
  managementSystemTypeCode: 'transportation',
  tenant: {
    id: 'tenant-id-1',
    name: 'Acme',
    slug: 'acme',
    schemaName: 'tenant_acme',
    status: TenantStatus.active,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
});

const createValidOnboardingPayload = () => ({
  tenant: {
    name: 'Acme',
    slug: 'acme',
    managementSystemTypeCode: 'transportation',
  },
  selectedRoleCodes: ['tenant_admin', 'dispatcher'],
  initialUsers: [
    {
      firstName: 'Alex',
      lastName: 'Admin',
      email: 'alex.admin@example.com',
      roleCode: 'tenant_admin',
    },
  ],
});

describe('platform tenant provisioning contract', () => {
  it('returns 201 for super_admin', async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send(createValidOnboardingPayload());

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('provisioned');
    expect(response.body.slug).toBe('acme');
    expect(response.body.managementSystemTypeCode).toBe('transportation');
  });

  it('returns 400 for invalid payload', async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({
        tenant: {
          name: 'A',
          slug: 'INVALID',
          managementSystemTypeCode: 'transportation',
        },
        selectedRoleCodes: ['tenant_admin'],
        initialUsers: [
          {
            firstName: 'Alex',
            lastName: 'Admin',
            email: 'alex.admin@example.com',
            roleCode: 'tenant_admin',
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('validation_error');
  });

  it('returns 400 for missing tenant.managementSystemTypeCode', async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({
        tenant: {
          name: 'Acme',
          slug: 'acme',
        },
        selectedRoleCodes: ['tenant_admin'],
        initialUsers: [
          {
            firstName: 'Alex',
            lastName: 'Admin',
            email: 'alex.admin@example.com',
            roleCode: 'tenant_admin',
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('validation_error');
  });

  it('returns 400 when selectedRoleCodes omits tenant_admin', async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({
        tenant: {
          name: 'Acme',
          slug: 'acme',
          managementSystemTypeCode: 'transportation',
        },
        selectedRoleCodes: ['dispatcher'],
        initialUsers: [
          {
            firstName: 'Alex',
            lastName: 'Admin',
            email: 'alex.admin@example.com',
            roleCode: 'dispatcher',
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('validation_error');
  });

  it('returns 400 when no initial user is assigned tenant_admin', async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({
        tenant: {
          name: 'Acme',
          slug: 'acme',
          managementSystemTypeCode: 'transportation',
        },
        selectedRoleCodes: ['tenant_admin', 'dispatcher'],
        initialUsers: [
          {
            firstName: 'Drew',
            lastName: 'Dispatcher',
            email: 'drew.dispatcher@example.com',
            roleCode: 'dispatcher',
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('validation_error');
  });

  it('returns 400 when an initial user role is not selected', async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({
        tenant: {
          name: 'Acme',
          slug: 'acme',
          managementSystemTypeCode: 'transportation',
        },
        selectedRoleCodes: ['tenant_admin'],
        initialUsers: [
          {
            firstName: 'Alex',
            lastName: 'Admin',
            email: 'alex.admin@example.com',
            roleCode: 'tenant_admin',
          },
          {
            firstName: 'Drew',
            lastName: 'Dispatcher',
            email: 'drew.dispatcher@example.com',
            roleCode: 'dispatcher',
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('validation_error');
  });

  it('returns 401 for missing token', async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant')
      .send(createValidOnboardingPayload());

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe('unauthenticated');
  });

  it('returns 403 for non-super-admin', async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant')
      .set('Authorization', `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send(createValidOnboardingPayload());

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
  });

  it('returns 409 on conflict', async () => {
    const provision = vi.fn(
      async () => ({ status: 'conflict', message: 'tenant slug already exists' }) as const,
    );
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post('/api/v1/platform/tenant')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send(createValidOnboardingPayload());

    expect(response.status).toBe(409);
    expect(response.body.errorCode).toBe('conflict');
  });

  it('returns 429 when rate limited', async () => {
    const provision = vi.fn(async () => createProvisioned());
    const rateLimitMiddleware: RequestHandler = (_req, res) => {
      res
        .status(429)
        .json({ errorCode: 'rate_limited', message: 'Too many tenant mutation requests' });
    };
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ provision, rateLimitMiddleware }),
    });

    const response = await request(app)
      .post('/api/v1/platform/tenant')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`)
      .send(createValidOnboardingPayload());

    expect(response.status).toBe(429);
    expect(response.body.errorCode).toBe('rate_limited');
  });
});
