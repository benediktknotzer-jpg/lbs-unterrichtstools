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
- Zum Auslesen von .docx/.pptx/.pdf: Inhalte in den Speicher oder in einen Ordner **außerhalb**
  von VFW_Claude lesen (z. B. Temp-Ordner).
- Geschrieben wird ausschließlich in diesem Repository (`lbs-unterrichtstools`).
- Schülerdaten (Namen, Noten, Beurteilungen) aus VFW_Claude **nie** in dieses Repository
  übernehmen – das Repository ist öffentlich.

## Warenkunde-Quiz

- Reines HTML/CSS/JavaScript, keine Build-Tools, keine externen Abhängigkeiten, kein Tracking,
  keine Speicherung (auch kein localStorage).
- Themen: `daten/themen.json` + je eine CSV (UTF-8, Semikolon):
  `nr;thema;typ;frage;richtig;falsch1;falsch2;falsch3;quelle`
- Fragetypen: MC, RF, ZU (`links = rechts | …`), RH (Schritte in richtiger Reihenfolge, `|`),
  LT (Text mit Lücken in `[eckigen Klammern]`, falsch1–3 = Ablenkwörter). Details: README.
- `daten/fleisch-rindfleisch.csv` nicht verändern (Vorgabe von Benedikt).
- Spalte `quelle`: woher die Frage stammt (z. B. „SA1 FOOD“, „AA Milch“). Inhalte, die nicht aus
  Benedikts Unterlagen stammen, mit „… – bitte prüfen“ markieren.
- Fragen sollen den Unterrichtsstoff wiederholen: aus Arbeitsaufträgen, Lösungen, Infoblättern,
  Schularbeiten in VFW_Claude ableiten. Sprache: österreichisches Deutsch, Sie-Form.

## Stil (wie Benedikts Arbeits- und Infoblätter)

Grundstil in `css/knb-stil.css` – für alle Tools einbinden, nur Ergänzungen in eigener CSS:
Arial, Titel/Überschriften fett #003399, Titel „Typ: Thema“, LBS-Logo rechts, Anleitungen kursiv,
Antwortlinien grau #808080, Tabellenkopf weiß auf #003399, Fußzeile „Benedikt Knotzer | knb“.
Wenn sich das Layout in den aktuellen Unterlagen (VFW_Claude) geändert hat, gilt das aktuelle
Layout – dann `css/knb-stil.css` anpassen.

## Prüfen vor jedem Commit

```
node tests/csv-test.js          # Formatprüfung aller Themen-CSVs
python -m http.server 8000      # dann http://localhost:8000 am Handy-Format (360 px) testen
```
