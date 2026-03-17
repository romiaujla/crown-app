import pino from "pino";
import { GenericContainer } from "testcontainers";

const logger = pino({ name: "crown-test-container", level: process.env.LOG_LEVEL ?? "info" });

export interface TestDatabaseContainer {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  url: string;
}

let container: any = undefined;

/**
 * Starts an ephemeral PostgreSQL test container
 * @returns Container connection details
 * @throws Error if container fails to start or health check times out
 */
export async function startTestContainer(): Promise<TestDatabaseContainer> {
  if (container) {
    logger.debug("Test container already running, returning existing connection");
    return getContainerDetails();
  }

  const startTime = Date.now();
  logger.info("Starting ephemeral PostgreSQL test container");

  try {
    container = await new GenericContainer("postgres:16-alpine")
      .withEnvironment({
        POSTGRES_DB: "postgres",
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "postgres"
      })
      .withExposedPorts(5432)
      .withHealthCheck({
        test: ["CMD-SHELL", "pg_isready -U postgres"],
        interval: 1000,
        timeout: 5000,
        retries: 5
      })
      .withStartupTimeout(90000)
      .start();

    const elapsed = Date.now() - startTime;
    logger.info(`Test container started in ${elapsed}ms`);

    const details = getContainerDetails();
    logger.debug("Container connection details", {
      host: details.host,
      port: details.port,
      database: details.database
    });

    return details;
  } catch (error) {
    logger.error("Failed to start test container", { error });
    throw error;
  }
}

/**
 * Stops and cleans up the ephemeral test container
 * @throws Error if container fails to stop
 */
export async function stopTestContainer(): Promise<void> {
  if (!container) {
    logger.debug("No test container to stop");
    return;
  }

  const startTime = Date.now();
  logger.info("Stopping ephemeral PostgreSQL test container");

  try {
    await container.stop();
    const elapsed = Date.now() - startTime;
    logger.info(`Test container stopped in ${elapsed}ms`);
    container = undefined;
  } catch (error) {
    logger.error("Failed to stop test container", { error });
    throw error;
  }
}

/**
 * Extracts connection details from the running container
 * @returns Container connection details
 * @throws Error if container is not running
 */
function getContainerDetails(): TestDatabaseContainer {
  if (!container) {
    throw new Error("Test container is not running");
  }

  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const database = "postgres";
  const username = "postgres";
  const password = "postgres";
    const url = `postgresql://${username}:${password}@${host}:${port}/${database}`;

    return {
        host,
        port,
        database,
        username,
        password,
        url
    };
}

/**
 * Gets the currently running container or throws error
 * @returns Running container connection details
 * @throws Error if container is not running
 */
export function getRunningContainer(): TestDatabaseContainer {
    if (!container) {
        throw new Error("Test container is not running - call startTestContainer first");
    }
    return getContainerDetails();
}
