# Test Results: Empty Periods & View Switching (Week/Month)

**Task:** [S2][US-02][T8] Tests: Leere Zeiträume und View-Umschaltung prüfen #105  
**Date:** January 27, 2026  
**Status:** ✅ **PASSED**

---

## Test Overview

This document contains the test results for **explicitly verifying**:

- Empty time ranges (periods with **zero** entries) in **week** and **month** views
- View switching behavior (**Week ↔ Month**) including active button state
- Period navigation (**previous/next**) while ensuring totals update correctly

---

## Test Environment

- **Test Framework:** Playwright Test
- **Browser:** Chromium
- **Test File:** `tests/tracker.spec.ts`
- **Test Name:** `Empty periods and view switching (week/month) [S2][US-02][T8]`

---

## Test Data

The test seeds LocalStorage with **exactly one entry** in the current period:

- Project: **Web Design**
- Date: **today**
- Time: **09:00 - 10:00**
- Duration: **60 min**

This guarantees that **adjacent periods** (previous week / next month) are **empty**.

---

## Test Cases Executed

### 1. Baseline: Current Week Contains Entry ✅

- **Expected:** Entry visible, total time = **60**
- **Actual:** ✅ Entry shown (`09:00 - 10:00`), total = **60**

### 2. Navigate to Previous Week (Empty Period) ✅

- **Action:** Click `◀` in week view
- **Expected:** Empty-state message + total time **0**
- **Actual:** ✅ Shows `No entries found for this period.` and total = **0**

### 3. Navigate Back to Current Week ✅

- **Action:** Click `▶`
- **Expected:** Entry visible again + total time **60**
- **Actual:** ✅ Entry shown, total = **60**

### 4. Switch to Month View ✅

- **Action:** Click `Month`
- **Expected:** Month button becomes active, entry still visible, total = **60**
- **Actual:** ✅ Month active, entry shown, total = **60**

### 5. Navigate to Next Month (Empty Period) ✅

- **Action:** Click `▶` in month view
- **Expected:** Empty-state message + total time **0**
- **Actual:** ✅ Shows `No entries found for this period.` and total = **0**

### 6. Switch Back to Week View (Reset to Current Week) ✅

- **Action:** Click `Week`
- **Expected:** Week button active, entry visible again, total = **60**
- **Actual:** ✅ Week active, entry shown, total = **60**

---

## Test Execution Log

Command:

```bash
npx playwright test -g "Empty periods and view switching" --project=chromium --reporter=line
```

Output:

```
Running 1 test using 1 worker
[1/1] [chromium] › tests/tracker.spec.ts:548:1 › Empty periods and view switching (week/month) [S2][US-02][T8]
T8 empty periods + view switching test completed successfully
1 passed (4.9s)
```

---

## Conclusion

The **T8** requirements are **implemented and explicitly tested**:

- ✅ Empty week/month periods are handled correctly
- ✅ View switching (week/month) updates UI state and re-renders correctly
- ✅ Total time resets to **0** when the filtered period has no entries

