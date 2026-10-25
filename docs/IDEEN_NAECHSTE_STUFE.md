# Ideen für die nächste Stufe des Quiz

Stand 25.10.2026 · Zum Durchsehen für Benedikt, nachdem alle Themen auf den Kernstoff gebracht
sind. Nichts davon ist gebaut. Alle Vorschläge halten die Grundregeln ein: reines
HTML/CSS/JavaScript, keine Anmeldung, keine Speicherung, kein Tracking, nichts von außen geladen.

## 1. Offene Fragen, die das Quiz selbst korrigiert (neuer Fragetyp „OA“)

Die Lehrlinge tippen die Antwort in ein Textfeld. Das Quiz prüft sie gegen **Schlüsselbegriffe**
und zeigt danach die Musterantwort, mit Häkchen bei jedem gefundenen Begriff und einem Hinweis
auf jeden fehlenden.

- **Tolerant gegen Tippfehler:** Groß-/Kleinschreibung, Umlaute (ae/ä), Bindestriche und ein bis
  zwei vertippte Buchstaben zählen trotzdem (Edit-Distanz). „Pasteurisiren“ ist richtig.
- **Synonyme:** je Begriff mehrere Schreibweisen, z. B. `Obers/Sahne/Rahm`.
- **Teilpunkte:** „3 von 4 Begriffen“ → zählt in der Note anteilig.
- **Zahlen mit Toleranz:** für Rechenfragen (Grundpreis, Bestellmenge, Inventurdifferenz), z. B.
  `1290` oder `1.290` oder `1290 Stück`.
- **CSV-Format:** `typ = OA`, `richtig` = Musterantwort, `falsch1` = Schlüsselbegriffe mit `|`,
  Synonyme mit `/`, z. B. `pasteurisiert | homogenisiert | 3,5 %`.
- **Grundstock ist schon da:** Die rund 230 Karteikarten aus den Fragenkatalogen lassen sich Stück
  für Stück zu OA-Fragen machen. Es fehlen nur die Schlüsselbegriffe je Karte.
- **Grenze ehrlich benannt:** Ein Programm ohne KI erkennt Begriffe, keinen Sinn. „Nicht
  pasteurisiert“ enthält auch „pasteurisiert“. Deshalb OA eher für Aufzählungen, Fachbegriffe und
  Zahlen, nicht für Begründungen. Begründungen bleiben Karteikarten.
- Aufwand: mittel (ein Abend für den Typ selbst, danach Schlüsselbegriffe je Thema).

## 2. Kleine Effekte, die das Lernen anschaulicher machen

- **Karteikarten zum Umdrehen:** echte Dreh-Animation (Vorderseite Frage, Rückseite Antwort),
  dazu „Gewusst / Nochmal“ – die „Nochmal“-Karten kommen am Ende der Runde wieder.
- **Serie:** „5 richtig in Folge“ als kleiner Hinweis, ab 10 ein Abzeichen in der Auswertung.
- **Abschluss:** Konfetti nur bei „Sehr gut“, sonst eine ruhige Auswertung. Rein mit CSS.
- **Fortschritt je Unterthema** in der Auswertung als Balken (die Zahlen gibt es schon).
- **Bilder, wo sie den Stoff tragen:** Pflegesymbole, Bio-Zeichen, Eierstempel, CE/GS, 0–3-
  Piktogramm, Käsegruppen. Als eigene SVG-Zeichnungen im Projekt (keine fremden Logos kopieren,
  bei Markenzeichen nur Beschreibung).
- **Klassenmodus:** Punktestand groß für das Smartboard, Ton beim Ablauf der 30 Sekunden
  (abschaltbar).

## 3. Neue Spielarten

- **Fehler-Detektiv:** Ein Etikett oder eine Aussage mit einem Fehler – antippen, wo er steckt
  (wie die Fehler-Detektive-Karten aus W8).
- **Zuordnen auf Zeit:** zehn Begriffe in 60 Sekunden zuordnen, gut als Einstieg in die Stunde.
- **Schularbeits-Probe:** nur Kernfragen (aus dem Fragenkatalog), Notenschlüssel der LBS,
  Zeitlimit wie bei der SA.

## 4. Format

- Prüfen am Handy (360 px) und am Smartboard (1280 × 720), sobald Benedikt das Quiz durchgesehen
  hat – Schriftgrößen, Abstände, Knopfgrößen.
- Startseite: Themen nach Lehrgangswoche ordnen (W1 Milch … W10 Spielzeug), damit die Lehrlinge
  sehen, was gerade dran ist.

## Empfohlene Reihenfolge

1. ✔ Karteikarten zum Umdrehen mit „Gewusst / Nochmal“ – gebaut 25.10.2026.
2. Fragetyp OA für Aufzählungen und Zahlen, zuerst bei Milch und Käse ausprobieren.
3. Bilder (SVG) für Pflegesymbole und Bio-Zeichen.
4. Themen nach Lehrgangswoche ordnen.
