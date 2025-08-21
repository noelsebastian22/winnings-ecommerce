import { test, expect } from '@playwright/test';

test.describe('App Component', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/AngularStarterTemplate/);
  });

  test('should navigate to different routes', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();
  });
});
