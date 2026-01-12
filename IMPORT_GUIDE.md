# User Stories Import Guide

This guide explains how to import the 16 user stories into GitHub issues for the time_tracker project.

## Overview

The project includes 16 user stories organized into:
- **Sprint 1**: 13 high-priority (P1) stories + 1 medium-priority (P2) story
- **Sprint 2**: 2 medium-priority (P2) stories

## Prerequisites

Before importing, ensure you have:

1. **GitHub CLI (gh)** installed:
   - macOS: `brew install gh`
   - Linux: Follow instructions at https://github.com/cli/cli/releases
   - Windows: Download from https://github.com/cli/cli/releases

2. **GitHub CLI authenticated**: Run `gh auth login` and follow the prompts

3. **Python 3.x** installed (usually pre-installed on macOS/Linux)

## Import Steps

### Step 1: Review User Stories (Dry Run)

First, preview what will be created without actually creating any issues:

```bash
./import-user-stories.sh --dry-run
```

This will display:
- All 16 user stories with their titles
- Complete issue bodies including acceptance criteria
- Labels that will be applied (including auto-generated sprint/priority labels)
- Sprint and Priority metadata

### Step 2: Verify GitHub Authentication

Make sure you're authenticated and pointing to the correct repository:

```bash
gh auth status
gh repo view
```

### Step 3: Import Issues

Once you've reviewed the dry run output and verified authentication, run the actual import:

```bash
./import-user-stories.sh
```

The script will:
- Parse all 16 stories from `user-stories.csv`
- Create each as a GitHub issue
- Apply labels: user story type + sprint + priority
- Display progress with URLs for created issues

### Step 4: Verify Import

After import completes, verify the issues were created:

```bash
gh issue list --label user-story
```

Or view them in the GitHub web interface.

## What Gets Created

Each user story becomes a GitHub issue with:

### Title
The user story title in German (e.g., "Übersicht nach App-Start anzeigen")

### Body Format
```
[User Story Description]

Akzeptanzkriterien:
- [Criterion 1]
- [Criterion 2]
...

---

**Sprint:** Sprint 1
**Priority:** P1
```

### Labels
Each issue receives multiple labels:
- **Type labels**: `user-story`, `core`, `ui`, `crud`, `validation`, etc.
- **Sprint label**: `sprint-1` or `sprint-2` (auto-generated)
- **Priority label**: `p1` or `p2` (auto-generated)

## User Stories Summary

### Sprint 1 - High Priority (P1) - 13 stories

| # | Title | Labels |
|---|-------|--------|
| 1 | Übersicht nach App-Start anzeigen | user-story, ui |
| 2 | Liste von Zeiteinträgen anzeigen | user-story, core |
| 3 | Detailansicht für Eintrag öffnen | user-story, core |
| 4 | Neuen Zeiteintrag erstellen | user-story, crud, validation |
| 5 | Zeiteintrag bearbeiten | user-story, crud, persistence |
| 6 | Zeiteintrag löschen | user-story, crud, persistence |
| 7 | Projekt auswählen und Timer starten/stoppen | user-story, timer, core |
| 8 | Lokale Persistenz für Einträge | user-story, persistence |
| 9 | Eingaben validieren und Fehleingaben verhindern | user-story, validation |
| 10 | Robuste Fehlerbehandlung im UI | user-story, robustness |
| 11 | UI/UX Mindestanforderungen erfüllen | user-story, ui, ux |
| 12 | E2E-Tests (Playwright) für Kernflows | user-story, testing, e2e |
| 13 | README-Dokumentation für Abgabe | user-story, docs |

### Sprint 1 - Medium Priority (P2) - 1 story

| # | Title | Labels |
|---|-------|--------|
| 14 | Demo-Flow in <2 Minuten möglich | user-story, demo |

### Sprint 2 - Medium Priority (P2) - 2 stories

| # | Title | Labels |
|---|-------|--------|
| 15 | Liste filtern und suchen | user-story, ui |
| 16 | Heutige Arbeitszeit je Projekt anzeigen | user-story, reporting |

## Troubleshooting

### "gh: command not found"
Install GitHub CLI: https://cli.github.com/

### "gh auth status" fails
Run `gh auth login` to authenticate with GitHub

### "failed to create issue"
Check that you have write permissions to the repository

### Import stops partway through
The script will report how many succeeded/failed. You can:
1. Check which issues were created: `gh issue list`
2. Edit `user-stories.csv` to remove already-created stories
3. Re-run the import script

## Manual Import Alternative

If you prefer to create issues manually or need more control:

1. Open `user-stories.csv` in a spreadsheet application
2. For each row, create a GitHub issue using the web interface
3. Use the Title as the issue title
4. Copy the Body as the issue description
5. Add the labels from the Labels column
6. Add sprint and priority labels manually

## Files Reference

- **`user-stories.csv`**: Source data with all 16 user stories
- **`import-user-stories.py`**: Python script that does the actual import
- **`import-user-stories.sh`**: Wrapper script with prerequisite checks
- **`IMPORT_GUIDE.md`**: This guide
- **`README.md`**: Project documentation with quick import instructions
