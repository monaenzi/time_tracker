# Playwright E2E Test Setup Guide - Step by Step

This guide will walk you through setting up Playwright tests for the "Create New Time Entry" feature.

---

## Step 1: Install Playwright

**What we're doing:** Installing Playwright as a development dependency. Playwright is a testing framework that can control browsers and test your application.

**Command to run:**
```bash
npm install --save-dev @playwright/test
```

**What this does:**
- `--save-dev` means it's only needed during development, not in production
- Installs Playwright and its dependencies
- Adds it to your `package.json` under `devDependencies`

**After running, you'll also need to install browser binaries:**
```bash
npx playwright install
```

This downloads the actual browsers (Chromium, Firefox, WebKit) that Playwright will use for testing.

---

## Step 2: Create Playwright Configuration File

**What we're doing:** Creating a configuration file that tells Playwright how to run tests.

**Create file:** `playwright.config.js` in the root directory

**Code:**
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test files location
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: 30 * 1000, // 30 seconds
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: 'html',
  
  // Shared settings for all projects
  use: {
    // Base URL for your application
    baseURL: 'http://localhost:3000',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Trace on failure (for debugging)
    trace: 'on-first-retry',
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run your dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes to start server
  },
});
```

**Explanation:**
- `testDir`: Where your test files will be located
- `baseURL`: The URL where your app runs (localhost:3000)
- `webServer`: Automatically starts your dev server before tests run
- `projects`: Which browsers to test in (we're using Chromium)
- `reporter: 'html'`: Generates an HTML report after tests

---

## Step 3: Create Tests Directory

**What we're doing:** Creating a folder to organize our test files.

**Command:**
```bash
mkdir tests
```

**Why:** Keeps tests organized and separate from application code.

---

## Step 4: Create the E2E Test File

**What we're doing:** Writing a test that verifies the "Create New Time Entry" feature works end-to-end.

**Create file:** `tests/create-entry.spec.js`

**Code:**
```javascript
import { test, expect } from '@playwright/test';

test.describe('Create New Time Entry', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Clear localStorage to start with a clean state
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should create a new time entry and display it in the history list', async ({ page }) => {
    // Step 1: Open the history panel
    // Find the history button and click it
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
    
    // Step 5: Fill in the form
    // Select a project from the dropdown
    const projectSelect = page.locator('#formProjectId');
    await projectSelect.selectOption('1'); // Select project with id 1
    
    // Fill in the date (using today's date in YYYY-MM-DD format)
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
    
    // Step 6: Submit the form
    const submitBtn = page.locator('#submitFormBtn');
    await submitBtn.click();
    
    // Step 7: Verify success message appears
    const successMessage = page.locator('#formSuccess');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('Time entry created successfully');
    
    // Step 8: Wait for form to close (it closes after 1.5 seconds)
    await page.waitForTimeout(2000);
    
    // Step 9: Verify the entry appears in the history list
    const entryList = page.locator('#entryList');
    const listItems = entryList.locator('li');
    
    // Check that at least one entry exists
    await expect(listItems).toHaveCount(1);
    
    // Verify the entry contains the project ID
    const firstEntry = listItems.first();
    await expect(firstEntry).toContainText('Project 1');
    await expect(firstEntry).toContainText('30 min');
    
    // Step 10: Verify total time is updated
    const totalTime = page.locator('#totalTime');
    await expect(totalTime).toContainText('30');
  });

  test('should validate required fields and prevent submission', async ({ page }) => {
    // Open history panel
    await page.locator('#historyBtn').click();
    await expect(page.locator('#historySection')).toBeVisible();
    
    // Open form
    await page.locator('#addEntryBtn').click();
    await expect(page.locator('#entryFormModal')).toBeVisible();
    
    // Try to submit without filling fields
    await page.locator('#submitFormBtn').click();
    
    // Verify error message appears
    const errorMessage = page.locator('#formError');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Please select a project');
  });
});
```

**Explanation of key concepts:**

1. **`test.describe()`**: Groups related tests together
2. **`test.beforeEach()`**: Runs before each test - good for setup
3. **`page.goto('/')`**: Navigates to the base URL
4. **`page.locator()`**: Finds elements on the page (like `document.querySelector`)
5. **`await expect()`**: Asserts that something is true (waits if needed)
6. **`await page.waitForTimeout()`**: Waits for a specific time (use sparingly)
7. **`localStorage.clear()`**: Cleans up between tests

---

## Step 5: Update package.json

**What we're doing:** Adding test scripts so you can run tests easily.

**Update the `scripts` section in `package.json`:**

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:report": "playwright show-report",
    "dev": "nodemon backend/server.js"
  }
}
```

**What each script does:**
- `npm test`: Runs all tests in headless mode (no browser window)
- `npm run test:ui`: Opens Playwright UI mode (interactive)
- `npm run test:headed`: Runs tests with visible browser (good for debugging)
- `npm run test:report`: Opens the HTML test report

---

## Step 6: Run Your First Test

**Commands to run:**

1. **Make sure your server can start:**
   ```bash
   npm run dev
   ```
   (Then stop it with Ctrl+C - Playwright will start it automatically)

2. **Run the tests:**
   ```bash
   npm test
   ```

3. **Or run with UI (recommended for learning):**
   ```bash
   npm run test:ui
   ```

**What to expect:**
- Playwright will start your server automatically
- Open a browser
- Run through the test steps
- Show you the results

---

## Understanding the Test Flow

Here's what happens when the test runs:

1. **Setup**: Browser opens, navigates to `http://localhost:3000`
2. **Clear state**: localStorage is cleared
3. **Open history**: Clicks the history button
4. **Open form**: Clicks "Add Entry" button
5. **Fill form**: Selects project, enters date and duration
6. **Submit**: Clicks submit button
7. **Verify success**: Checks that success message appears
8. **Verify list**: Checks that entry appears in history list
9. **Verify total**: Checks that total time is updated

---

## Common Issues and Solutions

### Issue: "Cannot find module '@playwright/test'"
**Solution:** Run `npm install` again

### Issue: "Server not starting"
**Solution:** Check that `npm run dev` works manually first

### Issue: "Element not found"
**Solution:** 
- Check that element IDs match in your HTML
- Add `await page.waitForSelector('#elementId')` before interacting

### Issue: "Test timeout"
**Solution:** 
- Increase timeout in config
- Or add `test.setTimeout(60000)` for a specific test

---

## Next Steps

1. Run the test and see it pass ✅
2. Try modifying the test to test different scenarios
3. Add more tests for edge cases (invalid dates, negative durations, etc.)
4. Check the HTML report to see detailed results

---

## Tips for Learning

- **Use `test:ui` mode**: It's visual and helps you understand what's happening
- **Add `await page.pause()`**: Pauses the test so you can inspect the page
- **Use `console.log()`**: Log values to understand what's happening
- **Read Playwright docs**: https://playwright.dev/docs/intro
