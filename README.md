# lbs-unterrichtstools
Interaktive Web-Tools für den Unterricht an der LBS Theresienfeld (BLAM, FP)

## Warenkunde-Quiz

Ein Quiz für Lehrlinge im Lebensmittel-Großhandel (2. Klasse Fachpraktikum), optimiert fürs Handy.

- Themenauswahl, optional Filter nach Unterthema, 5 / 10 / 20 / alle Fragen
- **„Alle Themen gemischt“** steht automatisch oben – mit 5 Fragen ideal als Einstieg in die Stunde
- Fragen und Antworten werden bei jedem Durchgang gemischt
- Sofortige Rückmeldung mit richtiger Lösung und Erklärung (Spalte `erklaerung`)
- Auswertung in Prozent mit Note laut Notenschlüssel der LBS Theresienfeld wie bei der
  Schularbeit: 100–91 % Sehr gut · 90–81 % Gut · 80–61 % Befriedigend · 60–51 % Genügend ·
  50–0 % Nicht genügend. Der Prozentwert wird abgerundet (90,9 % zählt als 90 % = Gut).
  Dazu eine Tabelle **je Unterthema** (das Schwächste zuerst, unter 61 % rot), die Liste der
  falschen Fragen mit Lösung und „Falsche Fragen wiederholen“
- Drei **Arten** (in den Einstellungen):
  - **Quiz** – üben am Handy, mit Note
  - **Karteikarten** – offene Fragen wie im Fragenkatalog und in der Schularbeit: Antwort selbst
    überlegen, Karte umdrehen (vorne Frage, hinten Musterantwort), dann „Gewusst“ oder „Nochmal“.
    „Nochmal“-Karten kommen am Ende der Runde wieder, bis alle sitzen. Die Auswertung zeigt, was auf
    Anhieb saß und was mehrere Anläufe brauchte.
  - **Klasse** – Klassenquiz am Smartboard: große Schrift, nur MC und Richtig/Falsch, 30 Sekunden
    Countdown, zwei Teams mit A-B-C-D-Karten, Lehrkraft löst auf und vergibt die Punkte, am Ende
    Teamstand und die Fragen, die kein Team konnte
- Sieben Fragetypen: Multiple Choice (MC), Mehrfachauswahl mit mehreren richtigen Antworten (MM),
  Richtig/Falsch (RF), Zuordnen (ZU), Reihenfolge (RH), Lückentext (LT) – alles per Antippen –
  und offene Fragen (OF) für die Karteikarten
- **Klassen-Codes**: Jede Klasse sieht nur die Themen ihrer Klasse (`daten/zugaenge.json`)
- Themen derzeit (2. Klasse, 916 Quizfragen und 236 Karteikarten): **Milch & Milchprodukte** (62),
  **Käse** (78), **Fleisch & Rindfleisch** (82), **Verkaufsgespräch, CI & Verpackung** (51),
  **Feinkost, Fertigkost & Zusatzverkauf** (77), **Eier** (47), **Fische, Krusten- & Weichtiere** (64),
  **Inventurdifferenzen** (24), **Speisefette & Speiseöle** (73), **Kakao & Schokolade** (77),
  **Diätetische Lebensmittel** (62), **Biowaren** (42), **Kindernährmittel** (42),
  **Beratungsfälle** (27), **Textilien** (42), **Spielzeug & Prüfsiegel** (41),
  **Zeichen- und Malbedarf** (25) – dazu die Mischungen „Wiederholung zur 1. Schularbeit“ und
  „… zur 2. Schularbeit“
- Jedes Warenkunde-Thema hat einen Fragenkatalog (`docs/fragenkataloge/` oder in VFW_Claude), jede
  Katalogfrage steht als Karteikarte und als Quizfrage im Quiz. Was gekürzt wurde und warum, steht
  in `docs/streichlisten/` (Ablauf: `docs/ABLAUF_THEMA_KUERZEN.md`).
