import { test, expect } from "@playwright/test";

test("super-admin lands in the crown control plane shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Crown Control Plane", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Platform management areas", level: 2 })).toBeVisible();
  await expect(page.getByText("Management-system ready")).toBeVisible();
  await expect(page.getByText("Start by preparing the first tenant management system")).toBeVisible();
});

test("non-super-admin users do not remain in the platform shell", async ({ page }) => {
  await page.goto("/?role=tenant_user");
  await expect(page.getByRole("heading", { name: "Platform access restricted", level: 1 })).toBeVisible();
  await expect(page.getByText("Tenant workspaces remain powered by Crown")).toBeVisible();
});

test("platform navigation remains usable without a tenant selected", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Platform management areas", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tenants", level: 3 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Operations", level: 3 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Expansion", level: 3 })).toBeVisible();
});
