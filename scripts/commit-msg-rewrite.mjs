#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const msgFile = process.argv[2];
if (!msgFile) process.exit(0);

const original = fs.readFileSync(msgFile, 'utf8');
const trimmed = original.trim();

if (!trimmed) process.exit(0);
if (/^(Merge|Revert|fixup!|squash!)/i.test(trimmed)) process.exit(0);
if (/^chore\(release\):\s+\S+/i.test(trimmed)) process.exit(0);
if (/^[a-z][a-z-]*:\s*CROWN-\d+\s*-\s+/i.test(trimmed)) process.exit(0);

let branch = '';
try {
  branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
} catch {
  process.exit(0);
}

const branchMatch = branch.match(/^(chore|feat|fix|hotfix)\/(CROWN-\d+)(?:[\/-].*)?$/i);
if (!branchMatch) {
  console.error(
    '[commit-msg] Branch must follow one of: chore/CROWN-123, feat/CROWN-123, fix/CROWN-123, hotfix/CROWN-123.',
  );
  process.exit(1);
}
const type = branchMatch[1].toLowerCase();
const issueKey = branchMatch[2].toUpperCase();
const rewritten = `${type}: ${issueKey} - ${trimmed}\n`;
fs.writeFileSync(msgFile, rewritten, 'utf8');
