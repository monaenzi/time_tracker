# Product Requirements Document (PRD)
## Mini Time Tracking Tool

**Version:** 2.0  
**Date:** 2026-01-12  
**Status:** Sprint 1

---

## 1. Executive Summary

This document defines the requirements for a Mini Time Tracking Tool (Zeiterfassungs-Mini-Tool) that allows users to track time spent on different projects. The application will be a web-based tool with local storage persistence, focusing on simplicity and ease of use.

---

## 2. Product Overview

### 2.1 Purpose
A lightweight time tracking application that enables users to:
- Start and stop timers for different projects
- View time entries for the current day
- Manage (create, edit, delete) time entries
- Persist data locally in the browser

### 2.2 Scope
- **Sprint 1 Focus:** Core functionality with local storage
- **Data Source:** Read-only project list from server (JSON)
- **Storage:** Local browser storage only
- **Authentication:** None required
- **Team Features:** Not included in Sprint 1

---

## 3. User Requirements

### 3.1 General Application Structure

#### 3.1.1 Start Page / Overview
- **User Story:** As a user, I want to see an overview when I open the app.
- **Requirements:**
  - Display the most important information at a glance
  - Show status, totals, and last changes
  - Provide quick access to key functions

#### 3.1.2 List View
- **Display List:**
  - **User Story:** As a user, I want to see a list of entries that I can select from.
  
- **Filter & Search:**
  - **User Story:** As a user, I want to be able to filter and search the list.

#### 3.1.3 Detail View
- **User Story:** As a user, I want to click on an entry and see its details.

#### 3.1.4 Editing Capabilities
- **Create:**
  - **User Story:** As a user, I want to be able to create new entries (if applicable to the app).
  
- **Edit:**
  - **User Story:** As a user, I want to be able to modify an entry.
  
- **Delete:**
  - **User Story:** As a user, I want to be able to remove entries.

### 3.2 Time Tracking Specific Requirements

#### 3.2.1 Core Functionality
- **User Story:** As a user, I want to select a project and start/stop my time tracking.
- **User Story:** As a user, I want to see how much time I have worked on a project today.
- **User Story:** As a user, I want my entries to persist when I reload the page.
- **User Story:** As a user, I want to be able to edit or delete my entries.

#### 3.2.2 Timer Functionality
- **Active Timer Display:**
  - Show when a timer is currently running
  - Display elapsed time in real-time
  - Only one timer can run at a time
  
- **Start/Stop Behavior:**
  - When stopped, a time entry is automatically saved
  - Timer state persists across page reloads

#### 3.2.3 Time Entry Display
- **Today's View:**
  - List all entries from today
  - Show sum per project
  - Display total sum for the day

---

## 4. Technical Requirements

### 4.1 Data Model

#### 4.1.1 Projects (Read-Only from Server)
- **Source:** Static `projects.json` file on server, loaded via `fetch()`
- **Structure:**
  ```json
  {
    "id": "string",
    "name": "string",
    "client": "string (optional)"
  }
  ```

#### 4.1.2 Time Entries (Local Storage)
- **Storage:** Browser local storage only
- **Required Fields:**
  - `projectId` (string) - Reference to project
  - `date` (string) - Format: YYYY-MM-DD
  - `startTime` / `endTime` OR `durationMinutes` (number)
  - `note` (string, optional) - Additional notes

### 4.2 User Interface

#### 4.2.1 Overview Page
- Project selection dropdown (populated from `projects.json`)
- Start/Stop button for selected project
- Active timer indicator with running time display
- Today's entries list with:
  - Individual entries
  - Sum per project
  - Total sum for the day

#### 4.2.2 Entry Management
- **Delete:** Required functionality to remove entries
- **Edit:** Optional but recommended functionality to modify entries

### 4.3 Business Rules
- Only one timer can run simultaneously
- When timer is stopped, an entry is automatically created and saved
- No authentication required
- No team collaboration features
- No server-side persistence (local storage only)

---

## 5. Data Validation & Error Handling

### 5.1 Validation Requirements
- **User Story:** As a user, I don't want to be able to make incorrect entries.
- **Implementation:**
  - Required fields must be validated (HTML5 + JavaScript)
  - Validation errors must be visible and understandable
  - Prevent invalid data entry

