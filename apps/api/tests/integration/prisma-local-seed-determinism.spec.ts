import { describe, expect, it } from 'vitest';

import { runLocalSeed } from '../../prisma/seed.js';
import {
  createExpectedCanonicalSnapshot,
  createSeedTestHarness,
  expectedCanonicalDeterministicLookupFields,
  expectedCanonicalTenantSchemaName,
  expectedCanonicalTenantSlug,
} from '../helpers/local-seed-db.js';

describe('prisma local seed determinism', () => {
  it('preserves stable fixture keys and representative seeded data across reruns', async () => {
    const harness = createSeedTestHarness();

    const firstRun = await runLocalSeed({
      prismaClient: harness.prisma,
      client: harness.client,
    });
    const firstSnapshot = harness.snapshot();

    const secondRun = await runLocalSeed({
      prismaClient: harness.prisma,
      client: harness.client,
    });
    const secondSnapshot = harness.snapshot();

    expect(secondSnapshot).toEqual(firstSnapshot);
    expect(secondRun.deterministicKeys).toEqual(firstRun.deterministicKeys);
    expect(secondRun.tenantSlug).toBe(expectedCanonicalTenantSlug);
    expect(secondRun.schemaName).toBe(expectedCanonicalTenantSchemaName);
    expect(secondRun.deterministicKeys).toEqual(expectedCanonicalDeterministicLookupFields);
    expect(secondSnapshot).toEqual(createExpectedCanonicalSnapshot());
  });
});
