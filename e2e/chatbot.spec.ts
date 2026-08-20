import { test, expect } from '@playwright/test';

test.describe('Chatbot docs site', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PatternFly/i);
  });

  test('navigates to chatbot extension page', async ({ page }) => {
    await page.goto('/extensions/chatbot/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('chatbot component renders in example', async ({ page }) => {
    await page.goto('/extensions/chatbot/');

    const exampleSection = page.locator('.ws-example');
    if (await exampleSection.count() > 0) {
      await expect(exampleSection.first()).toBeVisible();
    }
  });
});
