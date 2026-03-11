import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";

describe("api docs contract", () => {
  const app = buildApp();

  it("serves Swagger UI at /api/v1/docs", async () => {
    const response = await request(app).get("/api/v1/docs");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.text).toContain("<div id=\"swagger-ui\"></div>");
    expect(response.text).toContain("<title>Crown API Docs</title>");
  });

  it("does not expose a raw openapi json endpoint", async () => {
    const response = await request(app).get("/api/v1/openapi.json");

    expect(response.status).toBe(404);
  });
});
