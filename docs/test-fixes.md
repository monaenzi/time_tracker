# Test Fixes - User Story #26

## Issues Found

### ❌ Problem 1: Server Serving Wrong Files
**Error:** Tests showed "Server is running." instead of the actual app

**Root Cause:** 
- Server was configured to serve static files from `backend/` directory
- But the actual HTML/CSS/JS files are in `src/` directory
- Server was looking for `index.html` in `backend/` but it doesn't exist there

**Fix Applied:**
```javascript
// Before (WRONG):
app.use(express.static(path.join(__dirname))); // Serves from backend/
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Looks in backend/
});

// After (CORRECT):
const srcPath = path.join(__dirname, '..', 'src');
app.use(express.static(srcPath)); // Serves from src/
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'index.html')); // Serves from src/
});
```

**What this does:**
- `path.join(__dirname, '..', 'src')` goes up one directory from `backend/` then into `src/`
- Now static files (CSS, JS) are served from `src/`
- `index.html` is correctly served from `src/index.html`

---

### ❌ Problem 2: Inconsistent API Usage
**Error:** Form was trying to fetch `projects.json` directly instead of using API

**Root Cause:**
- `fetchProjects()` uses API: `http://localhost:3000/api/projects` ✅
- `populateProjectSelect()` was using: `projects.json` ❌

**Fix Applied:**
```javascript
// Before (WRONG):
const res = await fetch('projects.json');

// After (CORRECT):
const res = await fetch('http://localhost:3000/api/projects');
```

**Why this matters:**
- Consistency: Both functions now use the same API endpoint
- Reliability: API endpoint is more reliable than direct file access
- Maintainability: Single source of truth for projects data

---

### ❌ Problem 3: Test Timing Issues
**Error:** Tests couldn't find `#historyBtn` element

**Root Cause:**
- Tests were running before JavaScript finished loading
- Projects weren't loaded yet when test tried to interact
- Page needed more time to initialize

**Fix Applied:**
```javascript
// Added wait for projects to load
await page.waitForFunction(() => {
  const projectsList = document.getElementById('projectsList');
  return projectsList && projectsList.children.length > 0;
}, { timeout: 10000 });

// Added wait for form dropdown to populate
await page.waitForSelector('#formProjectId option[value="1"]', { timeout: 10000 });
```

**What this does:**
- `waitForFunction()` waits until a condition is true (projects loaded)
- `waitForSelector()` waits until an element exists (dropdown option)
- Prevents "element not found" errors

---

## Files Modified

1. **`backend/server.js`**
   - Fixed static file serving path
   - Fixed index.html serving path

2. **`src/js/main.js`**
   - Updated `populateProjectSelect()` to use API endpoint

3. **`tests/create-entry.spec.js`**
   - Added waits for page initialization
   - Added waits for project loading
   - Improved test reliability

---

## How to Verify the Fixes

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Open Browser
Navigate to `http://localhost:3000`

**Expected:** You should see the time tracker app (not "Server is running.")

### Step 3: Run Tests
```bash
npm test
```

**Expected:** Tests should pass ✅

---

## Key Learnings

### 1. Server Configuration
- Always verify which directory your server is serving files from
- Use `path.join()` correctly to navigate directories
- Test that your server actually serves the HTML file

### 2. API Consistency
- Use the same data source throughout your app
- Don't mix direct file access with API calls
- Centralize data fetching logic

### 3. Test Timing
- Always wait for async operations to complete
- Use `waitForFunction()` for custom conditions
- Use `waitForSelector()` for element existence
- Don't assume elements are immediately available

---

## Next Steps

1. ✅ Server configuration fixed
2. ✅ API consistency fixed
3. ✅ Test timing improved
4. ⏳ Run tests to verify everything works
5. ⏳ If tests still fail, check browser console for errors

---

## Debugging Tips

If tests still fail:

1. **Check server logs:**
   - Is the server starting correctly?
   - Are there any errors in the console?

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Run test in UI mode:**
   ```bash
   npm run test:ui
   ```
   - This shows you exactly what's happening
   - You can step through the test

4. **Add debugging:**
   ```javascript
   await page.pause(); // Pauses test so you can inspect
   console.log(await page.content()); // Logs page HTML
   ```
