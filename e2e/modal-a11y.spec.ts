import { test, expect } from '@playwright/test';
import { mockApiResponse, clearStorage } from './helpers/test-helpers';

const MOCK_PRODUCTS = [
  {
    sku: 'sku-1',
    name: 'Laptop Pro',
    price: 1999,
    rrp: 2299,
    image: '/assets/laptop-pro.jpg',
  },
];

test.describe('Add-to-Cart modal accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await mockApiResponse(page, '**/products.json', MOCK_PRODUCTS);
  });

  test('overlay is focusable and closable via keyboard', async ({ page }) => {
    await page.goto('/products');

    await page
      .getByRole('button', { name: /add to cart/i })
      .first()
      .click();

    const dialog = page.getByRole('dialog', { name: /added to cart!/i });
    await expect(dialog).toBeVisible();

    const overlayButton = page.getByRole('button', { name: /close modal/i });
    await overlayButton.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeHidden();
  });
});
