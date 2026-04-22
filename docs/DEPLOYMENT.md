# Deployment

## Overview

This project uses **GitHub Actions** for continuous deployment to **Cloudflare Workers** via **OpenNext**.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Local     │────▶│    Push      │────▶│  GitHub Actions │────▶│  Cloudflare      │
│ Development │     │   to master  │     │  CI/CD Pipeline │     │  Workers         │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────────┘
                                               │
                                               ▼
                                        ┌──────────────────┐
                                        │  • lint          │
                                        │  • type-check    │
                                        │  • build         │
                                        │  • deploy        │
                                        └──────────────────┘
```

## Prerequisites

### 1. GitHub Secrets

Configure the following secrets in your GitHub repository (Settings → Secrets → Actions):

| Secret | Description | How to Obtain |
|--------|-------------|---------------|
| `CLOUDFLARE_API_TOKEN` | API token for Cloudflare authentication | Cloudflare Dashboard → My Profile → API Tokens → Create Token (use "Edit Cloudflare Workers" template) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Cloudflare Dashboard → sidebar (bottom) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project identifier | Sanity.io → Project Settings |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name | Usually "production" |

### 2. Cloudflare Worker Configuration

Ensure `wrangler.jsonc` is properly configured:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "diegonr-next",
  // IMPORTANT: Update quarterly. See https://developers.cloudflare.com/workers/configuration/compatibility-dates/
  // Current: 2026-04-09 — verify this is within 30 days before deployment
  "compatibility_date": "2026-04-09",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "vars": {
    "NEXT_PUBLIC_SANITY_PROJECT_ID": "qda0c21o",
    "NEXT_PUBLIC_SANITY_DATASET": "production"
  },
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "diegonr-next"
    }
  ],
  "r2_buckets": [
    {
      "binding": "NEXT_INC_CACHE_R2_BUCKET",
      "bucket_name": "diegonr-portfolio-opennext-cache"
    }
  ],
  "images": {
    "binding": "IMAGES"
  }
}
```

### 3. Disable Cloudflare Workers Builds (if previously enabled)

If you previously used Cloudflare's native Git integration:

1. Go to Cloudflare Dashboard → Workers & Pages → Your Worker
2. Settings → Builds
3. Click "Disconnect" to avoid duplicate deployments

## Deployment Workflow

### Automatic Deployment

Every push to `master` triggers the deployment pipeline:

```bash
# Make changes locally
git add .
git commit -m "feat: add new feature"
git push origin master

# Deployment starts automatically (~2-3 minutes)
```

### Pipeline Steps

1. **Checkout**: Clones repository
2. **Setup Node.js 22**: Configures Node.js LTS
3. **Install dependencies**: `npm ci`
4. **Lint**: `npm run lint`
5. **Type check**: `npm run type-check`
6. **Build**: `npx opennextjs-cloudflare build`
7. **Deploy**: `wrangler deploy`

If any step fails, deployment is aborted.

## Monitoring Deployments

### View Deployment Status

```bash
# List recent runs
gh run list --workflow=Deploy

# View live logs
gh run view --web

# Or visit: https://github.com/500Byte/diegonr-next/actions
```

### View Worker Logs

```bash
# Real-time logs
wrangler tail

# Filter by status
wrangler tail --status error
```

## Rollback

If a deployment causes issues:

```bash
# List versions
wrangler versions list

# Rollback to previous version
wrangler rollback

# Or rollback to specific version
wrangler rollback <VERSION_ID>
```

## Local Build Verification

Before pushing, you can verify the build locally:

```bash
# Build for Cloudflare
npm run preview

# This runs: opennextjs-cloudflare build && opennextjs-cloudflare preview
```

## Troubleshooting

### Build Failures

**Issue**: `npm ci` fails  
**Solution**: Delete `node_modules` and `package-lock.json`, run `npm install` locally, commit changes

**Issue**: Type errors  
**Solution**: Run `npm run type-check` locally and fix errors

**Issue**: Lint errors  
**Solution**: Run `npm run lint:fix` locally

### Deployment Failures

**Issue**: Worker deploy fails  
**Solution**: 
1. Check secrets are configured correctly
2. Verify `wrangler.jsonc` syntax
3. Check Cloudflare dashboard for conflicts

**Issue**: "Worker not found"  
**Solution**: Worker name in `wrangler.jsonc` must match existing worker or be auto-provisioned

### Performance Issues

Check Worker startup time:
```bash
wrangler check startup
```

### Generate TypeScript Types

After changing `wrangler.jsonc`, regenerate types:
```bash
wrangler types
```

### Local Development Secrets

For local development, create `.dev.vars` (never commit this file):
```bash
# .dev.vars content (example)
SANITY_API_TOKEN=your-local-token
```

## Local Development

Start local dev with Cloudflare runtime simulation:
```bash
wrangler dev
```

Start local dev with remote bindings (AI, Vectorize, etc.):
```bash
wrangler dev --remote
```

## Environment Variables

### Build-time Variables (Required in GitHub Secrets)

These are needed during the build process and must be in GitHub secrets:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

### Runtime Variables (Configured in wrangler.jsonc)

Non-sensitive variables are defined in `wrangler.jsonc` under `vars`:

```jsonc
"vars": {
  "NEXT_PUBLIC_SANITY_PROJECT_ID": "your-project-id",
  "NEXT_PUBLIC_SANITY_DATASET": "production"
}
```

### Secrets (Configured via wrangler)

Sensitive values should be set via wrangler (not committed):

```bash
wrangler secret put SANITY_API_TOKEN
```

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [CI_CD.md](CI_CD.md) - Detailed CI/CD documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
