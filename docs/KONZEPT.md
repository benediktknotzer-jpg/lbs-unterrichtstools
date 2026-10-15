# Konzept: Warenkunde-Quiz mit Klassen-Freigabe

Stand: 15. Oktober 2026 · für Benedikt Knotzer (knb)

## Stand

Übergabe für einen neuen Chat (`/uebergabe` liest diesen Abschnitt und „Offene Punkte“).
Bei jedem Commit aktualisieren.

**Woran wir arbeiten:** Themen der 2. Schularbeit 2GH1b (Fr 23.10.2026), fertig bis etwa 16.10.
Danach Freigabe-System (Phase 2).

| Thema | Datei | Fragen | Stand |
|-------|-------|--------|-------|
| Wiederholung zur 2. Schularbeit | `"mix"` in `themen.json` | 467 | gemischt aus den 8 SA2-Themen (seit 15.10.) |
| Fleisch & Rindfleisch | `fleisch-rindfleisch.csv` | 82 | fertig (seit 15.10. bearbeitbar) |
| Käse | `kaese.csv` | 86 | an IB/Fragenkatalog W2 angeglichen (15.10.), 18 Fragen „bitte prüfen“ (nur im Buch belegbar) |
| Feinkost, Fertigkost & Zusatzverkauf | `feinkost-zusatzverkauf.csv` | 77 | fertig (SA2), geprüft 15.10. |
| Eier | `eier.csv` | 48 | fertig (SA2), geprüft 15.10. |
| Fische, Krusten- & Weichtiere | `fische.csv` | 64 | fertig (SA2), geprüft 15.10. |
| Inventurdifferenzen | `inventurdifferenzen.csv` | 24 | neu 15.10. (SA2-Aufgabe 4, 10 Punkte) |
| Speisefette & Speiseöle | `speisefette-oele.csv` | 73 | fertig (SA2), geprüft 15.10.; Nr. 10 und 35 Zusatzwissen aus AA III. LG |
| Kakao & Schokolade | `kakao-schokolade.csv` | 77 | fertig (SA2), geprüft 15.10. |
| Diätetische Lebensmittel | `diaetetische-lebensmittel.csv` | 62 | fertig (SA2), geprüft 15.10. |
| Biowaren | `biowaren.csv` | 42 | fertig (SA2), geprüft 15.10. |
| Kindernährmittel | – | – | offen, laut SA2-Lösung **nicht** SA-Stoff (Mi 21.10.) |
| Milch & Milchprodukte | – | – | offen, nach SA2 |

**15.10. nachmittags (Überarbeitung, noch nicht online):** Alle SA2-Themen Frage für Frage gegen
IB, LB, SA2-Lösung und LAP-Fragen geprüft. Keine falsche Lösung gefunden, aber korrigiert:
widersprüchliches Fisch-Etikett (Nr. 31: Aquakultur mit Fanggebiet), mehrdeutige Lückentexte mit
vertauschbaren Wörtern (Fette 21, 34, 38; Eier 30; Feinkost 47, 63; Käse 10), unscharfe
Erklärungen und Ablenker (Diät 9, 11, 18, 42, 58; Bio 13, 23; Kakao 23, 45, 66; Fische 7, 20,
37, 49; Feinkost 12, 13, 29, 46), doppelte Fragen (Eier 7/44, Feinkost 24 gestrichen),
Feinkost-Unterthemen vereinheitlicht. Käse: Umrechnungsfaktoren (0,7/0,6/0,5/0,3) passten weder
zum Buch noch zum AA (0,6/0,5/0,4/0,3) – ersetzt durch die Faustformel F. i. T. × Trockenmasse
÷ 100 und die Buchwerte (Emmentaler 45 % F. i. T. = 31 % Fett); neu: Fettstufen, „leicht“,
Pflichtangaben, Reifezeiten, Reifung außen/innen, Milch je kg, Schafmilchkäse 50 %.
SA2-Abdeckung: alles außer dem Beratungsfall (Aufgabe 8, 14 P) hat ein Quiz-Thema; der
Beratungsfall ist über Diät Nr. 56–61 teilweise abgedeckt.

