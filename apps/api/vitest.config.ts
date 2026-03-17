import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.spec.ts"],
    passWithNoTests: true,
    globalSetup: ["tests/global-setup.ts"],
    hookTimeout: 120000,
    testTimeout: 120000,
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  }
});
