# Test Results: Group Sum Calculation (T7)

**Task:** [S2][US-02][T7] Logik: Summen pro Gruppe berechnen (#104)  
**Date:** January 27, 2026  
**Status:** ✅ **PASSED**

---

## Test Overview

This document contains the test results for **explicit verification of per-group sum calculations** in the history list.

The test asserts **exact totals shown in group headers** for:

- Grouping by **Day** (selected project)
- Grouping by **Project** (all projects)

---

## Test Environment

- **Framework:** Playwright Test
- **Browser:** Chromium
- **Test file:** `tests/tracker.spec.ts`
- **Test name:** `Calculate sums per group (day/project) [S2][US-02][T7]`

---

## Test Data Used

The following entries are injected into `localStorage.timeEntries`:

```js
[
  // Web Design (today): 30 + 90 = 120
  { projectid: 1, projectName: "Web Design", date: "<today>",     durationMinutes: 30, startTime: "09:00", endTime: "09:30" },
  { projectid: 1, projectName: "Web Design", date: "<today>",     durationMinutes: 90, startTime: "10:00", endTime: "11:30" },

  // Web Design (yesterday): 60
  { projectid: 1, projectName: "Web Design", date: "<yesterday>", durationMinutes: 60, startTime: "12:00", endTime: "13:00" },

  // Consulting (today): 40
  { projectid: 3, projectName: "Consulting", date: "<today>",     durationMinutes: 40, startTime: "14:00", endTime: "14:40" }
]
```

Expected totals:

- **Day grouping (Web Design selected)**:
  - Today group header: **120 min**
  - Yesterday group header: **60 min**
- **Project grouping (all projects)**:
  - Web Design group header: **180 min**
  - Consulting group header: **40 min**

---

## Test Cases Executed

### 1. Sum per Day Group (Selected Project) ✅

**Steps:**

1. Load app and select project **Web Design**
2. Switch to **Month** view (to ensure all entries for current month are visible)
3. Confirm **Group by Day** is active
4. Assert the two day group headers exist
5. Assert exact `.group-total` values:
   - First header: `120 min`
   - Second header: `60 min`

**Result:** ✅ **PASSED**

---

### 2. Sum per Project Group (All Projects) ✅

**Steps:**

1. Switch grouping to **Group by Project**
2. Assert the two project group headers exist
3. Assert exact `.group-total` values by group label:
   - `Consulting` → `40 min`
   - `Web Design` → `180 min`

**Result:** ✅ **PASSED**

---

## Execution Log

```
> playwright test -g \[S2\]\[US-02\]\[T7\] --project=chromium --reporter=line

Running 1 test using 1 worker
[chromium] › tests/tracker.spec.ts › Calculate sums per group (day/project) [S2][US-02][T7]
T7 group sum calculation test completed successfully
1 passed (3.9s)
```

---

## Conclusion

✅ **Group sums are calculated and displayed correctly** in the group headers for both **day** and **project** grouping modes.

