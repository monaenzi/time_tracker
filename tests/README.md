# Tests Directory

This directory contains the essential test files for the application, organized by user story/issue.

## Test Organization

Tests are organized by issue/user story to maintain clear structure and traceability:

```
tests/
  ├── issue-26/              # Issue #26: Create New Time Entry
  │   ├── create-entry.spec.js
  │   └── README.md
  └── README.md              # This file
```

## Test Coverage by Issue

### Issue #26: Create New Time Entry
- **Location:** `tests/issue-26/`
- **Tests:** Form validation, entry creation, list updates
- **See:** [issue-26/README.md](issue-26/README.md) for details

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# View test report
npm run test:report

# Run tests for a specific issue
npx playwright test tests/issue-26/

# Run a specific test file
npx playwright test tests/issue-26/create-entry.spec.js
```

## Test Artifacts

Test output files, reports, and artifacts are stored in the `test-results/` directory at the project root to keep the tests directory clean.

Test results are generated in:
- `test-results/test-results.json` - JSON format (used by CI/CD)
- `test-results/test-results.md` - Markdown format (human-readable)
- `test-results/` - Screenshots, videos, and traces (on test failures)
- `playwright-report/` - HTML test report (auto-generated)

## Test Configuration

Test configuration is in `playwright.config.js` at the project root.

The test server automatically starts before tests run and serves files from the `src/` directory.

## Adding New Tests

When adding tests for a new user story/issue:

1. Create a new directory: `tests/issue-XX/`
2. Add your test spec file(s) in that directory
3. Create a `README.md` documenting:
   - User story description
   - Test coverage
   - Related files
   - How to run the tests
4. Update this main README with the new issue entry
