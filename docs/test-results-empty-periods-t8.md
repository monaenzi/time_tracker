## Test Results: Empty Periods & View Switching (T8)

**Task:** [S2][US-02][T8] Tests: Leere Zeiträume und View-Umschaltung prüfen #105  
**Date:** January 27, 2026  
**Status:** ✅ **PASSED**

---

## Test Overview

This document records the results for the explicit end‑to‑end test that verifies:

- Correct handling of **empty periods** (no entries in the selected week/month), and  
- Correct behavior of the **week/month view switching** in combination with period navigation.

The goal is to ensure that:

- Periods without entries show an appropriate “no entries” message and total `0`, and  
- Navigating back to a period with entries, or switching views, reliably restores the correct list and total.

---

## Test Environment

- **Framework:** Playwright Test  
- **Browser:** Chromium  
- **Test file:** `tests/tracker.spec.ts`  
- **Test name:** `Empty periods and view switching (week/month) [S2][US-02][T8]`

---

## Test Data Used

Only **one** entry is injected into `localStorage.timeEntries`, positioned in the **current period**:

```js
[
  {
    projectid: 1,
    projectName: 'Web Design',
    date: '<today>',
    startTime: '09:00',
    endTime: '10:00',
    durationMinutes: 60,
    notes: 'Current period entry'
  }
]
```

Implications:

- The **current week** and **current month** contain exactly one entry.  
- The **previous/next week** and **previous/next month** are expected to be **empty** for this project.

---

## Test Steps & Assertions

### 1. Baseline – Current Week Contains Entry ✅

**Steps:**

1. Seed `localStorage.timeEntries` with the single “current period” entry.  
2. Load `index.html`.  
3. Select project **Web Design** so the history renders.  
4. Ensure **Week** view is active (`#weekViewBtn` has `active` class).  

**Assertions:**

- History list (`[data-testid="history-list"]`) contains the entry text `09:00 - 10:00`.  
- Total time (`[data-testid="totalTime"]`) shows `60`.  

**Result:** ✅ **PASSED**

---

### 2. Previous Week – No Entries (Empty Period) ✅

**Steps:**

1. Click **Previous period** (`#prevPeriodBtn`) while in week view.  
2. Wait for re‑render.  

**Assertions:**

- History list contains the text **`"No entries found for this period."`**.  
- Total time shows **`0`**.  

**Result:** ✅ **PASSED**

---

### 3. Back to Current Week – Entry Restored ✅

**Steps:**

1. Click **Next period** (`#nextPeriodBtn`) to navigate back to the current week.  
2. Wait for re‑render.  

**Assertions:**

- History list again contains `09:00 - 10:00`.  
- Total time again shows `60`.  

**Result:** ✅ **PASSED**

---

### 4. Switch to Month View – Entry Still Visible ✅

**Steps:**

1. From current week, click **Month** view (`#monthViewBtn`).  
2. Wait for re‑render.  

**Assertions:**

- `#monthViewBtn` has `active` class, `#weekViewBtn` is not active.  
- History list contains `09:00 - 10:00`.  
- Total time shows `60`.  

**Result:** ✅ **PASSED**

---

### 5. Next Month – Empty Period in Month View ✅

**Steps:**

1. Click **Next period** (`#nextPeriodBtn`) while in **Month** view.  
2. Wait for re‑render.  

**Assertions:**

- History list shows **`"No entries found for this period."`**.  
- Total time shows **`0`**.  

**Result:** ✅ **PASSED**

---

### 6. Switch Back to Week View – Reset to Current Week ✅

**Steps:**

1. From the empty next month, click **Week** view (`#weekViewBtn`).  
2. Wait for re‑render.  

**Assertions:**

- `#weekViewBtn` has `active` class, `#monthViewBtn` is not active.  
- History list once again contains `09:00 - 10:00`.  
- Total time shows `60`.  

**Result:** ✅ **PASSED**

---

## Execution Log

Representative command and output (Chromium only):

```bash
npx playwright test -g "[S2][US-02][T8]" --project=chromium --reporter=line
```

```text
Running 1 test using 1 worker
[chromium] › tests/tracker.spec.ts › Empty periods and view switching (week/month) [S2][US-02][T8]
T8 empty periods + view switching test completed successfully
1 passed
```

---

## Conclusion

✅ **Empty periods are handled correctly** in both week and month views, with clear messaging and totals set to `0`.  
✅ **View switching and period navigation** work together reliably: moving between weeks/months and toggling week/month views consistently restores or hides entries and updates totals.  

The behavior required by **[S2][US-02][T8]** is fully implemented and verified for Chromium.

