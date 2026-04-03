import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const JIRA_ISSUES_SECTION_START = '<!-- jira-issues:start -->';
export const JIRA_ISSUES_SECTION_END = '<!-- jira-issues:end -->';

export function collectIssueKeysFromCommits(commitMessages) {
  const issueKeys = [];
  const seenIssueKeys = new Set();

  for (const message of commitMessages) {
    const matches = message.match(/\bCROWN-\d+\b/g) ?? [];

    for (const issueKey of matches) {
      if (seenIssueKeys.has(issueKey)) {
        continue;
      }

      seenIssueKeys.add(issueKey);
      issueKeys.push(issueKey);
    }
  }

  return issueKeys;
}

export function renderIssueSection(issueKeys) {
  const issueLines = issueKeys.map((issueKey) => `- ${issueKey}`).join('\n');

  return [
    JIRA_ISSUES_SECTION_START,
    '## Included Jira issues',
    issueLines,
    JIRA_ISSUES_SECTION_END,
  ].join('\n');
}

export function upsertIssueSection(existingBody, issueKeys) {
  const trimmedBody = existingBody.trim();
  const issueSection = renderIssueSection(issueKeys);
  const issueSectionPattern = new RegExp(
    `${JIRA_ISSUES_SECTION_START}[\\s\\S]*?${JIRA_ISSUES_SECTION_END}`,
    'm',
  );

  if (issueSectionPattern.test(trimmedBody)) {
    return trimmedBody.replace(issueSectionPattern, issueSection);
  }

  if (!trimmedBody) {
    return issueSection;
  }

  return `${trimmedBody}\n\n${issueSection}`;
}

function getRequiredEnvVar(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getCommitMessagesForReleaseRange(previousTag, releaseTag) {
  const gitArgs = previousTag
    ? ['log', '--format=%B%x00', `${previousTag}..${releaseTag}`]
    : ['log', '--format=%B%x00', releaseTag];

  const output = execFileSync('git', gitArgs, { encoding: 'utf8' });

  return output
    .split('\u0000')
    .map((message) => message.trim())
    .filter(Boolean);
}

async function githubRequest(url, init) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${getRequiredEnvVar('GITHUB_TOKEN')}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub API request failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

async function main() {
  const repository = getRequiredEnvVar('GITHUB_REPOSITORY');
  const releaseTag = getRequiredEnvVar('RELEASE_TAG');
  const previousTag = process.env.PREVIOUS_TAG?.trim() ?? '';
  const [owner, repo] = repository.split('/');

  if (!owner || !repo) {
    throw new Error(`Invalid GITHUB_REPOSITORY value: ${repository}`);
  }

  const commitMessages = getCommitMessagesForReleaseRange(previousTag, releaseTag);
  const issueKeys = collectIssueKeysFromCommits(commitMessages);

  if (issueKeys.length === 0) {
    console.log(
      `No Jira issue keys found between ${previousTag || 'repository start'} and ${releaseTag}.`,
    );
    return;
  }

  const release = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/releases/tags/${releaseTag}`,
    { method: 'GET' },
  );
  const updatedBody = upsertIssueSection(release.body ?? '', issueKeys);

  await githubRequest(`https://api.github.com/repos/${owner}/${repo}/releases/${release.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      body: updatedBody,
    }),
  });

  console.log(`Updated release ${releaseTag} with ${issueKeys.length} Jira issue(s).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
