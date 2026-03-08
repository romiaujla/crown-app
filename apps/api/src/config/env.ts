import { cleanEnv, num, str } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production"], default: "development" }),
  PORT: num({ default: 4000 }),
  DATABASE_URL: str({ default: "postgresql://postgres:postgres@localhost:5432/crown_app" }),
  JWT_ACCESS_SECRET: str({ default: "dev-access-secret" }),
  JWT_REFRESH_SECRET: str({ default: "dev-refresh-secret" })
});
