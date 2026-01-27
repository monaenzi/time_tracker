# Testing Local Projects Implementation

## Quick Test Guide

### Method 1: Manual Browser Test (Recommended)

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   - Navigate to: `http://localhost:3000`
   - Open DevTools (F12)

3. **Test Steps:**

   **Step 1: Check localStorage**
   ```javascript
   // In browser console:
   localStorage.getItem('userProjects')
   // Should return JSON string with 3 default projects
   ```

   **Step 2: Verify Projects Load**
   - Click the project selector dropdown
   - Should see: "Web Design", "App Development", "Consulting"

   **Step 3: Test Form Dropdown**
   - Click history button (🕒)
   - Click "+ Add Entry"
   - Check project dropdown
   - Should show the 3 projects

   **Step 4: Test Persistence**
   ```javascript
   // In browser console:
   localStorage.clear();
   location.reload();
   // After reload, projects should still appear (re-initialized)
   ```

---

### Method 2: Automated Test Page

1. **Open test page:**
   - Navigate to: `http://localhost:3000/tests/test-local-projects.html`
   - Tests run automatically on page load

2. **What it tests:**
   - ✅ Default projects initialization
   - ✅ getProjects() function
   - ✅ saveProjects() function
   - ✅ Persistence in localStorage
   - ✅ getNextProjectId() function
   - ✅ Empty storage handling

---

### Method 3: Playwright E2E Tests

**Note:** Tests need to be updated since we changed from server-side to local storage.

**Run tests:**
```bash
npm test
```

**Current status:**
- Tests may need updates to work with localStorage
- Server dependency removed, so tests should be simpler

---

## Verification Checklist

### ✅ Core Functionality

- [ ] **Default Projects Initialize**
  - Clear localStorage
  - Reload page
  - Should see 3 default projects

- [ ] **Projects Display in Selector**
  - Click project dropdown
  - Should see all projects listed

- [ ] **Projects in Form Dropdown**
  - Open "Add Entry" form
  - Project dropdown should be populated

- [ ] **Persistence**
  - Projects persist after page reload
  - Projects stored in localStorage

- [ ] **No Server Dependency**
  - Stop server
  - Projects should still work (from localStorage)
  - Form dropdown should still work

---

## Browser Console Tests

### Test 1: Check localStorage
```javascript
localStorage.getItem('userProjects')
// Expected: JSON string with 3 projects
```

### Test 2: Verify Structure
```javascript
const projects = JSON.parse(localStorage.getItem('userProjects'));
console.log(projects);
// Expected: Array with 3 objects
// Each object: { id, name, client }
```

### Test 3: Test Functions
```javascript
// Test getProjects()
const projects = getProjects();
console.log('Projects:', projects);
// Expected: Array with projects

// Test getNextProjectId()
const nextId = getNextProjectId();
console.log('Next ID:', nextId);
// Expected: 4 (if 3 projects exist)
```

### Test 4: Test Save
```javascript
// Add a test project
const projects = getProjects();
projects.push({ id: 99, name: "Test Project" });
saveProjects(projects);

// Verify it saved
const saved = getProjects();
console.log('Saved projects:', saved);
// Expected: 4 projects (3 defaults + test)
```

---

## Expected Behavior

### First Visit (Empty localStorage)
1. Page loads
2. `initializeDefaultProjects()` runs
3. Creates 3 default projects
4. Stores in localStorage
5. Displays in UI

### Subsequent Visits
1. Page loads
2. `getProjects()` reads from localStorage
3. Displays existing projects
4. No re-initialization

### Form Opening
1. User clicks "Add Entry"
2. `populateProjectSelect()` runs
3. Reads projects from localStorage
4. Populates dropdown
5. No server call needed

---

## Common Issues & Solutions

### Issue: Projects not showing
**Solution:**
```javascript
// Check if localStorage has data
localStorage.getItem('userProjects')

// If empty, clear and reload
localStorage.clear();
location.reload();
```

### Issue: Form dropdown empty
**Solution:**
- Check browser console for errors
- Verify `populateProjectSelect()` is called
- Check if `formProjectId` element exists

### Issue: Projects reset on reload
**Solution:**
- Check if localStorage is being cleared
- Verify `saveProjects()` is working
- Check browser settings (private mode clears on close)

---

## Test Results

### ✅ What Should Work:
- Projects load from localStorage
- Default projects initialize on first visit
- Projects persist across page reloads
- Form dropdown populates correctly
- No server API calls needed
- Works offline

### ❌ What Should NOT Happen:
- Server API calls for projects
- "Failed to load projects" errors
- Empty project dropdowns
- Projects resetting unexpectedly

---

## Next Steps After Testing

1. ✅ Verify all tests pass
2. ✅ Confirm no server dependency
3. ✅ Verify privacy (no network calls)
4. ⏳ Update Playwright tests (if needed)
5. ⏳ Add project management UI (optional)

---

## Quick Verification Command

```bash
# Start server
npm run dev

# In another terminal, test the API is NOT needed:
curl http://localhost:3000/api/projects
# This should still work (for backwards compatibility)
# But the app doesn't use it anymore
```

**Note:** The API endpoint still exists but is no longer used by the frontend. This is fine for backwards compatibility.
