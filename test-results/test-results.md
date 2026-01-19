# Test Results Report

**Generated:** 1/19/2026, 2:23:14 PM

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 7 |
| ✅ Passed | 7 |
| ❌ Failed | 0 |
| ⏭️  Skipped | 0 |
| 🔄 Flaky | 0 |
| ⏱️  Duration | 18.69s |
| 🕐 Start Time | 1/19/2026, 2:22:55 PM |

## Configuration

- **Playwright Version:** 1.57.0
- **Test Directory:** /Users/neocarelse/FHJ-MSD/Web Application Development/Agile Project/time_tracker-1/tests
- **Workers:** 1
- **Timeout:** 30000ms
- **Web Server:** npm run dev
- **Base URL:** http://localhost:3000

## Test Details

  ### Core Functionality Tests

  #### ✅ should load JSON from API and display projects in dropdown

  - **File:** `core-functionality.spec.js` (line 14)
  - **Status:** passed
  - **Duration:** 1.34s
  - **Browser:** chromium

  #### ✅ should change timer state when user starts and stops

  - **File:** `core-functionality.spec.js` (line 59)
  - **Status:** passed
  - **Duration:** 2.70s
  - **Browser:** chromium

  #### ✅ should persist state after page reload

  - **File:** `core-functionality.spec.js` (line 118)
  - **Status:** passed
  - **Duration:** 3.90s
  - **Browser:** chromium

  ### User Story #26: Create New Time Entry

  #### ✅ should create a new time entry and display it in the history list

  - **File:** `issue-26/create-entry.spec.js` (line 31)
  - **Status:** passed
  - **Duration:** 3.25s
  - **Browser:** chromium

  #### ✅ should validate required fields and prevent submission

  - **File:** `issue-26/create-entry.spec.js` (line 117)
  - **Status:** passed
  - **Duration:** 1.77s
  - **Browser:** chromium

  #### ✅ should validate date format

  - **File:** `issue-26/create-entry.spec.js` (line 160)
  - **Status:** passed
  - **Duration:** 1.79s
  - **Browser:** chromium

  #### ✅ should validate duration is positive number

  - **File:** `issue-26/create-entry.spec.js` (line 195)
  - **Status:** passed
  - **Duration:** 1.91s
  - **Browser:** chromium

---

*This report was automatically generated from test-results.json*
