import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

import dotenv from 'dotenv';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(dirname, '..');
const envPath = path.join(apiRoot, '.env');
const envLocalPath = path.join(apiRoot, '.env.local');

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

if (!existsSync(envLocalPath)) {
  console.error(`Missing local seed env file: ${envLocalPath}`);
  console.error(
    'Create apps/api/.env.local with your local DATABASE_URL before running pnpm db:seed:local.',
  );
  process.exit(1);
}

dotenv.config({ path: envLocalPath, override: true });

if (!process.env.DATABASE_URL) {
  console.error(`DATABASE_URL is not set after loading ${envLocalPath}`);
  process.exit(1);
}

const child = spawn('pnpm', ['exec', 'prisma', 'db', 'seed'], {
  cwd: apiRoot,
  env: process.env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
