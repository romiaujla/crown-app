#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const SMALL_FILE_THRESHOLD = Number.parseInt(process.env.SPECIFY_DRIFT_MAX_FILES || '8', 10);
const SMALL_LINE_THRESHOLD = Number.parseInt(process.env.SPECIFY_DRIFT_MAX_LINES || '150', 10);
const BASE_REF = process.env.SPECIFY_DRIFT_BASE || 'main';
const EXCLUDED_PATH_PREFIXES = ['docs/features/drift/'];

const run = (cmd) =>
  execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] })
    .toString()
    .trim();

const getBranch = () => run('git branch --show-current');

const getJiraKey = (branch) => {
  const match = branch.match(/CROWN-\d+/);
  return match ? match[0] : 'UNSCOPED';
};

const parseNumstat = (raw) => {
  const rows = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const files = [];
  let additions = 0;
  let deletions = 0;

  for (const row of rows) {
    const [addedRaw, deletedRaw, ...fileParts] = row.split('\t');
    const file = fileParts.join('\t');
    const added = Number.parseInt(addedRaw, 10);
    const deleted = Number.parseInt(deletedRaw, 10);
    const safeAdded = Number.isNaN(added) ? 0 : added;
    const safeDeleted = Number.isNaN(deleted) ? 0 : deleted;
    additions += safeAdded;
    deletions += safeDeleted;
    files.push({ file, added: safeAdded, deleted: safeDeleted });
  }

  return { files, additions, deletions, total: additions + deletions };
};

const getSummaryLine = (label, value) => `- ${label}: ${value}`;

const isExcludedPath = (file) => EXCLUDED_PATH_PREFIXES.some((prefix) => file.startsWith(prefix));

const mergeStats = (left, right) => {
  const byFile = new Map();
  for (const entry of [...left.files, ...right.files]) {
    const existing = byFile.get(entry.file) || { file: entry.file, added: 0, deleted: 0 };
    existing.added += entry.added;
    existing.deleted += entry.deleted;
    byFile.set(entry.file, existing);
  }
  const files = Array.from(byFile.values());
  const additions = files.reduce((sum, file) => sum + file.added, 0);
  const deletions = files.reduce((sum, file) => sum + file.deleted, 0);
  return { files, additions, deletions, total: additions + deletions };
};

const filterStats = (stats) => {
  const files = stats.files.filter((file) => !isExcludedPath(file.file));
  const additions = files.reduce((sum, file) => sum + file.added, 0);
  const deletions = files.reduce((sum, file) => sum + file.deleted, 0);
  return { files, additions, deletions, total: additions + deletions };
};

const getUntrackedStats = async () => {
  const raw = run('git ls-files --others --exclude-standard');
  const files = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const entries = [];
  for (const file of files) {
    let lines = 0;
    try {
      const content = await readFile(path.join(ROOT, file), 'utf8');
      lines = content.split('\n').length;
    } catch {
      lines = 0;
    }
    entries.push({ file, added: lines, deleted: 0 });
  }
  const additions = entries.reduce((sum, file) => sum + file.added, 0);
  return { files: entries, additions, deletions: 0, total: additions };
};

const main = async () => {
  const branch = getBranch();
  const jiraKey = getJiraKey(branch);
  const committed = parseNumstat(run(`git diff --numstat ${BASE_REF}...HEAD`));
  const workingTree = parseNumstat(run('git diff --numstat'));
  const staged = parseNumstat(run('git diff --numstat --cached'));
  const untracked = await getUntrackedStats();
  const stats = filterStats(
    mergeStats(mergeStats(mergeStats(committed, workingTree), staged), untracked),
  );

  if (stats.files.length === 0) {
    console.log('No drift recorded: no changes detected against base ref.');
    return;
  }

  const isSmallChange =
    stats.files.length <= SMALL_FILE_THRESHOLD && stats.total <= SMALL_LINE_THRESHOLD;
  const date = new Date().toISOString().slice(0, 10);
  const driftDir = path.join(ROOT, 'docs', 'features', 'drift');
  const driftFile = path.join(driftDir, `${jiraKey}.md`);
  const note = process.argv
    .slice(2)
    .filter((arg) => arg !== '--')
    .join(' ')
    .trim();

  const lines = [];
  lines.push(`## Drift Entry - ${date}`);
  lines.push('');
  lines.push(getSummaryLine('Issue', jiraKey));
  lines.push(getSummaryLine('Branch', branch));
  lines.push(getSummaryLine('Base ref', BASE_REF));
  lines.push(getSummaryLine('Files changed', stats.files.length));
  lines.push(getSummaryLine('Lines changed', stats.total));
  lines.push(getSummaryLine('Classification', isSmallChange ? 'small-change' : 'major-change'));
  if (note) {
    lines.push(getSummaryLine('Manual note', note));
  }
  lines.push('');
  lines.push('### File breakdown');
  for (const file of stats.files) {
    lines.push(`- ${file.file} (+${file.added} / -${file.deleted})`);
  }
  lines.push('');

  let output = `# Drift Log: ${jiraKey}\n\n`;
  try {
    output = await readFile(driftFile, 'utf8');
    if (!output.endsWith('\n')) {
      output += '\n';
    }
  } catch {
    // First entry, keep default heading
  }

  output += `${lines.join('\n')}\n`;

  await mkdir(driftDir, { recursive: true });
  await writeFile(driftFile, output, 'utf8');

  console.log(`Drift updated: docs/features/drift/${jiraKey}.md`);
  console.log(`Classification: ${isSmallChange ? 'small-change' : 'major-change'}`);
};

await main();
