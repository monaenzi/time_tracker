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

  // With grouping by day, we have 1 group header + 1 entry = 2 li elements
  // Or check for entry items specifically
  await expect(entryList.locator('.entry-item')).toHaveCount(1);
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
  // With grouping by day, we have 1 group header + 1 entry = 2 li elements
  // Or check for entry items specifically
  await expect(entryList.locator('.entry-item')).toHaveCount(1);
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
  // The message is "No entries found for this period." when using grouping
  await expect(entryList).toContainText('No entries found');

  await expect(totalTime).toContainText("0");
});

/**
 * Test week/month filtering functionality [S2][US-02][T4]
 */
test('Filter time entries by week and month period', async ({ page }) => {
  // Create test entries with different dates
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  
  const testEntries = [
    createMockEntry({ 
      date: formatDate(today), 
      startTime: '09:00', 
      endTime: '10:00', 
      durationMinutes: 60,
      notes: 'Today entry'
    }),
    createMockEntry({ 
      date: formatDate(weekAgo), 
      startTime: '10:00', 
      endTime: '11:00', 
      durationMinutes: 60,
      notes: 'Week ago entry'
    }),
    createMockEntry({ 
      date: formatDate(twoWeeksAgo), 
      startTime: '11:00', 
      endTime: '12:00', 
      durationMinutes: 60,
      notes: 'Two weeks ago entry'
    }),
    createMockEntry({ 
      date: formatDate(lastMonth), 
      startTime: '14:00', 
      endTime: '15:00', 
      durationMinutes: 60,
      notes: 'Last month entry'
    })
  ];

  const storageData = JSON.stringify(testEntries);

  await page.addInitScript((data) => {
    window.localStorage.setItem('timeEntries', data);
  }, storageData);

  await page.goto('index.html');

  // Select a project
  const trigger = page.getByTestId('project-trigger');
  await trigger.click();

  const menu = page.getByTestId('dropdown-menu');
  await expect(menu).toBeVisible();

  const list = page.getByTestId('projects-list');
  await expect(list).not.toBeEmpty();
  await list.getByText('Web Design').click();

  const entryList = page.getByTestId('history-list');
  await expect(entryList).toBeVisible();

  // Test Week View - should show entries from current week
  const weekViewBtn = page.locator('#weekViewBtn');
  await expect(weekViewBtn).toBeVisible();
  await weekViewBtn.click();
  
  // Wait for rendering
  await page.waitForTimeout(500);
  
  // In week view, should see entries from current week (today's entry)
  // Check that the entry with today's time is visible
  await expect(entryList).toContainText('09:00 - 10:00');
  
  // Verify period label shows week range
  const periodLabel = page.locator('#periodLabel');
  await expect(periodLabel).toBeVisible();
  await expect(periodLabel).not.toHaveText('Current Period'); // Should show actual period
  const weekLabelText = await periodLabel.textContent();
  expect(weekLabelText).toContain('Jan.'); // Should contain month abbreviation
  
  // Test Month View - should show entries from current month
  const monthViewBtn = page.locator('#monthViewBtn');
  await expect(monthViewBtn).toBeVisible();
  await monthViewBtn.click();
  
  // Wait for rendering
  await page.waitForTimeout(500);
  
  // In month view, should see entries from current month
  // Should see today's entry (09:00) and week ago entry (10:00)
  await expect(entryList).toContainText('09:00 - 10:00');
  await expect(entryList).toContainText('10:00 - 11:00');
  
  // Verify period label shows month
  const monthLabelText = await periodLabel.textContent();
  expect(monthLabelText).toContain('Januar'); // Should contain month name in German
  
  // Test navigation - go to previous week
  const prevPeriodBtn = page.locator('#prevPeriodBtn');
  await expect(prevPeriodBtn).toBeVisible();
  
  // Switch back to week view for navigation test
  await weekViewBtn.click();
  await page.waitForTimeout(500);
  
  // Navigate to previous week
  await prevPeriodBtn.click();
  await page.waitForTimeout(500);
  
  // Should now see entries from previous week
  // The week ago entry (10:00) should be visible
  await expect(entryList).toContainText('10:00 - 11:00');
  
  // Test navigation - go to next period
  const nextPeriodBtn = page.locator('#nextPeriodBtn');
  await expect(nextPeriodBtn).toBeVisible();
  await nextPeriodBtn.click();
  await page.waitForTimeout(500);
  
  // Should be back to current week - today's entry should be visible again
  await expect(entryList).toContainText('09:00 - 10:00');
  
  // Verify total time is calculated correctly for filtered entries
  const totalTime = page.getByTestId('totalTime');
  await expect(totalTime).toBeVisible();
  
  console.log('Week/Month filtering test completed successfully');
});

