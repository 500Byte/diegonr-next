import { test, expect } from '@playwright/test';

/**
 * Smoke tests for critical pages
 * Verifies pages load without 500 errors or critical console errors
 */

const criticalPages = [
  { path: '/es', name: 'Home (ES)' },
  { path: '/en', name: 'Home (EN)' },
  { path: '/es/about', name: 'About (ES)' },
  { path: '/en/about', name: 'About (EN)' },
  { path: '/es/projects', name: 'Projects (ES)' },
  { path: '/en/projects', name: 'Projects (EN)' },
  { path: '/es/blog', name: 'Blog (ES)' },
  { path: '/en/blog', name: 'Blog (EN)' },
  { path: '/es/contact', name: 'Contact (ES)' },
  { path: '/en/contact', name: 'Contact (EN)' },
];

test.describe('Critical Pages Smoke Tests', () => {
  // Collect console errors for each test
  let consoleErrors: string[] = [];

  test.beforeEach(({ page }) => {
    consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });
  });

  for (const page of criticalPages) {
    test(`${page.name} loads without errors`, async ({ page: pageObj }) => {
      const response = await pageObj.goto(page.path);
      
      // Verify page loaded (not 500)
      expect(response?.status()).toBeLessThan(500);
      expect(response?.status()).not.toBe(500);
      
      // Wait for page to be fully loaded
      await pageObj.waitForLoadState('networkidle');
      
      // Basic smoke: page title should exist
      const title = await pageObj.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
      
      // Check for critical console errors
      const criticalErrors = consoleErrors.filter(err => 
        !err.includes('favicon') && // Ignore favicon errors
        !err.includes('hot-update') // Ignore HMR errors in dev
      );
      
      expect(criticalErrors).toHaveLength(0);
    });
  }
});

test.describe('404 Page', () => {
  test('returns 404 for non-existent pages', async ({ page }) => {
    const response = await page.goto('/es/non-existent-page-12345');
    expect(response?.status()).toBe(404);
  });
});
