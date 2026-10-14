# Bestandsaufnahme VFW_Claude für das Warenkunde-Quiz

Stand: 8. Oktober 2026 · für Benedikt Knotzer (knb) · Phase 1 laut `docs/KONZEPT.md`

VFW_Claude wurde nur gelesen (Glob, Grep, Read). Es gibt keine Schülerdaten in diesem Dokument.
Pfade sind relativ zu `C:\Users\bened\VFW_Claude`.

---

## 1. Sperrtest (8.10.2026)

| Test | Erwartung | Ergebnis |
|------|-----------|----------|
| Ordner auflisten mit Glob/Read | erlaubt | funktioniert |
| `ls` auf VFW_Claude (Bash) | abgelehnt | abgelehnt |
| `Get-ChildItem` auf VFW_Claude (PowerShell) | abgelehnt | abgelehnt |
| Edit auf eine (nicht vorhandene) Datei in VFW_Claude | abgelehnt | abgelehnt („denied by your permission settings“) |

Es wurde keine Datei in VFW_Claude angelegt.

**Grenzen der Sperre:**

- Die Shell-Sperre greift nur, wenn „VFW_Claude“ im Befehl wörtlich vorkommt (drei
  Schreibweisen). Platzhalter wie `VFW*` oder eine andere Groß-/Kleinschreibung würde sie nicht
  erkennen. Für die Zusammenarbeit mit Claude reicht das, denn die Regel in `CLAUDE.md` gilt
  zusätzlich.
- **Word und PowerPoint:** `.docx` und `.pptx` lassen sich nur über die Shell auslesen. Dafür
  gibt es seit 8.10. eine einzige Ausnahme: das reine Lese-Skript `tools/vfw_lesen.py` (nur
  Standardbibliothek, öffnet lesend, Ausgabe nur am Bildschirm, lehnt Pfade außerhalb von
  VFW_Claude ab). Alte `.doc`/`.ppt` kann es nicht lesen.
- PDF-Seiten als Bild ansehen geht derzeit nicht, weil `pdftoppm` (poppler) nicht installiert ist.
  PDF-Text ist lesbar.

---

## 2. Ordnerstruktur VFW_Claude (relevant für das Quiz)

