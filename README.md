# Mini Time Tracker

A simple time tracking web application that allows users to track time spent on projects.
Projects are loaded from a static JSON file, while time entries are stored locally in the browser.

## Features

- Select a project and start/stop time tracking

- Only one active timer at a time

- See how much time you worked today

- Time entries persist after page reload

- Delete (and optionally edit) time entries

- Automatic calculation of:

  - Time per project (today)

  - Total time worked today

## Tech Stack

- Frontend: HTML, CSS, JavaScript

- Testing: Playwright

- Storage: Browser localStorage

## Requirements

- Node.js

- npm 

- Playwright (for end-to-end testing)

## Getting Started

### 1. Clone the repository

```bash 
git clone https://github.com/monaenzi/time_tracker.git
cd time_tracker

```

### 2. Install dependencies

```bash
npm install
```

### 3. Start server

```bash
npm run dev
```

### 4. Open http://localhost:3000 in your browser to view the time tracker

(The port may vary — check the terminal output.)

## Technical Overview

### Data Source - Projects

- Projects are loaded read-only from a static file `projects.json`

- Loaded using `fetch()`

- Each Project contains:

```json
{
  "id": "string",
  "name": "string",
  "client": "string (optional)"
}
```

### Local Storage - Time Entries

- Time entries are stored locally in the browser

- Each time entry contains at least:

```json
{
  "projectId": "string",
  "date": "YYYY-MM-DD",
  "startTime": "HH:mm",
  "endTime": "HH:mm",
  "durationMinutes": 42,
  "note": "optional text"
}
```

## UI & Functionality

### Overview Page

- Project dropdown (loaded from projects.json)

- Start / Stop button

- Indicator when a timer is running

- Live display of elapsed time

### Today’s Entries

- List of all entries from today

- Time sum per project

- Overall total time for today

- Delete button per entry

- (Optional) Edit entry functionality

## Rules & Constraints

- Only one timer can run at the same time

- Stopping a timer automatically creates a time entry

- No login or user accounts

- No team features

- No server-side storage for time entries

## Testing

This project uses [Playwright](https://playwright.dev) for end-to-end testing.

### Test Structure

Tests are organized by issue/user story in the `tests/` directory:

```
tests/
  ├── issue-26/              # Issue #26: Create New Time Entry
  │   ├── create-entry.spec.js
  │   └── README.md
  └── README.md
```

### Running Tests

```bash
# Run all tests (generates JSON and Markdown reports)
npm test

# Run tests with Playwright UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# View HTML test report
npm run test:report

# Generate markdown report from existing JSON
npm run test:md

# Run tests for a specific issue
npx playwright test tests/issue-26/

# Run a specific test file
npx playwright test tests/issue-26/create-entry.spec.js
```

### Test Artifacts

Test results and artifacts are stored in `test-results/`:

- `test-results/test-results.json` - JSON format (for CI/CD)
- `test-results/test-results.md` - Markdown format (human-readable)
- `test-results/` - Screenshots, videos, traces (on failures)
- `playwright-report/` - HTML test report (auto-generated)

See [tests/README.md](tests/README.md) for more details.
