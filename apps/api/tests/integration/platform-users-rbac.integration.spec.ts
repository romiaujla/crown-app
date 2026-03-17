import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { buildApp } from '../../src/app.js';
import { createJwtToken, tenantAdminClaims, tenantUserClaims } from '../helpers/auth-fixtures.js';

describe('platform users rbac integration', () => {
  const app = buildApp();

  it('denies tenant_admin from searching platform users', async () => {
    const response = await request(app)
      .post('/api/v1/platform/users/search')
      .set('Authorization', `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send({ filters: {} });

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
  });

  it('denies tenant_user from searching platform users', async () => {
    const response = await request(app)
      .post('/api/v1/platform/users/search')
      .set('Authorization', `Bearer ${createJwtToken(tenantUserClaims)}`)
      .send({ filters: {} });

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
  });

  it('denies tenant_admin from viewing platform user detail', async () => {
    const response = await request(app)
      .post('/api/v1/platform/user')
      .set('Authorization', `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send({ userId: 'user-123' });

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
  });

  it('denies tenant_user from creating tenant membership', async () => {
    const response = await request(app)
      .post('/api/v1/platform/tenant/membership')
      .set('Authorization', `Bearer ${createJwtToken(tenantUserClaims)}`)
      .send({ userId: 'u-1', tenantId: 't-1', roleCode: 'tenant_admin' });

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
  });

  it('rejects unauthenticated requests', async () => {
    const response = await request(app).post('/api/v1/platform/users/search').send({ filters: {} });

    expect(response.status).toBe(401);
  });
});
