# lbs-unterrichtstools – Hinweise für Claude

Interaktive Web-Tools für den Unterricht von Benedikt Knotzer (knb) an der LBS Theresienfeld
(Fachpraktikum FOOD / Großhandel, BLAM). Derzeit: Warenkunde-Quiz (`index.html`).

## Aktueller Plan

Siehe **`docs/KONZEPT.md`**: 1. PC einrichten und Bestandsaufnahme von VFW_Claude →
2. Freigabe-System mit Klassen-Codes und QR-Codes (Variante A: Ordnung, keine Geheimhaltung) →
3. weitere Themen (zuerst Milch & Milchprodukte). Dort stehen auch die offenen Punkte.

## Oberste Regel: VFW_Claude ist schreibgeschützt

Der Ordner **VFW_Claude** (Benedikts Unterrichtsmaterial-Sammlung, eigenes Projekt) darf nur
**gelesen und durchsucht** werden – als Quelle für Fragen, Layout und Fachinhalte.

- Dort **nie** Dateien anlegen, ändern, verschieben, umbenennen oder löschen – auch keine
  temporären Dateien, keine Konvertierungen „neben“ den Originalen, kein `git` in diesem Ordner.
- .docx/.pptx **nur** mit dem Lese-Skript auslesen (Pfad relativ zu VFW_Claude, Ausgabe nur am
  Bildschirm): `python tools/vfw_lesen.py "01_Lehrgang_…/Woche_…/datei.docx"`. Das ist die
  einzige freigegebene Shell-Ausnahme (`.claude/settings.local.json`). Alle anderen
  Shell-Befehle auf VFW_Claude bleiben gesperrt – nicht umgehen. Das Skript darf nie schreiben.
- .pdf, .md, .txt und Bilder mit dem Read-Werkzeug lesen. Alte .doc/.ppt gehen nicht.
- Geschrieben wird ausschließlich in diesem Repository (`lbs-unterrichtstools`).
- Schülerdaten (Namen, Noten, Beurteilungen) aus VFW_Claude **nie** in dieses Repository
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
  Handys die alte Fassung aus dem Zwischenspeicher.
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
- Fragen sollen den Unterrichtsstoff wiederholen: aus Arbeitsaufträgen, Lösungen, Infoblättern,
  Schularbeiten in VFW_Claude ableiten. Sprache: österreichisches Deutsch, Sie-Form.
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
  Die Seiten sind Bilder, lesen per Zoom-Bildschirmfoto. Milch = Buch S. 89–95. Fehlt der Katalog in VFW_Claude, entsteht der Entwurf hier in
  `docs/fragenkataloge/`; das DOCX dazu macht eine Sitzung in VFW_Claude.

## Stil (wie Benedikts Arbeits- und Infoblätter)

Grundstil in `css/knb-stil.css` – für alle Tools einbinden, nur Ergänzungen in eigener CSS:
Aptos (Fallback Calibri, Arial), Titel/Überschriften fett Logo-Blau #005090, gelbe Akzentlinien
#FFD600 in Kopf und Fuß, Titel „Typ: Thema“ mit farbigem Marker-Balken links, LBS-Logo rechts,
Anleitungen kursiv, Tabellenkopf fett blau auf Hellblau #E7EFF7 mit grauem Rahmen #BFBFBF,
Antwortflächen grau gestrichelt, Callouts Tipp/Merke/Hinweis, Fußzeile „Benedikt Knotzer | knb“.
Quelle: `VFW_Claude/Markenkit/` und `lbs-lehrer-plugin/skills/dokument-stil/` (Stand 8.10.2026).
Wenn sich das Layout in den aktuellen Unterlagen (VFW_Claude) geändert hat, gilt das aktuelle
Layout – dann `css/knb-stil.css` anpassen.

## Prüfen vor jedem Commit

```
node tests/csv-test.js          # Formatprüfung aller Themen-CSVs
python -m http.server 8000      # dann http://localhost:8000 am Handy-Format (360 px) testen
```
