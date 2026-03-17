import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { buildApp } from '../../src/app.js';
import { createJwtToken, tenantUserClaims } from '../helpers/auth-fixtures.js';

describe('tenant user rbac integration', () => {
  const app = buildApp();

  it('allows tenant-user auth class on matching tenant', async () => {
    const response = await request(app)
      .post('/api/v1/tenant/access')
      .send({ authClass: 'tenant_user', tenantId: tenantUserClaims.tenant_id })
      .set('Authorization', `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, namespace: 'tenant-user' });
  });

  it('denies tenant mismatch for tenant-user auth class', async () => {
    const response = await request(app)
      .post('/api/v1/tenant/access')
      .send({ authClass: 'tenant_user', tenantId: 'tenant-other' })
      .set('Authorization', `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe('forbidden_tenant');
  });

  it('denies tenant-user escalation to tenant-admin auth class', async () => {
    const response = await request(app)
      .post('/api/v1/tenant/access')
      .send({ authClass: 'tenant_admin', tenantId: tenantUserClaims.tenant_id })
      .set('Authorization', `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe('forbidden_role');
  });

  it('denies malformed claims', async () => {
    const malformed = Buffer.from(
      JSON.stringify({ sub: 'user', role: 'tenant_user' }),
      'utf8',
    ).toString('base64url');
    const token = `${Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' }), 'utf8').toString('base64url')}.${malformed}.sig`;

    const response = await request(app)
      .post('/api/v1/tenant/access')
      .send({ authClass: 'tenant_user', tenantId: tenantUserClaims.tenant_id })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe('invalid_claims');
  });
});
