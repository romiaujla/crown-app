import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";

describe("auth routes contract", () => {
  const app = buildApp();

  it("issues token pair on login", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "super@crowncrm.dev", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body.claims.role).toBe("super_admin");
  });

  it("returns 204 on logout", async () => {
    const response = await request(app).post("/api/v1/auth/logout").send({});
    expect(response.status).toBe(204);
  });
});
