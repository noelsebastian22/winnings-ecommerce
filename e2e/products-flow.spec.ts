import { test, expect } from '@playwright/test';
import {
  mockApiResponse,
  clearStorage,
  waitForRoute,
  elementExists,
  takeTimestampedScreenshot,
} from './helpers/test-helpers';

const MOCK_PRODUCTS = [
  {
    sku: 'sku-1',
    name: 'Laptop Pro',
    price: 1999,
    rrp: 2299,
    image: '/assets/laptop-pro.jpg',
  },
  {
    sku: 'sku-2',
    name: 'Phone Max',
    price: 999,
    rrp: 1099,
    image: '/assets/phone-max.jpg',
  },
];

test.describe('Products flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await mockApiResponse(page, '**/products.json', MOCK_PRODUCTS);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Screenshot on failure into e2e/screenshots/
    if (testInfo.status !== testInfo.expectedStatus) {
      await takeTimestampedScreenshot(
        page,
        testInfo.title.replace(/\s+/g, '_'),
      );
    }
  });

  test('Home → Products, add to cart, modal, persistence (+ optional header count)', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/home$/);
    await page.getByRole('button', { name: /shop now/i }).click();

    await waitForRoute(page, '/products');
    await expect(
      page.getByRole('heading', { name: /our products/i }),
    ).toBeVisible();

    await page
      .getByRole('button', { name: /add to cart/i })
      .first()
      .click();

    const dialog = page.getByRole('dialog', { name: /added to cart!/i });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: MOCK_PRODUCTS[0].name }),
    ).toBeVisible();

    await dialog.getByRole('button', { name: /continue shopping/i }).click();
    await expect(dialog).toBeHidden();

    await expect
      .poll(
        async () => {
          const state = await page.evaluate(() => {
            const raw = localStorage.getItem('cart');
            try {
              return raw ? JSON.parse(raw) : null;
            } catch {
              return null;
            }
          });
          return state?.totalItems ?? 0;
        },
        { timeout: 5000, message: 'cart.totalItems should become 1' },
      )
      .toBe(1);

    const cartCount = page.getByTestId('cart-count');
    if (await elementExists(cartCount)) {
      await expect(cartCount).toHaveText(/1/);
    }

    await page.reload();
    await expect(
      page.getByRole('heading', { name: /our products/i }),
    ).toBeVisible();

    if (await elementExists(cartCount)) {
      await expect(cartCount).toHaveText(/1/);
    }
  });
});
