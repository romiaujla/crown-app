import { expect, test, type Page } from "@playwright/test";

const API_BASE_URL = "http://localhost:4000";
const ACCESS_TOKEN_STORAGE_KEY = "crown.auth.access_token";
const createAccessTokenPayload = (persona: Persona, expiresInSeconds = 300) => {
  const tenantId = persona === "super_admin" ? null : "tenant-1";
  return {
    sub: `${persona}-user`,
    role: persona,
    tenant_id: tenantId,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds
  };
};

const createAccessToken = (persona: Persona, expiresInSeconds = 300) => {
  const payload = createAccessTokenPayload(persona, expiresInSeconds);
  const encodedHeader = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" }), "utf8").toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encodedHeader}.${encodedPayload}.sig`;
};

type Persona = "super_admin" | "tenant_admin" | "tenant_user";
type DashboardOverviewFixture = {
  widgets: {
    tenant_summary: {
      total_tenant_count: number;
      tenant_user_count: number;
      tenant_status_counts: Array<{
        status: "active" | "inactive" | "provisioning" | "provisioning_failed";
        count: number;
      }>;
      new_tenant_counts: Array<{
        window: "week" | "month" | "year";
        count: number;
      }>;
      tenant_growth_rates: Array<{
        window: "week" | "month" | "year";
        growth_rate_percentage: number;
      }>;
    };
  };
};

const buildDashboardOverview = (): DashboardOverviewFixture => ({
  widgets: {
    tenant_summary: {
      total_tenant_count: 4,
      tenant_user_count: 12,
      tenant_status_counts: [
        { status: "active", count: 3 },
        { status: "inactive", count: 1 },
        { status: "provisioning", count: 0 },
        { status: "provisioning_failed", count: 0 }
      ],
      new_tenant_counts: [
        { window: "week", count: 1 },
        { window: "month", count: 2 },
        { window: "year", count: 4 }
      ],
      tenant_growth_rates: [
        { window: "week", growth_rate_percentage: 100 },
        { window: "month", growth_rate_percentage: 33.33 },
        { window: "year", growth_rate_percentage: 50 }
      ]
    }
  }
});

const buildCurrentUser = (persona: Persona) => {
  const tenant =
    persona === "super_admin"
      ? null
      : {
          id: "tenant-1",
          slug: "northwind",
          name: "Northwind Operations Workspace",
          role: persona
        };

  return {
    principal: {
      id: `${persona}-user`,
      email: `${persona}@crown.test`,
      username: persona,
      display_name: persona === "super_admin" ? "Platform Operator" : "Northwind User",
      role: persona,
      account_status: "active"
    },
    role_context: {
      role: persona,
      tenant_id: tenant?.id ?? null
    },
    tenant,
    target_app: persona === "super_admin" ? "platform" : "tenant",
    routing: {
      status: "allowed",
      target_app: persona === "super_admin" ? "platform" : "tenant",
      reason_code: null
    }
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
  } = {}
) => {
  await page.route(`${API_BASE_URL}/api/v1/**`, async (route) => {
    const request = route.request();
    const url = request.url();

    if (url.endsWith("/platform/dashboard/overview")) {
      await route.fulfill({
        body:
          options.overviewStatus && options.overviewStatus !== 200
            ? JSON.stringify({
                error_code: "overview_unavailable",
                message: "Dashboard overview is unavailable."
              })
            : JSON.stringify(options.overviewResponse ?? buildDashboardOverview()),
        contentType: "application/json",
        status: options.overviewStatus ?? 200
      });
      return;
    }

    if (url.endsWith("/login")) {
      if (!options.loginPersona) {
        await route.fulfill({
          body: JSON.stringify({
            error_code: "invalid_credentials",
            message: "Invalid username/email or password."
          }),
          contentType: "application/json",
          status: 401
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
          current_user: currentUser
        }),
        contentType: "application/json",
        status: 200
      });
      return;
    }

    if (url.endsWith("/me")) {
      if (options.meStatus && options.meStatus !== 200) {
        await route.fulfill({
          body: JSON.stringify({
            error_code: "unauthenticated",
            message: "Session is no longer valid."
          }),
          contentType: "application/json",
          status: options.meStatus
        });
        return;
      }

      const persona = options.mePersona ?? options.loginPersona;
      if (!persona) {
        await route.fulfill({
          body: JSON.stringify({
            error_code: "unauthenticated",
            message: "Missing bearer token."
          }),
          contentType: "application/json",
          status: 401
        });
        return;
      }

      await route.fulfill({
        body: JSON.stringify(buildCurrentUser(persona)),
        contentType: "application/json",
        status: 200
      });
      return;
    }

    if (url.endsWith("/logout")) {
      await route.fulfill({
        body: "",
        contentType: "application/json",
        status: options.logoutStatus ?? 204
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
    { key: ACCESS_TOKEN_STORAGE_KEY, value: createAccessToken(persona) }
  );
};

test("login page rejects empty submissions before calling the API", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Enter your email or username.")).toBeVisible();
  await expect(page.getByText("Enter your password.")).toBeVisible();
});

test("invalid credentials stay on login and show an auth error", async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: null });

  await page.goto("/login");
  await page.getByLabel("Email or username").fill("bad-user");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator(".form-banner")).toContainText("Invalid username/email or password.");
});

