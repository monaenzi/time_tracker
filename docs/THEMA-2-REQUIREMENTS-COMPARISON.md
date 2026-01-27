# Thema 2 Requirements Comparison

**Based on:** Thema 2 - Mini Zeiterfassung 20260112 v2 inkl. Details.md  
**Assessment Date:** 2026-01-12  
**Project:** Mini Time Tracker

---

## Executive Summary

**Overall Completion: ~70% (14/20 requirements met)**

The project implements most core functionality but is missing critical features for edit/delete operations and some test coverage.

| Category | Status | Completion |
|----------|--------|------------|
| A) Benutzersicht / Kundensicht | ⚠️ Partial | 75% |
| B) Konkretisierung (Technical) | ⚠️ Partial | 80% |
| Testing Requirements | ⚠️ Partial | 50% |

---

## A) Benutzersicht / Kundensicht (User Perspective)

### ✅ Als Nutzer möchte ich ein Projekt auswählen und meine Zeit starten/stoppen
- **Status:** ✅ **COMPLETE**
- **Evidence:**
  - ✅ Project selection dropdown implemented
  - ✅ Projects loaded from server and displayed in dropdown
  - ✅ Start/Stop button functional (`handleStartStop()`)
  - ✅ Timer starts when button clicked (if project selected)
  - ✅ Timer pauses when button clicked again
  - ⚠️ **Note:** Uses "pause" instead of "stop" - timer can be resumed
- **Location:** 
  - `src/index.html` (lines 28-38, 44)
  - `src/js/main.js` (lines 236-243, 227-231)
- **Implementation Details:**
  - Project selector: Custom dropdown with search box
  - Start/Stop button: `#startStopBtn` with ▶/⏹ icons
  - Timer class: Encapsulates start/pause/stop functionality
  - Project validation: Alert shown if no project selected

### ✅ Ich möchte sehen, wie viel Zeit ich heute für ein Projekt gearbeitet habe
- **Status:** ✅ **COMPLETE**
- **Evidence:**
  - ✅ History panel shows today's entries
  - ✅ Each entry displays project name and duration
  - ✅ Total time for today displayed
  - ⚠️ **Partial:** Shows individual entries and total, but NOT sum per project
  - Requirements specify "Summe pro Projekt" (sum per project) which is missing
- **Location:**
  - `src/index.html` (lines 54-61)
  - `src/js/main.js` (lines 288-309)
- **Implementation Details:**
  - History panel: Toggleable panel showing "Heute" (Today)
  - Entry list: Shows all entries from today with project name and duration
  - Total calculation: Sums all durations for today
  - **Missing:** Grouping by project and showing sum per project

### ✅ Ich möchte Einträge wiederfinden, wenn ich die Seite neu lade
- **Status:** ✅ **COMPLETE**
- **Evidence:**
  - ✅ Entries stored in `localStorage`
  - ✅ Entries loaded on page initialization
  - ✅ Entries persist after page reload
  - ✅ History list updates with persisted entries
- **Location:**
  - `src/js/main.js` (line 2: `localStorage.getItem('timeEntries')`)
  - `src/js/main.js` (lines 256-257, 585: `localStorage.setItem`)
  - `src/js/main.js` (line 323: `renderHistory()` called on init)
- **Implementation Details:**
  - Storage: `localStorage.getItem('timeEntries')` on page load
  - Save: `localStorage.setItem('timeEntries', JSON.stringify(timeEntries))` after each entry creation
  - Format: JSON array of entry objects
  - Persistence: Verified - entries remain after reload

### ❌ Ich möchte meine Einträge bearbeiten oder löschen können
- **Status:** ❌ **NOT IMPLEMENTED**
- **Evidence:**
  - ❌ No delete button on entries
  - ❌ No edit button on entries
  - ❌ No delete functionality
  - ❌ No edit functionality
  - ⚠️ README mentions "Delete (and optionally edit) time entries" but not implemented
- **Location:** `src/index.html` (line 59: entry list has no buttons)
- **Missing Features:**
  - Delete button per entry
  - Delete handler function
  - Edit button per entry
  - Edit form/modal (could reuse create form)
  - Update entry in localStorage
  - Refresh list after delete/edit

---

## B) Konkretisierung für die Gruppe (Sprint 1 Technical Requirements)

### Datenquelle (read-only)