### 5.2 Error Handling
- **User Story:** As a user, I want clear feedback when something doesn't work.
- **Requirements:**
  - JSON loading errors must be caught and displayed in UI
  - Provide error message and option to retry loading
  - No unhandled errors in normal operation
  - Console should remain quiet during standard flow

---

## 6. UI/UX Requirements

### 6.1 Usability
- **User Story:** As a user, I want to be able to use the app intuitively.
- **Requirements:**
  - App must be usable without explanation
  - Buttons and navigation must be recognizable
  - Layout must be consistent (no "randomly mixed" pages)
  - Basic responsiveness: must work on narrow screens without making core functions unusable

### 6.2 Design Standards
- Consistent layout across all pages
- Clear visual hierarchy
- Intuitive navigation patterns
- Responsive design for mobile and desktop

---

## 7. Testing Requirements

### 7.1 Test Coverage
- **User Story:** As a stakeholder, I want to see that important functions are tested.
- **Framework:** Playwright E2E tests

### 7.2 Required Tests (Minimum 3)
1. **Data Loading Test:**
   - JSON is loaded and content appears in the UI
   - Projects are visible in dropdown

2. **User Action Test:**
   - User actions change state (create/edit/status/timer)
   - Start → Stop creates an entry
   - Delete removes entry and updates sums

3. **Persistence Test:**
   - After reload, state is maintained
   - Entries remain after page reload

### 7.3 Test Execution
- Tests must run locally via `npm test` or defined test command
- All tests must pass before deployment

---

## 8. Code Quality Standards

### 8.1 Project Setup
- Project must start without workarounds: `npm install` + `npm start` (or equivalent)
- No secrets/config needed in code
- No dead features in UI (buttons that do nothing)
- Clear folder structure (frontend/server separated or cleanly organized)

### 8.2 Code Standards
- No unhandled errors in normal operation
- Clean console output during standard flow
- Maintainable and readable code structure

---

## 9. Documentation Requirements

### 9.1 README.md Content
**User Story:** As a customer, I want to quickly understand what the product can do and how to start it.

**Required Sections:**
- **Project Name & Purpose:** Brief description (2-5 sentences)
- **Setup & Start:** Commands to install and run the project
- **Sprint 1 Features:** Bullet points of implemented features
- **Playwright Tests:** Command to run tests
- **Known Limitations / Open Issues:** List of current constraints
- **Team Members:** List of contributors

---

## 10. Definition of Done (Sprint 1)

### 10.1 Validation & Error Handling ✓
- [ ] Required fields are validated (HTML5 + JS)
- [ ] Error messages are visible and understandable
- [ ] JSON loading errors are caught in UI (error text + retry option)
- [ ] No unhandled errors in normal operation (quiet console)

### 10.2 UI Usability ✓
- [ ] App is usable without explanation (recognizable buttons/navigation)
- [ ] Layout is consistent (no randomly mixed pages)
- [ ] Basic responsiveness: works on narrow screens without breaking core functions

### 10.3 Testing ✓
- [ ] At least 3 Playwright E2E tests present
- [ ] Tests cover:
  - [ ] JSON loads and content appears
  - [ ] User action changes state (create/edit/status/timer)
  - [ ] Persistence: reload maintains state
- [ ] Tests run locally: `npm test` or defined test command

### 10.4 Code Quality ✓
- [ ] Project starts without workarounds: `npm install` + `npm start`
- [ ] No secrets/config needed in code
- [ ] No dead features in UI
- [ ] Clear folder structure

### 10.5 Documentation ✓
- [ ] README.md contains all required sections (see Section 9.1)

### 10.6 Demo Ready ✓
- [ ] App can be started in < 2 minutes
- [ ] Team can demonstrate:
  - [ ] Overview → Detail → Change → Reload → Change persists
  - [ ] Tests can be run or results shown

---

## 11. Out of Scope (Sprint 1)

- User authentication
- Team collaboration features
- Server-side persistence
- Multi-user support
- Reporting and analytics beyond daily totals
- Export functionality
- Project management features

---

## 12. Future Considerations

Potential enhancements for future sprints:
- Server-side persistence
- User authentication
- Team features
- Advanced reporting
- Export capabilities
- Multi-day views and summaries

---

**Document History:**
- v2.0 (2026-01-12): Consolidated PRD from multiple requirement documents
- v1.0 (2026-01-12): Initial requirements documents