- Zugangsblatt mit QR-Code für Ausdruck und Smartboard: `zugang.html`
- Gestaltet im Stil der knb-Arbeitsblätter (siehe unten „Einheitlicher Stil“)
- Keine Anmeldung, keine Speicherung, kein Tracking, keine externen Dateien –
  reines HTML/CSS/JavaScript

### Ordnerstruktur

```
index.html              Die App
zugang.html             Zugangsblatt mit QR-Code (Ausdruck A4, Vollbild fürs Smartboard),
                        für einen Klassen-Code: zugang.html?code=2GH2B-MILCH
css/knb-stil.css        Grundstil (Schrift, Farben, Kopf, Fußzeile) – für alle Tools
css/quiz.css            Aussehen speziell für das Quiz
bilder/lbs-logo.png     Logo der LBS Theresienfeld
bilder/qr-quiz.svg      QR-Code zur Quiz-Adresse (erzeugt mit tools/qr_code.py)
bilder/qr-<CODE>.svg    QR-Code je Klassen-Code
js/csv.js               Einlesen und Prüfen der Fragen-Dateien
js/app.js               Ablauf des Quiz
daten/themen.json       Liste der Themen (mit Klasse)
daten/zugaenge.json     Klassen-Codes
daten/*.csv             Fragen, eine Datei pro Thema
tests/csv-test.js       Automatische Prüfung der Fragen-Dateien
tools/qr_code.py        QR-Code als SVG erzeugen (nur Python, ohne Zusatzpakete)
tools/vfw_lesen.py      Unterlagen aus VFW_Claude lesen (nur lesen)
```

---

## Lokal starten

Die App lädt die Fragen per `fetch()`. Das funktioniert **nicht**, wenn man `index.html`
einfach doppelklickt (Adresse beginnt mit `file://`) – die App zeigt dann einen Hinweis.
Man braucht einen kleinen lokalen Webserver:

**Mit Python** (unter Windows im Microsoft Store bzw. auf python.org erhältlich, am Mac vorinstalliert):

1. Eingabeaufforderung / Terminal im Ordner `lbs-unterrichtstools` öffnen
   (Windows: im Explorer in die Adressleiste `cmd` tippen und Enter drücken).
2. Eingeben:
   ```
   python -m http.server 8000
   ```
   (am Mac ggf. `python3 -m http.server 8000`)
3. Im Browser öffnen: <http://localhost:8000>
4. Beenden mit `Strg + C`.

**Am Handy im selben WLAN testen:** Statt `localhost` die IP-Adresse des Computers verwenden,
z. B. `http://192.168.0.23:8000` (IP unter Windows mit `ipconfig` herausfinden).

**Alternative ohne Python:** In Visual Studio Code die Erweiterung „Live Server“ installieren
und bei `index.html` auf „Go Live“ klicken.

---

## Kostenlos veröffentlichen

Die App besteht nur aus statischen Dateien und kann auf jedem einfachen Webspace liegen.

### GitHub Pages (öffentliches Repository)

1. Auf GitHub im Repository: **Settings → Pages**.
2. Bei „Build and deployment“: Source **Deploy from a branch**, Branch **main**, Ordner **/ (root)** → **Save**.
3. Nach 1–2 Minuten ist die App erreichbar unter
   `https://benediktknotzer-jpg.github.io/lbs-unterrichtstools/`
4. Jede Änderung, die in `main` landet (z. B. neue Fragen), ist nach kurzer Zeit online.

Tipp: Aus der Adresse einen QR-Code erstellen (z. B. im Browser Chrome/Edge: Seite teilen →
QR-Code) und im Unterricht an die Wand projizieren.

### Wenn das Repository privat bleiben soll

GitHub Pages funktioniert für **private** Repositories nur mit einem kostenpflichtigen Konto
(GitHub Pro/Team). Kostenlose Alternativen:

- **Netlify Drop** (am einfachsten): <https://app.netlify.com/drop> öffnen, kostenloses Konto anlegen
  und den Ordner `lbs-unterrichtstools` in das Browserfenster ziehen. Man bekommt sofort eine
  Adresse wie `https://irgendwas.netlify.app`. Bei Änderungen den Ordner erneut hineinziehen.