**Benedikt 15.10.:** Unterlagen von Kolleginnen, Kollegen und Rektorin sind zulässige Quelle.
Bei Widerspruch gilt das aktuelle eigene Infoblatt (z. B. Olivenöl: vier Güteklassen).

**15.10.:** Klasse hat das Quiz am Smartboard getestet, gefällt. Umgesetzt: Fragetyp MM
(mehrere richtige Antworten, je 5–6 pro SA2-Thema), Berichtigung bei Richtig/Falsch (Spalte
`erklaerung`, alle Themen), Notenschlüssel der LBS in der Auswertung,
Zugangsblatt `zugang.html` mit QR-Code. Zugang vorerst ohne Klassen-Code: eine Adresse für alle.

**Entscheidung Benedikt 15.10.:** Zugang jetzt ohne Code (Variante A). Klassen-Code pro Lehrgang
(Variante B, Phase 2) als Nächstes. Echte Sperre mit Anmeldung (Variante C) kommt nicht.

**Als Nächstes:** Fr 16.10. QR-Code an 2GH1b austeilen (`zugang.html`). Alle SA2-Themen sind
online (Kindernährmittel ist kein SA-Stoff). Dann Phase 2 Klassen-Codes, spätestens vor dem
nächsten Lehrgang (I. LG endet 6.11.), danach Kindernährmittel und Milch.

## Ziel

Die Lehrlinge üben mit dem Handy genau den Stoff, der im Unterricht drankommt – auch
Schularbeitsfragen, denn sie sollen sich gezielt auf die Schularbeit vorbereiten können.
Jede Klasse sieht nur die Themen ihrer Klasse. Der Zugang erfolgt über einen QR-Code mit
Klassen-Code, den die Lehrkraft austeilt.

**Entscheidungen (8.10.2026):**

- Geheimhaltung ist **nicht** nötig. Die Fragen sind Übungsmaterial und dürfen öffentlich sein.
- Klassen-Code dient der **Ordnung**: Jede Klasse sieht nur ihren Stoff (Variante A).
- Gearbeitet wird **lokal am PC**. Der Ordner `C:\Users\bened\VFW_Claude` wird nur gelesen,
  nie verändert (siehe `CLAUDE.md`).
- Reihenfolge: 1. PC einrichten und Bestandsaufnahme → 2. Freigabe-System → 3. Themen.
- **Geändert am 8.10.2026:** Zuerst die Themen der 2. Schularbeit (Fr 23.10.2026) für 2GH1b,
  fertig und geprüft bis etwa 16.10. Danach das Freigabe-System, dann Milch und die übrigen
  Themen. Grund: Das Quiz soll der Klasse jetzt bei der Vorbereitung helfen. Das Freigabe-System
  wird erst gebraucht, wenn mehrere Klassen das Quiz nutzen.
- **Code-Rhythmus:** ein neuer Code **pro Lehrgang**. Ein Lehrgang dauert 10 Wochen, danach kommt
  eine neue Klasse. Der alte Code wird gesperrt.

---

## Phase 1: PC einrichten und Bestandsaufnahme

**Einrichtung** (Anleitung im Chat vom 8.10.):

1. `git clone` des Quiz nach `C:\Users\bened\Claude-Projekte\lbs-unterrichtstools`. Das Quiz
   liegt außerhalb von VFW_Claude, nicht darin. ✔ erledigt 8.10.
2. `.claude\settings.local.json` (nicht im Repository, steht in `.gitignore`) mit Lesezugriff
   auf VFW_Claude und Schreibsperre: `deny` für Edit/Write/NotebookEdit sowie für **jeden**
   Bash- oder PowerShell-Befehl, der VFW_Claude enthält. ✔ erledigt 8.10.
3. Test: Ordner auflisten → muss funktionieren. Schreibtest bewusst **nicht** durch Anlegen
   einer Datei in VFW_Claude, sondern durch einen harmlosen Shell-Befehl (z. B. `ls` auf
   VFW_Claude), der abgelehnt werden muss. ✔ erledigt 8.10. (Ergebnis in `docs/BESTANDSAUFNAHME.md`)
4. Node.js installieren (`winget install OpenJS.NodeJS.LTS`) für `tests/csv-test.js`.
   ✔ erledigt (Node v24, geprüft 14.10.)