test("super-admin login stores the token and routes to the platform shell", async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: "super_admin" });

  await page.goto("/login");
  await page.getByLabel("Email or username").fill("super_admin");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/platform$/);
  await expect(page.getByRole("heading", { name: "Dashboard", level: 3 })).toBeVisible();
  expect(
    await page.evaluate((key) => {
      const token = window.sessionStorage.getItem(key);
      return token ? JSON.parse(atob(token.split(".")[1])) : null;
    }, ACCESS_TOKEN_STORAGE_KEY)
  ).toMatchObject({
    role: "super_admin",
    tenant_id: null
  });
});

test("tenant login routes to the tenant shell recommended by the API", async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: "tenant_user" });

  await page.goto("/login");
  await page.getByLabel("Email or username").fill("tenant_user");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/tenant$/);
  await expect(page.getByRole("heading", { name: "Northwind Operations Workspace", level: 1 })).toBeVisible();
});

test("protected tenant routes restore after login when the destination is valid", async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: "tenant_admin" });

  await page.goto("/tenant");
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email or username").fill("tenant_admin");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/tenant$/);
});

test("tenant admin cannot remain in the control plane after login", async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: "tenant_admin" });

  await page.goto("/platform");
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email or username").fill("tenant_admin");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/tenant$/);
  await expect(page.getByRole("heading", { name: "Northwind Operations Workspace", level: 1 })).toBeVisible();
});

test("invalid return paths fall back to the safe recommended shell", async ({ page }) => {
  await setupAuthRoutes(page, { loginPersona: "tenant_user" });

  await page.goto("/platform");
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email or username").fill("tenant_user");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/tenant$/);
});

test("manual wrong-shell navigation is corrected for authenticated users", async ({ page }) => {
  await primeAuthenticatedSession(page, "tenant_user");

  await page.goto("/platform");
  await expect(page).toHaveURL(/\/tenant$/);
  await expect(page.getByRole("heading", { name: "Northwind Operations Workspace", level: 1 })).toBeVisible();
});

