# lbs-unterrichtstools – Hinweise für Claude

Interaktive Web-Tools für den Unterricht von Benedikt Knotzer (knb) an der LBS Theresienfeld
(Fachpraktikum FOOD / Großhandel, BLAM). Derzeit: Warenkunde-Quiz (`index.html`).

## Aktueller Plan

Siehe **`docs/KONZEPT.md`**: 1. PC einrichten und Bestandsaufnahme der Materialsammlung →
2. Freigabe-System mit Klassen-Codes und QR-Codes (Variante A: Ordnung, keine Geheimhaltung) →
3. weitere Themen (zuerst Milch & Milchprodukte). Dort stehen auch die offenen Punkte.

## Oberste Regel: Die Materialsammlung ist schreibgeschützt

Die **Materialsammlung** (Benedikts Unterrichtsmaterial, eigenes Projekt, Ordner
`C:\Users\bened\VFW_Claude`) darf nur **gelesen und durchsucht** werden – als Quelle für Fragen,
Layout und Fachinhalte.

**Name (Benedikt 12.11.2026):** „VFW“ ist ein anderer Unterrichtsgegenstand und hat mit den
Großhandelsklassen nichts zu tun; der Ordnername ist ein alter Fehler, der vorerst bleiben muss,
weil Leserechte und Sperren daran hängen. Darum **im Text nie „VFW“ schreiben** – nicht in Doku,
Daten, Tests, Commits oder Antworten an Benedikt. Sagen: „Materialsammlung“, „Fragenkatalog
II. LG“, „Katalog-Lösung“, „Wochengerüst“, „Sitzung in der Materialsammlung“. Der Ordnerpfad
steht nur dort, wo ein Befehl oder Pfad ihn braucht (in Backticks), dazu `tools/vfw_lesen.py`.

- Dort **nie** Dateien anlegen, ändern, verschieben, umbenennen oder löschen – auch keine
  temporären Dateien, keine Konvertierungen „neben“ den Originalen, kein `git` in diesem Ordner.
- .docx/.pptx **nur** mit dem Lese-Skript auslesen (Pfad relativ zur Materialsammlung, Ausgabe nur am
  Bildschirm): `python tools/vfw_lesen.py "01_Lehrgang_…/Woche_…/datei.docx"`. Das ist die
  einzige freigegebene Shell-Ausnahme (`.claude/settings.local.json`). Alle anderen
  Shell-Befehle auf die Materialsammlung bleiben gesperrt – nicht umgehen. Das Skript darf nie schreiben.
- .pdf, .md, .txt und Bilder mit dem Read-Werkzeug lesen. Alte .doc/.ppt gehen nicht.
- Geschrieben wird ausschließlich in diesem Repository (`lbs-unterrichtstools`).
- Schülerdaten (Namen, Noten, Beurteilungen) aus der Materialsammlung **nie** in dieses Repository
  übernehmen – das Repository ist öffentlich.

## Warenkunde-Quiz

- Reines HTML/CSS/JavaScript, keine Build-Tools, keine externen Abhängigkeiten, kein Tracking,
  keine Speicherung (auch kein localStorage).
- Themen: `daten/themen.json` + je eine CSV (UTF-8, Semikolon):
  `nr;thema;typ;frage;richtig;falsch1;falsch2;falsch3;quelle;erklaerung` (erklaerung freiwillig)
- Fragetypen: MC, MM (mehrere richtige, `|`), RF (mit Berichtigung in `erklaerung`),
  ZU (`links = rechts | …`), RH (Schritte in richtiger Reihenfolge, `|`),
  LT (Text mit Lücken in `[eckigen Klammern]`, falsch1–3 = Ablenkwörter),
  OF (offene Frage, `richtig` = Musterantwort, nur in der Art „Karteikarten“),
  OA (offene Antwort, vom Quiz korrigiert: `richtig` = Musterantwort, `falsch1` = Schlüsselbegriffe
  mit `|`, Synonyme mit `/`, `=` davor = ohne Tippfehler-Toleranz, `falsch2` = wie viele genügen;
  nur für Aufzählungen, Fachbegriffe, Zahlen – jede OA vorher mit richtiger und falscher
  Beispielantwort gegen `js/oa.js` prüfen). Details: README.
