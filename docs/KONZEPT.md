# Konzept: Warenkunde-Quiz mit Klassen-Freigabe

Stand: 25. Oktober 2026 · für Benedikt Knotzer (knb)

## Stand

Übergabe für einen neuen Chat (`/uebergabe` liest diesen Abschnitt und „Offene Punkte“).
Bei jedem Commit aktualisieren.

**Woran wir arbeiten:** Das Quiz ist für den II. Lehrgang (2GH2b ab Mo 09.11.) ausgebaut und
**seit So 25.10. online** (SA2 FP ist geschrieben und korrigiert, Benedikt hat den Push
freigegeben). Live geprüft am 25.10.: alle 17 CSVs laden, 917 Fragen und 137 Karteikarten, keine
Konsolenfehler, Zugangsblatt mit Code `2GH2B-MILCH` stimmt. Die neuen Themen mit „Durchsicht offen“ sind damit live, Benedikt sieht sie online
durch. Unterricht 2GH1b geht ab Di 27.10. weiter.

| Thema | Datei | Quiz | Karten | Stand |
|-------|-------|------|--------|-------|
| Wiederholung zur 1. Schularbeit | `"mix"` | 298 | 59 | neu 21.10.: Milch, Käse, Fleisch, Verkauf |
| Wiederholung zur 2. Schularbeit | `"mix"` | 494 | 59 | + Beratungsfälle (SA2 Aufgabe 8) |
| Milch & Milchprodukte | `milch-milchprodukte.csv` | 80 | 15 | neu 20.10., **Durchsicht Benedikt offen** |
| Käse | `kaese.csv` | 86 | 16 | überarbeitet 21.10. (Nr. 2 Temperaturen laut IB Milch) |
| Fleisch & Rindfleisch | `fleisch-rindfleisch.csv` | 82 | 10 | überarbeitet 21.10. |
| Verkaufsgespräch, CI & Verpackung | `verkauf-marketing.csv` | 50 | 18 | neu 21.10. (SA1 ohne Warenkunde), **Durchsicht offen** |
| Feinkost, Fertigkost & Zusatzverkauf | `feinkost-zusatzverkauf.csv` | 77 | 3 | überarbeitet 21.10. |
| Eier | `eier.csv` | 48 | 3 | überarbeitet 21.10. |
| Fische, Krusten- & Weichtiere | `fische.csv` | 64 | 18 | überarbeitet 21.10. |
| Inventurdifferenzen | `inventurdifferenzen.csv` | 24 | 2 | überarbeitet 21.10. |
| Speisefette & Speiseöle | `speisefette-oele.csv` | 73 | 3 | überarbeitet 21.10. |
| Kakao & Schokolade | `kakao-schokolade.csv` | 77 | 20 | überarbeitet 21.10. |
| Diätetische Lebensmittel | `diaetetische-lebensmittel.csv` | 62 | 4 | überarbeitet 21.10. |
| Biowaren | `biowaren.csv` | 42 | 3 | überarbeitet 21.10. |
| Kindernährmittel | `kindernaehrmittel.csv` | 42 | 5 | neu 21.10. (kein SA-Stoff), **Durchsicht offen** |
| Beratungsfälle | `beratungsfaelle.csv` | 27 | 3 | neu 21.10., **Durchsicht offen** |
| Textilien (Non-Food) | `textilien.csv` | 42 | 6 | neu 21.10., Flächengebilde laut IB „bitte prüfen“ |
| Spielzeug & Prüfsiegel (Non-Food) | `spielzeug.csv` | 41 | 8 | neu 21.10., **Durchsicht offen** |

**21.10. – Ausbau fürs nächste Level (Plan vom 21.10., Commits d9d55ec bis heute):**
- App: Arten **Quiz / Karteikarten / Klasse** (Smartboard, 30-s-Countdown, zwei Teams),
  „Alle Themen gemischt“ mit Anzahl 5 als Einstieg, Auswertung je Unterthema,
  **Klassen-Codes** (`daten/zugaenge.json`, Code `2GH2B-MILCH`, ohne Code bis 06.11. Klasse 2),
  `zugang.html?code=…` mit QR `bilder/qr-2GH2B-MILCH.svg` (mit OpenCV gegengelesen).
- Fragetyp **OF** (offene Frage) für Karteikarten: 137 Karten aus den Fragenkatalogen Milch, Käse,
  W4 Teil 1 und 2, LAP-Fragen Fische und Kakao, Wiederholungsblatt SA2 und den Quick-Checks.
- Alle bestehenden Fragen überarbeitet: falsche Antworten so lang und fachlich wie die richtige.
  „Richtige ist die längste“ jetzt 0–22 % je Datei (vorher 49–79 %), keine Längen-Position über
  50 %. **Jede Quizfrage hat eine Erklärung.** Beides prüft `tests/csv-test.js` (Fehler, nicht
  Warnung).
