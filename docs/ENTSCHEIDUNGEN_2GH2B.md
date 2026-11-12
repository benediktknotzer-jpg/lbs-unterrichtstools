# Entscheidungen: Quiz 2GH2b, II. Lehrgang

Gefragt 10.11.2026, **alle 18 Punkte von Benedikt beantwortet am 12.11.2026.** Grundlage: Abgleich
der Fragenkataloge II. LG, SA1 und SA2 II. LG und SVB W4 mit den Quiz-CSVs (nur gelesen).
Wochenplan: `docs/LEHRGANG_II_2GH2B.md`. Diese Datei ist ab jetzt der Umsetzungsplan; erledigte
Zeilen werden abgehakt (✔ mit Datum).

## Entschieden

| Nr. | Frage | Entscheidung |
|---|---|---|
| 1 | Durchsicht Milch | **Passt.** Milch ist fertig (bis auf MC 74, siehe unten). |
| 2 | Karteikarten | **Karteikarten = Fragenkatalog II. LG, 1 : 1.** Eine Karte je Katalogfrage, Wortlaut der Katalog-Lösung, Zahlen nach Buch. Die 28 Karten ohne Katalogfrage werden gestrichen: Käse 103 · Fleisch 86, 96 · Feinkost 80, 81, 91, 92, 93 · Eier 61 · Fische 81–86 · Fette 79, 85, 88 · Diät 74, 75 · Bio 45, 47, 51–54 · Kindernährmittel 50, 55. Fehlende oder halbe Karten kommen dazu. |
| 3 | Quizfragen außerhalb des Katalogs | **Bleiben**, wenn Buch oder IB. Keine neue Streichrunde; ergänzt wird nur, wo eine Katalogfrage keine Quizfrage hat. |
| 4 | Eigene Katalog-Entwürfe | **Als überholt markieren** (Fleisch, Feinkost, Eier, Fische, Fette, Diät, Bio, Kindernährmittel). Kein DOCX mehr daraus. |
| 5a | Käse, 27 Fragen „SA1 FOOD“ | **Bleiben** (Buch). |
| 5b | Käse, Verkostungsblatt | **Wird im II. LG nicht verwendet** → die 3 Fragen „Verkostungsblatt Käse-Sensorik“ fallen weg. |
| 6 | Fleisch, Zahlen nur aus der AMA-Broschüre | **Zweite unabhängige Quelle, sonst streichen** (Regel 09.11. ohne Ausnahme). |
| 7 | Fleisch, Teilstücke 65–71, 80 und Garstufen 72 | **Bleiben im Thema Fleisch, nicht im Mischquiz.** |
| 8 | Mischquiz | **Nur SA-Stoff**, über eine Unterthemen-Liste je SA in `themen.json` (App-Änderung). Beratungsfälle nach SA aufteilen. |
| 9 | Karpfen/Rotbarsch in der SA2 | **Eindeutigen Fisch nehmen:** Die Sitzung in der Materialsammlung korrigiert die Katalog-Lösung Fische Teil 1 Frage 3 (mittelfett, Buch S. 154) und ersetzt in SA2 Aufgabe 3a den Karpfen durch einen eindeutigen Fisch (z. B. Dorsch mager, Hering fett). Teil 2 Frage 14: über 100 °C. |
| 10 | Fische, 8 Katalogfragen ohne Quizfrage | **Je Frage Karteikarte und mindestens eine Quizfrage**, am Buch S. 153–165 geprüft. Wortlaut-Abweichungen (Hering-Handelsbezeichnungen, Kaviar): Buch gilt, Abweichung an die Materialsammlung melden. |
| 11 | Feinkost, Film-Fragen und „Verkaufen im Großhandel“ | **Bleiben im Thema**; ins Mischquiz zur 2. SA nur, was die Stoffbekanntgabe nennt. |
| 12 | Bio-Kontrollnummer | **Auf 2 Fragen kürzen** (wozu, wo), raus aus dem Mischquiz, nach der Entscheidung in der Materialsammlung (bis 13.01.) angleichen. |
| 13 | Fragetyp OA | **Ausweiten:** je 5–8 OA für Fleisch, Eier, Fette, Kakao, Diät; nur Aufzählungen, Fachbegriffe, Zahlen aus dem Katalog, jede gegen `js/oa.js` geprüft. |
| 14 | Textilien, 11 Fragen „bitte prüfen“ | **Claude prüft mit zwei unabhängigen Quellen**, ohne Beleg streichen. |
| 15 | W10-Kataloge | **Kein DOCX-Katalog.** Karteikarten bleiben, wie sie sind. |
| 16 | Verkaufsstoff ohne Quiz | **Kein Quiz**, Punkt geschlossen. |
| 17 | Wirkung messen | **Auf SA1 II. LG verlegt:** Nach dem 14.12. nennt Benedikt die Durchschnittspunkte je Aufgabe ohne Namen, Vergleich im Chat, nichts ins Repository. |
| 18 | Zugang mit Code | **Noch nicht eingesetzt:** Das Quiz kommt erst **Mo 16.11.** zum ersten Mal mit `2GH2B-MILCH` in die Klasse. |

## Umsetzungsplan (Claude, hier im Repository)

