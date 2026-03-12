#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execSync } from "node:child_process";
import { readdir } from "node:fs/promises";

const ROOT = process.cwd();
const BRANCH_PATTERN = /^(chore|feat|fix|hotfix)\/CROWN-\d+(-[a-z0-9-]+)?$/;
const REQUIRED_DOCS = [
  "docs/process/engineering-constitution.md",
  "docs/process/spec-kit-workflow.md",
  "docs/process/spec-kit-installation.md"
];

const checks = [];

const addCheck = (name, ok, detail) => {
  checks.push({ name, ok, detail });
};

const ensureFileContains = async (filePath, pattern, label) => {
  try {
    const content = await readFile(path.join(ROOT, filePath), "utf8");
    addCheck(label, pattern.test(content), pattern.test(content) ? "Found" : "Missing required content");
  } catch (error) {
    addCheck(label, false, `Unable to read ${filePath}: ${error.message}`);
  }
};

const findFeatureConstitutions = async (dirPath) => {
  const matches = [];
  const traverse = async (current) => {
    let entries = [];
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await traverse(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name === "constitution.md") {
        matches.push(path.relative(ROOT, fullPath));
      }
    }
  };
  await traverse(dirPath);
  return matches;
};

const main = async () => {
  try {
    const branch = execSync("git branch --show-current", {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"]
    })
      .toString()
      .trim();
    addCheck(
      "Branch naming follows constitution",
      BRANCH_PATTERN.test(branch),
      BRANCH_PATTERN.test(branch) ? branch : `Invalid branch: ${branch}`
    );
  } catch (error) {
    addCheck("Branch naming follows constitution", false, `Unable to detect branch: ${error.message}`);
  }

  for (const docPath of REQUIRED_DOCS) {
    try {
      await access(path.join(ROOT, docPath));
      addCheck(`Required doc exists: ${docPath}`, true, "Present");
    } catch {
      addCheck(`Required doc exists: ${docPath}`, false, "Missing");
    }
  }

  try {
    await access(path.join(ROOT, "docs/features/README.md"));
    addCheck("Feature index exists: docs/features/README.md", true, "Present");
  } catch {
    addCheck("Feature index exists: docs/features/README.md", false, "Missing");
  }

  const featureConstitutions = await findFeatureConstitutions(path.join(ROOT, "docs", "features"));
  addCheck(
    "No feature-level constitutions exist",
    featureConstitutions.length === 0,
    featureConstitutions.length === 0 ? "No duplicates found" : `Remove: ${featureConstitutions.join(", ")}`
  );

  await ensureFileContains(
    "docs/process/spec-kit-workflow.md",
    /single constitution|one constitution|canonical constitution|canonical policy/i,
    "Spec workflow references a single canonical constitution"
  );
  await ensureFileContains(
    "README.md",
    /spec-kit-installation\.md|Spec Kit installation runbook/i,
    "README links to Spec Kit installation guidance"
  );
  await ensureFileContains(
    "AGENTS.md",
    /--speckit CROWN-<id>[\s\S]*begin with `?\/specify`?/i,
    "AGENTS requires /specify for --speckit runs"
  );
  await ensureFileContains(
    "AGENTS.md",
    /--implement CROWN-<id>[\s\S]*skip `?\/specify`?, `?\/plan`?, and `?\/tasks`?/i,
    "AGENTS documents the --implement command"
  );
  await ensureFileContains(
    "docs/process/spec-kit-workflow.md",
    /--speckit CROWN-<id>[\s\S]*start the workflow with `?\/specify`?/i,
    "Spec workflow requires /specify for --speckit runs"
  );
  await ensureFileContains(
    "docs/process/spec-kit-workflow.md",
    /--implement CROWN-<id>[\s\S]*skip `?\/specify`?, `?\/plan`?, and `?\/tasks`?/i,
    "Spec workflow documents the --implement command"
  );
  await ensureFileContains(
    "docs/process/spec-kit-installation.md",
    /--speckit CROWN-<id>[\s\S]*Do not skip `?\/specify`?[\s\S]*before implementation/i,
    "Spec installation guidance preserves --speckit /specify rule"
  );
  await ensureFileContains(
    "README.md",
    /--implement CROWN-<id>[\s\S]*skip `?\/specify`?, `?\/plan`?, and `?\/tasks`?/i,
    "README documents the --implement command"
  );
  await ensureFileContains(
    ".husky/commit-msg",
    /commit-msg-rewrite\.mjs/,
    "Commit hook routes through rewrite script"
  );
  await ensureFileContains(
    "scripts/commit-msg-rewrite.mjs",
    /CROWN-\d+/,
    "Commit rewrite script enforces Jira key presence"
  );

  const failures = checks.filter((c) => !c.ok);
  const passes = checks.filter((c) => c.ok);

  console.log("specify.audit report");
  console.log("===================");
  for (const check of checks) {
    console.log(`${check.ok ? "PASS" : "FAIL"} - ${check.name}`);
    console.log(`  ${check.detail}`);
  }
  console.log("");
  console.log(`Summary: ${passes.length} passed, ${failures.length} failed`);

  if (failures.length > 0) {
    process.exitCode = 1;
  }
};

await main();
