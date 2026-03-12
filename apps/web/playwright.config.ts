import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:3000"
  },
  webServer: {
    command: "NEXT_PUBLIC_AUTH_EXPIRY_WARNING_MS=1000 pnpm exec next dev --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI
  }
});