| Ordner | Inhalt | Nutzen fürs Quiz |
|--------|--------|------------------|
| `01_Lehrgang_I_2026-27\FP_Food_2GH1b\` | laufender Lehrgang FP Food, 2. Klasse (1.9.–6.11.2026) | **Hauptquelle** |
| `02_Lehrstoffverteilungen\` | Lehrstoffverteilungen FP Food 1.–3. Klasse (PDF, Stand 2023) | Zuordnung Thema → Klasse |
| `08_Eigenes_Material_frühere_Lehrgänge\III-LG_2026-02_FP_Food_2GH\` | eigenes Material 2. Klasse, III. Lehrgang (Jän.–Feb. 2026) | Ergänzung, ältere Namensgebung |
| `09_Abgeschlossen_Lehrgang_IV_2025-26\FP_Food_1GH3\` | abgeschlossener Lehrgang FP Food, 1. Klasse (Apr.–Jul. 2026) | Quelle 1. Klasse |
| `04_Referenzmaterial_KollegInnen\FP\` | Kollegenmaterial (1KL/2KL/3KL_FOOD, NF_MATERIALIEN) | nur Ergänzung, als „Kollegin/Kollege“ kennzeichnen |
| `Markenkit\`, `lbs-lehrer-plugin\skills\dokument-stil\` | verbindlicher Dokumentstil | Layout fürs Web |
| `lbs-lehrer-plugin\skills\fp-kontext\SKILL.md` | Wochenverteilung aller Klassen | Orientierung, keine Quelle |

**Dateinamen-Schema (aktuell):** `NN_Typ_FP_Wx_Thema.docx`, z. B. `03_IB_FP_W2_Käse.docx`.

| Kürzel | Dokument |
|--------|----------|
| 01 SVB | Stundenvorbereitung |
| 02 SB | Strukturblatt |
| 03 IB | Infoblatt |
| 04 AB / 05 LB | Arbeitsblatt / Lösungsblatt |
| 06/07 | Frageblatt + Lösung (z. B. AMA-Broschüre) |
| 08/09 FRAGEN | Fragenkatalog + Lösung (12 Kernfragen = Schularbeitsfragen) |
| 13/14 SA | Schularbeit + Lösung |
| 15 / 08 Wiederholung | Wiederholungsblatt zur Schularbeit |
| 17–20 LAP-Fragen | Lehrabschlussprüfungs-Fragen + Lösung |
| 21 Quiz, 22 Stationskarten | Schularbeits-Wiederholung |
| PRÄ_… .pptx | Präsentation |

Unterordner `_Druck` und `_Druck_nach_Tagen` enthalten nur Kopien. Ältere Fassungen liegen in
`_archiv_alt_vor_NEU`.

---

## 3. Klassen und Warenkunde-Themen

Laut Lehrstoffverteilung (`02_Lehrstoffverteilungen\FP_Food * Klasse_23.pdf`). Ab etwa Woche 7–9
kommen in jeder Klasse Non-Food-Warengruppen (NF) dazu.

### 2. Klasse – laufender Lehrgang 2GH1b (12 Wst., SA am 28.9. und 23.10.2026)

| W | Warenkunde | Eigene Unterlagen im laufenden Lehrgang | Quiz |
|---|-----------|------------------------------------------|------|
| 1 | Milch und Milchprodukte | IB, AB, LB, **FRAGEN + Lösung**, PRÄ | **fehlt – nächstes Thema** |
| 2–3 | Käse (Käseprojekt) | IB, AB, LB, **FRAGEN + Lösung**, PRÄ, Projektauftrag, Bewertungsbogen | vorhanden (`kaese.csv`), abgleichen |
| 4 | Fleisch, Rindfleisch | IB, AB, LB (je Fleisch und Rindfleisch), PRÄ, AMA-Frageblatt + Lösung, AMA-Broschüre (PDF) | vorhanden (`fleisch-rindfleisch.csv`) |
| 5 | Feinkost, Fertigkost (+ Zusatzverkauf) | IB, AB, LB, AB/LB Film Schinken | vorhanden (`feinkost-zusatzverkauf.csv`) |
| 6 | Eier | IB, AB, LB, zusätzlich AB/LB „aus Turnus 1“ (.doc) | vorhanden (`eier.csv`) |
| 6 | Fische, Krusten- und Weichtiere | IB, AB, LB, PRÄ, **LAP-Fragen Teil 1 + 2 mit Lösung** | vorhanden (`fische.csv`) |
| 7 | Speisefette und Öle | IB, AB, LB, PRÄ | vorhanden (`speisefette-oele.csv`) |
| 7 | Kakao und Schokolade | IB, AB, LB | fehlt |
| 8 | Diätetische Lebensmittel (Diabetikerwaren) | IB, AB, LB | fehlt |
| 8 | Biowaren | IB, AB, LB | fehlt |
| 8 | Kindernährmittel | IB, AB, LB | fehlt |
| 9 | NF: Textile Rohstoffe und Flächengebilde, Textilpflege, Garne und Zwirne | IB, AB, LB | fehlt |
| 10 | NF: Spielen und Spielzeug, Prüfsiegel und Sicherheit, Zeichen- und Malbedarf | IB, AB, LB, PRÄ | fehlt |

Verkaufs- und Marketingthemen der 2. Klasse (auch Schularbeitsstoff): neun Phasen des
Verkaufsgesprächs, Bedarfsermittlung, Corporate Identity (W1), Public Relations,
Präsentationstechniken, Verkaufsaktionen (W2), Reklamation und Umtausch, Verpackung und
Transport, Projektdokumentation (W3), Telefongespräche, Zusatzverkauf (W5), Inventurdifferenzen
(W6), Ausstellungsraum und Messen, Call Center (W7), Werben in neuen Medien (W9).

**Schularbeiten 2GH1b** (Stoff aus `00_Stoffbekanntgabe_1_SA_FP.md` und `…_2_SA_FP.md`):

- **1. SA** (`Woche_05…\13_SA1_FP_W5.docx` + `14_SA1_Lösung…`): Verkaufsgespräch und
  Bedarfsermittlung, Corporate Identity, Milch, Käse, Verpackung und Recycling, Fleisch.
  Milch, Käse und Fleisch je 22 von 100 Punkten.
- **2. SA** am 23.10.2026 (`Woche_08…\13_SA2_FP_W8.docx` + Lösung): Feinkost/Fertigkost und
  Zusatzverkauf, Eier, Fisch/Krusten-/Weichtiere, Inventurdifferenzen, Speisefette/Öle,
  Kakao/Schokolade, Diätetische Lebensmittel, Biowaren, Kindernährmittel, ein Beratungsfall.
- Wiederholung: `Woche_04…\08_Wiederholung…zur_1_Schularbeit`, `24/25_FRAGEN_FP_W4_Teil1/Teil2`
  (Teil 2 = Milch, Käse, Fleisch), `Woche_08…\15_Wiederholungsblatt…2_Schularbeit`,
  `21_Quiz_SA-Wiederholung` (W4 und W8).

**Ergänzung aus dem III. Lehrgang (`08_…\III-LG_2026-02_FP_Food_2GH\`):** Arbeitsaufträge mit
Lösungen zu Milch, Käse, Fleisch (AMA), Feinkost, Öle/Fette, Kakao/Schokolade, Diätetische LM,
Bio, Kindernährmittel, Textile Flächengebilde. Zu Eier und Fische gibt es dort nichts. Teile
stammen von einer Kollegin (Kürzel `_har`).

### 1. Klasse – zuletzt IV. Lehrgang 1GH3 (Apr.–Jul. 2026, `09_Abgeschlossen…\FP_Food_1GH3\`)

| W | Warenkunde | Eigene Unterlagen |
|---|-----------|-------------------|
| 1 | Ernährungslehre, Nährstoffe, Ernährungspyramide, Energiebedarf, Gütesiegel | IB, AB, LB, FRAGEN |
| 2 | Ernährungstrends: Bio/Regional, Vegan/Vegetarisch, Functional Food/Fairtrade | IB, AB, LB, FRAGEN |
| 3 | Lebensmittelrecht, Allergene/HACCP, Konservierung, Etikettierung LMIV | IB, AB, LB, FRAGEN, MÜP |
| 4 | Getreide, Backwaren, Teigwaren | IB, AB, LB, FRAGEN |
| 5 | Obst (Kern-/Steinobst), Südfrüchte | IB, AB, LB, FRAGEN, 1. SA + Lösung |
| 6 | Gemüse Inland und Ausland | IB, AB, LB, FRAGEN |
| 7 | Zucker/Süßwaren/Süßstoffe, Honig, Speiseeis | IB, AB, LB, FRAGEN, MÜP |
| 8 | NF: Textile Rohstoffe, Textilpflege, Garne/Zwirne | IB, AB, LB, FRAGEN |
| 9 | NF: Papier/Pappe, Schreibwaren | IB, AB, LB, 2. SA + Lösung (kein FRAGEN) |
| 10 | NF: Spielwaren, Prüfzeichen | IB, AB, LB (kein FRAGEN) |

### 3. Klasse – kein eigenes Material

Lehrstoffverteilung: Kaffee, Tee, alkoholfreie Getränke (W1), Alkohol (W2–4), Gewürze,
Würzsoßen, Essig, Salz (W5), Futtermittel und Tierbedarf (W6), NF: Kurzwaren, Leder, Pelze,
Raumtextilien (W7), Sport-/Freizeitbekleidung, Camping (W8), Bürobedarf, Billets (W9).
Eigene Unterlagen gibt es nicht. Kollegenmaterial liegt unter
`04_Referenzmaterial_KollegInnen\FP\3KL_FOOD\FP-3. Klasse Food\` (Tee, Alkohol/Wein, Gewürze,
Hausmesse, Schularbeiten).

### Klassen-Zuordnung für `themen.json` (verbindlich laut Lehrstoffverteilung)

Festgelegt am 8.10.2026: Die Klasse eines Themas ergibt sich aus der Lehrstoffverteilung
(`02_Lehrstoffverteilungen\FP_Food 1./2./3. Klasse_23.pdf`, Stand 3.2.2023, alle drei gelesen).
Die Woche gibt an, wann das Thema im Lehrgang drankommt.

| Klasse | W | Warenkunde-Thema (eine CSV je Zeile) |
|--------|---|--------------------------------------|
| 1 | 1 | Ernährungslehre, Ernährungstrends |
| 1 | 2 | Lebensmittelrecht: LM-Allergien, LMSVG, Allergenverordnung, Codex, Kontrollorgane, HACCP |
| 1 | 3 | Konservierung, Normen |
| 1 | 4 | Getreide, Backwaren, Teigwaren |
| 1 | 5 | Inländisches Obst, Südfrüchte |
| 1 | 6 | In- und ausländisches Gemüse |
| 1 | 7 | Zucker und Zuckerwaren, künstliche Süßstoffe, Honig, Speiseeis |
| 1 | 8 | NF: Textile Rohstoffe, Textilpflegekennzeichen, Garne und Zwirne, Handarbeitsmaterial |
| 1 | 9 | NF: Papier, Papierwaren, Pappe, Schreibwaren |
| 1 | 10 | NF: Spielwaren, pädagogischer Wert, Prüfzeichen |
| 2 | 1 | Milch und Milchprodukte |
| 2 | 2–3 | Käse |
| 2 | 4 | Fleisch und Fleischwaren (Quiz: „Fleisch & Rindfleisch“) |
| 2 | 5 | Feinkost, Fertigkost |
| 2 | 6 | Eier; Fische, Krusten- und Weichtiere |
| 2 | 7 | Speisefette und -öle; Kakao und Schokolade |
| 2 | 8 | Diätetische Lebensmittel, Diabetikerwaren; Biowaren; Kindernährmittel |
| 2 | 9 | NF: Textile Flächengebilde, Webwaren, Maschenwaren |
| 2 | 10 | NF: Pädagogischer Wert des Spielzeugs, Prüfsiegel; Zeichen- und Malbedarf |
| 3 | 1 | Kaffee, Tee, alkoholfreie Getränke |
| 3 | 2–4 | Alkohol (Wein, Bier, Spirituosen) |
| 3 | 5 | Gewürze, Würzsoßen, Essig, Salz |
| 3 | 6 | Futtermittel, Pflege- und Spielartikel für Tiere |
| 3 | 7 | NF: Kurzwaren, Leder, Pelze, Mode/Farbe/Wäsche, Raumtextilien |
| 3 | 8 | NF: Sport- und Freizeitbekleidung, Wandern/Bergsteigen/Camping |
| 3 | 9 | NF: Bürobedarf, Klebemittel, Billets und Karten |

Umgesetzt in `daten/themen.json`: Käse und Fleisch & Rindfleisch → `"klassen": ["2"]`.

**Abweichung im laufenden Lehrgang:** In 2GH1b, Woche 9, gibt es neben „Textile Rohstoffe und
Flächengebilde“ auch „Textilpflege, Garne und Zwirne“. Laut Lehrstoffverteilung gehört das zur
1. Klasse. Spielwaren und Prüfzeichen kommen in beiden Klassen vor. Für das Quiz gilt die
Lehrstoffverteilung. Wird so ein Thema im Lehrgang tatsächlich unterrichtet, kann es zusätzlich
für diese Klasse freigegeben werden (`"klassen": ["1", "2"]`).

**Hinweis Quelle:** Laut `fp-kontext` gilt seit der Hospitation am 9.6.2026: Zu jedem
Warenkunde-Thema gehören ein Fragenkatalog (12 Kernfragen = SA-Fragen) und eine
Mini-Präsentation. Die Food-Fragen stammen aus dem Buch „Lebens- und Genussmittel“. Die
**FRAGEN- und SA-Dateien** sind deshalb die beste Quelle fürs Quiz.

---

## 4. Aktuelles Layout im Vergleich mit `css/knb-stil.css`

Quellen: `Markenkit\README.md`, `Farbpalette.md`, `Schriften.md`,
`lbs-lehrer-plugin\skills\dokument-stil\SKILL.md`, `_tools\generator.py`. Der Generator erzeugt
alle aktuellen Blätter mit Aptos, `#005090` und `#FFD600`. `#003399` kommt in den Werkzeugen
nirgends mehr vor. **Das Layout hat sich also geändert.**

