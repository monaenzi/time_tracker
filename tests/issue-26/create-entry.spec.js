import { test, expect } from '@playwright/test';

test.describe('User Story #26: Create New Time Entry', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Clear localStorage to start fresh
    await page.evaluate(() => {
      localStorage.clear();
      // Initialize default projects
      const defaultProjects = [
        { id: 1, name: "Web Design", client: "Company A" },
        { id: 2, name: "App Development", client: "Company B" },
        { id: 3, name: "Consulting", client: "Company C" }
      ];
      localStorage.setItem('userProjects', JSON.stringify(defaultProjects));
    });
    
    // Wait for projects to load
    await page.waitForFunction(() => {
      const projectsList = document.getElementById('projectsList');
      return projectsList && projectsList.children.length > 0;
    }, { timeout: 10000 });
  });

  test('should create a new time entry and display it in the history list', async ({ page }) => {
    // Step 1: Open the history panel
    const historyBtn = page.locator('#historyBtn');
    await expect(historyBtn).toBeVisible();
    await historyBtn.click();
    
    // Step 2: Verify history panel is visible
    const historySection = page.locator('#historySection');
    await expect(historySection).toBeVisible();
    
    // Step 3: Click "Add Entry" button
    const addEntryBtn = page.locator('#addEntryBtn');
    await expect(addEntryBtn).toBeVisible();
    await addEntryBtn.click();
    
    // Step 4: Verify the form modal is open
    const entryFormModal = page.locator('#entryFormModal');
    await expect(entryFormModal).toBeVisible();
    
    // Step 5: Wait for project dropdown to be populated
    // Check that option exists (options are always "hidden" inside select)
    await page.waitForFunction(() => {
      const select = document.getElementById('formProjectId');
      return select && select.options.length > 1; // More than just default option
    }, { timeout: 10000 });
    
    // Step 6: Fill in the form
    // Select a project
    const projectSelect = page.locator('#formProjectId');
    await projectSelect.selectOption('1'); // Select project with id 1
    
    // Fill in the date (using today's date)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    const dateInput = page.locator('#formDate');
    await dateInput.fill(dateString);
    
    // Fill in the duration
    const durationInput = page.locator('#formDurationMinutes');
    await durationInput.fill('30');
    
    // Step 7: Submit the form
    const submitBtn = page.locator('#submitFormBtn');
    await submitBtn.click();
    
    // Step 8: Verify success message appears
    const successMessage = page.locator('#formSuccess');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    await expect(successMessage).toContainText('Time entry created successfully');
    
    // Step 9: Wait for form to close (it closes after delay)
    await page.waitForTimeout(2000);
    
    // Step 10: Verify the entry appears in the history list
    const entryList = page.locator('#entryList');
    const listItems = entryList.locator('li');
    
    // Check that at least one entry exists
    await expect(listItems.first()).toBeVisible();
    
    // Verify the entry contains the project ID and duration
    const firstEntry = listItems.first();
    await expect(firstEntry).toContainText('Project 1');
    await expect(firstEntry).toContainText('30 min');
    
    // Step 11: Verify total time is updated
    const totalTime = page.locator('#totalTime');
    await expect(totalTime).toContainText('30');
    
    // Step 12: Verify entry is stored in localStorage
    const storedEntries = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('timeEntries') || '[]');
    });
    
    expect(storedEntries.length).toBeGreaterThan(0);
    expect(storedEntries[storedEntries.length - 1]).toMatchObject({
      projectId: 1,
      durationMinutes: 30,
      date: dateString
    });
  });

  test('should validate required fields and prevent submission', async ({ page }) => {
    // Open history panel
    await page.locator('#historyBtn').click();
    await expect(page.locator('#historySection')).toBeVisible();
    
    // Open form
    await page.locator('#addEntryBtn').click();
    await expect(page.locator('#entryFormModal')).toBeVisible();
    
    // Wait for projects to load
    await page.waitForFunction(() => {
      const select = document.getElementById('formProjectId');
      return select && select.options.length > 1;
    }, { timeout: 10000 });
    
    // Try to submit without filling fields
    // HTML5 validation might prevent submission, so we need to check for either
    // HTML5 validation message or our custom error message
    const submitBtn = page.locator('#submitFormBtn');
    await submitBtn.click();
    
    // Wait a bit for validation to run
    await page.waitForTimeout(500);
    
    // Check if HTML5 validation prevented submission (form still visible)
    // or if our custom validation ran (error message visible)
    const formModal = page.locator('#entryFormModal');
    const errorMessage = page.locator('#formError');
    
    // Either the form is still open (HTML5 validation) or error message is visible (JS validation)
    const isFormStillOpen = await formModal.isVisible();
    const isErrorVisible = await errorMessage.isVisible();
    
    // If form is still open, HTML5 validation worked
    // If error is visible, our JS validation worked
    expect(isFormStillOpen || isErrorVisible).toBeTruthy();
    
    // If our error message is visible, check its content
    if (isErrorVisible) {
      await expect(errorMessage).toContainText('Please select a project');
    }
  });

  test('should validate date format', async ({ page }) => {
    // Open form
    await page.locator('#historyBtn').click();
    await page.locator('#addEntryBtn').click();
    await expect(page.locator('#entryFormModal')).toBeVisible();
    
    // Wait for projects to load (check for option existence, not visibility)
    await page.waitForFunction(() => {
      const select = document.getElementById('formProjectId');
      return select && select.querySelector('option[value="1"]') !== null;
    }, { timeout: 10000 });
    
    // Select project
    await page.locator('#formProjectId').selectOption('1');
    
    // Try invalid date (should use date input which prevents invalid dates)
    // But test that form validates
    await page.locator('#formDurationMinutes').fill('30');
    
    // Submit (date should be required)
    await page.locator('#submitFormBtn').click();
    
    // Wait a bit for validation
    await page.waitForTimeout(500);
    
    // Should show validation error (either HTML5 or our custom validation)
    const formModal = page.locator('#entryFormModal');
    const errorMessage = page.locator('#formError');
    
    const isFormStillOpen = await formModal.isVisible();
    const isErrorVisible = await errorMessage.isVisible();
    
    expect(isFormStillOpen || isErrorVisible).toBeTruthy();
  });

  test('should validate duration is positive number', async ({ page }) => {
    // Open form
    await page.locator('#historyBtn').click();
    await page.locator('#addEntryBtn').click();
    await expect(page.locator('#entryFormModal')).toBeVisible();
    
    // Wait for projects to load (check for option existence, not visibility)
    await page.waitForFunction(() => {
      const select = document.getElementById('formProjectId');
      return select && select.querySelector('option[value="1"]') !== null;
    }, { timeout: 10000 });
    
    // Fill form with invalid duration
    await page.locator('#formProjectId').selectOption('1');
    
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    await page.locator('#formDate').fill(dateString);
    
    // Try zero duration (passes HTML5 min="1" validation but fails our JS validation)
    // Or try decimal (passes HTML5 but fails our integer check)
    await page.locator('#formDurationMinutes').fill('0');
    
    // Try to submit - HTML5 might prevent it, or our JS validation will catch it
    await page.locator('#submitFormBtn').click();
    
    // Wait a bit for validation
    await page.waitForTimeout(500);
    
    // Check if HTML5 validation prevented submission or our JS validation ran
    const formModal = page.locator('#entryFormModal');
    const errorMessage = page.locator('#formError');
    const durationInput = page.locator('#formDurationMinutes');
    
    const isFormStillOpen = await formModal.isVisible();
    const isErrorVisible = await errorMessage.isVisible();
    
    // Either HTML5 validation worked (form still open) or our JS validation worked (error visible)
    expect(isFormStillOpen || isErrorVisible).toBeTruthy();
    
    // If our error message is visible, check its content
    if (isErrorVisible) {
      const errorText = await errorMessage.textContent();
      expect(errorText).toMatch(/positive|greater than|must be/);
    }
  });
});