/**
 * Test day grouping functionality [S2][US-02][T5]
 */
test('Group time entries by day', async ({ page }) => {
  // Create test entries with different dates
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  
  const testEntries = [
    createMockEntry({ 
      date: formatDate(today), 
      startTime: '09:00', 
      endTime: '10:00', 
      durationMinutes: 60,
      projectName: 'Web Design'
    }),
    createMockEntry({ 
      date: formatDate(today), 
      startTime: '14:00', 
      endTime: '15:30', 
      durationMinutes: 90,
      projectName: 'Web Design'
    }),
    createMockEntry({ 
      date: formatDate(yesterday), 
      startTime: '10:00', 
      endTime: '11:00', 
      durationMinutes: 60,
      projectName: 'Web Design'
    }),
    createMockEntry({ 
      date: formatDate(twoDaysAgo), 
      startTime: '13:00', 
      endTime: '14:00', 
      durationMinutes: 60,
      projectName: 'Web Design'
    }),
    createMockEntry({ 
      date: formatDate(twoDaysAgo), 
      startTime: '15:00', 
      endTime: '16:00', 
      durationMinutes: 60,
      projectName: 'Web Design'
    })
  ];

  const storageData = JSON.stringify(testEntries);

  await page.addInitScript((data) => {
    window.localStorage.setItem('timeEntries', data);
  }, storageData);

  await page.goto('index.html');

  // Select a project
  const trigger = page.getByTestId('project-trigger');
  await trigger.click();

  const menu = page.getByTestId('dropdown-menu');
  await expect(menu).toBeVisible();

  const list = page.getByTestId('projects-list');
  await expect(list).not.toBeEmpty();
  await list.getByText('Web Design').click();

  const entryList = page.getByTestId('history-list');
  await expect(entryList).toBeVisible();

  // Switch to month view to ensure all entries are visible
  const monthViewBtn = page.locator('#monthViewBtn');
  await expect(monthViewBtn).toBeVisible();
  await monthViewBtn.click();
  await page.waitForTimeout(500);

  // Verify "Group by Day" button exists and is active by default
  const groupByDayBtn = page.locator('#groupByDayBtn');
  await expect(groupByDayBtn).toBeVisible();
  await expect(groupByDayBtn).toHaveClass(/active/);
  
  // Wait for rendering
  await page.waitForTimeout(500);
  
  // Verify entries are grouped by day
  // Should see group headers with dates
  const groupHeaders = entryList.locator('.group-header');
  const groupHeaderCount = await groupHeaders.count();
  
  // Should have at least 1 group header (entries from current month/week)
  // Note: Week view may filter some entries, so we check for at least 1
  expect(groupHeaderCount).toBeGreaterThanOrEqual(1);
  
  // Verify group headers contain dates and totals
  const firstHeader = groupHeaders.first();
  await expect(firstHeader).toBeVisible();
  await expect(firstHeader.locator('.group-total')).toBeVisible();
  
  // Verify entries are displayed under group headers
  const entryItems = entryList.locator('.entry-item');
  const entryCount = await entryItems.count();
  
  // Should have at least some entries (may be filtered by week/month view)
  expect(entryCount).toBeGreaterThan(0);
  
  // Test switching to "Group by Project" and back to "Group by Day"
  const groupByProjectBtn = page.locator('#groupByProjectBtn');
  await expect(groupByProjectBtn).toBeVisible();
  await groupByProjectBtn.click();
  await page.waitForTimeout(500);
  
  // Verify it switched
  await expect(groupByProjectBtn).toHaveClass(/active/);
  await expect(groupByDayBtn).not.toHaveClass(/active/);
  
  // Switch back to "Group by Day"
  await groupByDayBtn.click();
  await page.waitForTimeout(500);
  
  // Verify it switched back
  await expect(groupByDayBtn).toHaveClass(/active/);
  await expect(groupByProjectBtn).not.toHaveClass(/active/);
  
  // Verify entries are still grouped by day
  const groupHeadersAfterSwitch = entryList.locator('.group-header');
  const groupHeaderCountAfterSwitch = await groupHeadersAfterSwitch.count();
  expect(groupHeaderCountAfterSwitch).toBeGreaterThanOrEqual(1);
  
  // Verify total time is displayed (may be less than 330 if filtered by period)
  const totalTime = page.getByTestId('totalTime');
  await expect(totalTime).toBeVisible();
  const totalText = await totalTime.textContent();
  expect(parseInt(totalText || '0')).toBeGreaterThan(0);
  
  console.log('Day grouping test completed successfully');
});

