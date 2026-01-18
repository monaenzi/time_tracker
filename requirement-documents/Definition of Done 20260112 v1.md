# Definition of Done 20260112 v1

*Converted from: Definition of Done 20260112 v1.pdf*

---

## Page 1

Definition of Done (DoD) für Sprint 1  
1) Validierung & Fehlerbehandlung  
• Pflichtfelder sind validiert (HTML5 + JS).  
• Fehlermeldungen sind sichtbar und verständlich.  
• JSON-Ladefehler wird im UI abgefangen (Fehlertext + Möglichkeit neu zu laden).  
• Keine ungefangenen Fehler im Normalbetrieb (Konsole bleibt im Standardflow 
ruhig).  
 
2) UI ist benutzbar  
• App ist ohne Erklärung bedienbar (Buttons/Navigation erkennbar).  
• Layout ist konsistent (keine “wild zusammengewürfelten” Seiten).  
• Grobe Responsiveness: funktioniert auf schmalem Screen, ohne dass 
Kernfunktionen unbenutzbar werden.  
 
3) Testing ist vorhanden und läuft durch (Playwright)  
• Mindestens 3 Playwright E2E -Tests vorhanden.  
• Tests decken ab:  
1. JSON wird geladen  und Inhalte erscheinen  
2. User-Aktion ändert Zustand (create/edit/status/timer)  
3. Persistenz : Reload und Zustand bleibt  
• Tests laufen lokal durch: npm test oder definierter Test -Command.  
 
4) Code-Qualität (Minimalstandard)  
• Projekt startet ohne Workarounds: npm install + npm start (oder gleichwertig).  
• Keine Secrets/Config im Code nötig.  
• Keine toten Features im UI (Buttons, die nichts tun).  

## Page 2

• Ordnerstruktur nachvollziehbar (frontend/server getrennt oder sauber gelöst).  
 
5) Dokumentation ist abgabefähig  
README.md enthält mindestens:  
• Projektname + kurzer Zweck (2 –5 Sätze)  
• Setup & Start (Commands)  
• Sprint-1 Features (Bulletpoints)  
• Playwright Tests ausführen (Command)  
• Bekannte Einschränkungen / offene Punkte  
• Teammitglieder  
 
6) Demo ist möglich  
• App kann in < 2 Minuten gestartet werden.  
• Team kann eine kurze Demo zeigen:  
o Überblick → Detail → Änderung → Reload → Änderung bleibt  
o Tests kurz anstoßen oder Ergebnis zeigen  
