import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.spec.ts"],
    passWithNoTests: true,
    setupFiles: ["tests/setup.ts"],
    hookTimeout: 120000,
    testTimeout: 120000,
    threads: {
      singleThread: true
    }
  }
});
