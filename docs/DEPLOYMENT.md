# Deployment

## Build Process
The application is a standard Next.js project. It can be built using:
```bash
npm run build
```
This command compiles the application into the `.next` folder, ready for production deployment.

## Hosting Environments

### Cloudflare Pages (Production)
This project is configured for deployment on **Cloudflare Pages** via **OpenNext**.
1. Push the repository to GitHub.
2. Connect the repo to Cloudflare Pages.
3. Configure build settings:
   - Build command: `npx opennextjs-cloudflare build`
   - Build output directory: `.open-next`
4. Deploy:
   ```bash
   npm run deploy
   ```
This requires configuring the worker environment in `wrangler.jsonc` and managing secrets in the Cloudflare dashboard.

### Sanity Studio (Admin Panel)
The CMS management interface is a standalone React application located in the `/sanity` directory. It is deployed to Sanity's global hosting:
```bash
cd sanity
npx sanity deploy
```

## CMS Considerations
This project uses **Sanity Cloud**. Ensure the following environment variables are set in your deployment environment (Vercel/Cloudflare):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity Project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually "production" |
| `SANITY_API_TOKEN` | A Sanity API Token (Read-only or Editor as needed) |

Content edits are made at `cloud.sanity.io` and reflect in the production build according to the `useCdn` setting and ISR/Revalidation configuration in `src/lib/sanity.ts`.