- Probe am 21.10.: alle 917 Fragen automatisch durchgespielt, keine hängt. Blind getippt sind
  23 % richtig – Zufallsniveau, nach der Länge raten bringt nichts mehr.

**15.10. nachmittags (Überarbeitung, seit 15.10. online):** Alle SA2-Themen Frage für Frage gegen
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

**18.10. geprüft:** Alles committet und gepusht, die Online-Fassung (GitHub Pages) stimmt mit
dem letzten Commit überein (Unterschiede nur Windows-Zeilenenden), `tests/csv-test.js` grün,
Quiz live bei 360 px ohne Konsolenfehler. QR-Code am Fr 16.10. an die 2GH1b ausgeteilt.

**20.10. Milch-Entwurf:** 80 Fragen aus IB, LB, Fragenkatalog W1, SA1 und AA Milch III. LG.
Bei Widerspruch gilt das IB: Pasteurisieren 71–74 °C (AA III. LG: 72–75 °C). Nur aus dem AA III. LG:
Kalorien, Laktase, AMA-Bio-Siegel rot, Veterinärkontrollnummer, Rahm-Fettgehalte, B-Vitamin-Verlust,
MOPRO-Abteilung.

**Als Nächstes:**
1. Benedikt sieht die neuen Themen online durch (Milch, Verkauf, Kindernährmittel,
   Beratungsfälle, Textilien, Spielzeug), Korrekturen gehen direkt in die CSVs.
2. **Wirkung messen:** Benedikt nennt die Durchschnittspunkte je SA2-Aufgabe ohne Namen, Vergleich
   im Chat (Themen mit Quiz gegen Beratungsfall). Nichts davon ins Repository.
3. Zugangsblatt `zugang.html?code=2GH2B-MILCH` für Mo 09.11. drucken. Ab 07.11. verlangt die
   Startseite ohne Code einen Klassen-Code.

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
| ✔ Code-Format: „Klasse + Wort“, z. B. `2GH2B-MILCH` | entschieden 21.10. |
| ✔ Zugang befristen: jetzt ohne Code, Klassen-Code pro Lehrgang mit Phase 2, keine Anmeldung | entschieden 15.10. |
| ✔ Themen → Klasse: laut Lehrstoffverteilung, Tabelle in `docs/BESTANDSAUFNAHME.md` Abschnitt 3 | erledigt 8.10. |
| ✔ Layout umgestellt (Aptos, #005090, Gelb #FFD600) in `css/knb-stil.css` | erledigt 8.10. |
| ✔ .docx/.pptx lesen: `tools/vfw_lesen.py` (reines Lese-Skript, einzige Shell-Ausnahme) | erledigt 8.10. |
| Soll die Druckversion (Arbeitsblatt / Lösungsblatt aus der CSV) später dazukommen? | nach Phase 3 |
| ✔ Kollegenmaterial / AA aus dem III. LG als Quelle zulassen: ja, bei Widerspruch gilt das aktuelle IB | entschieden 15.10. |
| ✔ Käse am Buch geprüft (digi4school, E-Book 16967, Seite = Buchseite + 2). Abweichend vom Buch, bewusst gelassen: Nr. 65 „Käsepapier“ (Buch: Folie, Dose, Originalverpackung), Nr. 68 Frischkäse kühl servieren (Buch nennt Schmelzkäse) | erledigt 15.10. |
| ✔ Überarbeitung vom 15.10. online stellen (git push) | erledigt 15.10., geprüft 18.10. |
| ✔ QR-Code (`zugang.html`) an 2GH1b austeilen | erledigt Fr 16.10. |
| Neue Themen durchsehen (Milch, Verkauf, Kindernährmittel, Beratungsfälle, Textilien, Spielzeug) – seit 25.10. online | Benedikt, vor Di 10.11. |
| ✔ Push nach Benedikts Freigabe, davor lokal geprüft (360 px, Klassenmodus 1280 × 720, alle 17 CSVs laden, Test grün) | erledigt 25.10. |
| Wirkung messen: Durchschnittspunkte je SA2-Aufgabe (ohne Namen) gegen Quiz-Abdeckung | nach Korrektur SA2 |
| ✔ MC-Bestand: Ablenker angeglichen (0–22 % „längste“, keine Position über 50 %), jede Quizfrage mit Erklärung, Test scharf | erledigt 21.10. |
| ✔ Für 2GH2b ergänzt: Mischquiz SA1, Verkaufsthemen SA1, Beratungsfälle, Kindernährmittel, Textilien, Spielzeug, Karteikarten | erledigt 21.10. |
| ✔ Klassenmodus, Karteikarten, Einstieg mit 5 Fragen, Auswertung je Unterthema, Klassen-Codes | erledigt 21.10. |
| Kaffee-/Küchenobers-Fettgehalte: Angaben im AA Milch III. LG widersprüchlich, daher nicht im Quiz | Benedikt bei Gelegenheit |
