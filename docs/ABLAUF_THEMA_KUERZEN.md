# Ablauf: Ein Quiz-Thema auf den Kernstoff bringen

Festgelegt mit Benedikt am 25.10.2026, zuerst an Milch erprobt
(`docs/streichlisten/milch-milchprodukte.*`). Gilt für jedes Thema in `daten/`.

## Grundregeln

- **VFW_Claude ist schreibgeschützt.** Dort nur lesen: .docx/.pptx ausschließlich mit
  `python tools/vfw_lesen.py "<Pfad relativ zu VFW_Claude>"` (aus dem Repository-Ordner aufrufen),
  .pdf/.md/Bilder mit dem Read-Werkzeug, Dateien finden mit Glob. Keine anderen Shell-Befehle auf
  VFW_Claude, nichts dort anlegen oder ändern.
- Unterlagen des laufenden Lehrgangs: `VFW_Claude/01_Lehrgang_I_2026-27/FP_Food_2GH1b/Woche_*`
  (IB = Infoblatt, AB/LB = Arbeitsblatt/Lösungsblatt, FRAGEN = Fragenkatalog, SA = Schularbeit,
  Wiederholungsblatt, Quiz-SA-Wiederholung, Frageblätter, LAP-Fragen, Film-Arbeitsblätter).
  SA1: `Woche_05…/14_SA1_Lösung_FP_W5.docx`, SA2: `Woche_08…/` (SA2 und Lösung, Wiederholungsblatt).
  Kollegenmaterial aus dem III. Lehrgang (`08_…/III-LG_2026-02_FP_Food_2GH/`, „AA … III. LG“)
  ist **kein** Unterricht der 2GH1b.
- Keine Schülerdaten ins Repository. Sprache: österreichisches Deutsch, Sie-Form.

## Warenkundebuch

„Warenkunde Lebens- und Genussmittel“ (Westermann), digi4school E-Book 16967, **nur über Claude in
Chrome** (Benedikt ist dort angemeldet). Chrome-Werkzeuge mit einer ToolSearch laden
(`select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__browser_batch`).
Dann `tabs_context_mcp`, **eigenen Tab** mit `tabs_create_mcp` anlegen, nur dort arbeiten und ihn am
Ende schließen. Andere Tabs nie schließen oder benutzen (andere Agenten arbeiten parallel).

- Seite aufrufen: `https://a.digi4school.at/ebook/16967/?page=<Buchseite + 2>`.
- Die Seiten sind Bilder. Lesen: kurz warten (2 s), Bildschirmfoto, dann `zoom` auf die Buchseite
  (Bereich der weißen Seite), danach 10 Ticks nach unten scrollen und den unteren Teil zoomen.
- Klappt der direkte Aufruf nicht (Anmeldeseite, Fehlermeldung), einmal über
  `https://digi4school.at/ebooks` → Überschrift „Warenkunde Lebens- und Genussmittel + E-Book“
  anklicken versuchen. Geht es dann immer noch nicht: Buchprüfung auslassen und das im Bericht sagen.

Kapitel (Buchseiten): Ernährungsformen 29–33 (Diabetes 32, Unverträglichkeiten 32), Bio und
Ernährungstrends 34–40, Zuckeraustauschstoffe 79, Süßstoffe 80, Milch 89–95, Butter 96–99,
Käse 100–113, Eier 114–117, Fleisch 118–133 (Rind ab 120), Geflügel 134–138, Würste 141–146,
Schinken/Geselchtes/Speck/Pasteten 147–152, Fisch 153–160, Krusten- und Weichtiere 161–165,
Fette und Öle 166–172, Kindernährmittel 205–206, Convenience-Produkte 224–226, Kakao 248–253.
Non-Food (Textilien, Spielzeug) und Verkaufsthemen stehen nicht in diesem Buch.

## Schritte je Thema

1. **CSV lesen** (`daten/<datei>.csv`, Format in README und CLAUDE.md). Nicht OF = Quizfrage.
2. **Unterlagen lesen**: IB, AB/LB, FRAGEN (falls vorhanden), passende SA-Aufgaben und Lösung,
   Wiederholung, Quick-Check, Frageblätter. Notieren, was in welcher Aufgabe gefragt wird.
3. **Buch lesen** (Kapitelseiten oben), wenn das Thema im Buch steht.
4. **Fragenkatalog** (Rückgrat): Gibt es in VFW_Claude einen FRAGEN-Katalog, ist er die Vorlage.
   Gibt es keinen und ist es ein Warenkunde-Thema, einen **Entwurf** schreiben:
   `docs/fragenkataloge/<datei-ohne-.csv>.md`, 12–15 Kernfragen wie in einem Fragenkatalog von
   Benedikt (offene Fragen, die auch SA-Fragen sein können: was SA2 gefragt hat, was IB-Hauptteil,
   LB-Aufgaben und Quick-Check betonen). Jede Frage mit Musterantwort, **Buchseite** (am Buch
   geprüft) und Unterlage. Bei Non-Food ohne Buch: IB als Quelle. Kopf der Datei:
   „Entwurf, DOCX entsteht in einer VFW_Claude-Sitzung“.
