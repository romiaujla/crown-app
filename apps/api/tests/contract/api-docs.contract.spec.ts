import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";

describe("api docs contract", () => {
  const app = buildApp();

  it("serves Swagger UI at /api/v1/docs", async () => {
    const response = await request(app).get("/api/v1/docs");

    expect(response.status).toBe(301);
    expect(response.headers.location).toBe("/api/v1/docs/");
  });

  it("serves the docs page and bootstrap assets from the docs mount", async () => {
    const pageResponse = await request(app).get("/api/v1/docs/");
    const initResponse = await request(app).get("/api/v1/docs/swagger-ui-init.js");

    expect(pageResponse.status).toBe(200);
    expect(pageResponse.headers["content-type"]).toContain("text/html");
    expect(pageResponse.text).toContain("<div id=\"swagger-ui\"></div>");
    expect(pageResponse.text).toContain("<title>Crown API Docs</title>");

    expect(initResponse.status).toBe(200);
    expect(initResponse.headers["content-type"]).toContain("application/javascript");
    expect(initResponse.text).toContain("SwaggerUIBundle");
    expect(initResponse.text).toContain("swaggerDoc");
    expect(initResponse.text).toContain("/api/v1/platform/tenants/{tenantId}/deprovision");
  });

  it("does not expose a raw openapi json endpoint", async () => {
    const response = await request(app).get("/api/v1/openapi.json");

    expect(response.status).toBe(404);
  });
});