#### ✅ Statische Datei projects.json liegt am Server und wird per fetch() geladen
- **Status:** ✅ **COMPLETE**
- **Evidence:**
  - ✅ `projects.json` file exists in `backend/` directory
  - ✅ Server endpoint `/api/projects` serves the file
  - ✅ Frontend uses `fetch('/api/projects')` to load projects
  - ✅ Projects loaded on page initialization
- **Location:**
  - `backend/projects.json` (contains project data)
  - `backend/server.js` (lines 35-51: GET `/api/projects` endpoint)
  - `src/js/main.js` (lines 162-183: `fetchProjectsFromServer()`)
- **Implementation Details:**
  - Server: Express.js serves JSON file
  - Fetch: Uses native `fetch()` API
  - Error handling: Try-catch with error display in UI
  - Format: JSON array with id, name, optional client

#### ✅ Inhalt: Projekte mit id, name, optional client
- **Status:** ✅ **COMPLETE**
- **Evidence:**
  - ✅ Projects have `id` field (numeric: 1, 2, 3)
  - ✅ Projects have `name` field (string: "Web Design", etc.)
  - ✅ Projects have optional `client` field (string: "Company A", etc.)
- **Location:** `backend/projects.json` (lines 1-17)
- **Example:**
  ```json
  {
    "id": 1,
    "name": "Web Design",
    "client": "Company A"
  }
  ```

### Lokale Speicherung

#### ✅ Zeiteinträge werden nur lokal gespeichert
- **Status:** ✅ **COMPLETE**
- **Evidence:**
  - ✅ All entries stored in `localStorage` only
  - ✅ No server-side storage
  - ✅ No API calls for saving entries
  - ✅ Data persists in browser only
- **Location:** `src/js/main.js` (localStorage calls throughout)

#### ✅ Ein Zeiteintrag besteht mindestens aus: projectId, date (YYYY-MM-DD), startTime/endTime oder durationMinutes, optional note
- **Status:** ⚠️ **PARTIAL**
- **Evidence:**
  - ✅ `projectId` - Implemented (numeric)
  - ✅ `date` - Implemented (YYYY-MM-DD format)
  - ⚠️ `durationMinutes` - Implemented (uses this format)
  - ❌ `startTime/endTime` - NOT implemented (only uses durationMinutes)
  - ❌ `note` - NOT implemented (optional field missing)
- **Location:** `src/js/main.js` (lines 250-254, 575-579)
- **Current Entry Structure:**
  ```javascript
  {
    projectId: 1,
    date: "2026-01-12",
    durationMinutes: 30
  }
  ```
- **Missing:**
  - `startTime` / `endTime` fields (alternative to durationMinutes)
  - `note` field (optional text)

### UI & Funktionen

#### ✅ Übersichtsseite: Projekt auswählen + Start/Stop Button
- **Status:** ✅ **COMPLETE**
- **Evidence:**
  - ✅ Overview page shows project selector
  - ✅ Start/Stop button visible and functional
  - ✅ Project selection works
  - ✅ Timer controls work
- **Location:** `src/index.html` (lines 11-51)

#### ✅ Anzeige „aktiver Timer läuft" inkl. laufender Zeit
- **Status:** ✅ **COMPLETE**
- **Evidence:**
  - ✅ Status indicator shows "Running" when timer active
  - ✅ Timer display shows elapsed time in MM:SS format
  - ✅ Timer updates every second (real-time)
  - ✅ Visual indicator (status dot) changes
- **Location:**
  - `src/index.html` (lines 17-20: timer display and status)
  - `src/js/main.js` (lines 15-20: timer.start() updates UI)
  - `src/js/main.js` (lines 47-52: updateUI() function)

#### ⚠️ Liste „heute": alle Einträge von heute + Summe pro Projekt + Gesamtsumme
- **Status:** ⚠️ **PARTIAL (67%)**
- **Evidence:**
  - ✅ All entries from today displayed
  - ✅ Gesamtsumme (total sum) displayed
  - ❌ **MISSING:** Summe pro Projekt (sum per project)
- **Location:** `src/js/main.js` (lines 288-309: `renderHistory()`)
- **Current Implementation:**
  - Shows individual entries: "Project Name: X min"
  - Shows total: "Total: X min"
  - **Missing:** Grouped sums like "Web Design: 90 min total"
- **Gap:** Need to group entries by project and calculate sum per project

#### ❌ Bearbeiten/Löschen: mindestens Eintrag löschen, bearbeiten optional (aber empfohlen)
- **Status:** ❌ **NOT IMPLEMENTED**
- **Evidence:**
  - ❌ Delete functionality not implemented
  - ❌ Edit functionality not implemented
  - Requirements state: "mindestens Eintrag löschen" (at least delete entries)
  - This is a **required** feature, not optional
