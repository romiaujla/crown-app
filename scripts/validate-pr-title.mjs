#!/usr/bin/env node

const [, , ...args] = process.argv;

const title = args.join(' ').trim();

const allowedTypes = ['feat', 'fix', 'chore', 'hotfix', 'minor', 'major', 'no-release'];
const typePattern = allowedTypes
  .map((type) => type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');
const titlePattern = new RegExp(`^(${typePattern}): CROWN-\\d+ - .+`);

if (!title) {
  console.error('PR title validation failed: no title provided.');
  console.error('Expected format: <type>: CROWN-<id> - <message>');
  process.exit(1);
}

if (!titlePattern.test(title)) {
  console.error(`PR title validation failed: "${title}"`);
  console.error('Expected format: <type>: CROWN-<id> - <message>');
  console.error(`Allowed types: ${allowedTypes.join(', ')}`);
  console.error('Examples:');
  console.error('  feat: CROWN-8 - implement tenant app shell');
  console.error('  fix: CROWN-19 - enforce squash-merge PR title convention');
  process.exit(1);
}

console.log(`PR title validation passed: "${title}"`);
