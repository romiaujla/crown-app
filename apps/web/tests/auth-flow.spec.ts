import { expect, test, type Page } from '@playwright/test';
import {
  DashboardMetricWindowEnum,
  TenantStatusEnum,
  type DashboardOverviewResponse,
  type TenantDirectoryListResponse,
} from '@crown/types';

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

const buildDashboardOverview = (): DashboardOverviewFixture => ({
  widgets: {
    tenant_summary: {
      total_tenant_count: 5,
      tenant_user_count: 12,
      tenant_status_counts: [
        { status: TenantStatusEnum.ACTIVE, count: 3 },
        { status: TenantStatusEnum.INACTIVE, count: 1 },
        { status: TenantStatusEnum.PROVISIONING, count: 0 },
        { status: TenantStatusEnum.PROVISIONING_FAILED, count: 0 },
        { status: TenantStatusEnum.HARD_DEPROVISIONED, count: 1 },
      ],
      new_tenant_counts: [
        { window: DashboardMetricWindowEnum.WEEK, count: 1 },
        { window: DashboardMetricWindowEnum.MONTH, count: 2 },
        { window: DashboardMetricWindowEnum.YEAR, count: 4 },
      ],
      tenant_growth_rates: [
        { window: DashboardMetricWindowEnum.WEEK, growth_rate_percentage: 100 },
        { window: DashboardMetricWindowEnum.MONTH, growth_rate_percentage: 33.33 },
        { window: DashboardMetricWindowEnum.YEAR, growth_rate_percentage: 50 },
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
      display_name: persona === 'super_admin' ? 'Platform Operator' : 'Northwind User',
      role: persona,
      account_status: 'active',
    },
    role_context: {
      role: persona,
      tenant_id: tenant?.id ?? null,
    },
    tenant,
    target_app: persona === 'super_admin' ? 'platform' : 'tenant',
    routing: {
      status: 'allowed',
      target_app: persona === 'super_admin' ? 'platform' : 'tenant',
      reason_code: null,
    },
  };
};

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
                error_code: 'overview_unavailable',
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
            error_code: 'tenant_directory_unavailable',
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

    if (url.endsWith('/login')) {
      if (!options.loginPersona) {
        await route.fulfill({
          body: JSON.stringify({
            error_code: 'invalid_credentials',
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
          access_token: accessToken,
          claims,
          current_user: currentUser,
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
            error_code: 'unauthenticated',
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
            error_code: 'unauthenticated',
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

  await page.goto('/platform/tenants');
  await page.getByRole('link', { name: /Edit/ }).first().click();

  await expect(page).toHaveURL(/\/platform\/tenants\/northwind-tms\/edit$/);
  await expect(page.getByRole('heading', { name: 'Edit Tenant', level: 3 })).toBeVisible();
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
          access_token: accessToken,
          claims,
          current_user: buildCurrentUser('tenant_user'),
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