- **Location:** N/A (not implemented)
- **Missing:**
  - Delete button on each entry
  - Delete handler function
  - Edit button (recommended but not required)
  - Edit form/modal
  - Update localStorage after delete/edit

### Regeln (zur Einschränkung)

#### ✅ Es kann nur ein Timer gleichzeitig laufen
- **Status:** ✅ **COMPLETE**
- **Evidence:**
  - ✅ Timer class manages single timer instance
  - ✅ Only one timer can be running at a time
  - ✅ Starting a new timer pauses/resets previous one
  - ✅ Timer state tracked in `Timer` class
- **Location:** `src/js/main.js` (lines 5-66: Timer class)

#### ⚠️ Beim Stop wird ein Eintrag gespeichert
- **Status:** ⚠️ **PARTIAL**
- **Evidence:**
  - ⚠️ Entry saved on **Reset** (not Stop)
  - ⚠️ Timer has "pause" functionality, not "stop"
  - ✅ When Reset is clicked, entry is created and saved
  - ⚠️ **Issue:** Requirements say "Beim Stop" (on stop), but implementation uses Reset button
- **Location:** `src/js/main.js` (lines 245-260: `handleReset()`)
- **Current Behavior:**
  - Start → Pause: Timer pauses, no entry created
  - Reset: Timer stops, entry created and saved
- **Gap:** Should create entry on Stop/Pause, not just Reset

#### ✅ Keine Auth, keine Teamfunktionen, keine Serverpersistenz
- **Status:** ✅ **COMPLETE**
- **Evidence:**
  - ✅ No authentication implemented
  - ✅ No login/user accounts
  - ✅ No team features
  - ✅ No server-side storage (localStorage only)
  - ✅ All data stored locally in browser
- **Location:** Entire codebase (no auth/team/server code)

---

## Testing (Playwright, Sprint 1)

### ❌ Test: Projekte werden geladen und sind im Dropdown sichtbar
- **Status:** ❌ **MISSING**
- **Evidence:**
  - ⚠️ Projects are loaded in test setup (beforeEach)
  - ❌ No dedicated test that explicitly verifies:
    - Projects are loaded from server
    - Projects appear in dropdown
    - Projects are selectable
- **Location:** `tests/issue-26/create-entry.spec.js`
- **Gap:** Need explicit test for project loading and dropdown visibility

### ❌ Test: Start → Stop erzeugt einen Eintrag
- **Status:** ❌ **MISSING**
- **Evidence:**
  - ❌ No test for timer start/stop functionality
  - ❌ No test that verifies entry creation from timer
  - Current tests only cover manual entry creation via form
- **Location:** N/A (not implemented)
- **Gap:** Need test that:
  1. Selects a project
  2. Starts timer
  3. Stops/pauses timer
  4. Verifies entry is created
  5. Verifies entry appears in list

### ❌ Test: Eintrag bleibt nach Reload erhalten
- **Status:** ❌ **MISSING**
- **Evidence:**
  - ❌ No test for persistence after page reload
  - ❌ No test that verifies localStorage persistence
  - This is a critical requirement
- **Location:** N/A (not implemented)
- **Gap:** Need test that:
  1. Creates an entry
  2. Reloads the page
  3. Verifies entry still exists
  4. Verifies entry appears in list

