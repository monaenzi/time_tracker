# Thema 2 - Mini Zeiterfassung 20260112 v2 inkl. Details

*Converted from: Thema 2 - Mini Zeiterfassung 20260112 v2 inkl. Details.pdf*

---

## Page 1

2) Zeiterfassungs -Mini-Tool  
A) Benutzersicht / Kundensicht  
• Als Nutzer möchte ich ein Projekt auswählen und meine Zeit starten/stoppen.  
• Ich möchte sehen, wie viel Zeit ich heute für ein Projekt gearbeitet habe.  
• Ich möchte Einträge wiederfinden, wenn ich die Seite neu lade.  
• Ich möchte meine Einträge bearbeiten oder löschen können.  
  

## Page 2

B) Konkretisierung für die Gruppe (Sprint 1)  (JSON vom Server lesen, Zeiten lokal)  
Datenquelle (read -only):  
• Statische Datei projects.json liegt am Server und wird per fetch() geladen.  
• Inhalt: Projekte mit id, name, optional client.  
Lokale Speicherung:  
• Zeiteinträge werden nur lokal  gespeichert.  
• Ein Zeiteintrag besteht mindestens aus:  
o projectId  
o date (YYYY -MM-DD)  
o startTime / endTime oder durationMinutes  
o optional note  
UI & Funktionen:  
• Übersichtsseite: Projekt auswählen + Start/Stop Button.  
• Anzeige „aktiver Timer läuft“ inkl. laufender Zeit.  
• Liste „heute“: alle Einträge von heute + Summe pro Projekt + Gesamtsumme.  
• Bearbeiten/Löschen: mindestens Eintrag löschen, bearbeiten optional (aber 
empfohlen).  
Regeln (zur Einschränkung ): 
• Es kann nur ein Timer gleichzeitig  laufen.  
• Beim Stop  wird ein Eintrag gespeichert.  
• Keine Auth, keine Teamfunktionen, keine Serverpersistenz.  
Testing (Playwright, Sprint 1):  
• Test: Projekte werden geladen und sind im Dropdown sichtbar.  
• Test: Start → Stop erzeugt einen Eintrag.  
• Test: Eintrag bleibt nach Reload erhalten.  
• Test: Löschen entfernt Eintrag und aktualisiert Summen.  
 
