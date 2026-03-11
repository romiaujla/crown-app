import { describe, expect, it } from "vitest";

import { runLocalBootstrap } from "../../../../scripts/bootstrap-local-env.mjs";
import { createBootstrapWorkflowHarness, expectedBootstrapSequence } from "../helpers/bootstrap-workflow.js";

describe("local bootstrap workflow integration", () => {
  it("runs the canonical local bootstrap sequence from empty state", async () => {
    const harness = createBootstrapWorkflowHarness();

    const result = await runLocalBootstrap({
      runCommand: harness.runCommand,
      logger: harness.logger
    });

    expect(result.completedSteps).toEqual(["postgres", "db:push", "db:seed:local"]);
    expect(result.baselineCommand).toBe("pnpm db:seed:local");
    expect(harness.recordedSteps).toEqual(expectedBootstrapSequence);
  });

  it("reuses the same sequence when rerun from partial state", async () => {
    const harness = createBootstrapWorkflowHarness();

    await runLocalBootstrap({
      runCommand: harness.runCommand,
      logger: harness.logger
    });
    const secondRun = await runLocalBootstrap({
      runCommand: harness.runCommand,
      logger: harness.logger
    });

    expect(secondRun.completedSteps).toEqual(["postgres", "db:push", "db:seed:local"]);
    expect(harness.recordedSteps.map((step) => step.id)).toEqual([
      "postgres",
      "db:push",
      "db:seed:local",
      "postgres",
      "db:push",
      "db:seed:local"
    ]);
  });

  it("keeps the workflow aligned to the canonical seed boundary command", async () => {
    const harness = createBootstrapWorkflowHarness();

    await runLocalBootstrap({
      runCommand: harness.runCommand,
      logger: harness.logger
    });

    expect(harness.recordedSteps.some((step) => step.id === "db:migrate")).toBe(false);
    expect(harness.recordedSteps.filter((step) => step.id === "db:seed:local")).toHaveLength(1);
    expect(harness.infoMessages.at(-1)).toContain("canonical tenant schema");
  });

  it("returns the canonical baseline command for later automation reuse", async () => {
    const harness = createBootstrapWorkflowHarness();

    const result = await runLocalBootstrap({
      runCommand: harness.runCommand,
      logger: harness.logger
    });

    expect(result).toMatchObject({
      completedSteps: ["postgres", "db:push", "db:seed:local"],
      baselineCommand: "pnpm db:seed:local"
    });
  });

  it("limits the rerun boundary to the canonical seeded tenant flow", async () => {
    const harness = createBootstrapWorkflowHarness();

    await runLocalBootstrap({
      runCommand: harness.runCommand,
      logger: harness.logger
    });

    expect(harness.recordedSteps).toEqual(expectedBootstrapSequence);
    expect(harness.recordedSteps.some((step) => step.args.includes("db:reset"))).toBe(false);
    expect(harness.recordedSteps.some((step) => step.args.includes("migrate"))).toBe(false);
  });

  it("keeps bootstrap and direct reseed aligned to one canonical baseline contract", async () => {
    const harness = createBootstrapWorkflowHarness();

    const result = await runLocalBootstrap({
      runCommand: harness.runCommand,
      logger: harness.logger
    });

    expect(result.baselineCommand).toBe("pnpm db:seed:local");
    expect(harness.infoMessages.some((message) => message.includes("canonical tenant schema"))).toBe(true);
    expect(harness.recordedSteps.filter((step) => step.id === "db:seed:local")).toHaveLength(1);
    expect(harness.recordedSteps.some((step) => step.id === "db:setup")).toBe(false);
  });
});