Die Umstellung ist am 8.10.2026 umgesetzt. Die rechte Spalte zeigt den alten Stand.

| Element | aktuell in den Unterlagen | bis 8.10. in `knb-stil.css` |
|---------|---------------------------|---------------------------|
| Schrift | Aptos, Fallback Calibri, Arial | Arial |
| Titel/Überschriften | fett, Logo-Blau `#005090` (H1 16 pt, H2 14 pt) | fett, `#003399` |
| Fließtext | 11 pt, schwarz | schwarz |
| Akzent | Logo-Gelb `#FFD600`: Trennlinien in Kopf und Fuß, Punkte-Badge | fehlt |
| Kopfzeile | Titel „Dokumenttyp: Thema“ links, Klasse darunter, Logo rechts; gelbe Linie | Titel links, Logo rechts, blaue Linie |
| Dokumenttyp-Marker | farbiger Balken links vom Titel: Blau Info, Grün `#2E7D32` Arbeiten, Rot `#B71C1C` MÜP, Teal `#00796B` Lösung, Lila `#5E35B1` Bewertung | fehlt |
| Aufgaben | Tag „AUFGABE 1“ 9 pt fett grau `#808080` in Großbuchstaben, darüber Titel 14 pt blau | „Aufgabe 1: …“ blau |
| Tabellenkopf | 10 pt fett **blau auf Hellblau** `#E7EFF7`, Rahmen grau `#BFBFBF`, Zebra `#F0F0F0` | weiß auf `#003399`, Rahmen blau |
| Antwortflächen | Box mit Rahmen `#BFBFBF` gestrichelt, Fläche `#FAFAFA` | graue Linie `#808080` |
| Callouts | Tipp: Rand `#005090`, Fläche `#E7EFF7`; Merke: `#E65100`/`#FFF4E5`; Hinweis: `#2E7D32`/`#E8F5E9` | nur Fehlermeldung |
| Fußzeile | „Benedikt Knotzer \| knb“ links, „Seite X von Y“ rechts, 9 pt blau, **gelbe** Linie oben | „Benedikt Knotzer \| knb“ blau, schwarze Linie |
| Logo | `Markenkit\LBS_Logo.png` | `bilder/lbs-logo.png`, **identisch** |

