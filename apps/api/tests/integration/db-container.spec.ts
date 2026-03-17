import { PrismaPg } from "@prisma/adapter-pg";
import { describe, expect, it } from "vitest";
import { PrismaClient } from "../../src/generated/prisma/client.js";
import { getRunningContainer } from "../db-container.js";

describe("Container Lifecycle - Smoke Tests", () => {
    it("should have a running database container accessible to tests", async () => {
        const container = getRunningContainer();
        expect(container).toBeDefined();
        expect(container.host).toBeTruthy();
        expect(container.port).toBeGreaterThan(0);
        expect(container.database).toBeDefined();
        expect(container.username).toBeDefined();
        expect(container.password).toBeDefined();
        expect(container.url).toMatch(/^postgresql:\/\//);
    });

    it("should be able to connect to the database with Prisma Client", async () => {
        const container = getRunningContainer();
        const prisma = new PrismaClient({
            adapter: new PrismaPg({
                connectionString: container.url
            })
        });

        try {
            // Attempt a simple query to verify connectivity
            const result = await prisma.$queryRaw`SELECT 1`;
            expect(result).toBeDefined();
        } finally {
            await prisma.$disconnect();
        }
    });

    it("should have database connection string properly formatted", () => {
        const container = getRunningContainer();
        const url = container.url;

        // Verify URL is properly formatted
        expect(url).toContain(`postgresql://`);
        expect(url).toContain(`@`);
        expect(url).toContain(container.host);
        expect(url).toContain(String(container.port));
        expect(url).toContain(container.database);
    });
});