5. **Einordnen** jeder Quizfrage:
   - **Kern**: kommt im Fragenkatalog, in LB-Aufgaben, SA1/SA2, Wiederholung, Quick-Check oder
     einem im Unterricht verwendeten Frageblatt (z. B. AMA-Frageblatt, LAP-Fragen) vor.
   - **B – Grenzfall**: steht im Buch oder in einer Unterlage der 2GH1b (auch IB „Zum
     Nachschlagen“, AMA-Broschüre), wird aber in keiner Aufgabe gefragt. **B bleibt.**
   - **A – streichen**: steht weder im Buch noch in einer Unterlage der 2GH1b (z. B. nur
     „AA … III. LG“, frei ergänzt, „bitte prüfen“ ohne Beleg). **Nur A wird gestrichen.**
   - Doppelte Fragen (gleicher Inhalt, gleicher Typ) dürfen als A gestrichen werden, wenn eine
     gleichwertige bleibt; Grund „doppelt zu Nr. …“.
   - Im Zweifel B, nicht A.
6. **Streichliste schreiben**, BEVOR etwas gelöscht wird:
   `docs/streichlisten/<datei-ohne-.csv>.json` wie `milch-milchprodukte.json` (Felder `buch`,
   `hinweis`, `A`, `B`; Grund je Nummer kurz, mit Buchseite oder Unterlage), dann
   `python tools/streichliste.py daten/<datei>.csv docs/streichlisten/<name>.json docs/streichlisten/<name>.md "<Titel aus themen.json>"`.
   Danach oben in die .md direkt unter die Überschrift einfügen:
   `> **Erledigt 25.10.2026:** Gruppe A gestrichen, alle Grenzfälle aus B bleiben (stehen im Buch oder in den Unterlagen).`
   plus Zeile mit neuer Fragenanzahl.
7. **Gruppe A aus der CSV löschen.** Zeilenenden der Datei beibehalten (meist LF), `nr` nicht neu
   nummerieren. Am sichersten mit einem kleinen Python-Skript, das die Datei als Bytes liest.
8. **Abdeckung**: Jede Frage des Fragenkatalogs (vorhanden oder Entwurf) muss im Quiz stehen:
   als **Karteikarte (OF)** und als **mindestens eine Quizfrage** (MC, RF, MM, ZU, RH oder LT).
   Fehlende ergänzen: neue Zeilen ans Ende mit fortlaufender `nr`, passendes Unterthema, `quelle`
   z. B. „FRAGEN-Entwurf Eier W6 / Buch S. 115“, **jede Quizfrage mit Erklärung**, bei MC die
   falschen Antworten so lang und fachlich wie die richtige. Bestehende gleichwertige OF-Karten
   wiederverwenden statt doppelt anlegen.
9. **Fakten**: Widerspricht eine Kernfrage dem Buch, gilt laut Benedikt das aktuelle eigene
   Infoblatt. Nichts am Kern ändern, sondern im `hinweis` der JSON festhalten. Echte Fehler
   (widerspricht IB **und** Buch) korrigieren und im Hinweis nennen.
10. **Unterthemen**: Unterthemen mit nur einer Frage zusammenlegen, Namen anpassen, die nicht mehr
    passen (z. B. wenn ihr Inhalt gestrichen wurde).
11. **Prüfen**: `node tests/csv-test.js` muss grün sein (Formate, Erklärung bei jeder Quizfrage,
    höchstens 35 % „richtige MC-Antwort ist die längste“, keine Position über 50 %). Bei Verstoß
    neue oder bestehende Ablenker anpassen, nicht den Test.
12. **Nicht anfassen**: `daten/themen.json`, `daten/zugaenge.json`, `js/`, `css/`, `index.html`,
    `CLAUDE.md`, `docs/KONZEPT.md`, `README.md`, andere CSVs. Kein git commit, kein push.

## Bericht (am Ende, knapp)

Thema · Quizfragen vorher → nachher · A gestrichen (Anzahl, typische Gründe) · B behalten (Anzahl)
· Fragenkatalog (vorhanden / Entwurf mit n Fragen) · ergänzte Zeilen (Nummern) · Buchprüfung
(Seiten, Abweichungen) · Testergebnis · offene Fragen an Benedikt.
