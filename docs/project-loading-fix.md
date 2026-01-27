# Project Loading Fix

## Issue
The form modal was showing error: "Failed to load projects. Please try again later."

## Root Cause
1. **Absolute URL Issue**: Using `http://localhost:3000/api/projects` can cause CORS issues
2. **No Response Validation**: Not checking if the response was successful before parsing JSON
3. **Inconsistent URLs**: Different functions using different URL formats

## Fixes Applied

### 1. Changed to Relative URLs
**Before:**
```javascript
const res = await fetch('http://localhost:3000/api/projects');
```

**After:**
```javascript
const res = await fetch('/api/projects');
```

**Why:** 
- Relative URLs work regardless of the domain/port
- Avoids CORS issues
- More maintainable

### 2. Added Response Validation
**Before:**
```javascript
const res = await fetch('/api/projects');
const projects = await res.json();
```

**After:**
```javascript
const res = await fetch('/api/projects');

// Check if response is OK
if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
}

const projects = await res.json();

// Validate that we got an array
if (!Array.isArray(projects)) {
    throw new Error('Invalid response format: expected array');
}
```

**Why:**
- Prevents errors when server returns error status
- Validates data format before using it
- Better error messages for debugging

### 3. Updated Both Functions
- `fetchProjects()` - For main project list
- `populateProjectSelect()` - For form dropdown

Both now use the same pattern for consistency.

## Files Modified

1. **`src/js/main.js`**
   - Updated `fetchProjects()` to use relative URL and validate response
   - Updated `populateProjectSelect()` to use relative URL and validate response

## Testing

### Manual Test:
1. Start server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Click history button (🕒)
4. Click "+ Add Entry" button
5. **Expected:** Project dropdown should be populated with:
   - Web Design
   - App Development
   - Consulting

### If Still Not Working:

1. **Check Browser Console (F12)**
   - Look for any error messages
   - Check Network tab to see if `/api/projects` request is being made
   - Check if request returns 200 status

2. **Check Server Console**
   - Should see: "Server running on PORT 3000"
   - When you open form, should see the request in server logs

3. **Test API Directly**
   - Open: `http://localhost:3000/api/projects`
   - Should see JSON array with 3 projects

4. **Common Issues:**
   - Server not running → Start with `npm run dev`
   - Port conflict → Check if port 3000 is already in use
   - CORS error → Should be fixed with relative URLs
   - Wrong path → Verify `backend/projects.json` exists

## API Endpoint

The projects are served from:
- **File:** `backend/projects.json`
- **Endpoint:** `GET /api/projects`
- **Response:** JSON array of project objects

Example response:
```json
[
  {
    "id": 1,
    "name": "Web Design",
    "client": "Company A"
  },
  {
    "id": 2,
    "name": "App Development",
    "client": "Company B"
  },
  {
    "id": 3,
    "name": "Consulting",
    "client": "Company C"
  }
]
```
