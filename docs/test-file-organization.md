# Test File Organization - Best Practices

## ✅ Correct Structure

```
project-root/
├── src/                    # Production code only
│   ├── index.html
│   ├── js/
│   │   └── main.js
│   └── style.css
│
├── tests/                  # All test files
│   ├── create-entry.spec.js      # Playwright E2E tests
│   └── test-local-projects.html  # Manual test page
│
├── backend/                # Server code
│   └── server.js
│
└── docs/                  # Documentation
    └── ...
```

## Why Keep Tests Separate?

### 1. **Separation of Concerns**
- ✅ Production code (`src/`) stays clean
- ✅ Tests don't get deployed to production
- ✅ Easier to exclude tests from builds

### 2. **Best Practices**
- ✅ Industry standard structure
- ✅ Clear organization
- ✅ Easy to find test files

### 3. **Build & Deployment**
- ✅ Can exclude `tests/` from production builds
- ✅ Smaller production bundle
- ✅ No test files in production

### 4. **Team Collaboration**
- ✅ Clear what's production vs test
- ✅ New developers know where to look
- ✅ Follows common conventions

## Server Configuration

The server is configured to serve test files from a separate route:

```javascript
// Serve production files from src/
app.use(express.static(srcPath));

// Serve test files from tests/ (separate route)
app.use('/tests', express.static(testsPath));
```

### Access URLs:
- **Production:** `http://localhost:3000/` → serves from `src/`
- **Tests:** `http://localhost:3000/tests/` → serves from `tests/`

## File Types & Locations

| File Type | Location | Example |
|-----------|----------|---------|
| **Production HTML** | `src/` | `src/index.html` |
| **Production JS** | `src/js/` | `src/js/main.js` |
| **Production CSS** | `src/` | `src/style.css` |
| **E2E Tests** | `tests/` | `tests/create-entry.spec.js` |
| **Manual Test Pages** | `tests/` | `tests/test-local-projects.html` |
| **Test Results** | `test-results/` | Auto-generated |
| **Documentation** | `docs/` | `docs/*.md` |

## .gitignore Considerations

Test files are typically **committed** to git (unlike test results):

```gitignore
# Test results (generated, don't commit)
/test-results/
/playwright-report/

# But test files themselves ARE committed
# tests/
# ✅ Keep test files in git
```

## Production Build

When building for production:

```bash
# Copy only src/ to build/
# Exclude tests/
cp -r src/ build/
# Don't copy tests/
```

## Summary

✅ **DO:**
- Keep tests in `tests/` directory
- Keep production code in `src/`
- Serve tests from separate route (`/tests/`)

❌ **DON'T:**
- Put test files in `src/`
- Mix test and production code
- Deploy test files to production

---

**Current Structure:** ✅ Correct  
**Test File Location:** `tests/test-local-projects.html`  
**Access URL:** `http://localhost:3000/tests/test-local-projects.html`
