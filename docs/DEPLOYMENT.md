# Deployment

## Build Process
The application is a standard Next.js project. It can be built using:
```bash
npm run build
```
This command compiles the application into the `.next` folder, ready for production deployment.

## Hosting Environments
As a Next.js application, it is highly optimized for deployment on Vercel:
1. Push the repository to GitHub/GitLab.
2. Import the project into Vercel.
3. Vercel will automatically detect Next.js and apply the correct build settings (`npm run build`).

Alternatively, it can be deployed on any Node.js hosting provider (e.g., Railway, Render, AWS, DigitalOcean) by running:
```bash
npm run build
npm run start
```

## CMS Considerations
Since Keystatic is configured in `local` storage mode (`kind: 'local'` in `keystatic.config.ts`), content edits should be made locally during development, committed to Git, and then pushed. If remote editing is desired in production, Keystatic would need to be reconfigured to use the `github` storage kind.
