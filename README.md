# time_tracker

## Importing User Stories

This repository includes a set of user stories that can be imported as GitHub issues.

### Prerequisites

- [GitHub CLI (gh)](https://cli.github.com/) installed and authenticated
- Python 3.x

### Import Process

1. **Review the user stories**: The file `user-stories.csv` contains 16 user stories for the time tracker application.

2. **Dry run** (recommended first step): Preview what will be created without actually creating issues:
   ```bash
   ./import-user-stories.sh --dry-run
   ```
   Or directly with Python:
   ```bash
   python3 import-user-stories.py --dry-run
   ```

3. **Import the issues**: Once you're satisfied with the preview, run the import:
   ```bash
   ./import-user-stories.sh
   ```
   Or directly with Python:
   ```bash
   python3 import-user-stories.py
   ```

### What Gets Imported

Each user story will be created as a GitHub issue with:
- **Title**: The user story title
- **Body**: The full user story description including acceptance criteria
- **Labels**: All labels from the CSV plus automatically added sprint and priority labels
- **Sprint metadata**: Added to the issue body
- **Priority metadata**: Added to the issue body

### User Stories Overview

The following 16 user stories will be imported:

**Sprint 1 (P1 - High Priority):**
1. Übersicht nach App-Start anzeigen
2. Liste von Zeiteinträgen anzeigen
3. Detailansicht für Eintrag öffnen
4. Neuen Zeiteintrag erstellen
5. Zeiteintrag bearbeiten
6. Zeiteintrag löschen
7. Projekt auswählen und Timer starten/stoppen
8. Lokale Persistenz für Einträge
9. Eingaben validieren und Fehleingaben verhindern
10. Robuste Fehlerbehandlung im UI
11. UI/UX Mindestanforderungen erfüllen
12. E2E-Tests (Playwright) für Kernflows
13. README-Dokumentation für Abgabe

**Sprint 1 (P2 - Medium Priority):**
14. Demo-Flow in <2 Minuten möglich

**Sprint 2 (P2 - Medium Priority):**
15. Liste filtern und suchen
16. Heutige Arbeitszeit je Projekt anzeigen

### Files

- `user-stories.csv` - CSV file containing all user stories
- `import-user-stories.py` - Python script that parses CSV and creates GitHub issues
- `import-user-stories.sh` - Shell wrapper script with prerequisite checks