import { test, expect } from '@playwright/test';
import { start } from 'node:repl';

test.beforeEach(async ({ page }) => {
  await page.goto('index.html');

  await page.evaluate(() => window.localStorage.clear());
});

/**
 * Projects are loaded and are visible in the list
 */
test('Projects are loaded and are visible in the list', async ({ page }) => {
  const trigger = page.getByTestId('project-trigger');
  await trigger.click();

  const menu = page.getByTestId('dropdown-menu');
  await expect(menu).toBeVisible();

  const list = page.getByTestId('projects-list');

  await expect(list).not.toBeEmpty()
  await expect(list).toContainText('Web Design');
  await expect(list).toContainText('App Development');
  await expect(list).toContainText('Consulting');
});

test('start and stop an entry', async ({ page }) => {

  page.on('load', () => {
    console.error('ALARM: Die Seite hat sich neu geladen!');
    throw new Error('Die Seite hat sich unerwartet neu geladen! Test abgebrochen.');
  });

  const trigger = page.getByTestId('project-trigger');
  await trigger.click();

  const menu = page.getByTestId('dropdown-menu');
  await expect(menu).toBeVisible();

  const list = page.getByTestId('projects-list');
  await expect(list).not.toBeEmpty();
  await list.getByText('Web Design').click();

  const activeProjectDisplay = page.locator('#selectedProjectText');
  await expect(activeProjectDisplay).toHaveText('Web Design');

  await expect(menu).toBeHidden();

  const startStopbtn = page.getByTestId('start-stop-btn');
  await startStopbtn.click();
  await page.waitForTimeout(3000);
  await startStopbtn.click();

  const endSessionbtn = page.getByTestId('end-session-btn');
  await endSessionbtn.click();

  const listbtn = page.getByTestId('history-btn');
  await listbtn.click();

  const entryList = page.getByTestId('history-list');
  await expect(entryList).toBeVisible();
  await expect(entryList).toContainText('Web Design');

  await expect(entryList.locator('li')).toHaveCount(1);
});