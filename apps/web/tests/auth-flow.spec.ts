import {
  DashboardMetricWindowEnum,
  ManagementSystemTypeCodeEnum,
  RoleCodeEnum,
  TenantStatusEnum,
  type TenantCreateOnboardingSubmissionResponse,
  type DashboardOverviewResponse,
  type TenantCreateReferenceDataResponse,
  type TenantDirectoryListResponse,
} from '@crown/types';
import { expect, test, type Page } from '@playwright/test';

const API_BASE_URL = 'http://localhost:4000';
const ACCESS_TOKEN_STORAGE_KEY = 'crown.auth.access_token';
const createAccessTokenPayload = (persona: Persona, expiresInSeconds = 300) => {
  const tenantId = persona === 'super_admin' ? null : 'tenant-1';
  return {
    sub: `${persona}-user`,
    role: persona,
    tenant_id: tenantId,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
};

const createAccessToken = (persona: Persona, expiresInSeconds = 300) => {
  const payload = createAccessTokenPayload(persona, expiresInSeconds);
  const encodedHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' }), 'utf8').toString(
    'base64url',
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encodedHeader}.${encodedPayload}.sig`;
};

type Persona = 'super_admin' | 'tenant_admin' | 'tenant_user';
type DashboardOverviewFixture = DashboardOverviewResponse;
type TenantDirectoryFixture = TenantDirectoryListResponse;
type TenantCreateFixture = TenantCreateOnboardingSubmissionResponse;

const buildDashboardOverview = (): DashboardOverviewFixture => ({
  widgets: {
    tenantSummary: {
      totalTenantCount: 5,
      tenantUserCount: 12,
      tenantStatusCounts: [
        { status: TenantStatusEnum.ACTIVE, count: 3 },
        { status: TenantStatusEnum.INACTIVE, count: 1 },
        { status: TenantStatusEnum.PROVISIONING, count: 0 },
        { status: TenantStatusEnum.PROVISIONING_FAILED, count: 0 },
        { status: TenantStatusEnum.HARD_DEPROVISIONED, count: 1 },
      ],
      newTenantCounts: [
        { window: DashboardMetricWindowEnum.WEEK, count: 1 },
        { window: DashboardMetricWindowEnum.MONTH, count: 2 },
        { window: DashboardMetricWindowEnum.YEAR, count: 4 },
      ],
      tenantGrowthRates: [
        { window: DashboardMetricWindowEnum.WEEK, growthRatePercentage: 100 },
        { window: DashboardMetricWindowEnum.MONTH, growthRatePercentage: 33.33 },
        { window: DashboardMetricWindowEnum.YEAR, growthRatePercentage: 50 },
      ],
    },
  },
});

const baseTenantDirectoryList = [
  {
    tenantId: 'tenant-1',
    name: 'Northwind TMS',
    slug: 'northwind-tms',
    schemaName: 'tenant_northwind_tms',
    status: TenantStatusEnum.ACTIVE,
    createdAt: '2026-03-01T15:00:00.000Z',
    updatedAt: '2026-03-10T15:00:00.000Z',
  },
  {
    tenantId: 'tenant-2',
    name: 'Atlas Freight',
    slug: 'atlas-freight',
    schemaName: 'tenant_atlas_freight',
    status: TenantStatusEnum.INACTIVE,
    createdAt: '2026-03-02T15:00:00.000Z',
    updatedAt: '2026-03-11T15:00:00.000Z',
  },
  {
    tenantId: 'tenant-3',
    name: 'Summit Logistics',
    slug: 'summit-logistics',
    schemaName: 'tenant_summit_logistics',
    status: TenantStatusEnum.PROVISIONING,
    createdAt: '2026-03-03T15:00:00.000Z',
    updatedAt: '2026-03-12T15:00:00.000Z',
  },
  {
    tenantId: 'tenant-4',
    name: 'Legacy Fleet',
    slug: 'legacy-fleet',
    schemaName: 'tenant_legacy_fleet',
    status: TenantStatusEnum.HARD_DEPROVISIONED,
    createdAt: '2026-03-04T15:00:00.000Z',
    updatedAt: '2026-03-13T15:00:00.000Z',
  },
] as const;

const buildTenantDirectoryResponse = (filters?: {
  name?: string | null;
  status?: TenantStatusEnum | null;
}): TenantDirectoryFixture => {
  const normalizedName = filters?.name?.trim().toLowerCase() ?? null;
  const filteredTenantList = baseTenantDirectoryList.filter((tenant) => {
    const matchesName = normalizedName ? tenant.name.toLowerCase().includes(normalizedName) : true;
    const matchesStatus = filters?.status ? tenant.status === filters.status : true;

    return matchesName && matchesStatus;
  });

  return {
    data: {
      tenantList: filteredTenantList.map((tenant) => ({ ...tenant })),
    },
    meta: {
      totalRecords: filteredTenantList.length,
      filters: {
        name: filters?.name?.trim() || null,
        status: filters?.status ?? null,
      },
    },
  };
};

const buildCurrentUser = (persona: Persona) => {
  const tenant =
    persona === 'super_admin'
      ? null
      : {
          id: 'tenant-1',
          slug: 'northwind',
          name: 'Northwind Operations Workspace',
          role: persona,
        };

  return {
    principal: {
      id: `${persona}-user`,
      email: `${persona}@crown.test`,
      username: persona,
      displayName: persona === 'super_admin' ? 'Platform Operator' : 'Northwind User',
      role: persona,
      accountStatus: 'active',
    },
    roleContext: {
      role: persona,
      tenantId: tenant?.id ?? null,
    },
    tenant,
    targetApp: persona === 'super_admin' ? 'platform' : 'tenant',
    routing: {
      status: 'allowed',
      targetApp: persona === 'super_admin' ? 'platform' : 'tenant',
      reasonCode: null,
    },
  };
};

const knownTenantSlugs: Set<string> = new Set(baseTenantDirectoryList.map((t) => t.slug));
const knownUserEmails = new Set(['existing.user@crown.test']);

const buildReferenceDataResponse = (): TenantCreateReferenceDataResponse => ({
  data: {
    managementSystemTypeList: [
      {
        typeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
        version: '1.0',
        displayName: 'Transportation',
        description: 'Fleet and route management',
        roleOptions: [
          {
            roleCode: RoleCodeEnum.TENANT_ADMIN,
            displayName: 'Tenant Admin',
            description: null,
            isDefault: true,
            isRequired: true,
          },
          {
            roleCode: RoleCodeEnum.DISPATCHER,
            displayName: 'Dispatcher',
            description: null,
            isDefault: true,
            isRequired: false,
          },
          {
            roleCode: RoleCodeEnum.DRIVER,
            displayName: 'Driver',
            description: null,
            isDefault: true,
            isRequired: false,
          },
        ],
      },
      {
        typeCode: ManagementSystemTypeCodeEnum.DEALERSHIP,
        version: '1.0',
        displayName: 'Dealership',
        description: 'Vehicle sales management',
        roleOptions: [
          {
            roleCode: RoleCodeEnum.TENANT_ADMIN,
            displayName: 'Tenant Admin',
            description: null,
            isDefault: true,
            isRequired: true,
          },
        ],
      },
      {
        typeCode: ManagementSystemTypeCodeEnum.INVENTORY,
        version: '1.0',
        displayName: 'Inventory',
        description: 'Stock and warehouse management',
        roleOptions: [
          {
            roleCode: RoleCodeEnum.TENANT_ADMIN,
            displayName: 'Tenant Admin',
            description: null,
            isDefault: true,
            isRequired: true,
          },
        ],
      },
    ],
  },
});

const buildReferenceDataResponseWithSeparateAdminRoles = (): TenantCreateReferenceDataResponse => ({
  data: {
    managementSystemTypeList: [
      {
        typeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
        version: '1.0',
        displayName: 'Transportation',
        description: 'Fleet and route management',
        roleOptions: [
          {
            roleCode: RoleCodeEnum.TENANT_ADMIN,
            displayName: 'Tenant Admin',
            description: 'Tenant shell administrator role.',
            isDefault: true,
            isRequired: true,
          },
          {
            roleCode: RoleCodeEnum.ADMIN,
            displayName: 'Admin',
            description: 'Management-system administrator role inside the tenant workspace.',
            isDefault: true,
            isRequired: false,
          },
          {
            roleCode: RoleCodeEnum.DISPATCHER,
            displayName: 'Dispatcher',
            description: 'Coordinates fleet operations.',
            isDefault: true,
            isRequired: false,
          },
        ],
      },
    ],
  },
});

const buildTenantCreateResponse = (slug = 'acme-logistics'): TenantCreateFixture => ({
  appliedVersions: ['202603150001_initial'],
  managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
  schemaName: `tenant_${slug}`,
  slug,
  status: 'provisioned',
  tenantId: 'tenant-created-1',
});

const setupAuthRoutes = async (
  page: Page,
  options: {
    loginPersona?: Persona | null;
    mePersona?: Persona | null;
    meStatus?: number;
    logoutStatus?: number;
    overviewStatus?: number;
    overviewResponse?: DashboardOverviewFixture;
    tenantDirectoryStatus?: number;
    tenantDirectoryResponse?: TenantDirectoryFixture;
    tenantCreateStatus?: number;
    tenantCreateResponse?: TenantCreateFixture;
    tenantCreateDelayMs?: number;
    referenceDataResponse?: TenantCreateReferenceDataResponse;
  } = {},
) => {
  await page.route(`${API_BASE_URL}/api/v1/**`, async (route) => {
    const request = route.request();
    const url = request.url();

    if (url.endsWith('/platform/dashboard/overview')) {
      await route.fulfill({
        body:
          options.overviewStatus && options.overviewStatus !== 200
            ? JSON.stringify({
                errorCode: 'overview_unavailable',
                message: 'Dashboard overview is unavailable.',
              })
            : JSON.stringify(options.overviewResponse ?? buildDashboardOverview()),
        contentType: 'application/json',
        status: options.overviewStatus ?? 200,
      });
      return;
    }

    if (url.endsWith('/platform/tenants/search')) {
      if (options.tenantDirectoryStatus && options.tenantDirectoryStatus !== 200) {
        await route.fulfill({
          body: JSON.stringify({
            errorCode: 'tenant_directory_unavailable',
            message: 'Tenant directory is unavailable.',
          }),
          contentType: 'application/json',
          status: options.tenantDirectoryStatus,
        });
        return;
      }

      const rawPayload = request.postDataJSON() as {
        filters?: { name?: string; status?: TenantStatusEnum };
      } | null;
      const filters = rawPayload?.filters ?? {};

      await route.fulfill({
        body: JSON.stringify(
          options.tenantDirectoryResponse ??
            buildTenantDirectoryResponse({
              name: filters.name ?? null,
              status: filters.status ?? null,
            }),
        ),
        contentType: 'application/json',
        status: 200,
      });
      return;
    }

    if (url.endsWith('/platform/tenant/slug-availability')) {
      const payload = request.postDataJSON() as { slug?: string } | null;
      const slug = payload?.slug?.trim().toLowerCase() ?? '';
      await route.fulfill({
        body: JSON.stringify({
          data: {
            slug,
            isAvailable: !knownTenantSlugs.has(slug),
          },
        }),
        contentType: 'application/json',
        status: 200,
      });
      return;
    }

    if (url.endsWith('/platform/tenant/user-email-availability')) {
      const payload = request.postDataJSON() as { email?: string } | null;
      const email = payload?.email?.trim().toLowerCase() ?? '';
      await route.fulfill({
        body: JSON.stringify({
          data: {
            email,
            isAvailable: !knownUserEmails.has(email),
          },
        }),
        contentType: 'application/json',
        status: 200,
      });
      return;
    }

    if (url.endsWith('/platform/tenant/reference-data')) {
      await route.fulfill({
        body: JSON.stringify(options.referenceDataResponse ?? buildReferenceDataResponse()),
        contentType: 'application/json',
        status: 200,
      });
      return;
    }

    if (url.endsWith('/platform/tenant')) {
      if (options.tenantCreateDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, options.tenantCreateDelayMs));
      }

      if (options.tenantCreateStatus && options.tenantCreateStatus !== 201) {
        await route.fulfill({
          body: JSON.stringify({
            errorCode: 'tenant_create_failed',
            message: 'Tenant provisioning could not be completed.',
          }),
          contentType: 'application/json',
          status: options.tenantCreateStatus,
        });
        return;
      }

      await route.fulfill({
        body: JSON.stringify(options.tenantCreateResponse ?? buildTenantCreateResponse()),
        contentType: 'application/json',
        status: options.tenantCreateStatus ?? 201,
      });
      return;
    }

    if (url.endsWith('/login')) {
      if (!options.loginPersona) {
        await route.fulfill({
          body: JSON.stringify({
            errorCode: 'invalid_credentials',
            message: 'Invalid username/email or password.',
          }),
          contentType: 'application/json',
          status: 401,
        });
        return;
      }

      const currentUser = buildCurrentUser(options.loginPersona);
      const accessToken = createAccessToken(options.loginPersona);
      const claims = createAccessTokenPayload(options.loginPersona);
      await route.fulfill({
        body: JSON.stringify({
          accessToken: accessToken,
          claims,
          currentUser: currentUser,
        }),
        contentType: 'application/json',
        status: 200,
      });
      return;
    }

    if (url.endsWith('/me')) {
      if (options.meStatus && options.meStatus !== 200) {
        await route.fulfill({
          body: JSON.stringify({
            errorCode: 'unauthenticated',
            message: 'Session is no longer valid.',
          }),
          contentType: 'application/json',
          status: options.meStatus,
        });
        return;
      }

      const persona = options.mePersona ?? options.loginPersona;
      if (!persona) {
        await route.fulfill({
          body: JSON.stringify({
            errorCode: 'unauthenticated',
            message: 'Missing bearer token.',
          }),
          contentType: 'application/json',
          status: 401,
        });
        return;
      }

      await route.fulfill({
        body: JSON.stringify(buildCurrentUser(persona)),
        contentType: 'application/json',
        status: 200,
      });
      return;
    }

    if (url.endsWith('/logout')) {
      await route.fulfill({
        body: '',
        contentType: 'application/json',
        status: options.logoutStatus ?? 204,
      });
      return;
    }

    await route.fallback();
  });
};

const primeAuthenticatedSession = async (page: Page, persona: Persona) => {
  await setupAuthRoutes(page, { mePersona: persona });
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      window.sessionStorage.setItem(key, value);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, value: createAccessToken(persona) },
  );
};

test('login page rejects empty submissions before calling the API', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('Enter your email or username.')).toBeVisible();
  await expect(page.getByText('Enter your password.')).toBeVisible();
});

test('invalid credentials stay on login and show an auth error', async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: null });

  await page.goto('/login');
  await page.getByLabel('Email or username').fill('bad-user');
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('.form-banner')).toContainText('Invalid username/email or password.');
});

test('super-admin login stores the token and routes to the platform shell', async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: 'super_admin' });

  await page.goto('/login');
  await page.getByLabel('Email or username').fill('super_admin');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/platform$/);
  await expect(page.getByRole('heading', { name: 'Dashboard', level: 3 })).toBeVisible();
  expect(
    await page.evaluate((key) => {
      const token = window.sessionStorage.getItem(key);
      return token ? JSON.parse(atob(token.split('.')[1])) : null;
    }, ACCESS_TOKEN_STORAGE_KEY),
  ).toMatchObject({
    role: 'super_admin',
    tenant_id: null,
  });
});

test('tenant login routes to the tenant shell recommended by the API', async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: 'tenant_user' });

  await page.goto('/login');
  await page.getByLabel('Email or username').fill('tenant_user');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/tenant$/);
  await expect(
    page.getByRole('heading', { name: 'Northwind Operations Workspace', level: 1 }),
  ).toBeVisible();
});

test('protected tenant routes restore after login when the destination is valid', async ({
  page,
}) => {
  await setupAuthRoutes(page, { loginPersona: 'tenant_admin' });

  await page.goto('/tenant');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('Email or username').fill('tenant_admin');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/tenant$/);
});

test('tenant admin cannot remain in the control plane after login', async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: 'tenant_admin' });

  await page.goto('/platform');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('Email or username').fill('tenant_admin');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/tenant$/);
  await expect(
    page.getByRole('heading', { name: 'Northwind Operations Workspace', level: 1 }),
  ).toBeVisible();
});

test('invalid return paths fall back to the safe recommended shell', async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: 'tenant_user' });

  await page.goto('/platform');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('Email or username').fill('tenant_user');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/tenant$/);
});

test('manual wrong-shell navigation is corrected for authenticated users', async ({ page }) => {
  await primeAuthenticatedSession(page, 'tenant_user');

  await page.goto('/platform');
  await expect(page).toHaveURL(/\/tenant$/);
  await expect(
    page.getByRole('heading', { name: 'Northwind Operations Workspace', level: 1 }),
  ).toBeVisible();
});

test('super-admin shell renders the required control-plane navigation inventory', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform');

  for (const item of [
    'Dashboard',
    'Tenants',
    'Users',
    'Activity',
    'Settings',
    'System Health',
    'Security',
    'Billing',
    'Audit Log',
  ]) {
    await expect(page.getByRole('link', { name: item })).toBeVisible();
  }

  await expect(page.getByText('Authenticated as')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Open profile menu for Platform Operator' }),
  ).toBeVisible();
  await expect(page.locator('.sidebar-profile__avatar', { hasText: 'PO' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByRole('heading', { name: 'Dashboard', level: 3 })).toBeVisible();
  await expect(page.getByText('Platform footprint')).toBeVisible();
  await expect(page.getByText('Current scale')).toBeVisible();
});

test('platform navigation switches the active section and renders coming-soon placeholders', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform');
  await page.getByRole('link', { name: 'Billing' }).click();

  await expect(page).toHaveURL(/\/platform\?section=billing$/);
  await expect(page.getByRole('link', { name: 'Billing' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: 'Billing Coming Soon', level: 3 })).toBeVisible();
  await expect(
    page
      .getByText('Billing workflows and platform-wide commercial administration will appear here')
      .last(),
  ).toBeVisible();
});

test('tenant navigation routes to a dedicated tenant directory page', async ({ page }) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform');
  await page.getByRole('link', { name: 'Tenants' }).click();

  await expect(page).toHaveURL(/\/platform\/tenants$/);
  await expect(page.getByRole('link', { name: 'Tenants' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: 'Tenant Directory', level: 3 })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Tenant name' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Northwind TMS' })).toBeVisible();
  await expect(page.getByText('Tenants Coming Soon')).toHaveCount(0);
});

test('tenant directory filters tenants by name and explicit persisted status values', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants');

  await expect(page.getByRole('link', { name: 'Northwind TMS' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Atlas Freight' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Summit Logistics' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Legacy Fleet' })).toBeVisible();

  await page.getByLabel('Search tenants by name').fill('north');
  await expect(page.getByRole('link', { name: 'Northwind TMS' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Atlas Freight' })).toHaveCount(0);

  await page.getByLabel('Search tenants by name').fill('');
  await page.getByLabel('Filter tenants by status').click();
  await page.getByRole('option', { name: 'Provisioning', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Summit Logistics' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Northwind TMS' })).toHaveCount(0);

  await page.getByLabel('Filter tenants by status').click();
  await page.getByRole('option', { name: 'Deprovisioned', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Legacy Fleet' })).toBeVisible();
  await expect(page.getByRole('table').getByText('Deprovisioned', { exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: '-', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Summit Logistics' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Edit/ })).toHaveCount(0);

  await page.getByLabel('Search tenants by name').fill('missing');
  await expect(page.getByText('No tenants matched the current filters.')).toBeVisible();
});

test('tenant directory action links route to stable detail, add, and edit entry points', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants');
  await page.getByRole('link', { name: 'Northwind TMS' }).click();

  await expect(page).toHaveURL(/\/platform\/tenants\/northwind-tms$/);
  await expect(
    page.getByRole('heading', { name: 'Tenant Details', level: 3, exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Tenant reference:')).toContainText('northwind-tms');

  await page.goto('/platform/tenants');
  await page.getByRole('link', { name: 'Add new' }).click();

  await expect(page).toHaveURL(/\/platform\/tenants\/new$/);
  await expect(page.getByRole('heading', { name: 'Add Tenant', level: 3 })).toBeVisible();
  await expect(page.getByTestId('tenant-create-stepper')).toBeVisible();

  await page.goto('/platform/tenants');
  await page.getByRole('link', { name: /Edit/ }).first().click();

  await expect(page).toHaveURL(/\/platform\/tenants\/northwind-tms\/edit$/);
  await expect(page.getByRole('heading', { name: 'Edit Tenant', level: 3 })).toBeVisible();
});

test('tenant create shell advances through steps and protects entered progress on cancel', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants/new');

  await expect(page.getByText('Step 1 of 4')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tenant info' })).toBeVisible();
  await expect(
    page.locator('[data-testid="tenant-create-stepper"] [aria-current="step"]'),
  ).toContainText('Step 1/4');
  await expect(
    page.locator('[data-testid="tenant-create-stepper"] [aria-current="step"]'),
  ).toContainText('Tenant info');
  await expect(page.getByRole('button', { name: 'Step 2: Role selection' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back' })).toBeDisabled();

  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await expect(page.getByText('Step 2 of 4')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Role selection' })).toBeVisible();

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Step 3 of 4')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'User assignment' })).toBeVisible();

  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('heading', { name: 'Role selection' })).toBeVisible();

  // Enter data in step 1 to trigger unsaved-changes protection
  await page.getByRole('button', { name: 'Step 1: Tenant info' }).click();
  await page.getByLabel('Tenant name').fill('Northwind expansion workspace');

  await page.getByRole('button', { name: 'Cancel' }).click();
  const dialog = page.getByTestId('confirm-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Discard the tenant setup progress');
  await dialog.getByRole('button', { name: 'Stay' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/\/platform\/tenants\/new$/);

  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Discard' }).click();
  await expect(page).toHaveURL(/\/platform\/tenants$/);
});

test('tenant create step 2 shows role options for selected management system type', async ({
  page,
}) => {
  await setupAuthRoutes(page, {
    mePersona: 'super_admin',
    referenceDataResponse: buildReferenceDataResponseWithSeparateAdminRoles(),
  });
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      window.sessionStorage.setItem(key, value);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, value: createAccessToken('super_admin') },
  );

  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/reference-data') && resp.status() === 200),
    page.goto('/platform/tenants/new'),
  ]);

  await page.getByLabel('Management system type').click();
  await page.getByRole('option', { name: 'Transportation' }).click();

  // Navigate to step 2
  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await expect(page.getByText('Step 2 of 4')).toBeVisible();
  await expect(page.getByTestId('role-selection-list')).toBeVisible();

  // Verify role cards render for Transportation defaults
  await expect(page.getByTestId('role-option-tenant_admin')).toBeVisible();
  await expect(page.getByTestId('role-option-admin')).toBeVisible();
  await expect(page.getByTestId('role-option-dispatcher')).toBeVisible();
  await expect(page.getByTestId('role-selection-admin-guidance')).toContainText(
    'Tenant Admin and Admin are separate roles.',
  );
  await expect(page.getByTestId('role-option-tenant_admin')).toContainText('Bootstrap role');
  await expect(page.getByTestId('role-option-admin')).toContainText('Workspace role');
  await expect(page.getByTestId('role-option-admin')).toContainText(
    'Management-system administrator role inside the tenant workspace.',
  );

  // Verify tenant admin role is checked and locked
  const tenantAdminCheckbox = page.getByRole('checkbox', { name: /Tenant Admin.*required/i });
  await expect(tenantAdminCheckbox).toBeChecked();
  await expect(tenantAdminCheckbox).toBeDisabled();

  // Verify optional roles start checked (isDefault = true)
  const adminCheckbox = page.getByRole('checkbox', { name: 'Admin', exact: true });
  await expect(adminCheckbox).toBeChecked();
  await expect(adminCheckbox).toBeEnabled();

  const dispatcherCheckbox = page.getByRole('checkbox', { name: 'Dispatcher' });
  await expect(dispatcherCheckbox).toBeChecked();
  await expect(dispatcherCheckbox).toBeEnabled();

  // Toggle dispatcher off
  await dispatcherCheckbox.click();
  await expect(dispatcherCheckbox).not.toBeChecked();

  // Navigate back to step 1 and return — toggle state should persist
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('heading', { name: 'Tenant info' })).toBeVisible();
  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await expect(page.getByRole('checkbox', { name: 'Dispatcher' })).not.toBeChecked();

  // Re-select dispatcher
  await page.getByRole('checkbox', { name: 'Dispatcher' }).click();
  await expect(page.getByRole('checkbox', { name: 'Dispatcher' })).toBeChecked();
});

test('tenant create step 2 shows empty state when no management system type selected', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants/new');

  // Navigate to step 2 without selecting a type
  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await expect(page.getByTestId('role-selection-empty-state')).toBeVisible();
  await expect(page.getByText('No roles available')).toBeVisible();
});

test('tenant create step 3 requires a tenant admin before review and preserves assignment rows', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/reference-data') && resp.status() === 200),
    page.goto('/platform/tenants/new'),
  ]);

  await page.getByLabel('Management system type').click();
  await page.getByRole('option', { name: 'Transportation' }).click();

  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await expect(page.getByTestId('role-selection-list')).toBeVisible();

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { name: 'User assignment' })).toBeVisible();
  await expect(page.getByTestId('user-assignment-section-tenant_admin')).toBeVisible();
  await expect(page.getByTestId('user-assignment-section-dispatcher')).toBeVisible();
  await expect(page.getByTestId('user-assignment-section-driver')).toBeVisible();
  await expect(page.getByText('Add users to this role or leave it empty')).toHaveCount(2);

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(
    page
      .getByTestId('user-assignment-section-tenant_admin')
      .getByText('At least one tenant admin is required')
      .last(),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'User assignment' })).toBeVisible();

  const adminRow = page.getByTestId('user-assignment-row-tenant_admin-0');
  const emailAvailabilityResponse = page.waitForResponse(
    (resp) =>
      resp.url().includes('/platform/tenant/user-email-availability') && resp.status() === 200,
  );
  await adminRow.getByLabel('Display name').fill('Alex Admin');
  await adminRow.getByLabel('Username').fill('alex_admin');
  await adminRow.getByLabel('Email').fill('alex.admin@crown.test');
  await emailAvailabilityResponse;
  await expect(page.getByTestId('user-assignment-row-tenant_admin-1')).toBeVisible();

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible();

  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('heading', { name: 'User assignment' })).toBeVisible();
  await expect(adminRow.locator('input[value="Alex Admin"]')).toBeVisible();
  await expect(adminRow.locator('input[value="alex_admin"]')).toBeVisible();
  await expect(adminRow.locator('input[value="alex.admin@crown.test"]')).toBeVisible();
});

test('tenant create step 3 validates duplicate emails and clears assignments after upstream reset', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/reference-data') && resp.status() === 200),
    page.goto('/platform/tenants/new'),
  ]);

  await page.getByLabel('Management system type').click();
  await page.getByRole('option', { name: 'Transportation' }).click();

  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { name: 'User assignment' })).toBeVisible();

  const adminRow = page.getByTestId('user-assignment-row-tenant_admin-0');
  await adminRow.getByLabel('Display name').fill('Alex Admin');
  await adminRow.getByLabel('Username').fill('alex_admin');
  await adminRow.getByLabel('Email').fill('shared@crown.test');

  const dispatcherRow = page.getByTestId('user-assignment-row-dispatcher-0');
  await dispatcherRow.getByLabel('Display name').fill('Drew Dispatcher');
  await dispatcherRow.getByLabel('Username').fill('drew_dispatcher');
  await dispatcherRow.getByLabel('Email').fill('shared@crown.test');

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Admins cannot be assigned to roles')).toHaveCount(2);

  await page.getByRole('button', { name: 'Step 1: Tenant info' }).click();
  await expect(page.getByRole('heading', { name: 'Tenant info' })).toBeVisible();
  await page.getByLabel('Management system type').click();
  await page.getByRole('option', { name: 'Dealership' }).click();
  const dialog = page.getByTestId('confirm-dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Continue' }).click();
  await expect(dialog).not.toBeVisible();

  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await expect(page.getByTestId('role-option-tenant_admin')).toBeVisible();
  await expect(page.getByTestId('role-option-dispatcher')).toHaveCount(0);

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { name: 'User assignment' })).toBeVisible();
  await expect(page.getByTestId('user-assignment-section-tenant_admin')).toBeVisible();
  await expect(page.getByTestId('user-assignment-section-dispatcher')).toHaveCount(0);
  await expect(page.locator('input[value="shared@crown.test"]')).toHaveCount(0);
});

test('tenant create step 3 auto-generates usernames until a manual edit is made', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/reference-data') && resp.status() === 200),
    page.goto('/platform/tenants/new'),
  ]);

  await page.getByLabel('Management system type').click();
  await page.getByRole('option', { name: 'Transportation' }).click();

  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  const adminRow = page.getByTestId('user-assignment-row-tenant_admin-0');
  const usernameInput = adminRow.getByLabel('Username');

  await adminRow.getByLabel('Display name').fill('Jane Doe');
  await expect(usernameInput).toHaveValue('jane_doe');

  await usernameInput.fill('custom_admin');
  await adminRow.getByLabel('Display name').fill('Jane Changed');

  await expect(usernameInput).toHaveValue('custom_admin');
});

test('tenant create step 3 blocks existing system emails returned by the availability service', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants/new');

  const refDataResponse = page.waitForResponse(
    (resp) => resp.url().includes('/reference-data') && resp.status() === 200,
  );
  await refDataResponse;

  await page.getByLabel('Management system type').click();
  await page.getByRole('option', { name: 'Transportation' }).click();

  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  const adminRow = page.getByTestId('user-assignment-row-tenant_admin-0');
  const emailAvailabilityResponse = page.waitForResponse(
    (resp) =>
      resp.url().includes('/platform/tenant/user-email-availability') && resp.status() === 200,
  );

  await adminRow.getByLabel('Display name').fill('Existing User');
  await adminRow.getByLabel('Username').fill('existing_user');
  await adminRow.getByLabel('Email').fill('existing.user@crown.test');
  await emailAvailabilityResponse;

  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByText('This email already exists in the system')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'User assignment' })).toBeVisible();
});

test('tenant create step 4 summarizes the latest draft data in a read-only review', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants/new');

  await page.getByLabel('Tenant name').fill('Acme Logistics');
  const slugResponse = page.waitForResponse(
    (resp) => resp.url().includes('/slug-availability') && resp.status() === 200,
  );
  await slugResponse;

  await page.getByLabel('Management system type').click();
  await page.getByRole('option', { name: 'Transportation' }).click();

  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  const adminRow = page.getByTestId('user-assignment-row-tenant_admin-0');
  const adminEmailResponse = page.waitForResponse(
    (resp) =>
      resp.url().includes('/platform/tenant/user-email-availability') && resp.status() === 200,
  );
  await adminRow.getByLabel('Display name').fill('Alex Admin');
  await adminRow.getByLabel('Username').fill('alex_admin');
  await adminRow.getByLabel('Email').fill('alex.admin@crown.test');
  await adminEmailResponse;

  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible();
  await expect(page.getByTestId('review-tenant-info')).toContainText('Acme Logistics');
  await expect(page.getByTestId('review-tenant-info')).toContainText('acme-logistics');
  await expect(page.getByTestId('review-role-tenant_admin')).toContainText('Enabled');
  await expect(page.getByTestId('review-role-dispatcher')).toContainText('Enabled');
  await expect(page.getByTestId('review-role-driver')).toContainText('Enabled');
  await expect(page.getByTestId('review-tenant-admins-table')).toContainText('Alex Admin');
  await expect(page.getByTestId('review-role-warning')).toContainText(
    'Some roles do not have assigned users',
  );
  await expect(page.getByTestId('review-assignment-table-dispatcher-empty')).toContainText(
    '[No users assigned]',
  );
});

test('tenant create step 4 submits the onboarding payload and routes to tenant details on success', async ({
  page,
}) => {
  await setupAuthRoutes(page, {
    mePersona: 'super_admin',
    tenantCreateDelayMs: 250,
    tenantCreateResponse: buildTenantCreateResponse('acme-logistics'),
  });
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      window.sessionStorage.setItem(key, value);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, value: createAccessToken('super_admin') },
  );

  await page.goto('/platform/tenants/new');
  await page.getByLabel('Tenant name').fill('Acme Logistics');
  const slugResponse = page.waitForResponse(
    (resp) => resp.url().includes('/slug-availability') && resp.status() === 200,
  );
  await slugResponse;

  await page.getByLabel('Management system type').click();
  await page.getByRole('option', { name: 'Transportation' }).click();
  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  const adminRow = page.getByTestId('user-assignment-row-tenant_admin-0');
  const adminEmailResponse = page.waitForResponse(
    (resp) =>
      resp.url().includes('/platform/tenant/user-email-availability') && resp.status() === 200,
  );
  await adminRow.getByLabel('Display name').fill('Alex Admin');
  await adminRow.getByLabel('Username').fill('alex_admin');
  await adminRow.getByLabel('Email').fill('alex.admin@crown.test');
  await adminEmailResponse;

  await page.getByRole('button', { name: 'Next' }).click();

  const tenantCreateRequest = page.waitForRequest((request) => {
    if (!request.url().includes('/platform/tenant') || request.method() !== 'POST') {
      return false;
    }

    const payload = request.postDataJSON() as {
      initialUsers?: Array<{ roleCode?: string }>;
      selectedRoleCodes?: string[];
    } | null;

    return (
      payload?.selectedRoleCodes?.includes('tenant_admin') === true &&
      payload.initialUsers?.some((initialUser) => initialUser.roleCode === 'tenant_admin') === true
    );
  });
  const createResponse = page.waitForResponse(
    (resp) => resp.url().includes('/platform/tenant') && resp.status() === 201,
  );
  await page.getByRole('button', { name: 'Create tenant' }).click();
  await tenantCreateRequest;

  await expect(page.getByRole('button', { name: 'Creating tenant' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Back' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  await createResponse;

  await expect(page).toHaveURL(/\/platform\/tenants\/acme-logistics$/);
  await expect(page.getByText('Tenant details coming soon')).toBeVisible();
  await expect(page.getByText('Tenant reference:')).toBeVisible();
  await expect(page.getByText('acme-logistics', { exact: true })).toBeVisible();
});

test('tenant create step 4 keeps draft state and allows retry-safe recovery after create failure', async ({
  page,
}) => {
  await setupAuthRoutes(page, {
    mePersona: 'super_admin',
    tenantCreateStatus: 409,
  });
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      window.sessionStorage.setItem(key, value);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, value: createAccessToken('super_admin') },
  );

  await page.goto('/platform/tenants/new');
  await page.getByLabel('Tenant name').fill('Acme Logistics');
  const slugResponse = page.waitForResponse(
    (resp) => resp.url().includes('/slug-availability') && resp.status() === 200,
  );
  await slugResponse;

  await page.getByLabel('Management system type').click();
  await page.getByRole('option', { name: 'Transportation' }).click();
  await page.getByRole('button', { name: 'Step 2: Role selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  const adminRow = page.getByTestId('user-assignment-row-tenant_admin-0');
  const adminEmailResponse = page.waitForResponse(
    (resp) =>
      resp.url().includes('/platform/tenant/user-email-availability') && resp.status() === 200,
  );
  await adminRow.getByLabel('Display name').fill('Alex Admin');
  await adminRow.getByLabel('Username').fill('alex_admin');
  await adminRow.getByLabel('Email').fill('alex.admin@crown.test');
  await adminEmailResponse;

  await page.getByRole('button', { name: 'Next' }).click();

  const createResponse = page.waitForResponse(
    (resp) => resp.url().includes('/platform/tenant') && resp.status() === 409,
  );
  await page.getByRole('button', { name: 'Create tenant' }).click();
  await createResponse;

  await expect(page.getByTestId('review-submit-error')).toContainText(
    'Tenant provisioning could not be completed.',
  );
  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible();

  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('heading', { name: 'User assignment' })).toBeVisible();
  await expect(adminRow.locator('input[value="Alex Admin"]')).toBeVisible();
  await expect(adminRow.locator('input[value="alex_admin"]')).toBeVisible();
  await expect(adminRow.locator('input[value="alex.admin@crown.test"]')).toBeVisible();
});

test('tenant create shell allows clean cancel when no step data has been entered', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants/new');
  await page.getByRole('button', { name: 'Cancel' }).click();

  await expect(page).toHaveURL(/\/platform\/tenants$/);
});

test('tenant create step 1 shows slug immutability warning and real form fields', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants/new');

  await expect(page.getByTestId('slug-immutability-warning')).toContainText(
    'The tenant slug cannot be changed after creation',
  );
  await expect(page.getByLabel('Tenant name')).toBeVisible();
  await expect(page.getByLabel('Tenant slug')).toBeVisible();
  await expect(page.getByLabel('Management system type')).toBeVisible();
});

test('tenant create step 1 auto-derives slug from name and checks availability', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants/new');

  await page.getByLabel('Tenant name').fill('Acme Logistics');

  await expect(page.getByLabel('Tenant slug')).toHaveValue('acme-logistics');

  const slugResponse = page.waitForResponse(
    (resp) => resp.url().includes('/slug-availability') && resp.status() === 200,
  );
  await slugResponse;

  await expect(page.getByLabel('Slug is available')).toBeVisible();
});

test('tenant create step 1 shows taken indicator for existing slug', async ({ page }) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants/new');

  await page.getByLabel('Tenant slug').fill('northwind-tms');

  const slugResponse = page.waitForResponse(
    (resp) => resp.url().includes('/slug-availability') && resp.status() === 200,
  );
  await slugResponse;

  await expect(page.getByLabel('Slug is already taken')).toBeVisible();
});

test('tenant create step 1 populates management system type from reference data', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants/new');

  const refDataResponse = page.waitForResponse(
    (resp) => resp.url().includes('/reference-data') && resp.status() === 200,
  );
  await refDataResponse;

  await page.getByLabel('Management system type').click();
  await expect(page.getByRole('option', { name: 'Transportation' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Dealership' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Inventory' })).toBeVisible();

  await page.getByRole('option', { name: 'Transportation' }).click();
  await expect(page.getByLabel('Management system type')).toContainText('Transportation');
});

test('tenant create step 1 triggers discard warning when name is entered then cancel', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform/tenants/new');

  await page.getByLabel('Tenant name').fill('Test Tenant');

  await page.getByRole('button', { name: 'Cancel' }).click();
  const discardDialog = page.getByTestId('confirm-dialog');
  await expect(discardDialog).toBeVisible();
  await expect(discardDialog).toContainText('Discard the tenant setup progress');
  await discardDialog.getByRole('button', { name: 'Discard' }).click();
  await expect(page).toHaveURL(/\/platform\/tenants$/);
});

test('tenant directory shows a contained error state when the directory API fails', async ({
  page,
}) => {
  await setupAuthRoutes(page, { mePersona: 'super_admin', tenantDirectoryStatus: 500 });
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      window.sessionStorage.setItem(key, value);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, value: createAccessToken('super_admin') },
  );

  await page.goto('/platform/tenants');

  await expect(page.getByText('Directory unavailable')).toBeVisible();
  await expect(
    page.getByText(
      'Tenant directory is unavailable right now. Try refreshing once the platform API is reachable.',
    ),
  ).toBeVisible();
});

test('platform dashboard renders the live metric cards from the overview widget', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform');

  await expect(page.getByText('Platform footprint')).toBeVisible();
  await expect(page.getByText('5 tenants')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Total users' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'New tenants' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tenant growth rate' })).toBeVisible();
  await expect(page.getByText('12', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Week' }).first()).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(
    page
      .getByRole('heading', { name: 'New tenants' })
      .locator('..')
      .getByText('1', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Trailing window count based on the past 7 days.')).toBeVisible();
  await expect(page.getByText('100%', { exact: true })).toBeVisible();
  await expect(page.getByTestId('platform-footprint-kpi-label-active')).toBeVisible();
  await expect(page.getByTestId('platform-footprint-kpi-label-inactive')).toBeVisible();
  await expect(page.getByTestId('platform-footprint-kpi-label-provisioning')).toBeVisible();
  await expect(page.getByTestId('platform-footprint-kpi-label-provisioning_failed')).toBeVisible();
  await expect(page.getByTestId('platform-footprint-kpi-label-hard_deprovisioned')).toBeVisible();
});

test('platform footprint keeps all five dashboard KPIs on one row for desktop and stacks them on mobile', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  const getTopOffsets = async () => {
    const kpiCards = page.getByTestId('platform-footprint-kpi-card');
    await expect(kpiCards).toHaveCount(5);

    return kpiCards.evaluateAll((elements) =>
      elements.map((element) => (element as HTMLElement).offsetTop),
    );
  };

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/platform');
  const desktopTopOffsets = await getTopOffsets();
  const firstDesktopTop = desktopTopOffsets[0];
  expect(firstDesktopTop).toBeDefined();
  for (const topOffset of desktopTopOffsets) {
    expect(topOffset).toBe(firstDesktopTop);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/platform');
  const mobileTopOffsets = await getTopOffsets();
  expect(new Set(mobileTopOffsets).size).toBeGreaterThan(1);
});

test('platform footprint KPI labels stay non-interactive when they fit within their cards', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/platform');
  await expect(page.getByTestId('platform-footprint-kpi-label-active')).not.toHaveAttribute(
    'title',
    /.+/,
  );
});

test('platform footprint KPI labels reveal full text for long statuses', async ({ page }) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/platform');

  const desktopInteractiveLabel = page.getByRole('button', { name: 'PROVISIONING FAILED' });
  await expect(desktopInteractiveLabel).toBeVisible();
  await expect(desktopInteractiveLabel).toHaveAttribute('title', 'PROVISIONING FAILED');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/platform');

  const mobileInteractiveLabel = page.getByRole('button', { name: 'PROVISIONING FAILED' });
  await expect(mobileInteractiveLabel).toBeVisible();
  await mobileInteractiveLabel.click();
  await expect(
    page.locator('[data-testid^="platform-footprint-kpi-popover-"]').first(),
  ).toBeVisible();
});

test('platform dashboard window chips switch one selected value at a time', async ({ page }) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform');

  const chipButtons = page.getByRole('button', { name: 'Month' });

  await chipButtons.nth(0).click();
  await expect(chipButtons.nth(0)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('2', { exact: true })).toBeVisible();
  await expect(page.getByText('Trailing window count based on the past 30 days.')).toBeVisible();

  await chipButtons.nth(1).click();
  await expect(chipButtons.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('33.33%', { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      'Tenant growth across the past 30 days compared with the previous window of the same length.',
    ),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Week' }).nth(1)).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

test('platform profile entry opens a compact menu with identity details', async ({ page }) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform');
  await page.getByRole('button', { name: 'Open profile menu for Platform Operator' }).click();

  const profileMenu = page.getByRole('menu');

  await expect(profileMenu.getByText('Signed in as')).toBeVisible();
  await expect(profileMenu.getByText('Platform Operator')).toBeVisible();
  await expect(profileMenu.getByText('Super Admin')).toBeVisible();

  await page.getByRole('button', { name: 'Open profile menu for Platform Operator' }).click();
  await expect(page.getByText('Signed in as')).toHaveCount(0);
});

test('platform shell collapses to icon-only navigation on iPad-sized layouts and exposes tooltips', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'super_admin');
  await page.setViewportSize({ width: 1024, height: 900 });

  await page.goto('/platform');

  await expect(page.locator('.sidebar-nav__label', { hasText: 'Dashboard' })).toBeHidden();
  await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('title', 'Dashboard');
  await expect(page.getByText('5 tenants')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Total users' })).toBeVisible();

  const billingLink = page.getByRole('link', { name: 'Billing' });
  await billingLink.hover();

  await expect(page.locator('[role="tooltip"]', { hasText: 'Billing' }).first()).toBeVisible();
});

test('platform dashboard shows a contained error state when overview data fails to load', async ({
  page,
}) => {
  await setupAuthRoutes(page, { mePersona: 'super_admin', overviewStatus: 500 });
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      window.sessionStorage.setItem(key, value);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, value: createAccessToken('super_admin') },
  );

  await page.goto('/platform');

  await expect(page.getByText('Dashboard overview unavailable')).toBeVisible();
  await expect(
    page.getByText(
      'Dashboard overview is unavailable right now. Try refreshing once the platform API is reachable.',
    ),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('logout clears the browser token and returns to the login page', async ({ page }) => {
  await primeAuthenticatedSession(page, 'super_admin');

  await page.goto('/platform');
  await page.getByRole('button', { name: 'Open profile menu for Platform Operator' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();

  await expect(page).toHaveURL(/\/login$/);
  expect(
    await page.evaluate((key) => window.sessionStorage.getItem(key), ACCESS_TOKEN_STORAGE_KEY),
  ).toBeNull();
});

test('tenant admin logout clears the browser token and returns to the login page', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'tenant_admin');

  await page.goto('/tenant');
  await page.getByRole('button', { name: 'Log out' }).click();

  await expect(page).toHaveURL(/\/login$/);
  expect(
    await page.evaluate((key) => window.sessionStorage.getItem(key), ACCESS_TOKEN_STORAGE_KEY),
  ).toBeNull();
});

test('tenant user logout clears the browser token and returns to the login page', async ({
  page,
}) => {
  await primeAuthenticatedSession(page, 'tenant_user');

  await page.goto('/tenant');
  await page.getByRole('button', { name: 'Log out' }).click();

  await expect(page).toHaveURL(/\/login$/);
  expect(
    await page.evaluate((key) => window.sessionStorage.getItem(key), ACCESS_TOKEN_STORAGE_KEY),
  ).toBeNull();
});

test('expired sessions redirect to login with a recovery message', async ({ page }) => {
  await setupAuthRoutes(page, { mePersona: 'tenant_user', meStatus: 401 });
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      window.sessionStorage.setItem(key, value);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, value: createAccessToken('tenant_user', -1) },
  );

  await page.goto('/tenant');
  await expect(page).toHaveURL(/\/login(?:\?reason=session-expired)?$/);
  await expect(page.locator('.form-banner')).toContainText(
    'Your session expired. Sign in again to continue.',
  );
  expect(
    await page.evaluate((key) => window.sessionStorage.getItem(key), ACCESS_TOKEN_STORAGE_KEY),
  ).toBeNull();
});

test('session expiry warning appears before timed logout and redirects to login', async ({
  page,
}) => {
  const accessToken = createAccessToken('tenant_user', 2);
  const claims = createAccessTokenPayload('tenant_user', 2);
  await page.route(`${API_BASE_URL}/api/v1/auth/**`, async (route) => {
    const request = route.request();
    const url = request.url();

    if (url.endsWith('/login')) {
      await route.fulfill({
        body: JSON.stringify({
          accessToken: accessToken,
          claims,
          currentUser: buildCurrentUser('tenant_user'),
        }),
        contentType: 'application/json',
        status: 200,
      });
      return;
    }

    if (url.endsWith('/me')) {
      await route.fulfill({
        body: JSON.stringify(buildCurrentUser('tenant_user')),
        contentType: 'application/json',
        status: 200,
      });
      return;
    }

    if (url.endsWith('/logout')) {
      await route.fulfill({
        body: '',
        contentType: 'application/json',
        status: 204,
      });
      return;
    }

    await route.fallback();
  });

  await page.goto('/login');
  await page.getByLabel('Email or username').fill('tenant_user');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('Your session is about to expire')).toBeVisible();
  await expect(page.getByText(/Signing out in/i)).toBeVisible();
  await expect(page.locator('.form-banner')).toContainText(
    'Your session expired. Sign in again to continue.',
    {
      timeout: 5000,
    },
  );
  await expect(page).toHaveURL(/\/login\?reason=session-expired$/, { timeout: 5000 });
});
