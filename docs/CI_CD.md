# CI/CD Pipeline

## Overview

This project uses **GitHub Actions** for continuous integration and deployment (CI/CD) to **Cloudflare Workers**.

## Pipeline Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Local     │────▶│  git push    │────▶│  GitHub Actions │────▶│  Cloudflare      │
│Development  │     │   master     │     │  CI/CD Pipeline │     │  Workers         │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────────┘
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    ▼                           ▼                           ▼
            ┌──────────────┐          ┌────────────────┐          ┌────────────────┐
            │ 1. lint      │          │ 2. type-check  │          │ 3. build       │
            │    (eslint)  │          │    (tsc)       │          │    (opennext)  │
            └──────────────┘          └────────────────┘          └────────────────┘
                                                                           │
                                                                           ▼
                                                                  ┌────────────────┐
                                                                  │ 4. deploy      │
                                                                  │    (wrangler)  │
                                                                  └────────────────┘
```

## Workflow Configuration

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - uses: actions/setup-node@v5
        with:
          node-version: '22'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

      - name: Build for Cloudflare
        run: npx opennextjs-cloudflare build
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ secrets.NEXT_PUBLIC_SANITY_DATASET }}

      - name: Deploy
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

## Design Decisions

### Single Job vs Multiple Jobs

**Decision**: Use a single job (`deploy`) instead of separate `build` and `deploy` jobs.

**Rationale**:
- Jobs in GitHub Actions run on isolated runners with fresh filesystems
- Sharing artifacts between jobs requires `actions/upload-artifact` and `actions/download-artifact`
- Adds complexity and extra time for artifact upload/download
- Our build is fast enough (~2-3 minutes total) that parallelization doesn't provide significant benefit
- Simpler mental model: linear pipeline where any failure stops deployment

### Node.js 22 LTS

**Decision**: Use Node.js 22 LTS instead of 20 or 24.

**Rationale**:
- Node 20 reaches EOL in April 2026 (too soon)
- Node 22 is LTS until April 2027 (stable, well-supported)
- Node 24 is very new (might have compatibility issues)
- Our stack (Next.js 16, OpenNext, Wrangler) works perfectly with Node 22
- Balance between stability and modern features

### Direct wrangler vs wrangler-action

**Decision**: Use `npx wrangler deploy` directly instead of `cloudflare/wrangler-action@v3`.

**Rationale**:
- `wrangler-action@v3` runs on Node 20 internally, triggering deprecation warnings
- Using `npx wrangler deploy` directly eliminates the warning completely
- Wrangler is already in `devDependencies`, so it's available after `npm ci`
- Wrangler automatically reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from environment
- Cleaner workflow with fewer external action dependencies

### Direct Deploy vs Version Upload

**Decision**: Use `wrangler deploy` directly instead of `versions upload`.

**Rationale**:
- Simple workflow: push → deploy
- No manual promotion step needed
- Rollback is easy via `wrangler rollback` if needed
- Fits our "push and forget" workflow preference

## Required Secrets

Configure in GitHub → Settings → Secrets → Actions:

| Secret | Description | Source |
|--------|-------------|--------|
| `CLOUDFLARE_API_TOKEN` | API token for Cloudflare | Cloudflare Dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Cloudflare Dashboard sidebar (bottom) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | Sanity.io → Project Settings |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset | Usually "production" |

## Monitoring

### View Workflow Status

```bash
# List recent runs
gh run list --workflow=Deploy

# View specific run
gh run view <RUN_ID>

# View logs in browser
gh run view --web
```

### Check Deployment Status

```bash
# View Worker details
wrangler info diegonr-next

# View recent versions
wrangler versions list

# Tail live logs
wrangler tail
```

## Troubleshooting

### Pipeline Failures

#### Lint Errors
```bash
# Fix automatically
npm run lint:fix

# Check manually
npm run lint
```

#### Type Errors
```bash
# Check types
npm run type-check

# Fix errors in your editor
```

#### Build Failures
```bash
# Build locally to debug
npm run preview

# Check OpenNext output
ls -la .open-next/
```

#### Deploy Failures

**Authentication Issues**:
- Verify `CLOUDFLARE_API_TOKEN` is set correctly
- Check token has "Edit Cloudflare Workers" permission
- Verify `CLOUDFLARE_ACCOUNT_ID` matches your account

**Worker Configuration Issues**:
- Check `wrangler.jsonc` syntax
- Verify worker name matches or can be auto-provisioned
- Check Cloudflare Dashboard for existing configurations

## Rollback Procedure

If a deployment causes issues:

```bash
# List versions
wrangler versions list

# Rollback to previous
wrangler rollback

# Or rollback to specific version
wrangler rollback <VERSION_ID>
```

Alternative: Push a revert commit to master
```bash
git revert HEAD
git push origin master
```

## Security Considerations

1. **Secrets are encrypted**: GitHub secrets are never exposed in logs
2. **No secrets in code**: Never commit API keys or tokens
3. **Token scope**: Use minimal scope API tokens (Edit Cloudflare Workers only)
4. **Branch protection**: Consider enabling branch protection on master

## Performance Optimization

### Caching

The workflow uses built-in caching:
- `actions/setup-node` caches npm dependencies
- `.open-next` is generated fresh each run (no cache needed)

### Build Time

Current average: **2-3 minutes**

Breakdown:
- Checkout: ~5s
- Setup Node: ~5s
- npm ci: ~45-60s (with cache)
- Lint: ~2s
- Type check: ~8s
- Build: ~30-40s
- Deploy: ~10-20s

## Future Improvements

### Potential Enhancements

1. **Branch Protection**: Require PR reviews before merging to master
2. **Preview Deploys**: Deploy PRs to preview URLs (requires more complex setup)
3. **Notifications**: Slack/Discord notifications on deploy success/failure
4. **Build Matrix**: Test on multiple Node versions (if needed)
5. **Caching**: Cache `.open-next` between builds (if build times increase)

### Migration Path

If we need more control in the future:
- Separate jobs with artifact passing
- Manual approval gates
- Staging environment
- Automated rollback on error detection

## Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment guide
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
