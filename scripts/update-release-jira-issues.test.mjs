import test from 'node:test';
import assert from 'node:assert/strict';

import {
  collectIssueKeysFromCommits,
  renderIssueSection,
  upsertIssueSection,
} from './update-release-jira-issues.mjs';

test('collectIssueKeysFromCommits preserves first-seen Jira keys and removes duplicates', () => {
  const issueKeys = collectIssueKeysFromCommits([
    'feat: CROWN-111 - first change',
    'fix: CROWN-112 - second change\n\nRefs: CROWN-111',
    'chore: no Jira key here',
    'feat: CROWN-113 - third change',
  ]);

  assert.deepEqual(issueKeys, ['CROWN-111', 'CROWN-112', 'CROWN-113']);
});

test('upsertIssueSection appends a Jira issue section when one does not exist', () => {
  const body = upsertIssueSection('## Changes\n- Added dashboard polish', [
    'CROWN-111',
    'CROWN-112',
  ]);

  assert.match(body, /## Changes/);
  assert.match(body, /## Included Jira issues/);
  assert.match(body, /- CROWN-111/);
  assert.match(body, /- CROWN-112/);
});

test('upsertIssueSection replaces an existing Jira issue section in place', () => {
  const originalBody = [
    '## Changes',
    '- Added dashboard polish',
    '',
    renderIssueSection(['CROWN-101']),
  ].join('\n');
  const body = upsertIssueSection(originalBody, ['CROWN-201', 'CROWN-202']);

  assert.doesNotMatch(body, /CROWN-101/);
  assert.match(body, /CROWN-201/);
  assert.match(body, /CROWN-202/);
  assert.equal(body.match(/## Included Jira issues/g)?.length, 1);
});
