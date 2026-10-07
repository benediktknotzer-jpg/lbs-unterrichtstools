# lbs-unterrichtstools
Interaktive Web-Tools für den Unterricht an der LBS Theresienfeld (BLAM, FP)

## Warenkunde-Quiz

Ein Quiz für Lehrlinge im Lebensmittel-Großhandel (2. Klasse Fachpraktikum), optimiert fürs Handy.

- Themenauswahl, optional Filter nach Unterthema, 10 / 20 / alle Fragen
- Fragen und Antworten werden bei jedem Durchgang gemischt
- Sofortige Rückmeldung mit richtiger Lösung
- Auswertung in Prozent mit Note laut Notenschlüssel der Schularbeiten (91/81/61/51 %),
  Liste der falschen Fragen mit Lösung, „Falsche Fragen wiederholen“
- Fünf Fragetypen: Multiple Choice (MC), Richtig/Falsch (RF), Zuordnen (ZU),
  Reihenfolge (RH) und Lückentext (LT) – alles per Antippen, ohne Tippen auf der Tastatur
- Themen derzeit: **Fleisch & Rindfleisch** (77 Fragen), **Käse** (78 Fragen)
- Gestaltet im Stil der knb-Arbeitsblätter (siehe unten „Einheitlicher Stil“)
- Keine Anmeldung, keine Speicherung, kein Tracking, keine externen Dateien –
  reines HTML/CSS/JavaScript

### Ordnerstruktur

```
index.html              Die App
css/knb-stil.css        Grundstil (Schrift, Farben, Kopf, Fußzeile) – für alle Tools
css/quiz.css            Aussehen speziell für das Quiz
bilder/lbs-logo.png     Logo der LBS Theresienfeld
js/csv.js               Einlesen und Prüfen der Fragen-Dateien
js/app.js               Ablauf des Quiz
daten/themen.json       Liste der Themen
daten/*.csv             Fragen, eine Datei pro Thema
tests/csv-test.js       Automatische Prüfung der Fragen-Dateien
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
nr;thema;typ;frage;richtig;falsch1;falsch2;falsch3;quelle
```

| Spalte  | Bedeutung |
|---------|-----------|
| nr      | laufende Nummer (hilft bei Fehlermeldungen) |
| thema   | Unterthema, danach kann im Quiz gefiltert werden (z. B. „Lagerung“) |
| typ     | `MC`, `RF`, `ZU`, `RH` oder `LT` |
| frage   | Fragetext bzw. Aussage |
| richtig | richtige Antwort (je nach Typ, siehe unten) |
| falsch1–falsch3 | falsche Antworten (MC) bzw. zusätzliche Ablenkwörter (LT) |
| quelle  | nur für Sie – wird im Quiz nicht angezeigt (z. B. „SA1 FOOD“, „AA Milch“, „Lehrbuch S. 45“) |

### Beispiele für die fünf Fragetypen

**MC – Multiple Choice:** In `richtig` steht die richtige Antwort, in `falsch1` bis `falsch3`
die falschen. Die Reihenfolge wird im Quiz gemischt.

```
78;Lagerung;MC;Bei welcher Temperatur wird Tiefkühlware gelagert?;−18 °C oder kälter;0 bis +2 °C;−5 °C;+4 °C;Lehrbuch S. 12
```

**RF – Richtig/Falsch:** In `frage` steht eine Aussage, in `richtig` das Wort `richtig` oder
`falsch`. Die Spalten `falsch1` bis `falsch3` bleiben leer.

```
79;Lagerung;RF;Aufgetautes Fleisch darf wieder eingefroren werden.;falsch;;;;Lehrbuch S. 13
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

**Tipp für gute Fragen:** Nehmen Sie die Inhalte direkt aus Ihren Arbeitsaufträgen, Lösungsblättern
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
| Schrift | ausschließlich Arial |
| Titel | fett, Blau `#003399`, Format „Typ: Thema“ (z. B. „Quiz: Käse“, „Auswertung: Käse“) |
| Logo | LBS-Logo rechts neben dem Titel |
| Überschriften | fett, Blau `#003399` |
| Anleitungen | kursiv, wie „Anleitung: …“ auf den Arbeitsblättern |
| Lücken / leere Felder | graue Antwortlinie `#808080` |
| Tabellen / Karten | Kopf weiße Schrift auf Blau `#003399`, Rahmen Blau |
| Fußzeile | Trennlinie, „Benedikt Knotzer \| knb“ in Blau |

Alle Grundregeln stehen in `css/knb-stil.css`. Ein neues Tool bindet diese Datei ein und ergänzt
nur, was es zusätzlich braucht – so sieht alles einheitlich aus.

### Fragen mit Vermerk „bitte prüfen“

Im Käse-Katalog steht bei manchen Fragen in der Spalte `quelle` der Vermerk **„Lehrbuch – bitte prüfen“**
oder **„Faktoren bitte prüfen“**. Diese Inhalte stammen nicht direkt aus Ihren Unterlagen
(Schularbeit FOOD, AA Milch, Sensorik-Protokoll, Wochenplanung), sondern aus allgemeinem
Warenkunde-Wissen. Bitte vor dem Einsatz mit Ihrem Lehrbuch bzw. dem AA „Käse allgemein“
abgleichen – vor allem die Umrechnungsfaktoren F.i.T. → Fett absolut.
