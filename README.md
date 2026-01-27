# Mini Time Tracker

A simple time tracking web application that allows users to track time spent on projects.
Projects are loaded from a static JSON file, while time entries are stored locally in the browser.

## Features

### Sprint 1

- Select a project and start/stop time tracking

- Only one active timer at a time

- See how much time you worked today

- Time entries persist after page reload

- Delete (and optionally edit) time entries

- Automatic calculation of:

  - Time per project (today)

  - Total time worked today

### Sprint 2

- Open detailed view of time entry

- Reset all entries in a project

- View all entries from today/this week/this month

- Edit time entries

- Dark and lightmode

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
"projectid": "selectedProjectId",
"projectName": "selectedProjectName",
"date": "new Date().toISOString().split('T')[0]",
"startTime": "formatTime(startedAt)",
"endTime": "formatTime(now)",
"durationMinutes": "duration",
"notes": "''"
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


## Tests

### How to test

#### Start the server

`npm run dev`

#### Start tests or open test UI

`npm run test`
or
`npm run testui`

#### Run tests

Tests can be run individually while also looking at what the test does in the mini-test-browser

### What is getting tested

 1. Test to see if project are being loaded correctly from the server and then displayed

 2. Test to see if Timer can be started and stopped

 3. Test to see if time entries are being stored in local storage and persistent after reload

 4. Test to see if time entry gets deleted and total time gets updated

 5. Test to see if 'Reset All' deletes every time entry in a project

 6. Test to see if editing a time entry gets saved correctly

## Still open features, problems and limitations

### Still open features

#### Multi-Layer-Navigation

Wasn't necessary because our time tracker operates one one single page

### Problems and limitations

- Time management/reaching deadlines in time

- different understanding of what a feature should do - more communication needed


