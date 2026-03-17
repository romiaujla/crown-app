import { PrismaPg } from "@prisma/adapter-pg";
import { execSync } from "child_process";
import path from "path";
import pino from "pino";
import { afterAll, beforeAll } from "vitest";

import { runLocalSeed } from "../prisma/seed.js";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { startTestContainer, stopTestContainer } from "./db-container.js";

const logger = pino({ name: "crown-test-setup", level: process.env.LOG_LEVEL ?? "info" });

/**
 * Vitest setup file that runs before all tests
 * Starts ephemeral PostgreSQL container and runs seed process
 */
beforeAll(async () => {
    logger.info("Setting up test environment");

    try {
        // Start ephemeral container
        const containerDetails = await startTestContainer();

        // Set DATABASE_URL for Prisma Client and seed process
        process.env.DATABASE_URL = containerDetails.url;
        logger.info("Container started and DATABASE_URL configured");

        // Run Prisma migrations to set up the database schema
        logger.info("Running Prisma migrations to initialize database schema");
        try {
            // Run prisma migrate deploy to apply all migrations
            execSync("prisma migrate deploy", {
                cwd: path.resolve(process.cwd()),
                env: { ...process.env, DATABASE_URL: containerDetails.url },
                stdio: "pipe"
            });
            logger.info("Prisma migrations completed successfully");
        } catch (error) {
            logger.error({ error }, "Prisma migrations failed");
            throw new Error(`Failed to run Prisma migrations: ${error}`);
        }

        // Run seed process with a new client
        logger.info("Running seed process for test data initialization");
        const seedSummary = await runLocalSeed({
            prismaClient: new PrismaClient({
                adapter: new PrismaPg({
                    connectionString: containerDetails.url
                })
            })
        });
        logger.info({
            tenantSlug: seedSummary.tenantSlug,
            schemaName: seedSummary.schemaName,
            loadedCounts: seedSummary.loadedCounts
        }, "Seed process completed successfully");
    } catch (error) {
        logger.error({ error }, "Test setup failed");
        throw error;
    }
});

/**
 * Cleanup after all tests complete
 */
afterAll(async () => {
    logger.info("Cleaning up test environment");
    try {
        await stopTestContainer();
        logger.info("Test container cleaned up successfully");
    } catch (error) {
        logger.error({ error }, "Cleanup failed");
        throw error;
    }
});

/**
 * Register signal handlers to ensure cleanup on interrupt
 */
process.on("SIGTERM", async () => {
    logger.warn("SIGTERM received, cleaning up");
    try {
        await stopTestContainer();
        process.exit(0);
    } catch (error) {
        logger.error({ error }, "Failed to cleanup on SIGTERM");
        process.exit(1);
    }
});

process.on("SIGINT", async () => {
    logger.warn("SIGINT received, cleaning up");
    try {
        await stopTestContainer();
        process.exit(0);
    } catch (error) {
        logger.error({ error }, "Failed to cleanup on SIGINT");
        process.exit(1);
    }
});

logger.info("Test setup file loaded and lifecycle handlers registered");
