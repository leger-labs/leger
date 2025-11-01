# Webhook Integration for Docs Repository

This document explains how to integrate the Leger CLI documentation with a separate documentation repository (e.g., `docs.leger.run`).

## Overview

When CLI commands change in the `leger` repository, the documentation is automatically regenerated and committed to `docs/cli/`. The docs repository can be notified via:

1. **Repository Dispatch** (recommended) - Active webhook notification
2. **File Watching** (alternative) - Passive monitoring of changes

## Option 1: Repository Dispatch (Active Webhook)

### Setup in leger-labs/leger

1. Create a GitHub Personal Access Token with `repo` scope
2. Add it as a secret: `DOCS_REPO_WEBHOOK_TOKEN`
3. Set repository variable: `DOCS_REPO=leger-labs/docs`

### Setup in docs repository

Create `.github/workflows/update-cli-docs.yml`:

```yaml
name: Update CLI Documentation

on:
  repository_dispatch:
    types: [cli_docs_updated]
  workflow_dispatch:

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout docs repo
        uses: actions/checkout@v4

      - name: Checkout leger repo
        uses: actions/checkout@v4
        with:
          repository: leger-labs/leger
          path: leger-repo
          ref: main

      - name: Copy CLI documentation
        run: |
          rm -rf content/cli/
          mkdir -p content/cli/
          cp -r leger-repo/docs/cli/* content/cli/

      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add content/cli/
          if git diff --cached --quiet; then
            echo "No changes to commit"
          else
            git commit -m "docs: update CLI documentation from leger@${{ github.event.client_payload.sha }}"
            git push
          fi
```

### Trigger Format

The webhook sends a `repository_dispatch` event with:

```json
{
  "event_type": "cli_docs_updated",
  "client_payload": {
    "repository": "leger-labs/leger",
    "ref": "refs/heads/main",
    "sha": "abc123..."
  }
}
```

## Option 2: File Watching (Passive)

The docs repository can periodically check for changes:

```yaml
name: Sync CLI Documentation

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  sync-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout docs repo
        uses: actions/checkout@v4

      - name: Checkout leger repo
        uses: actions/checkout@v4
        with:
          repository: leger-labs/leger
          path: leger-repo
          ref: main

      - name: Check for changes
        id: check
        run: |
          if ! diff -r content/cli/ leger-repo/docs/cli/ > /dev/null 2>&1; then
            echo "changed=true" >> $GITHUB_OUTPUT
          else
            echo "changed=false" >> $GITHUB_OUTPUT
          fi

      - name: Copy CLI documentation
        if: steps.check.outputs.changed == 'true'
        run: |
          rm -rf content/cli/
          mkdir -p content/cli/
          cp -r leger-repo/docs/cli/* content/cli/

      - name: Commit changes
        if: steps.check.outputs.changed == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add content/cli/
          git commit -m "docs: sync CLI documentation from leger"
          git push
```

## Manual Webhook Trigger

For testing or manual updates:

```bash
# Using GitHub CLI
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/leger-labs/docs/dispatches \
  -f event_type='cli_docs_updated' \
  -f client_payload[repository]='leger-labs/leger' \
  -f client_payload[ref]='refs/heads/main' \
  -f client_payload[sha]='latest'
```

## Cloudflare Worker Alternative

For more advanced use cases, you can deploy a Cloudflare Worker that receives webhooks and triggers the docs rebuild:

```javascript
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const payload = await request.json();

    // Verify webhook signature (optional but recommended)
    // ...

    // Trigger docs repository rebuild
    const response = await fetch(
      `https://api.github.com/repos/leger-labs/docs/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          event_type: 'cli_docs_updated',
          client_payload: payload,
        }),
      }
    );

    return new Response('Webhook processed', { status: 200 });
  },
};
```

## Security Considerations

1. **Token Security**: Use a fine-grained PAT with minimal permissions
2. **Webhook Verification**: Validate webhook signatures in production
3. **Rate Limiting**: Implement rate limiting on webhook endpoints
4. **Repository Permissions**: Ensure tokens only have access to required repos

## Troubleshooting

### Webhook not triggering

- Check `DOCS_REPO` variable is set correctly
- Verify `DOCS_REPO_WEBHOOK_TOKEN` has `repo` scope
- Check GitHub Actions logs in leger repository

### Documentation not updating

- Verify docs repository workflow is enabled
- Check for errors in docs repository Actions tab
- Ensure file paths match between repositories