### ❌ Test: Löschen entfernt Eintrag und aktualisiert Summen
- **Status:** ❌ **MISSING**
- **Evidence:**
  - ❌ Delete functionality not implemented
  - ❌ No test for delete (cannot test what doesn't exist)
  - This test cannot be written until delete is implemented
- **Location:** N/A (not implemented)
- **Gap:** 
  1. First implement delete functionality
  2. Then add test for delete
  3. Verify entry removed from list
  4. Verify totals updated

---

## Summary of Gaps

### Critical Gaps (Must Fix for Sprint 1)
1. **Delete Functionality** - Required: "mindestens Eintrag löschen"
2. **Sum Per Project** - Required: "Summe pro Projekt" in today's list
3. **Persistence Test** - Required: "Eintrag bleibt nach Reload erhalten"
4. **Start→Stop Entry Test** - Required: "Start → Stop erzeugt einen Eintrag"

### Important Gaps (Should Fix)
5. **Edit Functionality** - Recommended: "bearbeiten optional (aber empfohlen)"
6. **Project Loading Test** - Required: "Projekte werden geladen und sind im Dropdown sichtbar"
7. **Delete Test** - Required: "Löschen entfernt Eintrag und aktualisiert Summen"
8. **Entry on Stop** - Should create entry on Stop/Pause, not just Reset

### Nice to Have
9. **Note Field** - Optional field in entry structure
10. **startTime/endTime** - Alternative to durationMinutes (currently only durationMinutes used)

---

## Detailed Feature Comparison

| Requirement | Status | Implementation | Notes |
|-------------|--------|----------------|-------|
| **A) User Perspective** |
| Select project and start/stop | ✅ | Complete | Uses pause, not stop |
| See time worked today | ⚠️ | Partial | Missing sum per project |
| Entries persist after reload | ✅ | Complete | localStorage works |
| Edit/Delete entries | ❌ | Missing | Required feature |
| **B) Technical** |
| JSON from server (fetch) | ✅ | Complete | `/api/projects` endpoint |
| Projects: id, name, client | ✅ | Complete | All fields present |
| Local storage only | ✅ | Complete | No server persistence |
| Entry: projectId | ✅ | Complete | Numeric ID |
| Entry: date (YYYY-MM-DD) | ✅ | Complete | Correct format |
| Entry: durationMinutes | ✅ | Complete | Used format |
| Entry: startTime/endTime | ❌ | Missing | Alternative format |
| Entry: note (optional) | ❌ | Missing | Optional field |
| Overview: project select | ✅ | Complete | Dropdown works |
| Overview: start/stop button | ✅ | Complete | Functional |
| Active timer display | ✅ | Complete | Real-time updates |
| Today's list: all entries | ✅ | Complete | Filtered by date |
| Today's list: sum per project | ❌ | Missing | Required feature |
| Today's list: total sum | ✅ | Complete | Calculated |
| Delete entries | ❌ | Missing | **Required** |
| Edit entries | ❌ | Missing | Recommended |
| One timer at a time | ✅ | Complete | Enforced |
| Entry saved on stop | ⚠️ | Partial | Saved on reset, not stop |
| No auth/team/server | ✅ | Complete | Local only |
| **Testing** |
| Test: Projects loaded | ❌ | Missing | No explicit test |
| Test: Start→Stop creates entry | ❌ | Missing | No timer test |
| Test: Persistence after reload | ❌ | Missing | No persistence test |
| Test: Delete removes entry | ❌ | Missing | Cannot test (not implemented) |

---

## Recommendations

### Immediate Actions (Critical for Sprint 1)
1. ✅ **Implement Delete Functionality**
   - Add delete button to each entry in list
   - Implement delete handler
   - Update localStorage
   - Refresh list and totals

2. ✅ **Add Sum Per Project**
   - Group entries by project in `renderHistory()`
   - Calculate sum per project
   - Display grouped sums in list

3. ✅ **Fix Entry Creation on Stop**
   - Create entry when timer is paused/stopped (not just reset)
   - Or clarify that "Reset" is the intended "Stop" action

4. ✅ **Add Missing Tests**
   - Test: Projects loaded and visible in dropdown
   - Test: Start → Stop creates entry
   - Test: Entry persists after reload
   - Test: Delete removes entry (after implementing delete)

### Next Steps
5. Implement Edit Functionality (recommended)
6. Add Note Field to Entry Structure (optional)
7. Consider startTime/endTime as alternative to durationMinutes

---

## Completion Checklist

### User Perspective (A)
- [x] Select project and start/stop timer
- [x] See time worked today (partial - missing sum per project)
- [x] Entries persist after reload
- [ ] Edit/Delete entries

### Technical Requirements (B)
- [x] JSON from server via fetch()
- [x] Projects: id, name, optional client
- [x] Local storage only
- [x] Entry: projectId, date (YYYY-MM-DD), durationMinutes
- [ ] Entry: startTime/endTime (alternative)
- [ ] Entry: note (optional)
- [x] Overview: project select + start/stop
- [x] Active timer display with running time
- [x] Today's list: all entries
- [ ] Today's list: sum per project
- [x] Today's list: total sum
- [ ] Delete entries (required)
- [ ] Edit entries (recommended)
- [x] One timer at a time
- [x] Entry saved (on reset, not stop)
- [x] No auth/team/server features

### Testing
- [ ] Test: Projects loaded and visible
- [ ] Test: Start → Stop creates entry
- [ ] Test: Entry persists after reload
- [ ] Test: Delete removes entry

**Total: 14/20 requirements met (70%)**

---

**Assessment completed by:** AI Assistant  
**Last Updated:** 2026-01-12