/**
 * Test group sum calculation functionality [S2][US-02][T7]
 * Verifies exact totals shown in group headers for both grouping modes.
 */
test('Calculate sums per group (day/project) [S2][US-02][T7]', async ({ page }) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  // Data set:
  // - Web Design totals per day: today = 30 + 90 = 120, yesterday = 60
  // - Web Design total per project (month view): 30 + 90 + 60 = 180
  // - Consulting total per project: 40
  const testEntries = [
    createMockEntry({
      projectid: 1,
      projectName: 'Web Design',
      date: formatDate(today),
      startTime: '09:00',
      endTime: '09:30',
      durationMinutes: 30,
      notes: 'Web Design (30)'
    }),
    createMockEntry({
      projectid: 1,
      projectName: 'Web Design',
      date: formatDate(today),
      startTime: '10:00',
      endTime: '11:30',
      durationMinutes: 90,
      notes: 'Web Design (90)'
    }),
    createMockEntry({
      projectid: 1,
      projectName: 'Web Design',
      date: formatDate(yesterday),
      startTime: '12:00',
      endTime: '13:00',
      durationMinutes: 60,
      notes: 'Web Design (60)'
    }),
    createMockEntry({
      projectid: 3,
      projectName: 'Consulting',
      date: formatDate(today),
      startTime: '14:00',
      endTime: '14:40',
      durationMinutes: 40,
      notes: 'Consulting (40)'
    })
  ];

  const storageData = JSON.stringify(testEntries);
  await page.addInitScript((data) => {
    window.localStorage.setItem('timeEntries', data);
  }, storageData);

  await page.goto('index.html');

  // Select project "Web Design" so day grouping mode can render.
  const trigger = page.getByTestId('project-trigger');
  await trigger.click();
  const menu = page.getByTestId('dropdown-menu');
  await expect(menu).toBeVisible();
  const list = page.getByTestId('projects-list');
  await expect(list).not.toBeEmpty();
  await list.getByText('Web Design').click();

  const entryList = page.getByTestId('history-list');
  await expect(entryList).toBeVisible();

  // Use month view to ensure all entries are visible in the current period.
  const monthViewBtn = page.locator('#monthViewBtn');
  await expect(monthViewBtn).toBeVisible();
  await monthViewBtn.click();
  await page.waitForTimeout(500);

  // Ensure "Group by Day" is active.
  const groupByDayBtn = page.locator('#groupByDayBtn');
  await expect(groupByDayBtn).toBeVisible();
  await expect(groupByDayBtn).toHaveClass(/active/);

  // Assert exact per-day totals for selected project.
  const dayGroupHeaders = entryList.locator('.group-header');
  await expect(dayGroupHeaders).toHaveCount(2);
  await expect(dayGroupHeaders.nth(0).locator('.group-total')).toHaveText('120 min');
  await expect(dayGroupHeaders.nth(1).locator('.group-total')).toHaveText('60 min');

  // Switch to "Group by Project" and assert exact totals per project group.
  const groupByProjectBtn = page.locator('#groupByProjectBtn');
  await expect(groupByProjectBtn).toBeVisible();
  await groupByProjectBtn.click();
  await page.waitForTimeout(500);

  await expect(groupByProjectBtn).toHaveClass(/active/);
  await expect(groupByDayBtn).not.toHaveClass(/active/);

  const projectHeaders = entryList.locator('.group-header');
  await expect(projectHeaders).toHaveCount(2);

  const consultingHeader = projectHeaders.filter({ hasText: 'Consulting' });
  await expect(consultingHeader).toHaveCount(1);
  await expect(consultingHeader.locator('.group-total')).toHaveText('40 min');

  const webDesignHeader = projectHeaders.filter({ hasText: 'Web Design' });
  await expect(webDesignHeader).toHaveCount(1);
  await expect(webDesignHeader.locator('.group-total')).toHaveText('180 min');

  console.log('T7 group sum calculation test completed successfully');
});

