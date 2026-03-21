#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';

const ROOT = process.cwd();
const BRANCH_PATTERN = /^(chore|feat|fix|hotfix)\/CROWN-\d+(-[a-z0-9-]+)?$/;
const PROMPT_PATTERNS = [
  '--help',
  '--speckit CROWN-<id>',
  '--implement CROWN-<id>',
  '--audit CROWN-<id>',
  '--clean-code-api',
  '--clean-code-web',
  '--sync-to-jira CROWN-<id>',
  '--sync-from-jira CROWN-<id>',
  '--resolve-pr-comments [PR-NUMBER]',
  '--review [PR-NUMBER]',
  '--refresh-pr [PR-NUMBER]',
  '--status [CROWN-<id>]',
  '--handoff CROWN-<id>',
  '--reconcile CROWN-<id>',
  '--test-fix [TARGET]',
  '--openapi-audit [TARGET]',
  '--scope-drift CROWN-<id>',
];
const REQUIRED_DOCS = [
  'docs/process/engineering-constitution.md',
  'docs/process/ai-agent-prompt-help.md',
  'docs/process/spec-kit-workflow.md',
  'docs/process/spec-kit-installation.md',
];

const checks = [];

const addCheck = (name, ok, detail) => {
  checks.push({ name, ok, detail });
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ensureFileContains = async (filePath, pattern, label) => {
  try {
    const content = await readFile(path.join(ROOT, filePath), 'utf8');
    addCheck(
      label,
      pattern.test(content),
      pattern.test(content) ? 'Found' : 'Missing required content',
    );
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
      if (entry.isFile() && entry.name === 'constitution.md') {
        matches.push(path.relative(ROOT, fullPath));
      }
    }
  };
  await traverse(dirPath);
  return matches;
};

