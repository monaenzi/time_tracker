import { test, expect } from '@playwright/test';

test.describe('Core Functionality Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate first to enable localStorage access
    await page.goto('/');
    // Clear localStorage to start fresh (except for persistence test)
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should load JSON from API and display projects in dropdown', async ({ page }) => {
    // Step 1: Wait for page to be ready (already navigated in beforeEach)
    await page.waitForLoadState('networkidle');

    // Step 2: Open the project dropdown
    const selectTrigger = page.locator('#selectTrigger');
    await expect(selectTrigger).toBeVisible();
    await selectTrigger.click();

    // Step 3: Wait for projects to load and appear in the dropdown
    // This implicitly verifies JSON was loaded from /api/projects
    const projectsList = page.locator('#projectsList');
    await expect(projectsList).toBeVisible();
    
    await page.waitForFunction(() => {
      const list = document.getElementById('projectsList');
      return list && list.querySelectorAll('.project-item').length > 0;
    }, { timeout: 10000 });

    // Step 4: Verify projects are displayed (proves JSON was loaded)
    const projectItems = projectsList.locator('.project-item');
    const count = await projectItems.count();
    expect(count).toBeGreaterThan(0);
    
    // Step 5: Verify project structure matches expected API format
    // Get project names from the UI
    const projectNames = [];
    for (let i = 0; i < count; i++) {
      const name = await projectItems.nth(i).textContent();
      projectNames.push(name.trim());
    }
    
    // Verify we have projects with names (proves JSON structure is correct)
    expect(projectNames.length).toBeGreaterThan(0);
    expect(projectNames.every(name => name.length > 0)).toBeTruthy();
    
    // Step 6: Verify projects match expected backend data structure
    // Expected projects from backend/projects.json: Web Design, App Development, Consulting
    const expectedProjects = ['Web Design', 'App Development', 'Consulting'];
    const hasExpectedProject = expectedProjects.some(expected => 
      projectNames.some(actual => actual.includes(expected))
    );
    expect(hasExpectedProject).toBeTruthy();
  });

  test('should change timer state when user starts and stops', async ({ page }) => {
    // Step 1: Wait for page to be ready (already navigated in beforeEach)
    await page.waitForLoadState('networkidle');
    
    // Step 2: Wait for projects to load
    await page.waitForFunction(() => {
      const list = document.getElementById('projectsList');
      return list && list.querySelectorAll('.project-item').length > 0;
    }, { timeout: 10000 });

    // Step 3: Select a project first (required to start timer)
    const selectTrigger = page.locator('#selectTrigger');
    await selectTrigger.click();
    
    const projectsList = page.locator('#projectsList');
    await expect(projectsList).toBeVisible();
    
    // Click first project
    const firstProject = projectsList.locator('.project-item').first();
    await firstProject.click();

    // Step 3: Verify initial state (Paused)
    const statusText = page.locator('#statusText');
    await expect(statusText).toContainText('Paused');
    
    const startStopBtn = page.locator('#startStopBtn');
    await expect(startStopBtn).toContainText('▶');

    // Step 4: Start the timer
    await startStopBtn.click();

    // Step 5: Verify timer is running
    await expect(statusText).toContainText('Running', { timeout: 2000 });
    await expect(startStopBtn).toContainText('⏹');

    // Step 6: Wait a moment to ensure timer is counting
    await page.waitForTimeout(1500);

    // Step 7: Verify timer display has changed (not 00:00)
    const timerDisplay = page.locator('#timerDisplay');
    const timerValue = await timerDisplay.textContent();
    expect(timerValue).not.toBe('00:00');

    // Step 8: Pause the timer
    await startStopBtn.click();

    // Step 9: Verify timer is paused
    await expect(statusText).toContainText('Paused', { timeout: 2000 });
    await expect(startStopBtn).toContainText('▶');

    // Step 10: Verify timer display still shows elapsed time (not reset to 00:00)
    const pausedTimerValue = await timerDisplay.textContent();
    expect(pausedTimerValue).not.toBe('00:00');
    // Timer might have advanced by 1 second, so check it's close (within 2 seconds)
    const timerSeconds = parseInt(timerValue.split(':')[0]) * 60 + parseInt(timerValue.split(':')[1]);
    const pausedSeconds = parseInt(pausedTimerValue.split(':')[0]) * 60 + parseInt(pausedTimerValue.split(':')[1]);
    expect(Math.abs(pausedSeconds - timerSeconds)).toBeLessThanOrEqual(2);
  });

  test('should persist state after page reload', async ({ page }) => {
    // Step 1: Wait for page to be ready (already navigated in beforeEach)
    await page.waitForLoadState('networkidle');
    
    // Step 2: Wait for projects to load
    await page.waitForFunction(() => {
      const list = document.getElementById('projectsList');
      return list && list.querySelectorAll('.project-item').length > 0;
    }, { timeout: 10000 });

    // Step 3: Create a time entry
    // Open history panel
    await page.locator('#historyBtn').click();
    await expect(page.locator('#historySection')).toBeVisible();
    
    // Open form
    await page.locator('#addEntryBtn').click();
    await expect(page.locator('#entryFormModal')).toBeVisible();
    
    // Wait for projects to load in form
    await page.waitForFunction(() => {
      const select = document.getElementById('formProjectId');
      return select && select.options.length > 1;
    }, { timeout: 10000 });
    
    // Fill form
    await page.locator('#formProjectId').selectOption('1');
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    await page.locator('#formDate').fill(dateString);
    await page.locator('#formDurationMinutes').fill('45');
    
    // Submit
    await page.locator('#submitFormBtn').click();
    
    // Wait for success message
    await expect(page.locator('#formSuccess')).toBeVisible({ timeout: 5000 });
    
    // Wait for form to close
    await page.waitForTimeout(2000);

    // Step 3: Verify entry is in localStorage before reload
    const entriesBeforeReload = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('timeEntries') || '[]');
    });
    expect(entriesBeforeReload.length).toBeGreaterThan(0);
    expect(entriesBeforeReload[entriesBeforeReload.length - 1]).toMatchObject({
      projectId: 1,
      durationMinutes: 45,
      date: dateString
    });

    // Step 4: Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Step 5: Wait for projects to load again
    await page.waitForFunction(() => {
      const list = document.getElementById('projectsList');
      return list && list.querySelectorAll('.project-item').length > 0;
    }, { timeout: 10000 });

    // Step 6: Open history panel
    await page.locator('#historyBtn').click();
    await expect(page.locator('#historySection')).toBeVisible();

    // Step 7: Verify entry still exists after reload
    const entryList = page.locator('#entryList');
    const listItems = entryList.locator('li');
    
    await expect(listItems.first()).toBeVisible();
    await expect(listItems.first()).toContainText('45 min');

    // Step 8: Verify localStorage still contains the entry
    const entriesAfterReload = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('timeEntries') || '[]');
    });
    
    expect(entriesAfterReload.length).toBe(entriesBeforeReload.length);
    expect(entriesAfterReload[entriesAfterReload.length - 1]).toMatchObject({
      projectId: 1,
      durationMinutes: 45,
      date: dateString
    });

    // Step 9: Verify total time is still correct
    const totalTime = page.locator('#totalTime');
    await expect(totalTime).toContainText('45');
  });
});