- Arten in der App: Quiz (Handy, mit Note, auch OA), Karteikarten (OF, zum Umdrehen mit
  „Gewusst / Nochmal“), Klasse (Smartboard, nur MC/RF, 30-s-Countdown, zwei Teams).
  „Alle Themen gemischt“ stellt die App selbst zusammen.
- Nach Änderungen an `js/` oder `css/` die `?v=`-Nummer in `index.html` erhöhen, sonst laden
  Handys die alte Fassung aus dem Zwischenspeicher. GitHub Pages lässt Browser die Startseite bis
  zu 10 Minuten zwischenspeichern: Bei einem neuen Fragetyp erst die App pushen, die CSV-Zeilen mit
  dem neuen Typ frühestens 10 Minuten später (sonst überspringt die alte App sie als unbekannt).
- Qualität: Bei MC die falschen Antworten so lang wie die richtige – `tests/csv-test.js` erlaubt
  höchstens 35 % „richtige ist die längste“ je Datei. Jede Frage mit Erklärung.
- Klassen-Codes: `daten/zugaenge.json` (Format „Klasse + Wort“, z. B. `2GH2B-MILCH`, pro Lehrgang neu,
  alter Code `aktiv: false`). Jedes Thema in `themen.json` braucht `klassen`. QR je Code:
  `bilder/qr-<CODE>.svg` mit `tools/qr_code.py`, Blatt: `zugang.html?code=<CODE>`.
- Notenschlüssel der LBS (wie Schularbeit, nicht ändern): 100–91 / 90–81 / 80–61 / 60–51 / 50–0 %,
  Prozent abgerundet. Quelle: `VFW_Claude/00_START_NEUER_LEHRGANG_I_2026-27.md`.
- Zugang für die Lehrlinge: `zugang.html` (QR-Code `bilder/qr-quiz.svg`, erzeugt mit
  `python tools/qr_code.py <adresse> bilder/qr-quiz.svg`). Die Adresse ohne Code zeigt bis
  06.11.2026 die 2. Klasse (`ohneCode` in `zugaenge.json`), danach nur mit Code.
- `daten/fleisch-rindfleisch.csv` darf seit 15.10.2026 bearbeitet werden (Freigabe Benedikt).
- Spalte `quelle`: woher die Frage stammt (z. B. „SA1 FOOD“, „AA Milch“). Inhalte, die nicht aus
  Benedikts Unterlagen stammen, mit „… – bitte prüfen“ markieren.
- **Zahlen nur mit Beleg (Entscheidung Benedikt 09.11.2026):** Keine Zahl (Temperatur, Fettgehalt,
  Dauer, Prozent, Menge) ohne Beleg. Grundlage ist das Warenkundebuch, die Seite steht in `quelle`.
  Gibt es neuere Daten als das Buch, gilt das Neuere nur, wenn es mehrfach geprüft ist: Primärquelle
  (EU-Verordnung, Österreichisches Lebensmittelbuch, Schutzkonsortium, AMA, AGES) **und** eine zweite
  unabhängige Quelle; dann Quelle mit Stand in `quelle`/`erklaerung`. Zahlen, die nur in einem
  Infoblatt, AA III. LG oder Kollegenmaterial stehen und sich so nicht belegen lassen, werden auf den
  Buchwert gestellt oder gestrichen. Das ersetzt für Zahlen die Regel vom 15.10. („bei Widerspruch
  gilt das eigene IB“). Ändert sich dadurch eine Zahl, die im Infoblatt anders steht, in
  `docs/LEHRGANG_II_2GH2B.md` vermerken: Die Sitzung in der Materialsammlung zieht das Infoblatt nach.
- **Nur 2. Klasse (Benedikt 09.11.2026):** Bis die 2GH2b fertig ist, nur Themen der 2. Klasse.
  Was wann unterrichtet wird, steht in `docs/LEHRGANG_II_2GH2B.md` (abgeleitet aus dem
  Wochengerüst FP 2GH2b); bei jeder Sitzung zuerst dort und im Wochengerüst nachsehen.
