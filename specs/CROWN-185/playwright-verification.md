# Playwright Verification Strategy

## Problem

The built-in Playwright MCP flow is not reliable in this environment. When invoked from this machine, it fails before navigation with:

```text
Error: ENOENT: no such file or directory, mkdir '/.playwright-mcp'
```

The failure happens because the MCP process attempts to create `/.playwright-mcp`, which is not writable here. That means "use Playwright MCP" should not stop the work. It should fall back to a repeatable local Playwright verification path instead.

## Fallback Strategy

1. Try Playwright MCP first when requested.
2. If MCP fails with the `/.playwright-mcp` mkdir error, switch immediately to local Playwright CLI/browser automation.
3. Use Storybook URLs directly and capture screenshots of each state to verify spacing, sizing, icons, and interaction affordances.
4. When DOM-level inspection is needed, run Playwright from a temporary local install instead of waiting on MCP recovery.

## Working Commands

### Browser Runtime

Install a local browser runtime if needed:

```bash
npx -y playwright@latest install chromium
```

Use the locally installed Chrome channel when available:

```text
/Applications/Google Chrome.app
```

### Screenshot Verification

Use Playwright CLI screenshots for state-by-state review:

```bash
npx -y playwright@latest screenshot \
  --channel chrome \
  --wait-for-timeout 1500 \
  --viewport-size "1600,900" \
  "http://localhost:6006/?path=/story/ui-chip--default" \
  /tmp/ui-chip-default.png
```

Repeat the same pattern for each Storybook story URL under review.

### DOM Inspection

When screenshots are not enough, install a temporary Playwright runtime and run a small Node script against it:

```bash
npm install --prefix /tmp/pw playwright@1.59.1
```

Then require Playwright from `/tmp/pw/node_modules/playwright` in a local script to inspect computed layout, SVG sizing, or nested button structure.

## Storybook URL Guidance

- Use `?path=/story/...` manager URLs for screenshot parity with what reviewers see in Storybook.
- Use `iframe.html?id=...&viewMode=story` when DOM-only inspection is needed without the Storybook manager chrome.

## Expected Agent Behavior Next Time

When a future request says "use Playwright MCP" in this repository:

1. Attempt MCP once.
2. If the `/.playwright-mcp` path error appears, do not block on MCP.
3. Continue with local Playwright CLI/browser automation.
4. Report clearly that MCP is environment-blocked and that the verification used the documented fallback path.

## Why This Is In Scope For CROWN-185

This fallback process was required to validate and fix the `Chip` Storybook issues in `CROWN-185`, including text hugging, missing leading icon rendering, and removable `X` icon alignment. Keeping the strategy with the Jira scope makes the UI verification path reusable for follow-up review on the same component work.
