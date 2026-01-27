import { test, expect } from '@playwright/test';
import { createMockEntry } from './test-utils';

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

/**
 * Start and stop an entry
 */
test('start and stop an entry', async ({ page }) => {

  page.on('load', () => {
    console.error('RELOAD: Site reloaded');
    throw new Error('Site reloaded. Test cancelled.');
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

  const entryList = page.getByTestId('history-list');
  await expect(entryList).toContainText('Web Design');

  await expect(entryList.locator('li')).toHaveCount(1);
});

/**
 * Entry stays in history list after page refresh
 */
test('Entry stays in history list after page refresh', async ({ page }) => {
  const entryToDelete = createMockEntry({
    projectName: "Web Design"
  });

  const storageData = JSON.stringify([entryToDelete]);

  await page.addInitScript((data) => {
    window.localStorage.setItem('timeEntries', data);
  }, storageData);

  await page.goto('index.html');
  await page.reload();

  const trigger = page.getByTestId('project-trigger');
  await trigger.click();

  const menu = page.getByTestId('dropdown-menu');
  await expect(menu).toBeVisible();

  const list = page.getByTestId('projects-list');
  await expect(list).not.toBeEmpty();
  await list.getByText('Web Design').click();

  const entryList = page.getByTestId('history-list');
  await expect(entryList).toBeVisible();
  await expect(entryList).toContainText('Web Design');
  await expect(entryList.locator('li')).toHaveCount(1);
});

/**
 * Delete entry and update time sum
 */
test('Delete entry and update time sum', async ({ page }) => {
  const entryToDelete = createMockEntry({
    projectName: 'Web Design',
    durationMinutes: 60
  });

  const storageData = JSON.stringify([entryToDelete]);

  await page.addInitScript((data) => {
    window.localStorage.setItem('timeEntries', data);
  }, storageData);

  await page.goto('index.html');

  const trigger = page.getByTestId('project-trigger');
  await trigger.click();

  const menu = page.getByTestId('dropdown-menu');
  await expect(menu).toBeVisible();

  const list = page.getByTestId('projects-list');
  await expect(list).not.toBeEmpty();
  await list.getByText('Web Design').click();
  
  const totalTime = page.getByTestId('totalTime');
  await expect(totalTime).toContainText("60");
  
  const entryList = page.getByTestId('history-list');
  await expect(entryList).toBeVisible();
  await expect(entryList).toContainText('Web Design');


  // handle browser pop-up
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('Are you sure');
    await dialog.accept();
  });

  const deletebtn = page.getByTestId('delete-btn');
  await deletebtn.click()

  await expect(entryList).not.toContainText('projectString');
  await expect(entryList).toContainText('No entries found for this project.');

  await expect(totalTime).toContainText("0");
});

/** 
 * Reset all entries for the currently selected project
 */ 
test('Reset all entries for the currently selected project', async ({ page }) => {
  const entries = [
    { projectid: "1", projectName: 'Web Design', durationMinutes: 30, date: '2026-01-20' },
    { projectid: "1", projectName: 'Web Design', durationMinutes: 45, date: '2026-01-21' },
    { projectid: "2", projectName: 'App Development', durationMinutes: 100, date: '2026-01-22' }
  ];

  await page.addInitScript((data) => {
    window.localStorage.setItem('timeEntries', JSON.stringify(data));
  }, entries);

  await page.goto('index.html');

  const trigger = page.getByTestId('project-trigger');
  await trigger.click();

  const list = page.getByTestId('projects-list');
  await expect(list).not.toBeEmpty();
  await list.getByText('Web Design').click();

  const entryList = page.getByTestId('history-list');
  await expect(entryList.locator('li.entry-item')).toHaveCount(2);
  await expect(page.getByTestId('totalTime')).toContainText("75");

  page.on('dialog', async dialog => {
    if (dialog.type() === 'confirm') {
      expect(dialog.message()).toContain('Are you sure you want to delete all entries for the project \"Web Design\"?');
      await dialog.accept();
    } else if (dialog.type() === 'alert') {
      await dialog.accept();
    }
  });

  const resetAllBtn = page.getByTestId('reset-all-btn');
  await resetAllBtn.click();

  await expect(entryList).toContainText('No entries found for this project.');
  await expect(page.getByTestId('totalTime')).toContainText("0");

  const finalStorage = await page.evaluate(() => JSON.parse(window.localStorage.getItem('timeEntries') || '[]'));

  expect(finalStorage).toHaveLength(1);
  expect(finalStorage[0].projectName).toBe('App Development');
});

/**
 * Cannot exceed 600 total minutes for a single project
 **/
test('Cannot exceed 600 total minutes for a sinngle project', async ({ page }) => {
  const entries = [
    { 
      projectid: "1", 
      projectName: 'Web Design', 
      durationMinutes: 500, 
      date: new Date().toISOString().split('T')[0], 
      startTime: "08:00", 
      endTime: "16:20" 
    }
  ];

  await page.addInitScript((data) => {
    window.localStorage.setItem('timeEntries', JSON.stringify(data));
  }, entries);

  await page.goto('index.html');

  await page.locator('#addEntryBtn').click();

  const select = page.locator('#formProjectId');
  await select.selectOption({ label: 'Web Design' });

  await page.locator('#formDate').fill('2026-01-26');
  await page.locator('#formStartTime').fill('17:00');
  await page.locator('#formEndTime').fill('19:00');

  await page.locator('#submitFormBtn').click();

  const errorEl = page.locator('#formError');
  await expect(errorEl).toBeVisible();
  await expect(errorEl).toContainText('Limit reached!');
  await expect(errorEl).toContainText('100 more minutes');

  const finalStorage = await page.evaluate(() => JSON.parse(window.localStorage.getItem('timeEntries') || '[]'));
  expect(finalStorage).toHaveLength(1);
});

/**
 * Edit an existing time entry and save changes
 **/
test('Edit an existing time entry and save changes', async ({ page }) => {
  const entryToEdit = {
    projectid: "1",
    projectName: 'Web Design',
    durationMinutes: 60,
    date: '2026-01-20',
    startTime: "10:00",
    endTime: "11:00",
    notes: "Original Note"
  };

  await page.addInitScript((data) => {
    window.localStorage.setItem('timeEntries', JSON.stringify([data]));
  }, entryToEdit);

  await page.goto('index.html');

  const trigger = page.getByTestId('project-trigger');
  await trigger.click();
  await page.getByTestId('projects-list').getByText('Web Design').click();

  const entryItem = page.locator('.entry-main-content');
  await entryItem.click();

  const modal = page.locator('#detailModal');
  await expect(modal).toBeVisible();
  await expect(page.locator('#editNotes')).toHaveValue('Original Note');

  await page.locator('#editEndTime').fill('12:00');
  await page.locator('#editNotes').fill('Updated Note');

  await page.locator('#saveEditBtn').click();

  await expect(modal).toBeHidden();

  const entryList = page.getByTestId('history-list');
  await expect(entryList).toContainText('120 min');

  await expect(page.getByTestId('totalTime')).toHaveText('120');

  const finalStorage = await page.evaluate(() => JSON.parse(window.localStorage.getItem('timeEntries') || '[]'));
  expect(finalStorage[0].durationMinutes).toBe(120);
  expect(finalStorage[0].notes).toBe('Updated Note');
  expect(finalStorage[0].endTime).toBe('12:00');
});