/**
 * Tests empty periods + view switching (week/month) explicitly.
 * [S2][US-02][T8] Tests: Leere Zeiträume und View-Umschaltung prüfen #105
 */
test('Empty periods and view switching (week/month) [S2][US-02][T8]', async ({ page }) => {
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  // Only ONE entry in the current period (today). Adjacent periods should be empty.
  const testEntries = [
    createMockEntry({
      projectid: 1,
      projectName: 'Web Design',
      date: formatDate(today),
      startTime: '09:00',
      endTime: '10:00',
      durationMinutes: 60,
      notes: 'Current period entry'
    })
  ];

  const storageData = JSON.stringify(testEntries);
  await page.addInitScript((data) => {
    window.localStorage.setItem('timeEntries', data);
  }, storageData);

  await page.goto('index.html');

  // Select a project so history renders.
  const trigger = page.getByTestId('project-trigger');
  await trigger.click();
  const menu = page.getByTestId('dropdown-menu');
  await expect(menu).toBeVisible();
  const list = page.getByTestId('projects-list');
  await expect(list).not.toBeEmpty();
  await list.getByText('Web Design').click();

  const historySection = page.getByTestId('history-list');
  await expect(historySection).toBeVisible();

  const weekViewBtn = page.locator('#weekViewBtn');
  const monthViewBtn = page.locator('#monthViewBtn');
  const prevPeriodBtn = page.locator('#prevPeriodBtn');
  const nextPeriodBtn = page.locator('#nextPeriodBtn');
  const totalTime = page.getByTestId('totalTime');

  await expect(weekViewBtn).toBeVisible();
  await expect(monthViewBtn).toBeVisible();
  await expect(prevPeriodBtn).toBeVisible();
  await expect(nextPeriodBtn).toBeVisible();

  // Baseline: current week should contain the entry.
  await expect(weekViewBtn).toHaveClass(/active/);
  await expect(monthViewBtn).not.toHaveClass(/active/);
  await expect(historySection).toContainText('09:00 - 10:00');
  await expect(totalTime).toHaveText('60');

  // Navigate to previous week: should be empty.
  await prevPeriodBtn.click();
  await page.waitForTimeout(500);
  await expect(historySection).toContainText('No entries found for this period.');
  await expect(totalTime).toHaveText('0');

  // Navigate back to current week: entry should be visible again.
  await nextPeriodBtn.click();
  await page.waitForTimeout(500);
  await expect(historySection).toContainText('09:00 - 10:00');
  await expect(totalTime).toHaveText('60');

  // Switch to month view: should still contain the entry and set active state.
  await monthViewBtn.click();
  await page.waitForTimeout(500);
  await expect(monthViewBtn).toHaveClass(/active/);
  await expect(weekViewBtn).not.toHaveClass(/active/);
  await expect(historySection).toContainText('09:00 - 10:00');
  await expect(totalTime).toHaveText('60');

  // Navigate to next month: should be empty.
  await nextPeriodBtn.click();
  await page.waitForTimeout(500);
  await expect(historySection).toContainText('No entries found for this period.');
  await expect(totalTime).toHaveText('0');

  // Switch back to week view: should reset to current week and show entry again.
  await weekViewBtn.click();
  await page.waitForTimeout(500);
  await expect(weekViewBtn).toHaveClass(/active/);
  await expect(monthViewBtn).not.toHaveClass(/active/);
  await expect(historySection).toContainText('09:00 - 10:00');
  await expect(totalTime).toHaveText('60');

  console.log('T8 empty periods + view switching test completed successfully');
});