- **Netlify** oder **Cloudflare Pages** mit GitHub verbinden: Beide können auch private
  Repositories kostenlos veröffentlichen und aktualisieren sich automatisch bei jeder Änderung.
  Einstellungen: kein Build-Befehl, Ausgabeordner `/` (Hauptordner).
- Ein zweites, **öffentliches** Repository nur für das Quiz anlegen und dort GitHub Pages nutzen.

Hinweis: Die veröffentlichte App selbst ist immer öffentlich erreichbar (für die Lehrlinge ist
das ja gewünscht). Die Seite ist für Suchmaschinen als `noindex` markiert.

---

## Fragen und Themen ergänzen (Anleitung für Lehrkräfte)

### Aufbau einer Fragen-Datei

Jedes Thema ist eine CSV-Datei im Ordner `daten/`. Die erste Zeile (Kopfzeile) ist immer:

```
nr;thema;typ;frage;richtig;falsch1;falsch2;falsch3;quelle;erklaerung
```

Die Spalte `erklaerung` ist freiwillig. Fehlt sie in einer Datei, funktioniert das Quiz trotzdem.

| Spalte  | Bedeutung |
|---------|-----------|
| nr      | laufende Nummer (hilft bei Fehlermeldungen) |
| thema   | Unterthema, danach kann im Quiz gefiltert werden (z. B. „Lagerung“) |
| typ     | `MC`, `MM`, `RF`, `ZU`, `RH`, `LT` oder `OF` |
| frage   | Fragetext bzw. Aussage |
| richtig | richtige Antwort (je nach Typ, siehe unten) |
| falsch1–falsch3 | falsche Antworten (MC, MM) bzw. zusätzliche Ablenkwörter (LT) |
| quelle  | nur für Sie – wird im Quiz nicht angezeigt (z. B. „SA1 FOOD“, „AA Milch“, „Lehrbuch S. 45“) |
| erklaerung | freiwillig – erscheint nach dem Beantworten und in der Auswertung. Bei RF die Berichtigung, z. B. „Falsch: Aufgetautes Fleisch darf nicht wieder eingefroren werden.“ |

### Beispiele für die sechs Fragetypen

**MC – Multiple Choice:** In `richtig` steht die richtige Antwort, in `falsch1` bis `falsch3`
die falschen. Die Reihenfolge wird im Quiz gemischt.

```
78;Lagerung;MC;Bei welcher Temperatur wird Tiefkühlware gelagert?;−18 °C oder kälter;0 bis +2 °C;−5 °C;+4 °C;Lehrbuch S. 12
```

**MM – Mehrfachauswahl:** Wie MC, aber mit **mehreren richtigen Antworten**. In `richtig` stehen
alle richtigen Antworten, getrennt durch `|`. In `falsch1` bis `falsch3` stehen die falschen
(mindestens eine). Höchstens sechs Antworten insgesamt. Die Lehrlinge sehen den Hinweis, dass
mehrere Antworten richtig sein können, kreuzen an und tippen auf „Antwort prüfen“. Die Frage
zählt nur als richtig, wenn genau alle richtigen Antworten angekreuzt sind.

```
83;Einteilung;MM;Welche Fette sind tierisch?;Butterschmalz | Rindertalg | Fischöle;Kokosfett;Palmfett;Rapsöl;IB W7
```

**RF – Richtig/Falsch:** In `frage` steht eine Aussage, in `richtig` das Wort `richtig` oder
`falsch`. Die Spalten `falsch1` bis `falsch3` bleiben leer. In `erklaerung` steht am besten die
Berichtigung – sie erscheint nach dem Antippen, damit die Lehrlinge sehen, was richtig ist.

```
79;Lagerung;RF;Aufgetautes Fleisch darf wieder eingefroren werden.;falsch;;;;Lehrbuch S. 13;Falsch: Aufgetautes Fleisch darf nicht wieder eingefroren werden.
```