**Bestandsaufnahme VFW_Claude**, nur lesen. Ergebnis kommt als `docs/BESTANDSAUFNAHME.md` ins
Quiz-Projekt, **ohne Schülerdaten**:

- Welche Klassen und Lehrgänge gibt es (1., 2., 3. Klasse, FP FOOD, BLAM, …)?
- Welche Warengruppen und Themen gibt es je Klasse (Fleisch, Käse, Milch, Honig, Speiseeis, …)?
- Welche Unterlagen gibt es je Thema (Infoblatt, Arbeitsauftrag + Lösung, Präsentation,
  Schularbeit, MÜP)?
- Wie sehen die **aktuellen** Arbeits- und Infoblätter aus (Kopf, Schriften, Farben, Tabellen,
  Fußzeile)? Daraus wird `css/knb-stil.css` aktualisiert.
- Vorgehen sparsam: zuerst nur Datei- und Ordnernamen lesen, dann gezielt einzelne Dokumente.
  Nicht den ganzen Ordner auf einmal lesen.

---

## Phase 2: Freigabe-System

### So erleben es die Lehrlinge

1. Die Lehrkraft zeigt oder verteilt einen QR-Code, z. B. „Warenkunde-Quiz · 2. Klasse“.
2. Scannen → das Quiz öffnet sich direkt mit den Themen der 2. Klasse. Kein Eintippen nötig.
3. Ohne QR-Code: Die Startseite zeigt nur das Feld **„Klassen-Code eingeben“**. Der Code steht
   auch lesbar unter dem QR-Code, z. B. `FP2-KAESE`.
4. Tipp für die Lehrlinge: Seite als Lesezeichen oder „Zum Startbildschirm hinzufügen“. Der
   Code steckt in der Adresse, deshalb muss die App nichts speichern.

### So arbeitet die Lehrkraft

Alles steht in zwei Dateien im Ordner `daten/`:

**`themen.json`** – jedes Thema bekommt die Klasse(n), zu der es gehört:

```json
[
  { "titel": "Fleisch & Rindfleisch", "datei": "fleisch-rindfleisch.csv", "klassen": ["2"] },
  { "titel": "Käse",                  "datei": "kaese.csv",               "klassen": ["2"] },
  { "titel": "Honig",                 "datei": "honig.csv",               "klassen": ["1"] }
]
```

**`zugaenge.json`** – die Klassen-Codes, die ausgeteilt werden:

```json
[
  { "code": "FP2-KAESE", "name": "2. Klasse Großhandel", "klasse": "2", "aktiv": true },
  { "code": "FP1-HONIG", "name": "1. Klasse Großhandel", "klasse": "1", "aktiv": false }
]
```

- **Freigeben / sperren:** `aktiv` auf `true` oder `false` setzen. Ein gesperrter Code zeigt
  „Dieser Zugang ist derzeit nicht freigegeben.“
- **Neuer Lehrgang:** neuen Code eintragen und den alten auf `false` setzen. Dann kommen frühere
  Lehrlinge mit dem alten QR-Code nicht mehr hinein.
- **Optional schrittweise freigeben:** Mit `"themen": ["Käse"]` sieht die Klasse nur die
  genannten Themen. So können Sie Thema für Thema freischalten, passend zum Unterricht.
- Die Prüfung beim Laden meldet Fehler verständlich, z. B. bei einem doppelten Code oder einem
  Thema ohne Klasse.

### Lehrkraft-Seite für die QR-Codes

Eine eigene Seite `lehrkraft.html` wird von der Startseite aus nicht verlinkt:

- Sie listet alle Zugänge mit Status (aktiv / gesperrt) und den freigegebenen Themen.
- Sie erzeugt je Zugang ein **druckfertiges Blatt im knb-Stil**: Titel „Quiz-Zugang:
  2. Klasse“, großer QR-Code, Code lesbar darunter, kurze Anleitung für die Lehrlinge,
  Fußzeile „Benedikt Knotzer | knb“.
- Zum Projizieren gibt es zusätzlich eine Vollbild-Anzeige des QR-Codes.
- Der QR-Code wird direkt im Browser erzeugt, ohne Internet-Dienst. Dafür kommt eine kleine
  QR-Bibliothek als Datei ins Projekt (frei lizenziert, MIT), damit nichts von außen nachgeladen
  wird.