- **Karteikarten = Fragenkatalog des laufenden Lehrgangs, 1 : 1 (Benedikt 12.11.2026):** je
  Katalogfrage eine OF-Karte im Wortlaut der Katalog-Lösung (Zahlen nach Buch), Karten ohne Katalogfrage
  fallen weg. Quizfragen außerhalb des Katalogs bleiben, wenn sie im Buch oder IB stehen. Die
  Mischquiz „Wiederholung zur 1./2. Schularbeit“ enthalten nur SA-Stoff (Unterthemen je SA).
  Alle Entscheidungen vom 12.11. und der Umsetzungsplan: `docs/ENTSCHEIDUNGEN_2GH2B.md`.
- Durchsicht für die Lehrkraft: `durchsicht.html?thema=<datei>.csv` zeigt alle Fragen eines Themas
  mit Lösung, Erklärung und Quelle, Zahlen gelb, „bitte prüfen“ rot.
- Fragen sollen den Unterrichtsstoff wiederholen: aus Arbeitsaufträgen, Lösungen, Infoblättern,
  Schularbeiten in der Materialsammlung ableiten. Sprache: österreichisches Deutsch, Sie-Form.
- **Nur Kernstoff (Entscheidung Benedikt 25.10.2026):** kein Zusatzwissen, das in der Stunde nicht
  vorkommt. Kern = Fragenkatalog, Lösungsblatt-Aufgaben, Schularbeit, Wiederholung, Quick-Check.
  Kollegenmaterial (AA III. LG), AMA-Broschüre, LAP-Fragen und IB „Zum Nachschlagen“ nur, wenn
  Benedikt es ausdrücklich will. Themen werden mit `tools/streichliste.py` gekürzt
  (`docs/streichlisten/`), Benedikt sieht nur die Streichliste durch. Gestrichen wird nur
  Gruppe A (weder im Buch noch im Unterricht); was im Buch steht, bleibt (Benedikt 25.10.).
- **Fragenkatalog als Rückgrat:** Jedes Warenkunde-Thema bekommt einen Fragenkatalog
  (12–15 Kernfragen = SA-Fragen), am Warenkundebuch „Lebens- und Genussmittel“ geprüft, mit
  Buchseite. Jede Katalogfrage steht im Quiz als Karteikarte (OF) und als mindestens eine
  Quizfrage. Buch: digi4school E-Book 16967 (Seite im E-Book = Buchseite + 2), nur über
  **Claude in Chrome** (dort ist Benedikt angemeldet): digi4school.at → E-Books → „Warenkunde
  Lebens- und Genussmittel“ öffnet einen Tab, dann `a.digi4school.at/ebook/16967/?page=<Buchseite+2>`.
  Die Seiten sind Bilder, lesen per Zoom-Bildschirmfoto. Milch = Buch S. 89–95. Fehlt der Katalog in der Materialsammlung, entsteht der Entwurf hier in
  `docs/fragenkataloge/`; das DOCX dazu macht eine Sitzung in der Materialsammlung.

## Stil (wie Benedikts Arbeits- und Infoblätter)

Grundstil in `css/knb-stil.css` – für alle Tools einbinden, nur Ergänzungen in eigener CSS:
Aptos (Fallback Calibri, Arial), Titel/Überschriften fett Logo-Blau #005090, gelbe Akzentlinien
#FFD600 in Kopf und Fuß, Titel „Typ: Thema“ mit farbigem Marker-Balken links, LBS-Logo rechts,
Anleitungen kursiv, Tabellenkopf fett blau auf Hellblau #E7EFF7 mit grauem Rahmen #BFBFBF,
Antwortflächen grau gestrichelt, Callouts Tipp/Merke/Hinweis, Fußzeile „Benedikt Knotzer | knb“.
Quelle: `VFW_Claude/Markenkit/` und `lbs-lehrer-plugin/skills/dokument-stil/` (Stand 8.10.2026).
Wenn sich das Layout in den aktuellen Unterlagen (Materialsammlung) geändert hat, gilt das aktuelle
Layout – dann `css/knb-stil.css` anpassen.

## Prüfen vor jedem Commit

```
node tests/csv-test.js          # Formatprüfung aller Themen-CSVs
python -m http.server 8000      # dann http://localhost:8000 am Handy-Format (360 px) testen
```