const main = async () => {
  try {
    const branch = execSync('git branch --show-current', {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
      .toString()
      .trim();
    addCheck(
      'Branch naming follows constitution',
      BRANCH_PATTERN.test(branch),
      BRANCH_PATTERN.test(branch) ? branch : `Invalid branch: ${branch}`,
    );
  } catch (error) {
    addCheck(
      'Branch naming follows constitution',
      false,
      `Unable to detect branch: ${error.message}`,
    );
  }

  for (const docPath of REQUIRED_DOCS) {
    try {
      await access(path.join(ROOT, docPath));
      addCheck(`Required doc exists: ${docPath}`, true, 'Present');
    } catch {
      addCheck(`Required doc exists: ${docPath}`, false, 'Missing');
    }
  }

  try {
    await access(path.join(ROOT, 'docs/features/README.md'));
    addCheck('Feature index exists: docs/features/README.md', true, 'Present');
  } catch {
    addCheck('Feature index exists: docs/features/README.md', false, 'Missing');
  }

  const featureConstitutions = await findFeatureConstitutions(path.join(ROOT, 'docs', 'features'));
  addCheck(
    'No feature-level constitutions exist',
    featureConstitutions.length === 0,
    featureConstitutions.length === 0
      ? 'No duplicates found'
      : `Remove: ${featureConstitutions.join(', ')}`,
  );

  for (const promptPattern of PROMPT_PATTERNS) {
    await ensureFileContains(
      'docs/process/ai-agent-prompt-help.md',
      new RegExp(escapeRegExp(promptPattern), 'i'),
      `Prompt help registry documents ${promptPattern}`,
    );
  }
  await ensureFileContains(
    'docs/process/ai-agent-prompt-help.md',
    /registry[\s\S]*future|future[\s\S]*registry/i,
    'Prompt help registry defines how future commands are added',
  );
  await ensureFileContains(
    'docs/process/spec-kit-workflow.md',
    /--audit CROWN-<id>[\s\S]*--clean-code-api[\s\S]*--clean-code-web[\s\S]*--sync-to-jira CROWN-<id>[\s\S]*--sync-from-jira CROWN-<id>[\s\S]*--resolve-pr-comments \[PR-NUMBER\]/i,
    'Spec workflow documents the workflow-helper prompt contract',
  );
  await ensureFileContains(
    'AGENTS.md',
    /--audit[\s\S]*--sync-to-jira[\s\S]*--sync-from-jira[\s\S]*--resolve-pr-comments/i,
    'AGENTS documents the workflow-helper prompts',
  );
  await ensureFileContains(
    'AGENTS.md',
    /--help[\s\S]*prompt discovery|source-of-truth registry/i,
    'AGENTS documents the --help discovery command',
  );
  await ensureFileContains(
    'README.md',
    /--help[\s\S]*prompt registry|ai-agent prompt help registry/i,
    'README links to the prompt help registry',
  );
  await ensureFileContains(
    'docs/process/spec-kit-workflow.md',
    /--help[\s\S]*ai-agent-prompt-help\.md/i,
    'Spec workflow references the --help registry',
  );
  await ensureFileContains(
    'docs/process/spec-kit-installation.md',
    /--help[\s\S]*ai-agent-prompt-help\.md/i,
    'Spec installation guidance references the --help registry',
  );
  await ensureFileContains(
    'docs/process/spec-kit-workflow.md',
    /single constitution|one constitution|canonical constitution|canonical policy/i,
    'Spec workflow references a single canonical constitution',
  );
  await ensureFileContains(
    'README.md',
    /spec-kit-installation\.md|Spec Kit installation runbook/i,
    'README links to Spec Kit installation guidance',
  );
  await ensureFileContains(
    'AGENTS.md',
    /--speckit CROWN-<id>[\s\S]*begin with `?\/specify`?/i,
    'AGENTS requires /specify for --speckit runs',
  );
  await ensureFileContains(
    'AGENTS.md',
    /git co main && git pull[\s\S]*Jira-linked branch[\s\S]*transition that issue to `In Progress`/i,
    'AGENTS requires refreshing main before branch creation and transitioning Jira to In Progress',
  );
  await ensureFileContains(
    'AGENTS.md',
    /--implement CROWN-<id>[\s\S]*skip `?\/specify`?, `?\/plan`?, and `?\/tasks`?/i,
    'AGENTS documents the --implement command',
  );
  await ensureFileContains(
    'docs/process/spec-kit-workflow.md',
    /--speckit CROWN-<id>[\s\S]*start the workflow with `?\/specify`?/i,
    'Spec workflow requires /specify for --speckit runs',
  );
  await ensureFileContains(
    'docs/process/spec-kit-workflow.md',
    /--implement CROWN-<id>[\s\S]*skip `?\/specify`?, `?\/plan`?, and `?\/tasks`?/i,
    'Spec workflow documents the --implement command',
  );
  await ensureFileContains(
    'docs/process/spec-kit-workflow.md',
    /git co main && git pull[\s\S]*Jira-linked branch[\s\S]*transition that issue to `In Progress`/i,
    'Spec workflow requires refreshing main before branch creation and transitioning Jira to In Progress',
  );
  await ensureFileContains(
    'docs/process/spec-kit-installation.md',
    /--speckit CROWN-<id>[\s\S]*git co main && git pull[\s\S]*Do not skip `?\/specify`?[\s\S]*before implementation/i,
    'Spec installation guidance preserves main refresh and --speckit /specify rule',
  );
  await ensureFileContains(
    'README.md',
    /--implement CROWN-<id>[\s\S]*skip `?\/specify`?, `?\/plan`?, and `?\/tasks`?/i,
    'README documents the --implement command',
  );
  await ensureFileContains(
    'README.md',
    /git co main && git pull[\s\S]*Jira-linked branch[\s\S]*`In Progress`[\s\S]*Jira-linked pull request[\s\S]*`In Review`/i,
    'README documents refreshing main before branch creation and Jira status transitions',
  );
  await ensureFileContains(
    'docs/process/ai-agent-prompt-help.md',
    /--clean-code-api[\s\S]*apps\/api[\s\S]*findings first[\s\S]*concrete file references/i,
    'Prompt help registry documents the --clean-code-api contract',
  );
  await ensureFileContains(
    'docs/process/ai-agent-prompt-help.md',
    /--clean-code-web[\s\S]*apps\/web[\s\S]*findings first[\s\S]*concrete file references/i,
    'Prompt help registry documents the --clean-code-web contract',
  );
  await ensureFileContains(
    'AGENTS.md',
    /--clean-code-api[\s\S]*apps\/api[\s\S]*findings first[\s\S]*(review-only|implementation)/i,
    'AGENTS documents the --clean-code-api scope and review-only behavior',
  );
  await ensureFileContains(
    'AGENTS.md',
    /--clean-code-web[\s\S]*apps\/web[\s\S]*findings first[\s\S]*(review-only|implementation)/i,
    'AGENTS documents the --clean-code-web scope and review-only behavior',
  );
  await ensureFileContains(
    'README.md',
    /--clean-code-api[\s\S]*apps\/api[\s\S]*--clean-code-web[\s\S]*apps\/web/i,
    'README documents the clean-code audit prompts',
  );
  await ensureFileContains(
    'README.md',
    /--audit CROWN-<id>[\s\S]*--resolve-pr-comments|workflow-helper prompts/i,
    'README links the workflow-helper prompt catalog',
  );
  await ensureFileContains(
    'AGENTS.md',
    /pull request[\s\S]*transition that issue to `In Review`/i,
    'AGENTS requires transitioning Jira to In Review on PR creation',
  );
  await ensureFileContains(
    'docs/process/spec-kit-workflow.md',
    /pull request[\s\S]*transitions the issue to `In Review`/i,
    'Spec workflow requires transitioning Jira to In Review on PR creation',
  );
  await ensureFileContains(
    '.husky/commit-msg',
    /commit-msg-rewrite\.mjs/,
    'Commit hook routes through rewrite script',
  );
  await ensureFileContains(
    'scripts/commit-msg-rewrite.mjs',
    /CROWN-\d+/,
    'Commit rewrite script enforces Jira key presence',
  );

  const failures = checks.filter((c) => !c.ok);
  const passes = checks.filter((c) => c.ok);

  console.log('specify.audit report');
  console.log('===================');
  for (const check of checks) {
    console.log(`${check.ok ? 'PASS' : 'FAIL'} - ${check.name}`);
    console.log(`  ${check.detail}`);
  }
  console.log('');
  console.log(`Summary: ${passes.length} passed, ${failures.length} failed`);

  if (failures.length > 0) {
    process.exitCode = 1;
  }
};

await main();
