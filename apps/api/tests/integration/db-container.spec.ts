import { PrismaPg } from "@prisma/adapter-pg";
import { describe, expect, it } from "vitest";
import { PrismaClient } from "../../src/generated/prisma/client.js";

describe("Container Lifecycle - Smoke Tests", () => {
    it("should have DATABASE_URL set by globalSetup pointing to an ephemeral container", () => {
        const url = process.env.DATABASE_URL;
        expect(url).toBeDefined();
        expect(url).toMatch(/^postgresql:\/\//);
    });

    it("should be able to connect to the database with Prisma Client", async () => {
        const prisma = new PrismaClient({
            adapter: new PrismaPg({
                connectionString: process.env.DATABASE_URL!
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
        const url = process.env.DATABASE_URL!;

        // Verify URL is properly formatted
        expect(url).toContain("postgresql://");
        expect(url).toContain("@");
    });
});
