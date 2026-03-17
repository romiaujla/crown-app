import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { buildApp } from '../../src/app.js';
import {
  createJwtToken,
  superAdminClaims,
  tenantAdminClaims,
  tenantUserClaims,
} from '../helpers/auth-fixtures.js';

describe('platform auth contract', () => {
  const app = buildApp();

  it('allows super_admin on platform route', async () => {
    const response = await request(app)
      .get('/api/v1/platform/ping')
      .set('Authorization', `Bearer ${createJwtToken(superAdminClaims)}`);

    expect(response.status).toBe(200);
    expect(response.body.namespace).toBe('platform');
  });

  it('denies tenant_admin on platform route', async () => {
    const response = await request(app)
      .get('/api/v1/platform/ping')
      .set('Authorization', `Bearer ${createJwtToken(tenantAdminClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
  });

  it('denies tenant_user on platform route', async () => {
    const response = await request(app)
      .get('/api/v1/platform/ping')
      .set('Authorization', `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe('forbidden_role');
  });
});