**Vorschlag für die Web-CSS:**

- Schrift: `font-family: Aptos, Calibri, Arial, "Helvetica Neue", Helvetica, sans-serif;`.
  Aptos ist im Web nicht frei verfügbar. Auf Windows-PCs mit aktuellem Office wird sie
  angezeigt, am Handy greift Arial bzw. Helvetica.
- Farben: `--knb-blau: #005090`, neu `--knb-gelb: #FFD600`, `--knb-blau-hell: #E7EFF7`,
  `--knb-rahmen: #BFBFBF`.
- Kopf- und Fußlinie gelb (2 px), Tabellenkopf blau auf hellblau, Callout „Tipp“ für Hinweise im
  Quiz.
- Die Quiz-Farben für richtig und falsch bleiben (eigene Funktion, nicht im Dokumentstil).
- Danach `CLAUDE.md` (Abschnitt Stil) an das neue Layout anpassen.

---

## 5. Offene Punkte aus der Bestandsaufnahme

| Punkt | Wann |
|-------|------|
| ✔ `.docx`/`.pptx` lesen: entschieden 8.10. – reines Lese-Skript `tools/vfw_lesen.py`, einzige Shell-Ausnahme in `settings.local.json`. Getestet mit Fragenkatalog Käse und PRÄ Käse. | erledigt |
| ✔ Node.js installiert (v24, geprüft 14.10.). | erledigt |
| ✔ `knb-stil.css` auf das aktuelle Layout umgestellt (8.10.). | erledigt |
| ✔ Klassen-Zuordnung: laut Lehrstoffverteilung (Abschnitt 3). | erledigt |
| Kollegenmaterial (z. B. `_har`) als Quelle zulassen? Dann `quelle` mit Kürzel kennzeichnen. | Phase 3 |
