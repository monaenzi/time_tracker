# User Stories CSV Format

## File: user-stories.csv

This CSV file contains all user stories for the time tracker application that can be imported as GitHub issues.

## CSV Structure

The CSV file has the following columns:

| Column | Description | Format | Example |
|--------|-------------|--------|---------|
| Title | User story title | Plain text | "Übersicht nach App-Start anzeigen" |
| Body | Full user story with acceptance criteria | Multi-line text with newlines | "Als Nutzer möchte ich...\n\nAkzeptanzkriterien:\n- ..." |
| Labels | Comma-separated list of labels | label1,label2,label3 | "user-story,ui,core" |
| Sprint | Sprint assignment | "Sprint 1" or "Sprint 2" | "Sprint 1" |
| Priority | Priority level | "P1" or "P2" | "P1" |

## Field Details

### Title
- Single line describing the user story
- Will become the GitHub issue title
- Should be concise but descriptive

### Body
- Contains the full user story description
- Typically in "Als [role] möchte ich [goal], damit [benefit]" format
- Includes "Akzeptanzkriterien:" (acceptance criteria) section
- Can contain multiple paragraphs and bullet points
- Multi-line text is properly quoted in CSV

### Labels
- Comma-separated list without spaces after commas
- Common labels:
  - `user-story` - Indicates this is a user story
  - `core` - Core functionality
  - `ui` - User interface related
  - `ux` - User experience related
  - `crud` - Create, Read, Update, Delete operations
  - `validation` - Input validation
  - `persistence` - Data persistence/storage
  - `timer` - Timer functionality
  - `reporting` - Reporting/analytics
  - `robustness` - Error handling and robustness
  - `testing` - Testing related
  - `e2e` - End-to-end testing
  - `docs` - Documentation
  - `demo` - Demo/presentation related

### Sprint
- Sprint assignment for the user story
- Values: "Sprint 1" or "Sprint 2"
- Script will auto-generate a label like `sprint-1` or `sprint-2`

### Priority
- Priority level for the user story
- Values:
  - `P1` - High priority (must-have for sprint)
  - `P2` - Medium priority (nice-to-have)
- Script will auto-generate a label like `p1` or `p2`

## Example Row

```csv
Neuen Zeiteintrag erstellen,"Als Nutzer möchte ich neue Einträge anlegen können.

Akzeptanzkriterien:
- Formular zum Anlegen vorhanden.
- Pflichtfelder validiert (HTML5 + JS).
- Erfolgreiches Anlegen aktualisiert Liste/Übersicht.","user-story,crud,validation",Sprint 1,P1
```

This will create a GitHub issue with:
- **Title:** "Neuen Zeiteintrag erstellen"
- **Labels:** user-story, crud, validation, sprint-1, p1
- **Body:** The description with acceptance criteria plus Sprint and Priority metadata

## Adding New User Stories

To add new user stories to the CSV:

1. Follow the format exactly as shown above
2. Use proper CSV quoting for multi-line Body fields (enclose in double quotes)
3. Escape any internal double quotes by doubling them ("")
4. Ensure all five columns are present for each row
5. Keep labels consistent with existing ones where possible

## Validation

The import script (`import-user-stories.py`) validates:
- All required fields are present
- Sprint and Priority values are valid
- CSV file format is correct

Use `--dry-run` mode to validate your CSV before importing:
```bash
python3 import-user-stories.py --dry-run
```
