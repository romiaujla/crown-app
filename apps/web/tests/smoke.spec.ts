import { test, expect } from "@playwright/test";

test("super-admin lands in the crown control plane shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Crown Control Plane", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Platform management areas", level: 2 })).toBeVisible();
  await expect(page.getByText("Management-system ready")).toBeVisible();
  await expect(page.getByText("Start by preparing the first tenant management system")).toBeVisible();
});

test("tenant-scoped users land in a powered-by-crown workspace shell", async ({ page }) => {
  await page.goto("/?role=tenant_user");
  await expect(page.getByRole("heading", { name: "Northwind Operations Workspace", level: 1 })).toBeVisible();
  await expect(page.locator(".tenant-panel").getByText("Powered by Crown")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tenant workspace areas", level: 2 })).toBeVisible();
  await expect(page.getByText("Management-system workspace overview")).toBeVisible();
});

test("platform navigation remains usable without a tenant selected", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Platform management areas", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tenants", level: 3 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Operations", level: 3 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Expansion", level: 3 })).toBeVisible();
});

test("super-admin does not remain in the tenant workspace shell", async ({ page }) => {
  await page.goto("/?role=super_admin");
  await expect(page.getByRole("heading", { name: "Crown Control Plane", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Northwind Operations Workspace", level: 1 })).not.toBeVisible();
});

test("unauthenticated visitors are kept out of both protected shells", async ({ page }) => {
  await page.goto("/?role=guest");
  await expect(page.getByRole("heading", { name: "Workspace access restricted", level: 1 })).toBeVisible();
});
