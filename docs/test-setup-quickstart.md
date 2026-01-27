# Quick Start: Running Your First Playwright Test

## What We've Set Up

✅ Created `playwright.config.js` - Configuration for Playwright  
✅ Created `tests/create-entry.spec.js` - Your E2E test file  
✅ Updated `package.json` - Added test scripts  
✅ Created setup guide - `docs/playwright-setup-guide.md`

---

## Next Steps (Run These Commands)

### Step 1: Install Playwright
```bash
npm install --save-dev @playwright/test
```

**What this does:** Downloads and installs Playwright testing framework

---

### Step 2: Install Browser Binaries
```bash
npx playwright install
```

**What this does:** Downloads the actual browsers (Chrome, Firefox, etc.) that Playwright uses for testing

**Note:** This might take a few minutes the first time

---

### Step 3: Run Your First Test

**Option A: Run in UI Mode (Recommended for Learning)**
```bash
npm run test:ui
```

**What this does:**
- Opens Playwright's interactive UI
- Shows you the test running step-by-step
- Great for understanding what's happening

**Option B: Run in Headless Mode**
```bash
npm test
```

**What this does:**
- Runs tests in the background (no visible browser)
- Faster, good for CI/CD

**Option C: Run with Visible Browser**
```bash
npm run test:headed
```

**What this does:**
- Runs tests with a visible browser window
- Good for debugging

---

## What the Test Does

The test (`tests/create-entry.spec.js`) verifies:

1. ✅ History panel opens when clicking history button
2. ✅ "Add Entry" form opens when clicking the button
3. ✅ Form can be filled with project, date, and duration
4. ✅ Form submits successfully
5. ✅ Success message appears
6. ✅ New entry appears in the history list
7. ✅ Total time updates correctly

---

## Understanding the Test Code

### Basic Structure
```javascript
test('test name', async ({ page }) => {
  // Your test steps here
});
```

### Finding Elements
```javascript
// Find by ID
const button = page.locator('#buttonId');

// Find by text
const heading = page.locator('text=Welcome');
```

### Interacting with Elements
```javascript
// Click
await button.click();

// Type text
await input.fill('Hello');

// Select dropdown
await select.selectOption('value');
```

### Checking Results (Assertions)
```javascript
// Check if visible
await expect(element).toBeVisible();

// Check text content
await expect(element).toContainText('Expected text');

// Check count
await expect(list).toHaveCount(3);
```

---

## Common Commands

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with visible browser
npm run test:headed

# View test report
npm run test:report

# Run specific test file
npx playwright test tests/create-entry.spec.js

# Run in debug mode (step through)
npx playwright test --debug
```

---

## Troubleshooting

### "Cannot find module '@playwright/test'"
**Fix:** Run `npm install` again

### "Server not starting"
**Fix:** 
1. Check that `npm run dev` works manually
2. Make sure port 3000 is not already in use

### "Element not found"
**Fix:**
- Check that element IDs in test match your HTML
- Add wait: `await page.waitForSelector('#elementId')`

### "Test timeout"
**Fix:**
- Increase timeout in `playwright.config.js`
- Or add `test.setTimeout(60000)` to specific test

---

## Learning Resources

- **Playwright Docs:** https://playwright.dev
- **Test Generator:** Use `npx playwright codegen http://localhost:3000` to generate test code by interacting with your app
- **Our Guide:** See `docs/playwright-setup-guide.md` for detailed explanations

---

## What Happens When You Run the Test

1. Playwright starts your dev server automatically
2. Opens a browser (Chrome by default)
3. Navigates to `http://localhost:3000`
4. Executes each test step
5. Takes screenshots/videos on failure
6. Shows you results and a report

---

## Next: Try It Yourself!

1. Run `npm install --save-dev @playwright/test`
2. Run `npx playwright install`
3. Run `npm run test:ui`
4. Watch the magic happen! ✨
