import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for smoke tests
 * Minimal setup for deployment confidence
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3005',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run clean:dev && next dev -p 3005',
    url: 'http://localhost:3005',
    reuseExistingServer: !process.env.CI,
  },
});
