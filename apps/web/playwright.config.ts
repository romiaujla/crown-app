import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { defineConfig } from '@playwright/test';

const readEnvFile = (filename: string) => {
  try {
    const contents = readFileSync(join(__dirname, filename), 'utf8');
    return contents.split(/\r?\n/).reduce<Record<string, string>>((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return acc;

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) return acc;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      acc[key] = value;
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const playwrightEnv = {
  ...readEnvFile('.env.playwright'),
  ...process.env,
};

const playwrightPort = playwrightEnv.PLAYWRIGHT_PORT ?? '3100';
const baseURL = `http://127.0.0.1:${playwrightPort}`;
const authExpiryWarningMs = playwrightEnv.NEXT_PUBLIC_AUTH_EXPIRY_WARNING_MS ?? '1000';

export default defineConfig({
  testDir: './tests',
  workers: 6,
  use: {
    baseURL,
  },
  webServer: {
    command: `NEXT_PUBLIC_AUTH_EXPIRY_WARNING_MS=${authExpiryWarningMs} pnpm exec next dev --port ${playwrightPort}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