**ZU – Zuordnen:** In `richtig` stehen die Paare im Format `links = rechts`, getrennt durch `|`
(senkrechter Strich, Tastatur: `AltGr` + `<`). Mindestens zwei Paare. Die rechten Seiten werden
im Quiz gemischt und müssen durch Antippen zugeordnet werden.

```
80;Teilstücke Rind;ZU;Ordnen Sie die Teilstücke der Verwendung zu.;Tafelspitz = Sieden | Beiried = Kurzbraten | Wadschinken = Gulasch;;;;AMA
```

**RH – Reihenfolge:** In `richtig` stehen die Schritte **in der richtigen Reihenfolge**, getrennt
durch `|`. Mindestens drei Schritte. Im Quiz werden sie gemischt und müssen der Reihe nach
angetippt werden. Ideal für Arbeitsabläufe (Herstellung, Warenannahme, Verkostung …).

```
81;Käseherstellung;RH;Bringen Sie die Schritte in die richtige Reihenfolge.;Milch vorbereiten | Lab zugeben | Käsebruch schneiden | Molke abtrennen | Pressen | Salzen | Reifen;;;;Film Käse
```

**LT – Lückentext:** In `frage` steht die Aufgabe, in `richtig` der Text – die Wörter für die
Lücken stehen in **eckigen Klammern** `[ ]` (Tastatur: `AltGr` + `8` und `AltGr` + `9`).
In `falsch1` bis `falsch3` können Sie bis zu drei **Ablenkwörter** angeben, die zusätzlich zur
Auswahl stehen (optional – macht die Aufgabe schwieriger).

```
82;Fettgehalt;LT;Ergänzen Sie den Text.;F.i.T. bedeutet Fett in der [Trockenmasse]. Für die Ernährung ist der Fettgehalt [absolut] aussagekräftiger.;Eiweiß;relativ;;SA1 FOOD
```

So sieht die Lücke im Quiz aus: wie eine graue Antwortlinie auf dem Arbeitsblatt. Die Lehrlinge
tippen ein Wort aus der Liste darunter an, und es wandert in die markierte Lücke.

**OF – offene Frage (Karteikarte):** In `frage` steht die Frage, in `richtig` die Musterantwort
(wie im Lösungsblatt zum Fragenkatalog). `falsch1` bis `falsch3` bleiben leer. OF-Fragen
erscheinen nur in der Art „Karteikarten“, nicht im Quiz und nicht im Klassenquiz.

```
90;Hitzeverfahren;OF;Was ist H-Milch, und wie lange ist sie haltbar?;Ultrahocherhitzte Milch (135 bis 150 °C) ohne vermehrungsfähige Keime, bei Zimmertemperatur bis 6 Monate haltbar.;;;;FRAGEN Milch W1
```

**Tipp für gute Fragen:**
- Die falschen Antworten bei MC und MM so lang und so fachlich formulieren wie die richtige.
  Sonst raten die Lehrlinge einfach die längste Antwort. `node tests/csv-test.js` prüft das: Bei
  höchstens 35 % der MC-Fragen einer Datei darf die richtige Antwort die längste sein.
- Jede Frage bekommt in `erklaerung` ein bis zwei Sätze, warum die Lösung stimmt.
- Nehmen Sie die Inhalte direkt aus Ihren Arbeitsaufträgen, Lösungsblättern
  und Schularbeiten – dann ist das Quiz eine echte Wiederholung des Unterrichts. Tragen Sie in
  `quelle` ein, woher die Frage stammt; so finden Sie sie später schnell wieder.

### Neue Fragen zu einem bestehenden Thema

1. Die CSV-Datei öffnen, z. B. `daten/fleisch-rindfleisch.csv`.
2. Unten neue Zeilen nach den Beispielen oben anfügen.
3. Speichern – fertig. Beim nächsten Laden der Seite sind die Fragen dabei.

### Neues Thema anlegen

1. Neue CSV-Datei im Ordner `daten/` anlegen, z. B. `daten/kaese.csv` – mit der Kopfzeile oben.
   Dateiname am besten ohne Umlaute und Leerzeichen.
