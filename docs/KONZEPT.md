# Konzept: Warenkunde-Quiz mit Klassen-Freigabe

Stand: 15. Oktober 2026 · für Benedikt Knotzer (knb)

## Stand

Übergabe für einen neuen Chat (`/uebergabe` liest diesen Abschnitt und „Offene Punkte“).
Bei jedem Commit aktualisieren.

**Woran wir arbeiten:** Themen der 2. Schularbeit 2GH1b (Fr 23.10.2026), fertig bis etwa 16.10.
Danach Freigabe-System (Phase 2).

| Thema | Datei | Fragen | Stand |
|-------|-------|--------|-------|
| Fleisch & Rindfleisch | `fleisch-rindfleisch.csv` | 77 | fertig (Vorgabe, nicht ändern) |
| Käse | `kaese.csv` | 78 | im Quiz, 29 Fragen „bitte prüfen“, Abgleich mit aktuellen Unterlagen offen |
| Feinkost, Fertigkost & Zusatzverkauf | `feinkost-zusatzverkauf.csv` | 78 | fertig (SA2) |
| Eier | `eier.csv` | 48 | fertig (SA2) |
| Fische, Krusten- & Weichtiere | `fische.csv` | 64 | fertig (SA2) |
| Speisefette & Speiseöle | `speisefette-oele.csv` | 73 | fertig (SA2), 2 Fragen „bitte prüfen“ (aus AA III. LG) |
| Kakao & Schokolade | `kakao-schokolade.csv` | 77 | fertig (SA2) |
| Diätetische Lebensmittel | – | – | offen (SA2) |
| Biowaren | – | – | offen (SA2) |
| Kindernährmittel | – | – | offen, laut SA2-Lösung **nicht** SA-Stoff (Mi 21.10.) |
| Milch & Milchprodukte | – | – | offen, nach SA2 |

**15.10.:** Klasse hat das Quiz am Smartboard getestet, gefällt. Umgesetzt: Fragetyp MM
(mehrere richtige Antworten, je 5–6 pro SA2-Thema), Berichtigung bei Richtig/Falsch (Spalte
`erklaerung`, Fleisch ausgenommen – Vorgabedatei), Notenschlüssel der LBS in der Auswertung,
Zugangsblatt `zugang.html` mit QR-Code. Zugang vorerst ohne Klassen-Code: eine Adresse für alle.

**Als Nächstes:** Fr 16.10. QR-Code an 2GH1b austeilen. Dann Diätetische LM und Biowaren
(SA2-Stoff, Unterricht Mo 19./Di 20.10.) – erscheinen automatisch unter derselben Adresse.
Klassen-Codes (Phase 2) erst, wenn mehrere Klassen das Quiz nutzen.

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
| ✔ Themen → Klasse: laut Lehrstoffverteilung, Tabelle in `docs/BESTANDSAUFNAHME.md` Abschnitt 3 | erledigt 8.10. |
| ✔ Layout umgestellt (Aptos, #005090, Gelb #FFD600) in `css/knb-stil.css` | erledigt 8.10. |
| ✔ .docx/.pptx lesen: `tools/vfw_lesen.py` (reines Lese-Skript, einzige Shell-Ausnahme) | erledigt 8.10. |
| Soll die Druckversion (Arbeitsblatt / Lösungsblatt aus der CSV) später dazukommen? | nach Phase 3 |
| Kollegenmaterial / AA aus dem III. LG als Quelle zulassen? Bis dahin mit „bitte prüfen“ markiert. Achtung: AA Fette/Öle III. LG nennt nur drei Olivenöl-Stufen, das aktuelle IB vier. | Benedikt |
| „bitte prüfen“-Fragen durchsehen: Käse (29), Speisefette (2) | Benedikt, vor 23.10. |