| Bis | Was | Nr. |
|---|---|---|
| ✔ 12.11. (vor dem ersten Einsatz Mo 16.11.) | Käse: 3 Verkostungsfragen und Karte 103 streichen, Karten gegen Fragenkatalog W2 (16 Fragen) prüfen. Milch MC 74 eindeutig formulieren. Zugang `?code=2GH2B-MILCH` lokal und online prüfen. Entwürfe als überholt markieren. | 2, 4, 5, 18 |
| ✔ 12.11. | Mischquiz je SA nach der Stoffbekanntgabe in SA1/SA2 II. LG (`auswahl` in `themen.json`). **1. SA** (266 Fragen, 65 Karten): ohne Milch „Zusammensetzung“ und „Sauermilch und Rahm“ (nicht im Katalog), ohne Käse „Lagerung & Service“, ohne Fleisch „Teilstücke Rind“ und Garstufen (72); dazu Beratungsfälle Milch, Käse, Fleisch, Verkaufsgespräch. **2. SA** (466 Fragen, 114 Karten): ohne Feinkost-Film (nicht in der Stoffbekanntgabe), ohne Bio „Kontrollnummer“; Beratungsfälle nur der SA2-Themen (ohne Milch, Käse, Fleisch, Kindernährmittel, Verkaufsgespräch). Alte App-Fassungen übersehen `auswahl`, darum ging App und Daten in einem Push. | 8, 7, 11, 12 |
| ✔ 12.11. | Fleisch: 12 Karten im Wortlaut der Katalog-Lösung W4 (86, 88, 96 gestrichen), 8 OA (98–105, je mit richtiger und falscher Probe gegen `js/oa.js`). AMA-Zahlen geprüft: Nr. 52 (180 Tage Auslauf) gestrichen, Nr. 58 auf „falsch“ gestellt (gemischtes Faschiertes höchstens 30 %, Codex B 14 und LMIV), Nr. 43 und Karte 4 auf rund 20 % Eiweiß (Codex B 14, FAO), Nr. 53 auf Acker- und Grünland eingeschränkt (EU-Bio-VO), Nr. 59 und Karte 6 mit Buch S. 124 belegt, Nr. 75 ohne Temperatur. Danach: Fleisch 89 Fragen, 12 Karten; Mischquiz zur 1. SA 273 Fragen, 62 Karten. | 2, 6, 13 |
| Mi 02.12. | Mischquiz zur 1. SA gegen SA1 II. LG und Stoffbekanntgabe prüfen (Stoffbekanntgabe ist in der SA1-Lösung schon abgebildet). | 8 |
| ✔ 12.11. | Feinkost: 12 Karten im Wortlaut der Katalog-Lösung W5. Katalog 2, 5, 7, 8 neu (Nr. 94–97), 1 vervollständigt (79); gestrichen 80, 81, 85 (in Karte 9), 90 (in Karte 12), 91, 92, 93. Die Quizfragen zu Zusatzverkauf bleiben (SA2-Stoff). | 2 |
| ✔ 12.11. | Eier: 12 Karten im Wortlaut der Katalog-Lösung W6 (Karte 1 neu als 62; 50 in Karte 10, 61 gestrichen), 7 OA (63–69, je mit Proben gegen `js/oa.js`). | 2, 13 |
| Fr 11.12. | Fische: 8 Katalogfragen als Karte und Quizfrage, 81–86 streichen, Wortlaut am Buch. | 2, 10, 13 |
| Fr 08.01. | Fette (Karte 4 neu, 79, 85, 88 streichen, OA), Kakao (OA), Diät (74, 75 streichen, OF 66 Hafer am Buch, OA), Bio (11, 12 vervollständigen, 45, 47, 51–54 streichen, Kontrollnummer auf 2), Kindernährmittel (6, 11 vervollständigen, 50, 55 streichen, „ab dem 4. Monat“). | 2, 12, 13 |
| Di 12.01. | Mischquiz zur 2. SA gegen SA2 II. LG und Stoffbekanntgabe (Feinkost-Film und Großhandel danach). | 8, 11 |
| Fr 22.01. | Textilien: 11 Fragen mit zwei Quellen prüfen. | 14 |

Nebenbei beim Ausrichten: Wochennummern in `quelle` auf den II. LG umstellen.

## Aufträge an eine Sitzung in der Materialsammlung (Benedikt stößt an)

Claude schreibt nicht in der Materialsammlung. Sammelliste auch in `docs/LEHRGANG_II_2GH2B.md`, Punkt 4.

| Bis | Was |
|---|---|
| **Fr 27.11.** (Druck W4) | Fleisch: Katalog-Lösung Frage 6 und AMA-Frageblatt-Lösung, TK-Lagerdauer nach Buch S. 124 |
| Fr 04.12. | Feinkost: San Daniele mindestens 400 Tage (falls im IB) |
| Fr 11.12. | Fische: IB und Katalog-Lösung Teil 1 Frage 3 (Rotbarsch, Karpfen mittelfett), Teil 2 Frage 14 (über 100 °C); **SA2 Aufgabe 3a und Lösung: Karpfen durch eindeutigen Fisch ersetzen** |
| ✔ 10.11. | Milch: A2-Milch, Buttermilch, PRÄ-Notizen (Auftrag geschickt) |
