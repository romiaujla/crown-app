import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";

describe("authenticate middleware", () => {
  const app = buildApp();

  it("rejects missing bearer token", async () => {
    const response = await request(app).get("/api/v1/platform/ping");

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe("unauthenticated");
  });

  it("rejects invalid claims payload", async () => {
    const response = await request(app)
      .get("/api/v1/platform/ping")
      .set("Authorization", "Bearer malformed.token");

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe("invalid_claims");
  });
});
