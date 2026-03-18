import { describe, expect, it } from 'vitest';

import { authDocsDocument } from '../../src/docs/openapi.js';

describe('api docs openapi document', () => {
  it('documents the auth-bearing route surface', () => {
    expect(Object.keys(authDocsDocument.paths)).toEqual(
      expect.arrayContaining([
        '/api/v1/auth/login',
        '/api/v1/auth/me',
        '/api/v1/auth/logout',
        '/api/v1/platform/ping',
        '/api/v1/platform/tenant/slug-availability',
        '/api/v1/platform/tenant/reference-data',
        '/api/v1/platform/tenants/search',
        '/api/v1/tenant/access',
        '/api/v1/platform/tenant',
      ]),
    );
  });

  it('marks protected routes with bearer auth', () => {
    expect(authDocsDocument.paths['/api/v1/auth/me'].get.security).toEqual([{ bearerAuth: [] }]);
    expect(authDocsDocument.paths['/api/v1/platform/ping'].get.security).toEqual([
      { bearerAuth: [] },
    ]);
    expect(
      authDocsDocument.paths['/api/v1/platform/tenant/slug-availability'].post.security,
    ).toEqual([{ bearerAuth: [] }]);
    expect(authDocsDocument.paths['/api/v1/platform/tenant/reference-data'].post.security).toEqual([
      { bearerAuth: [] },
    ]);
    expect(authDocsDocument.paths['/api/v1/platform/tenants/search'].post.security).toEqual([
      { bearerAuth: [] },
    ]);
    expect(authDocsDocument.paths['/api/v1/tenant/access'].post.security).toEqual([
      { bearerAuth: [] },
    ]);
    expect(authDocsDocument.paths['/api/v1/platform/tenant'].post.security).toEqual([
      { bearerAuth: [] },
    ]);
  });

  it('documents the login request payload and current-user response', () => {
    const loginSchema =
      authDocsDocument.paths['/api/v1/auth/login'].post.requestBody.content['application/json']
        .schema;
    const currentUserSchema =
      authDocsDocument.paths['/api/v1/auth/me'].get.responses['200'].content['application/json']
        .schema;
    const currentUserForbidden =
      authDocsDocument.paths['/api/v1/auth/me'].get.responses['403'].content['application/json']
        .schema;

    expect(loginSchema).toEqual({ $ref: '#/components/schemas/LoginRequest' });
    expect(currentUserSchema).toEqual({ $ref: '#/components/schemas/CurrentUserResponse' });
    expect(currentUserForbidden).toEqual({ $ref: '#/components/schemas/ErrorResponse' });
  });

  it('documents the tenant-create reference-data request payload', () => {
    const referenceDataSchema =
      authDocsDocument.paths['/api/v1/platform/tenant/reference-data'].post.requestBody.content[
        'application/json'
      ].schema;

    expect(referenceDataSchema).toEqual({
      $ref: '#/components/schemas/TenantCreateReferenceDataRequest',
    });
  });

  it('documents the tenant slug availability request payload', () => {
    const slugAvailabilitySchema =
      authDocsDocument.paths['/api/v1/platform/tenant/slug-availability'].post.requestBody.content[
        'application/json'
      ].schema;

    expect(slugAvailabilitySchema).toEqual({
      $ref: '#/components/schemas/TenantSlugAvailabilityRequest',
    });
  });

  it('documents the tenant onboarding submission request payload', () => {
    const onboardingSchema =
      authDocsDocument.paths['/api/v1/platform/tenant'].post.requestBody.content['application/json']
        .schema;

    expect(onboardingSchema).toEqual({
      $ref: '#/components/schemas/TenantCreateOnboardingSubmissionRequest',
    });
  });

  it('does not include a raw openapi json route in the document', () => {
    expect('/api/v1/openapi.json' in authDocsDocument.paths).toBe(false);
  });
});
