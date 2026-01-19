import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('index.html');

});

/**
 * Projects are loaded and are visible in the list
 */
test('Projects are loaded and are visible in the list', async ({ page }) => {
  const trigger = page.getByTestId('project-trigger')
  await trigger.click();

  const menu = page.getByTestId('dropdown-menu')
  await expect(menu).toBeVisible();

  const list = page.getByTestId('projects-list')

  await expect(list).not.toBeEmpty()
  await expect(list).toContainText('Web Design');
  await expect(list).toContainText('App Development');
  await expect(list).toContainText('Consulting');
});