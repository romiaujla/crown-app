import { PrismaPg } from "@prisma/adapter-pg";
import { describe, expect, it } from "vitest";
import { PrismaClient } from "../../src/generated/prisma/client.js";
import { getRunningContainer } from "../db-container.js";

describe("Seed Data Integration - Smoke Tests", () => {
    it("should have seeded users in the database", async () => {
        const container = getRunningContainer();
        const prisma = new PrismaClient({
            adapter: new PrismaPg({
                connectionString: container.url
            })
        });

        try {
            // Query for seeded users
            const users = await prisma.user.findMany();
            expect(users).toBeDefined();
            expect(Array.isArray(users)).toBe(true);
            expect(users.length).toBeGreaterThan(0);
        } finally {
            await prisma.$disconnect();
        }
    });

    it("should have seeded roles in the database", async () => {
        const container = getRunningContainer();
        const prisma = new PrismaClient({
            adapter: new PrismaPg({
                connectionString: container.url
            })
        });

        try {
            // Query for seeded roles
            const roles = await prisma.role.findMany();
            expect(roles).toBeDefined();
            expect(Array.isArray(roles)).toBe(true);
            expect(roles.length).toBeGreaterThan(0);
        } finally {
            await prisma.$disconnect();
        }
    });

    it("should have seeded tenant in the database", async () => {
        const container = getRunningContainer();
        const prisma = new PrismaClient({
            adapter: new PrismaPg({
                connectionString: container.url
            })
        });

        try {
            // Query for seeded tenants
            const tenants = await prisma.tenant.findMany();
            expect(tenants).toBeDefined();
            expect(Array.isArray(tenants)).toBe(true);
            expect(tenants.length).toBeGreaterThan(0);
        } finally {
            await prisma.$disconnect();
        }
    });

    it("should have seeded user-role relationships in the database", async () => {
        const container = getRunningContainer();
        const prisma = new PrismaClient({
            adapter: new PrismaPg({
                connectionString: container.url
            })
        });

        try {
            // Query for user-role relationships
            const userRoles = await prisma.userPlatformRoleAssignment.findMany();
            expect(userRoles).toBeDefined();
            expect(Array.isArray(userRoles)).toBe(true);
            expect(userRoles.length).toBeGreaterThan(0);
        } finally {
            await prisma.$disconnect();
        }
    });
});