2. In `daten/themen.json` einen Eintrag ergänzen. **Achtung:** Zwischen den Einträgen steht ein
   Komma, nach dem letzten Eintrag keines:
   ```json
   [
     { "titel": "Fleisch & Rindfleisch", "datei": "fleisch-rindfleisch.csv" },
     { "titel": "Käse", "datei": "kaese.csv" }
   ]
   ```
3. Die Themen erscheinen auf der Startseite in dieser Reihenfolge.

### Nach Änderungen an CSS oder JavaScript

In `index.html` (und `zugang.html`) hängt an jeder CSS- und JS-Datei eine Versionsnummer, z. B.
`js/app.js?v=2026-10-15`. Nach jeder Änderung an `css/` oder `js/` diese Nummer überall auf das
neue Datum setzen – sonst können Handys bis zu 10 Minuten lang die alte Datei aus dem
Zwischenspeicher mit den neuen Fragen-Dateien mischen. Für Änderungen nur an `daten/` ist das
nicht nötig, die Fragen werden immer frisch geladen.

### Gemischtes Quiz (z. B. Schularbeits-Wiederholung)

Statt `"datei"` steht `"mix"` mit einer Liste von Dateien, die schon als eigene Themen in
`themen.json` stehen. Das Quiz mischt deren Fragen; als Unterthema erscheint das jeweilige Thema.
Auf der Startseite hat die Karte einen gelben Rand.

```json
{ "titel": "Wiederholung zur 2. Schularbeit", "mix": ["eier.csv", "fische.csv"] }
```

„Alle Themen gemischt“ braucht keinen Eintrag: Die App stellt diese Mischung aus allen Themen der
Klasse selbst zusammen (blauer Rand).

**Achtung bei Lückentexten (LT):** Jede Lücke wird an ihrer Stelle geprüft. Wörter, die man
fachlich vertauschen könnte („aus [Samen], [Früchten] oder Keimen“), nicht beide als Lücke setzen –
sonst wird eine richtige Antwort als falsch gewertet.

### Klassen-Codes und Zugangsblatt

Jedes Thema in `themen.json` hat `"klassen"`, z. B. `["2"]`. Die Codes stehen in `daten/zugaenge.json`:

```json
{
  "ohneCode": { "klasse": "2", "bis": "2026-11-06" },
  "zugaenge": [
    { "code": "2GH2B-MILCH", "name": "2GH2b · II. Lehrgang 2026/27", "klasse": "2", "aktiv": true }
  ]
}
```

- Mit `?code=2GH2B-MILCH` in der Adresse sieht man nur die Themen der Klasse 2. Groß- und
  Kleinschreibung ist egal, der Code kann auch auf der Startseite eingetippt werden.
- `"aktiv": false` sperrt einen Code („Dieser Zugang ist derzeit nicht freigegeben.“).
- Optional `"themen": ["Milch & Milchprodukte", "Käse"]`: Die Klasse sieht nur diese Themen –
  so lässt sich Thema für Thema freischalten.
- `ohneCode`: Bis zum Datum `bis` sieht man ohne Code die Themen dieser Klasse. Danach verlangt die
  Startseite einen Code. Ohne `ohneCode` braucht man immer einen Code.
- **Neuer Lehrgang:** neuen Code eintragen (Klasse + Wort, z. B. `2GH3B-KAESE`), den alten auf
  `false` setzen, QR-Code erzeugen und das Blatt drucken:

  ```
  python tools/qr_code.py "https://benediktknotzer-jpg.github.io/lbs-unterrichtstools/?code=2GH3B-KAESE" bilder/qr-2GH3B-KAESE.svg
  ```

  Zugangsblatt: `zugang.html?code=2GH3B-KAESE` öffnen und drucken (A4) oder am Smartboard zeigen.
- `node tests/csv-test.js` prüft die Datei: doppelte Codes, unbekannte Klasse oder unbekanntes Thema,
  fehlender QR-Code.