test("super-admin shell renders the required control-plane navigation inventory", async ({ page }) => {
  await primeAuthenticatedSession(page, "super_admin");

  await page.goto("/platform");

  for (const item of [
    "Dashboard",
    "Tenants",
    "Users",
    "Activity",
    "Settings",
    "System Health",
    "Security",
    "Billing",
    "Audit Log"
  ]) {
    await expect(page.getByRole("link", { name: item })).toBeVisible();
  }

  await expect(page.getByText("Authenticated as")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open profile menu for Platform Operator" })).toBeVisible();
  await expect(page.locator(".sidebar-profile__avatar", { hasText: "PO" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: "Dashboard", level: 3 })).toBeVisible();
  await expect(page.getByText("4 tenants")).toBeVisible();
});

test("platform navigation switches the active section and renders coming-soon placeholders", async ({ page }) => {
  await primeAuthenticatedSession(page, "super_admin");

  await page.goto("/platform");
  await page.getByRole("link", { name: "Billing" }).click();

  await expect(page).toHaveURL(/\/platform\?section=billing$/);
  await expect(page.getByRole("link", { name: "Billing" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: "Billing Coming Soon", level: 3 })).toBeVisible();
  await expect(
    page.getByText("Billing workflows and platform-wide commercial administration will appear here").last()
  ).toBeVisible();
});

test("platform dashboard renders the live tenant-summary overview widget", async ({ page }) => {
  await primeAuthenticatedSession(page, "super_admin");

  await page.goto("/platform");

  await expect(page.getByText("4 tenants")).toBeVisible();
  await expect(page.getByText("Review the current tenant count and status distribution for the platform at a glance.")).toBeVisible();
  await expect(page.getByText("Active", { exact: true })).toBeVisible();
  await expect(page.getByText("Inactive", { exact: true })).toBeVisible();
  await expect(page.getByText("Provisioning", { exact: true })).toBeVisible();
  await expect(page.getByText("Provisioning Failed", { exact: true })).toBeVisible();
});

test("platform dashboard overview stays scoped to tenant summary content", async ({ page }) => {
  await primeAuthenticatedSession(page, "super_admin");

  await page.goto("/platform");

  await expect(page.getByText("No pending actions")).toHaveCount(0);
  await expect(page.getByText("Recent platform activity")).toHaveCount(0);
  await expect(
    page.getByText("Operate Crown as the platform for tenant management systems, with a stable navigation shell and a clear starting point for global oversight.")
  ).toHaveCount(0);
});

test("platform profile entry opens a compact menu with identity details", async ({ page }) => {
  await primeAuthenticatedSession(page, "super_admin");

  await page.goto("/platform");
  await page.getByRole("button", { name: "Open profile menu for Platform Operator" }).click();

  const profileMenu = page.getByRole("menu");

  await expect(profileMenu.getByText("Signed in as")).toBeVisible();
  await expect(profileMenu.getByText("Platform Operator")).toBeVisible();
  await expect(profileMenu.getByText("Super Admin")).toBeVisible();

  await page.getByRole("button", { name: "Open profile menu for Platform Operator" }).click();
  await expect(page.getByText("Signed in as")).toHaveCount(0);
});

test("platform shell collapses to icon-only navigation on iPad-sized layouts and exposes tooltips", async ({ page }) => {
  await primeAuthenticatedSession(page, "super_admin");
  await page.setViewportSize({ width: 1024, height: 900 });

  await page.goto("/platform");

  await expect(page.locator(".sidebar-nav__label", { hasText: "Dashboard" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Dashboard" })).toHaveAttribute("title", "Dashboard");
  await expect(page.getByText("4 tenants")).toBeVisible();

  const billingLink = page.getByRole("link", { name: "Billing" });
  await billingLink.hover();

  await expect(page.locator('[role="tooltip"]', { hasText: "Billing" }).first()).toBeVisible();
});

test("platform dashboard shows a contained error state when overview data fails to load", async ({ page }) => {
  await setupAuthRoutes(page, { mePersona: "super_admin", overviewStatus: 500 });
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      window.sessionStorage.setItem(key, value);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, value: createAccessToken("super_admin") }
  );

  await page.goto("/platform");

  await expect(page.getByText("Dashboard overview unavailable")).toBeVisible();
  await expect(
    page.getByText("Dashboard overview is unavailable right now. Try refreshing once the platform API is reachable.")
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
});

test("logout clears the browser token and returns to the login page", async ({ page }) => {
  await primeAuthenticatedSession(page, "super_admin");

  await page.goto("/platform");
  await page.getByRole("button", { name: "Open profile menu for Platform Operator" }).click();
  await page.getByRole("button", { name: "Log out" }).click();

  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate((key) => window.sessionStorage.getItem(key), ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
});

test("tenant admin logout clears the browser token and returns to the login page", async ({ page }) => {
  await primeAuthenticatedSession(page, "tenant_admin");

  await page.goto("/tenant");
  await page.getByRole("button", { name: "Log out" }).click();

  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate((key) => window.sessionStorage.getItem(key), ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
});

test("tenant user logout clears the browser token and returns to the login page", async ({ page }) => {
  await primeAuthenticatedSession(page, "tenant_user");

  await page.goto("/tenant");
  await page.getByRole("button", { name: "Log out" }).click();

  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate((key) => window.sessionStorage.getItem(key), ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
});

test("expired sessions redirect to login with a recovery message", async ({ page }) => {
  await setupAuthRoutes(page, { mePersona: "tenant_user", meStatus: 401 });
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      window.sessionStorage.setItem(key, value);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, value: createAccessToken("tenant_user", -1) }
  );

  await page.goto("/tenant");
  await expect(page).toHaveURL(/\/login(?:\?reason=session-expired)?$/);
  await expect(page.locator(".form-banner")).toContainText("Your session expired. Sign in again to continue.");
  expect(await page.evaluate((key) => window.sessionStorage.getItem(key), ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
});

test("session expiry warning appears before timed logout and redirects to login", async ({ page }) => {
  const accessToken = createAccessToken("tenant_user", 2);
  const claims = createAccessTokenPayload("tenant_user", 2);
  await page.route(`${API_BASE_URL}/api/v1/auth/**`, async (route) => {
    const request = route.request();
    const url = request.url();

    if (url.endsWith("/login")) {
      await route.fulfill({
        body: JSON.stringify({
          access_token: accessToken,
          claims,
          current_user: buildCurrentUser("tenant_user")
        }),
        contentType: "application/json",
        status: 200
      });
      return;
    }

    if (url.endsWith("/me")) {
      await route.fulfill({
        body: JSON.stringify(buildCurrentUser("tenant_user")),
        contentType: "application/json",
        status: 200
      });
      return;
    }

    if (url.endsWith("/logout")) {
      await route.fulfill({
        body: "",
        contentType: "application/json",
        status: 204
      });
      return;
    }

    await route.fallback();
  });

  await page.goto("/login");
  await page.getByLabel("Email or username").fill("tenant_user");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Your session is about to expire")).toBeVisible();
  await expect(page.getByText(/Signing out in/i)).toBeVisible();
  await expect(page.locator(".form-banner")).toContainText("Your session expired. Sign in again to continue.", {
    timeout: 5000
  });
  await expect(page).toHaveURL(/\/login\?reason=session-expired$/, { timeout: 5000 });
});