### Bewusste Grenzen von Variante A

- Die Fragen sind öffentlich abrufbar (GitHub, direkte Datei-Adresse). Der Code ordnet nur zu,
  er schützt nicht. Das ist so gewollt.
- Ein Lehrling kann seinen Code weitergeben. Das ist unkritisch und wird bei Bedarf durch einen
  neuen Code pro Lehrgang gelöst.
- Weiterhin gilt: keine Anmeldung, keine Speicherung, kein Tracking.

### Veröffentlichung

Das Repository ist öffentlich, deshalb ist **GitHub Pages kostenlos** möglich: Settings → Pages →
Branch `main`, Ordner `/`. Die Adresse lautet dann
`https://benediktknotzer-jpg.github.io/lbs-unterrichtstools/?code=FP2-KAESE`.

---

## Phase 3: Themen im richtigen Format

Ablauf für jedes neue Thema:

1. **Quellen** aus der Bestandsaufnahme lesen: Infoblatt, Arbeitsauftrag + Lösung, Präsentation,
   Schularbeit, MÜP.
2. **Fragen entwerfen** mit allen fünf Typen (MC, RF, ZU, RH, LT), 60–80 Fragen, sinnvolle
   Unterthemen. Jede Frage bekommt in `quelle` ihr Dokument, z. B. „AA Milch LSG S. 3“.
   Inhalte, die nicht aus den Unterlagen stammen, werden mit „– bitte prüfen“ markiert.
3. **Prüfung durch die Lehrkraft:** Liste aller „bitte prüfen“-Fragen durchsehen.
4. **Testen:** `node tests/csv-test.js` und ein Durchgang am Handy-Format.
5. **Zuordnen und freigeben:** Klasse in `themen.json` eintragen, bei Bedarf in `zugaenge.json`
   freischalten.

**Reihenfolge der Themen:**

0. Zuerst der Stoff der 2. Schularbeit 2GH1b (23.10.2026): Feinkost/Fertigkost, Eier, Fische,
   Speisefette/Öle, Kakao/Schokolade, Diätetische LM, Biowaren, Kindernährmittel.
1. Milch & Milchprodukte (2. Klasse)
2. Käse mit den aktuellen Unterlagen abgleichen. Die Umrechnungsfaktoren F.i.T. → Fett absolut
   prüfen.
3. Weitere Themen laut Bestandsaufnahme, z. B. Honig und Speiseeis, für die jeweilige Klasse.

---

## Offene Punkte

| Punkt | Wann klären |
|-------|-------------|
| ✔ Code-Rhythmus: pro Lehrgang (10 Wochen) | entschieden 8.10. |
| Code-Format: z. B. `FP2-KAESE` oder neutral `FP2-7K4M`? | Phase 2 |
| ✔ Zugang befristen: jetzt ohne Code, Klassen-Code pro Lehrgang mit Phase 2, keine Anmeldung | entschieden 15.10. |
| ✔ Themen → Klasse: laut Lehrstoffverteilung, Tabelle in `docs/BESTANDSAUFNAHME.md` Abschnitt 3 | erledigt 8.10. |
| ✔ Layout umgestellt (Aptos, #005090, Gelb #FFD600) in `css/knb-stil.css` | erledigt 8.10. |
| ✔ .docx/.pptx lesen: `tools/vfw_lesen.py` (reines Lese-Skript, einzige Shell-Ausnahme) | erledigt 8.10. |
| Soll die Druckversion (Arbeitsblatt / Lösungsblatt aus der CSV) später dazukommen? | nach Phase 3 |
| ✔ Kollegenmaterial / AA aus dem III. LG als Quelle zulassen: ja, bei Widerspruch gilt das aktuelle IB | entschieden 15.10. |
| Käse: 18 Fragen „Lehrbuch – bitte prüfen“ (Sorten, Herkunft, Schimmel) am Westermann-Buch S. 104–113 abgleichen – Buch online, Zugang klären | Benedikt |
| Überarbeitung vom 15.10. online stellen (git push) | Benedikt, vor Fr 16.10. |