- Der Code ordnet nur zu, er schützt nichts: Die Fragen sind öffentlich (so gewollt).

### Bearbeiten mit Excel oder einem Texteditor

- **Excel:** Datei öffnen, bearbeiten, dann **Datei → Speichern unter → „CSV UTF-8 (durch
  Trennzeichen getrennt)“** wählen. Das österreichische Excel verwendet automatisch das Semikolon.
  (Bei „CSV (Trennzeichen-getrennt)“ ohne UTF-8 funktioniert das Quiz auch, die App zeigt aber
  einen Hinweis, weil Umlaute falsch dargestellt werden können.)
- **Texteditor** (z. B. Notepad++, VS Code oder direkt auf GitHub mit dem Stift-Symbol):
  Kodierung UTF-8 verwenden.
- Enthält ein Text selbst ein Semikolon, den ganzen Text in Anführungszeichen setzen:
  `"Was gilt; genau?"` – oder das Semikolon durch ein Komma/einen Gedankenstrich ersetzen.

### Fehler in den Dateien

Die App prüft beim Laden jede Zeile. Fehlerhafte Fragen (z. B. unbekannter Typ, fehlende Antwort,
ZU-Paar ohne `=`) werden übersprungen, alle anderen Fragen funktionieren weiter. Auf der Startseite
erscheint beim betroffenen Thema ein aufklappbarer Hinweis **„⚠ Für die Lehrkraft“** mit Zeilennummer
und Beschreibung des Problems, z. B.:

> Zeile 3 (Nr. 2): Unbekannter Fragetyp „XY“. Erlaubt sind MC, RF, ZU, LT oder RH.

Wer Node.js installiert hat, kann alle Themen auch ohne Browser prüfen:

```
node tests/csv-test.js
```

---

## Einheitlicher Stil (für dieses und alle weiteren Tools)

Das Aussehen folgt den Arbeits- und Infoblättern von Benedikt Knotzer (knb):

| Element | Umsetzung |
|---------|-----------|
| Schrift | Aptos, Fallback Calibri, Arial (Aptos gibt es nur mit aktuellem Office) |
| Titel | fett, Logo-Blau `#005090`, Format „Typ: Thema“ (z. B. „Quiz: Käse“, „Auswertung: Käse“) |
| Kopf | Titel mit farbigem Marker-Balken links (Quiz: Grün wie Arbeitsblatt), Klasse darunter, LBS-Logo rechts, gelbe Linie `#FFD600` |
| Überschriften | fett, Logo-Blau `#005090` |
| Anleitungen | kursiv, wie „Anleitung: …“ auf den Arbeitsblättern |
| Lücken / leere Felder | graue Antwortlinie `#808080`, Antwortflächen grau gestrichelt auf `#FAFAFA` |
| Tabellen / Karten | Kopf fett blau auf Hellblau `#E7EFF7`, Rahmen grau `#BFBFBF` |
| Infokästen | Tipp (blau), Merke (orange), Hinweis (grün) |
| Fußzeile | gelbe Trennlinie, „Benedikt Knotzer \| knb“ in Blau |

Alle Grundregeln stehen in `css/knb-stil.css`. Ein neues Tool bindet diese Datei ein und ergänzt
nur, was es zusätzlich braucht – so sieht alles einheitlich aus.

### Fragen mit Vermerk „bitte prüfen“

Im Käse-Katalog steht bei manchen Fragen in der Spalte `quelle` der Vermerk **„Lehrbuch – bitte prüfen“**
oder **„Faktoren bitte prüfen“**. Diese Inhalte stammen nicht direkt aus Ihren Unterlagen
(Schularbeit FOOD, AA Milch, Sensorik-Protokoll, Wochenplanung), sondern aus allgemeinem
Warenkunde-Wissen. Bitte vor dem Einsatz mit Ihrem Lehrbuch bzw. dem AA „Käse allgemein“
abgleichen – vor allem die Umrechnungsfaktoren F.i.T. → Fett absolut.
