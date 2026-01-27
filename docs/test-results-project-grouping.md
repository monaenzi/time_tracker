## Test Results – [S2][US-02][T6] Logic: Group time entries by project

**Date**: 2026-01-27  
**Branch**: `feature/S2-US-02-week-month-view`  
**Command**: `npm test` (alias for `playwright test`)

### Goal

**Goal** of this test run: execute the end-to-end tests that cover grouping of time entries by project and verify that the implementation for [S2][US-02][T6] works as expected.

### Overall Result

- **Status**: ⚠️ Partially successful  
- **Summary**:  
  - All **Chromium** and **Firefox** runs passed, including the tests that validate:
    - grouping by day,  
    - grouping by project (indirectly via group-sum checks), and  
    - calculating sums per group ([S2][US-02][T7]).  
  - All **WebKit** runs failed due to a **Playwright/WebKit environment issue**, not an application logic error.

### Key Console Output (current run)

From the end of `npm test`:

```text
8 failed
  [webkit] › tests/tracker.spec.ts:13:1 › Projects are loaded and are visible in the list
  [webkit] › tests/tracker.spec.ts:31:1 › start and stop an entry
  [webkit] › tests/tracker.spec.ts:72:1 › Entry stays in history list after page refresh
  [webkit] › tests/tracker.spec.ts:107:1 › Delete entry and update time sum
  [webkit] › tests/tracker.spec.ts:158:1 › Filter time entries by week and month period
  [webkit] › tests/tracker.spec.ts:294:1 › Group time entries by day
  [webkit] › tests/tracker.spec.ts:435:1 › Calculate sums per group (day/project) [S2][US-02][T7]
  [webkit] › tests/tracker.spec.ts:548:1 › Empty periods and view switching (week/month) [S2][US-02][T8]
16 passed (1.6m)
```

And the representative WebKit error:

```text
Error: browserContext.newPage: Protocol error (Page.overrideSetting):
  Unknown setting: FixedBackgroundsPaintRelativeToDocument
```

This error occurs for all WebKit tests (including the ones that are relevant for [S2][US-02]).

### Interpretation for [S2][US-02][T6]

- The **grouping by project logic is functionally verified** on both Chromium and Firefox:  
  - The tests that depend on correct grouping and correct per-group sums (especially [S2][US-02][T7]) pass in these browsers.  
- The remaining failures are **WebKit-specific** and caused by a **Playwright/WebKit protocol incompatibility**, not by failures in the time-tracking or grouping logic itself.

### Next Steps / Recommendations

1. Treat [S2][US-02][T6] as **implemented and validated** for Chromium and Firefox.  
2. If WebKit support is required, investigate the Playwright/WebKit issue:
   - Ensure you are using a compatible combination of Playwright version and WebKit runtime for macOS 12.
   - Check the Playwright issue tracker for `FixedBackgroundsPaintRelativeToDocument` to see if this is a known bug with a recommended workaround or version pin.
3. Once the WebKit environment issue is resolved, re-run:

   ```bash
   npm test
   ```

   to confirm that all three browser engines (Chromium, Firefox, WebKit) pass the [S2][US-02] test suite.

### Conclusion

- **Functional status**: The feature for **grouping time entries by project** ([S2][US-02][T6]) behaves correctly and is covered by passing E2E tests on Chromium and Firefox.  
- **Technical status**: WebKit E2E tests are currently blocked by a Playwright/WebKit protocol error that is external to the application code.

