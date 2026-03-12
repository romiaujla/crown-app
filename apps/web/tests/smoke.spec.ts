import { expect, test } from "@playwright/test";

test("signed-out entry routes to the shared login page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Enter Crown", level: 1 })).toBeVisible();
});

test("unauthorized screen offers a recovery path", async ({ page }) => {
  await page.goto("/unauthorized?reason=route_not_allowed");
  await expect(page.getByRole("heading", { name: "This route is not available for your role", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return to sign in" })).toBeVisible();
});
