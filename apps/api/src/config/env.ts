import { cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  PORT: num({ default: 4000 }),
  DATABASE_URL: str({ default: 'postgresql://postgres:postgres@localhost:5432/crown_app' }),
  JWT_ACCESS_SECRET: str({ default: 'dev-access-secret' }),
  JWT_REFRESH_SECRET: str({ default: 'dev-refresh-secret' }),
  JWT_ACCESS_TTL_SECONDS: num({ default: 2 * 60 * 60 }),
  SEED_DEFAULT_PASSWORD: str({ default: 'change-me-local-default-password' }),
  SEED_SUPER_ADMIN_PASSWORD: str({ default: 'change-me-local-super-admin-password' }),
  SEED_TENANT_ADMIN_PASSWORD: str({ default: 'change-me-local-tenant-admin-password' }),
  SEED_TENANT_USER_PASSWORD: str({ default: 'change-me-local-tenant-user-password' }),
});
