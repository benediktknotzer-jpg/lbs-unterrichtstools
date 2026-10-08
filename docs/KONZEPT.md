# Konzept: Warenkunde-Quiz mit Klassen-Freigabe

Stand: 8. Oktober 2026 · für Benedikt Knotzer (knb)

## Ziel

Die Lehrlinge üben mit dem Handy genau den Stoff, der im Unterricht drankommt – auch
Schularbeitsfragen, denn sie sollen sich gezielt auf die Schularbeit vorbereiten können.
Jede Klasse sieht nur die Themen ihrer Klasse. Der Zugang erfolgt über einen QR-Code mit
Klassen-Code, den die Lehrkraft austeilt.

**Entscheidungen (8.10.2026):**

- Geheimhaltung ist **nicht** nötig. Die Fragen sind Übungsmaterial und dürfen öffentlich sein.
- Klassen-Code dient der **Ordnung**: Jede Klasse sieht nur ihren Stoff (Variante A).
- Gearbeitet wird **lokal am PC**. Der Ordner `C:\Users\Bened\VFW_Claude` wird nur gelesen,
  nie verändert (siehe `CLAUDE.md`).
- Reihenfolge: 1. PC einrichten und Bestandsaufnahme → 2. Freigabe-System → 3. Themen.

---

## Phase 1: PC einrichten und Bestandsaufnahme

**Einrichtung** (Anleitung im Chat vom 8.10.):

1. `git clone` des Quiz nach `C:\Users\Bened\lbs-unterrichtstools`. Das Quiz liegt neben
   VFW_Claude, nicht darin.
2. `.claude\settings.local.json` mit Lesezugriff auf VFW_Claude und Schreibsperre
   (`deny` für Edit/Write).
3. Test: Datei in VFW_Claude anlegen → muss abgelehnt werden. Ordner auflisten → muss
   funktionieren.

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

1. Milch & Milchprodukte (2. Klasse)
2. Käse mit den aktuellen Unterlagen abgleichen. Die Umrechnungsfaktoren F.i.T. → Fett absolut
   prüfen.
3. Weitere Themen laut Bestandsaufnahme, z. B. Honig und Speiseeis, für die jeweilige Klasse.

---

## Offene Punkte

| Punkt | Wann klären |
|-------|-------------|
| Code-Rhythmus: pro Lehrgang oder pro Schuljahr? | Phase 2 |
| Code-Format: z. B. `FP2-KAESE` oder neutral `FP2-7K4M`? | Phase 2 |
| Welche Themen gehören zu welcher Klasse? | nach der Bestandsaufnahme (Phase 1) |
| Ist das aktuelle Layout gleich wie in `knb-stil.css` oder geändert? | Phase 1 |
| Soll die Druckversion (Arbeitsblatt / Lösungsblatt aus der CSV) später dazukommen? | nach Phase 3 |
